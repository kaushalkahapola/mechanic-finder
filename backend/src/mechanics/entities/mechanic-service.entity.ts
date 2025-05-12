import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Mechanic } from './mechanic.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';

@Entity('MechanicServices')
export class MechanicService {
  @PrimaryColumn({ name: 'mechanic_id', type: 'char', length: 36 })
  mechanicId: string;

  @PrimaryColumn({ name: 'service_id', type: 'char', length: 36 })
  serviceId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'custom_price',
    nullable: true,
  })
  customPrice: number;

  @Column({ name: 'is_emergency_available', default: false })
  isEmergencyAvailable: boolean;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.mechanicServices)
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @ManyToOne(() => ServiceType)
  @JoinColumn({ name: 'service_id' })
  serviceType: ServiceType;
}
