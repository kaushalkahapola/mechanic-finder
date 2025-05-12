import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Mechanic } from '../../mechanics/entities/mechanic.entity';
import { BookingService } from './booking-service.entity';

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('Bookings')
export class Booking {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @Column({ name: 'mechanic_id', type: 'char', length: 36 })
  mechanicId: string;

  @Column({
    name: 'service_location_latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
  })
  serviceLocationLatitude: number;

  @Column({
    name: 'service_location_longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
  })
  serviceLocationLongitude: number;

  @Column({ name: 'scheduled_time' })
  scheduledTime: Date;

  @Column({ name: 'issue_description', type: 'text', nullable: true })
  issueDescription?: string;

  @Column({ name: 'estimated_duration' })
  estimatedDuration: number;

  @Column({ name: 'estimated_cost', type: 'decimal', precision: 10, scale: 2 })
  estimatedCost: number;

  @Column({
    name: 'final_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  finalCost?: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ name: 'completion_time', nullable: true })
  completionTime?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @OneToMany(() => BookingService, (bookingService) => bookingService.booking)
  bookingServices: BookingService[];
}
