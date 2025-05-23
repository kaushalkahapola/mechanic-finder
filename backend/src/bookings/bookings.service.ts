import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  FindOptionsOrder,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
} from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { MechanicsService } from '../mechanics/mechanics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DataSource } from 'typeorm';
import { BookingService } from './entities/booking-service.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingService)
    private readonly bookingServiceRepository: Repository<BookingService>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mechanicsService: MechanicsService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const { mechanicId, scheduledTime, services } = createBookingDto;

    // Check if mechanic exists
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: mechanicId },
      relations: ['user', 'mechanicServices', 'mechanicServices.serviceType'],
    });

    if (!mechanic) {
      throw new NotFoundException(`Mechanic with ID ${mechanicId} not found`);
    }

    // Validate scheduled time
    if (new Date(scheduledTime) <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Check if mechanic offers all requested services
    for (const service of services) {
      const offersService = mechanic.mechanicServices?.some(
        (ms) => ms.serviceType.id === service.serviceTypeId,
      );

      if (!offersService) {
        throw new BadRequestException(
          `Mechanic does not offer service with ID ${service.serviceTypeId}`,
        );
      }
    }

    // Calculate total duration for overlap checking
    const totalDuration = services.reduce(
      (sum, service) => sum + service.estimatedDuration,
      0,
    );

    // Check for overlapping bookings
    const endTime = new Date(scheduledTime);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);

    const overlappingBooking = await this.bookingRepository.findOne({
      where: {
        mechanicId,
        status: BookingStatus.ACCEPTED,
        scheduledTime: Between(new Date(scheduledTime), endTime),
      },
    });

    if (overlappingBooking) {
      throw new BadRequestException(
        'Mechanic has another booking during this time',
      );
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the booking
      const bookingId = uuidv4();
      const booking = this.bookingRepository.create({
        id: bookingId,
        userId,
        mechanicId,
        serviceLocationLatitude: createBookingDto.serviceLocation.latitude,
        serviceLocationLongitude: createBookingDto.serviceLocation.longitude,
        scheduledTime: new Date(scheduledTime),
        issueDescription: createBookingDto.issueDescription,
        estimatedDuration: totalDuration,
        estimatedCost: services.reduce(
          (sum, service) => sum + service.estimatedCost,
          0,
        ),
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });

      const savedBooking = await queryRunner.manager.save(booking);

      // Create booking services
      const bookingServices = services.map((service) =>
        this.bookingServiceRepository.create({
          bookingId: savedBooking.id,
          serviceTypeId: service.serviceTypeId,
          estimatedDuration: service.estimatedDuration,
          estimatedCost: service.estimatedCost,
        }),
      );

      await queryRunner.manager.save(bookingServices);
      await queryRunner.commitTransaction();

      // Create notification for mechanic
      await this.notificationsService.create(
        mechanic.user.id,
        `New booking request for multiple services on ${new Date(
          scheduledTime,
        ).toLocaleString()}`,
      );

      return this.findOne(userId, savedBooking.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    userId: string,
    role: UserRole,
    queryDto: QueryBookingDto,
  ): Promise<{
    items: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = 'scheduledTime',
      order = 'ASC',
    } = queryDto;

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.mechanic', 'mechanic')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('mechanic.user', 'mechanicUser');

    // Filter by user role
    if (role === UserRole.MECHANIC) {
      query.where('booking.mechanicId = :userId', { userId });
    } else {
      query.where('booking.userId = :userId', { userId });
    }

    // Apply filters
    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('booking.scheduledTime BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination and sorting
    query
      .orderBy(`booking.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const items = await query.getMany();
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      totalPages,
    };
  }

  async findOne(userId: string, id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        'mechanic',
        'user',
        'mechanic.user',
        'bookingServices',
        'bookingServices.serviceType',
      ],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId && booking.mechanicId !== userId) {
      throw new ForbiddenException('Not authorized to view this booking');
    }

    return booking;
  }

  async update(
    userId: string,
    role: UserRole,
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(userId, id);

    // Load related user and mechanic data for notifications
    const [user, mechanic] = await Promise.all([
      this.userRepository.findOne({ where: { id: booking.userId } }),
      this.mechanicRepository.findOne({
        where: { id: booking.mechanicId },
        relations: ['user'],
      }),
    ]);

    if (!user || !mechanic) {
      throw new NotFoundException('Related user or mechanic not found');
    }

    // Validate update permissions
    if (role === UserRole.MECHANIC && booking.mechanicId !== userId) {
      throw new ForbiddenException('Not authorized to update this booking');
    }
    if (role === UserRole.USER && booking.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this booking');
    }

    // Validate status transition
    if (
      !this.isValidStatusTransition(
        booking.status,
        updateBookingDto.status,
        role,
      )
    ) {
      throw new BadRequestException('Invalid status transition');
    }

    // Validate required fields based on status
    if (
      updateBookingDto.status === BookingStatus.CANCELED &&
      !updateBookingDto.cancellationReason
    ) {
      throw new BadRequestException(
        'Cancellation reason is required when canceling a booking',
      );
    }
    if (updateBookingDto.status === BookingStatus.COMPLETED) {
      if (!updateBookingDto.actualDuration) {
        throw new BadRequestException(
          'Actual duration is required when completing a booking',
        );
      }
      if (!updateBookingDto.finalCost) {
        throw new BadRequestException(
          'Final cost is required when completing a booking',
        );
      }
      booking.completionTime = new Date();
    }

    // Create notifications based on status changes
    if (updateBookingDto.status !== booking.status) {
      switch (updateBookingDto.status) {
        case BookingStatus.ACCEPTED:
          await this.notificationsService.create(
            booking.userId,
            `Your booking for ${booking.issueDescription} has been accepted by the mechanic`,
          );
          break;
        case BookingStatus.COMPLETED:
          await this.notificationsService.create(
            booking.userId,
            `Your booking for ${booking.issueDescription} has been marked as completed`,
          );
          break;
        case BookingStatus.CANCELED:
          // Notify the other party about cancellation
          const notifyUserId =
            role === UserRole.USER ? mechanic.user.id : booking.userId;
          const canceledBy = role === UserRole.USER ? 'customer' : 'mechanic';
          await this.notificationsService.create(
            notifyUserId,
            `Booking for ${booking.issueDescription} was canceled by ${canceledBy}. Reason: ${updateBookingDto.cancellationReason}`,
          );
          break;
      }
    }

    // Update booking
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  private isValidStatusTransition(
    currentStatus: string,
    newStatus: string,
    role: UserRole,
  ): boolean {
    const transitions = {
      [UserRole.USER]: {
        pending: ['canceled'],
        accepted: ['canceled'],
      },
      [UserRole.MECHANIC]: {
        pending: ['accepted', 'canceled'],
        accepted: ['completed', 'canceled'],
      },
    };

    return transitions[role]?.[currentStatus]?.includes(newStatus) ?? false;
  }
}
