import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { ServiceType } from './entities/service-type.entity';

@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createServiceTypeDto: CreateServiceTypeDto,
  ): Promise<ServiceType> {
    return this.serviceTypesService.create(createServiceTypeDto);
  }

  @Get()
  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceType> {
    return this.serviceTypesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: Partial<CreateServiceTypeDto>,
  ): Promise<ServiceType> {
    return this.serviceTypesService.update(id, updateServiceTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.serviceTypesService.remove(id);
  }
}
