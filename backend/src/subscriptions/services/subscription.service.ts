import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import {
  UserSubscription,
  SubscriptionStatus,
} from '../entities/user-subscription.entity';
import {
  MaintenanceSchedule,
  MaintenanceStatus,
} from '../entities/maintenance-schedule.entity';
import { User } from '../../user/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepo: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private userSubscriptionRepo: Repository<UserSubscription>,
    @InjectRepository(MaintenanceSchedule)
    private maintenanceScheduleRepo: Repository<MaintenanceSchedule>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    private dataSource: DataSource,
  ) {}

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepo.find();
  }

  async initiateSubscription(
    userId: string,
    planId: string,
    vehicleId: string,
  ): Promise<UserSubscription> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [user, plan, vehicle] = await Promise.all([
        this.userRepo.findOneBy({ id: userId }),
        this.subscriptionPlanRepo.findOneBy({ id: planId }),
        this.vehicleRepo.findOneBy({ id: vehicleId }),
      ]);

      if (!user || !plan || !vehicle) {
        throw new NotFoundException('User, plan or vehicle not found');
      }

      const subscription = this.userSubscriptionRepo.create({
        id: uuidv4(),
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE, // Directly activate the subscription
        startDate: new Date(),
        endDate: new Date(
          Date.now() + plan.durationMonths * 30 * 24 * 60 * 60 * 1000,
        ),
        autoRenew: true,
      });

      await queryRunner.manager.save(subscription);
      await this.generateMaintenanceSchedule(subscription);
      await queryRunner.commitTransaction();

      return subscription;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async generateMaintenanceSchedule(
    subscription: UserSubscription,
  ): Promise<void> {
    const plan = await this.subscriptionPlanRepo.findOneBy({
      id: subscription.planId,
    });
    const vehicle = await this.vehicleRepo.findOne({
      where: { userId: subscription.userId },
      order: { createdAt: 'DESC' },
    });

    if (!plan || !vehicle) {
      throw new NotFoundException('Plan or vehicle not found');
    }

    const schedules: MaintenanceSchedule[] = [];
    const startDate = new Date(subscription.startDate);

    for (const [serviceType, config] of Object.entries(plan.serviceIntervals)) {
      for (let i = 0; i < config.included_services; i++) {
        const scheduledDate = new Date(startDate);
        scheduledDate.setMonth(
          scheduledDate.getMonth() + i * config.interval_months,
        );

        schedules.push(
          this.maintenanceScheduleRepo.create({
            id: uuidv4(),
            subscriptionId: subscription.id,
            vehicleId: vehicle.id,
            serviceTypeId: serviceType,
            scheduledDate,
            status: MaintenanceStatus.PENDING,
          }),
        );
      }
    }

    await this.maintenanceScheduleRepo.save(schedules);
  }

  async cancelSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<void> {
    const subscription = await this.userSubscriptionRepo.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;
    await this.userSubscriptionRepo.save(subscription);
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return this.userSubscriptionRepo.find({
      where: { userId },
      relations: ['plan', 'vehicle'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMaintenanceSchedule(
    userId: string,
    subscriptionId: string,
  ): Promise<MaintenanceSchedule[]> {
    const subscription = await this.userSubscriptionRepo.findOne({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.maintenanceScheduleRepo.find({
      where: { subscriptionId },
      relations: ['serviceType', 'mechanic', 'vehicle'],
      order: { scheduledDate: 'ASC' },
    });
  }
}
