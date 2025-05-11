import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Mechanic } from './entities/mechanic.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { CreateMechanicProfileDto } from './dto/create-mechanic-profile.dto';
import { UpdateMechanicLocationDto } from './dto/update-mechanic-location.dto';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    serviceType?: string,
    useLocation: boolean = false,
  ): Promise<Mechanic[]> {
    let query = this.mechanicRepository
      .createQueryBuilder('mechanic')
      .leftJoinAndSelect('mechanic.user', 'user')
      .where('mechanic.availability = :availability', { availability: true });

    // Add location-based filtering if useLocation is true and coordinates are provided
    if (useLocation && latitude !== 0 && longitude !== 0) {
      query = query.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(mechanic.currentLatitude)) *
            cos(radians(mechanic.currentLongitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(mechanic.currentLatitude))
          )
        ) <= :radius`,
        { latitude, longitude, radius }
      );
    }

    // Add service type filtering if provided
    if (serviceType) {
      query = query.andWhere('JSON_CONTAINS(mechanic.services, :service)', {
        service: JSON.stringify(serviceType),
      });
    }

    // Order by distance if using location
    if (useLocation && latitude !== 0 && longitude !== 0) {
      query = query.orderBy(
        `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(mechanic.currentLatitude)) *
            cos(radians(mechanic.currentLongitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(mechanic.currentLatitude))
          )
        )`,
        'ASC'
      );
    }

    const mechanics = await query.getMany();
    return mechanics.map(mechanic => this.excludePassword(mechanic));
  }

  async getProfile(userId: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { userId },
      relations: ['user'],
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

    let mechanic = await this.mechanicRepository.findOne({ where: { userId } });
    if (!mechanic) {
      mechanic = this.mechanicRepository.create({
        id: uuidv4(),
        userId,
        ...createMechanicProfileDto,
      });
    } else {
      Object.assign(mechanic, createMechanicProfileDto);
    }

    const savedMechanic = await this.mechanicRepository.save(mechanic);
    return this.getProfile(userId);
  }

  async updateLocation(
    userId: string,
    updateLocationDto: UpdateMechanicLocationDto,
  ): Promise<void> {
    const mechanic = await this.mechanicRepository.findOne({ where: { userId } });
    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    mechanic.currentLatitude = updateLocationDto.latitude;
    mechanic.currentLongitude = updateLocationDto.longitude;
    mechanic.availability = updateLocationDto.availability;
    mechanic.lastLocationUpdate = new Date();

    await this.mechanicRepository.save(mechanic);
  }
} 
