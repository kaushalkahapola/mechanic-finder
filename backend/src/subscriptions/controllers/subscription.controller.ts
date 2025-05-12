import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';
import { SubscriptionService } from '../services/subscription.service';
import { InitiateSubscriptionDto } from '../dto/initiate-subscription.dto';
import { PayhereWebhookDto } from '../dto/payhere-webhook.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getSubscriptionPlans() {
    return this.subscriptionService.getSubscriptionPlans();
  }

  @Post('initiate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.USER)
  async initiateSubscription(
    @Request() req,
    @Body() initiateDto: InitiateSubscriptionDto,
  ) {
    return this.subscriptionService.initiateSubscription(
      req.user.sub,
      initiateDto.planId,
      initiateDto.vehicleId,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(@Body() webhookDto: PayhereWebhookDto) {
    return { status: 'success' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.USER)
  async cancelSubscription(
    @Request() req,
    @Param('id') subscriptionId: string,
  ) {
    await this.subscriptionService.cancelSubscription(
      req.user.sub,
      subscriptionId,
    );
    return { message: 'Subscription cancelled successfully' };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getUserSubscriptions(@Request() req) {
    return this.subscriptionService.getUserSubscriptions(req.user.sub);
  }

  @Get(':id/schedule')
  @UseGuards(JwtAuthGuard)
  async getMaintenanceSchedule(
    @Request() req,
    @Param('id') subscriptionId: string,
  ) {
    return this.subscriptionService.getMaintenanceSchedule(
      req.user.sub,
      subscriptionId,
    );
  }
}
