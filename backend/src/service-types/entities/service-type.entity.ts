import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ServiceTypes')
export class ServiceType {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' })
  basePrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'emergency_surcharge',
  })
  emergencySurcharge: number;

  @Column({ name: 'estimated_duration' })
  estimatedDuration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
