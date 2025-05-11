import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification } from './entities/notification.entity';
import { MarkNotificationsReadDto } from './dto/mark-notifications-read.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req): Promise<Notification[]> {
    return this.notificationsService.findAllForUser(req.user.sub);
  }

  @Post()
  async markAsRead(
    @Request() req,
    @Body() markAsReadDto: MarkNotificationsReadDto,
  ): Promise<void> {
    await this.notificationsService.markAsRead(req.user.sub, markAsReadDto);
  }
}
