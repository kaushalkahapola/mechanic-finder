import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { MechanicService } from './mechanic-service.entity';

@Entity('Mechanics')
export class Mechanic {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @Column({ type: 'json', nullable: true })
  certifications: string[];

  @Column({ name: 'experience_years', type: 'int' })
  experienceYears: number;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({
    name: 'current_latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  currentLatitude: number;

  @Column({
    name: 'current_longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  currentLongitude: number;

  @Column({ name: 'last_location_update', type: 'timestamp', nullable: true })
  lastLocationUpdate: Date;

  @Column({
    name: 'service_radius_km',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 10,
  })
  serviceRadiusKm: number;

  @Column({ type: 'json', name: 'working_hours', nullable: true })
  workingHours: Record<string, { start: string; end: string }>;

  @Column({ name: 'is_online', type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ name: 'last_online', type: 'timestamp', nullable: true })
  lastOnline: Date;

  @Column({ name: 'emergency_available', type: 'boolean', default: false })
  emergencyAvailable: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => MechanicService,
    (mechanicService) => mechanicService.mechanic,
  )
  mechanicServices: MechanicService[];
}
