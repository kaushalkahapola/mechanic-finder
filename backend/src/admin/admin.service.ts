import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async findAllUsers(requestingUserId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['mechanics'],
      order: { created_at: 'DESC' },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findAllMechanics(requestingUserId: string): Promise<Mechanic[]> {
    return this.mechanicRepository.find({
      relations: ['user', 'mechanicServices', 'mechanicServices.serviceType'],
      order: { rating: 'DESC' },
    });
  }

  async findAllBookings(requestingUserId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: [
        'user',
        'mechanic',
        'mechanic.user',
        'bookingServices',
        'bookingServices.serviceType',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalMechanics: number;
    totalBookings: number;
    totalServices: number;
    recentBookings: Booking[];
    topMechanics: Mechanic[];
  }> {
    const [
      totalUsers,
      totalMechanics,
      totalBookings,
      totalServices,
      recentBookings,
      topMechanics,
    ] = await Promise.all([
      this.userRepository.count(),
      this.mechanicRepository.count(),
      this.bookingRepository.count(),
      this.serviceTypeRepository.count(),
      this.bookingRepository.find({
        relations: ['user', 'mechanic', 'mechanic.user', 'bookingServices'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.mechanicRepository.find({
        relations: ['user'],
        order: { rating: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      totalUsers,
      totalMechanics,
      totalBookings,
      totalServices,
      recentBookings,
      topMechanics,
    };
  }

  async getBookingStats(): Promise<{
    totalPending: number;
    totalAccepted: number;
    totalCompleted: number;
    totalCanceled: number;
    averageRating: number;
  }> {
    const [pending, accepted, completed, canceled] = await Promise.all([
      this.bookingRepository.count({
        where: { status: BookingStatus.PENDING },
      }),
      this.bookingRepository.count({
        where: { status: BookingStatus.ACCEPTED },
      }),
      this.bookingRepository.count({
        where: { status: BookingStatus.COMPLETED },
      }),
      this.bookingRepository.count({
        where: { status: BookingStatus.CANCELED },
      }),
    ]);

    const avgRatingResult = await this.mechanicRepository
      .createQueryBuilder('mechanic')
      .select('AVG(mechanic.rating)', 'avgRating')
      .getRawOne();

    return {
      totalPending: pending,
      totalAccepted: accepted,
      totalCompleted: completed,
      totalCanceled: canceled,
      averageRating: Number(avgRatingResult?.avgRating || 0),
    };
  }
}
