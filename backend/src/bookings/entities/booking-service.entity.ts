import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';

@Entity('BookingServices')
export class BookingService {
  @PrimaryColumn({
    name: 'booking_id',
    type: 'char',
    length: 36,
    nullable: false,
  })
  bookingId: string;

  @PrimaryColumn({
    name: 'service_type_id',
    type: 'char',
    length: 36,
    nullable: false,
  })
  serviceTypeId: string;

  @Column({ name: 'estimated_duration', nullable: false })
  estimatedDuration: number;

  @Column({
    name: 'estimated_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  estimatedCost: number;

  @Column({ name: 'actual_duration', nullable: true })
  actualDuration?: number;

  @Column({
    name: 'final_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  finalCost?: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingServices, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => ServiceType, {
    nullable: false,
  })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  constructor(partial: Partial<BookingService>) {
    Object.assign(this, partial);
  }
}
