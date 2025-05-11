import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum MechanicService {
  TIRE_CHANGE = 'Tire Change',
  OIL_CHANGE = 'Oil Change',
  BATTERY_REPLACEMENT = 'Battery Replacement',
  ENGINE_REPAIR = 'Engine Repair',
  BRAKE_SERVICE = 'Brake Service',
  TOWING = 'Towing',
  JUMP_START = 'Jump Start',
  FUEL_DELIVERY = 'Fuel Delivery',
  LOCKOUT_SERVICE = 'Lockout Service',
}

@Entity('Mechanics')
export class Mechanic {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @Column({ type: 'json' })
  services: MechanicService[];

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'json', nullable: true })
  certifications: string[];

  @Column({ name: 'experience_years', type: 'int' })
  experienceYears: number;

  @Column({ name: 'current_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column({ name: 'current_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ name: 'last_location_update', type: 'timestamp', nullable: true })
  lastLocationUpdate: Date;

  @Column({ name: 'service_radius_km', type: 'decimal', precision: 5, scale: 2, default: 10 })
  serviceRadiusKm: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 
