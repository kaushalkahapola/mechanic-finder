import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SubscriptionPlans')
export class SubscriptionPlan {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'duration_months' })
  durationMonths: number;

  @Column({ type: 'json', name: 'service_intervals' })
  serviceIntervals: Record<
    string,
    { interval_months: number; included_services: number }
  >;

  @Column({ type: 'json' })
  features: string[];

  @Column({
    name: 'mechanic_revenue_share',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  mechanicRevenueShare: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
