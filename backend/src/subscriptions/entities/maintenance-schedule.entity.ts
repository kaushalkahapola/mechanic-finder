import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';
import { Mechanic } from '../../mechanics/entities/mechanic.entity';

export enum MaintenanceStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

@Entity('MaintenanceSchedules')
export class MaintenanceSchedule {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'subscription_id', type: 'char', length: 36 })
  subscriptionId: string;

  @Column({ name: 'vehicle_id', type: 'char', length: 36 })
  vehicleId: string;

  @Column({ name: 'service_type_id', type: 'char', length: 36 })
  serviceTypeId: string;

  @Column({ name: 'mechanic_id', type: 'char', length: 36, nullable: true })
  mechanicId: string | null;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: Date;

  @Column({ name: 'preferred_time_slot', nullable: true })
  preferredTimeSlot: string | null;

  @Column({
    name: 'service_location_latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  serviceLocationLatitude: number | null;

  @Column({
    name: 'service_location_longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  serviceLocationLongitude: number | null;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;

  @Column({ name: 'completion_date', type: 'date', nullable: true })
  completionDate: Date | null;

  @Column({ name: 'completion_notes', type: 'text', nullable: true })
  completionNotes: string | null;

  @Column({
    name: 'rescheduled_from_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  rescheduledFromId: string | null;

  @ManyToOne(() => UserSubscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription: UserSubscription;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic | null;

  @ManyToOne(() => MaintenanceSchedule)
  @JoinColumn({ name: 'rescheduled_from_id' })
  rescheduledFrom: MaintenanceSchedule | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
