import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from './entities/notification.entity';
import { MarkNotificationsReadDto } from './dto/mark-notifications-read.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAllForUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(
    userId: string,
    dto: MarkNotificationsReadDto,
  ): Promise<void> {
    // First verify that all notifications belong to the user
    const notifications = await this.notificationRepository.find({
      where: {
        id: In(dto.notificationIds),
        userId,
      },
    });

    if (notifications.length !== dto.notificationIds.length) {
      throw new ForbiddenException(
        'Some notifications do not belong to the user',
      );
    }

    await this.notificationRepository.update(
      { id: In(dto.notificationIds) },
      { isRead: true },
    );
  }

  // Helper method to create notifications (used by other services)
  async create(userId: string, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({
      id: uuidv4(),
      userId,
      message,
    });

    return this.notificationRepository.save(notification);
  }
}
