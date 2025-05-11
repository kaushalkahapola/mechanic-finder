import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { Mechanic } from './entities/mechanic.entity';
import { MechanicService } from './entities/mechanic-service.entity';
import { ServiceTypesModule } from '../service-types/service-types.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mechanic, MechanicService, User]),
    ServiceTypesModule,
    UserModule,
  ],
  controllers: [MechanicsController],
  providers: [MechanicsService],
  exports: [MechanicsService],
})
export class MechanicsModule {}
