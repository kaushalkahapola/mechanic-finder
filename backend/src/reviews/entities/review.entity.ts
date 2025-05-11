import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Mechanic } from '../../mechanics/entities/mechanic.entity';

@Entity('Reviews')
export class Review {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @Column({ name: 'mechanic_id', type: 'char', length: 36 })
  mechanicId: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;
}
