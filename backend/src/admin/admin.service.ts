import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findAllUsers(requestingUserId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { created_at: 'DESC' },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findAllMechanics(requestingUserId: string): Promise<Mechanic[]> {
    return this.mechanicRepository.find({
      relations: ['user'],
      order: { rating: 'DESC' },
    });
  }

  async findAllBookings(requestingUserId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'mechanic', 'mechanic.user'],
      order: { createdAt: 'DESC' },
    });
  }
}
