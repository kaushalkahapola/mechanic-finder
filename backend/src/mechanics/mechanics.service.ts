import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Mechanic } from './entities/mechanic.entity';
import { MechanicService as MechanicServiceEntity } from './entities/mechanic-service.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { CreateMechanicProfileDto } from './dto/create-mechanic-profile.dto';
import { UpdateMechanicLocationDto } from './dto/update-mechanic-location.dto';
import { ServiceTypesService } from '../service-types/service-types.service';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MechanicServiceEntity)
    private readonly mechanicServiceRepository: Repository<MechanicServiceEntity>,
    private readonly serviceTypesService: ServiceTypesService,
  ) {}

  private excludePassword(mechanic: Mechanic): Mechanic {
    if (mechanic?.user) {
      const { password, ...userWithoutPassword } = mechanic.user;
      mechanic.user = userWithoutPassword as User;
    }
    return mechanic;
  }

  async findMechanics(
    latitude: number,
    longitude: number,
    radius: number = 10,
    serviceTypeId?: string,
    useLocation: boolean = false,
  ): Promise<{ mechanics: Mechanic[]; distances: Record<string, number> }> {
    let query = this.mechanicRepository
      .createQueryBuilder('mechanic')
      .leftJoinAndSelect('mechanic.user', 'user')
      .leftJoinAndSelect('mechanic.mechanicServices', 'mechanicServices')
      .leftJoinAndSelect('mechanicServices.serviceType', 'serviceType')
      .where('mechanic.availability = :availability', { availability: true });

    // Add service type filtering if provided
    if (serviceTypeId) {
      query = query.andWhere('mechanicServices.serviceId = :serviceTypeId', {
        serviceTypeId,
      });
    }

    // Calculate distances using Haversine formula
    if (useLocation && latitude !== undefined && longitude !== undefined) {
      const haversineFormula = `(
        6371 * 
        ACOS(
          LEAST(1, 
            COS(RADIANS(:latitude)) * 
            COS(RADIANS(mechanic.currentLatitude)) * 
            COS(RADIANS(mechanic.currentLongitude - :longitude)) + 
            SIN(RADIANS(:latitude)) * 
            SIN(RADIANS(mechanic.currentLatitude))
          )
        )
      )`;

      query = query
        .andWhere('mechanic.currentLatitude IS NOT NULL')
        .andWhere('mechanic.currentLongitude IS NOT NULL')
        .addSelect(haversineFormula, 'distance')
        .setParameter('latitude', latitude)
        .setParameter('longitude', longitude)
        .having(`distance <= :radius`)
        .setParameter('radius', radius)
        .orderBy('distance', 'ASC');
    }

    const results = await query.getRawAndEntities();
    const mechanics = results.entities.map((mechanic) =>
      this.excludePassword(mechanic),
    );

    // Create a map of mechanic IDs to their distances
    const distances: Record<string, number> = {};
    if (useLocation && results.raw.length > 0) {
      results.raw.forEach((raw) => {
        distances[raw.mechanic_id] = parseFloat(raw.distance || 0);
      });
    }

    return { mechanics, distances };
  }

  async getProfile(userId: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { userId },
      relations: ['user', 'mechanicServices', 'mechanicServices.serviceType'],
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    return this.excludePassword(mechanic);
  }

  async createOrUpdateProfile(
    userId: string,
    createMechanicProfileDto: CreateMechanicProfileDto,
  ): Promise<Mechanic> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.MECHANIC) {
      throw new ForbiddenException('Only mechanics can create a profile');
    }

    let mechanic = await this.mechanicRepository.findOne({
      where: { userId },
      relations: ['mechanicServices'],
    });

    if (!mechanic) {
      mechanic = this.mechanicRepository.create({
        id: uuidv4(),
        userId,
        experienceYears: createMechanicProfileDto.experienceYears,
        certifications: createMechanicProfileDto.certifications,
        serviceRadiusKm: createMechanicProfileDto.serviceRadiusKm,
        emergencyAvailable: createMechanicProfileDto.emergencyAvailable,
      });
      mechanic = await this.mechanicRepository.save(mechanic);
    } else {
      Object.assign(mechanic, {
        experienceYears: createMechanicProfileDto.experienceYears,
        certifications: createMechanicProfileDto.certifications,
        serviceRadiusKm: createMechanicProfileDto.serviceRadiusKm,
        emergencyAvailable: createMechanicProfileDto.emergencyAvailable,
      });
      mechanic = await this.mechanicRepository.save(mechanic);
    }

    // Update mechanic services
    if (createMechanicProfileDto.services) {
      // Remove old services
      if (mechanic.mechanicServices) {
        await this.mechanicServiceRepository.remove(mechanic.mechanicServices);
      }

      // Add new services
      const servicePromises = createMechanicProfileDto.services.map(
        async (serviceDto) => {
          const serviceType = await this.serviceTypesService.findOne(
            serviceDto.serviceId,
          );
          const mechanicService = this.mechanicServiceRepository.create({
            mechanic: { id: mechanic.id },
            serviceType: { id: serviceType.id },
            customPrice: serviceDto.customPrice,
            isEmergencyAvailable:
              serviceDto.isEmergencyAvailable ?? mechanic.emergencyAvailable,
          });
          return this.mechanicServiceRepository.save(mechanicService);
        },
      );

      await Promise.all(servicePromises);
    }

    return this.getProfile(userId);
  }

  async updateLocation(
    userId: string,
    updateLocationDto: UpdateMechanicLocationDto,
  ): Promise<void> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { userId },
    });
    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    mechanic.currentLatitude = updateLocationDto.latitude;
    mechanic.currentLongitude = updateLocationDto.longitude;
    mechanic.availability = updateLocationDto.availability;
    mechanic.lastLocationUpdate = new Date();

    await this.mechanicRepository.save(mechanic);
  }

  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.mechanicRepository.update(
      { userId },
      {
        isOnline,
        lastOnline: isOnline ? new Date() : undefined,
      },
    );
  }
}
