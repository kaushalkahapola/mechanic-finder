import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from './entities/service-type.entity';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(
    createServiceTypeDto: CreateServiceTypeDto,
  ): Promise<ServiceType> {
    const serviceType = this.serviceTypeRepository.create({
      id: uuidv4(),
      ...createServiceTypeDto,
    });
    return this.serviceTypeRepository.save(serviceType);
  }

  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypeRepository.find();
  }

  async findOne(id: string): Promise<ServiceType> {
    const serviceType = await this.serviceTypeRepository.findOne({
      where: { id },
    });
    if (!serviceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }
    return serviceType;
  }

  async update(
    id: string,
    updateData: Partial<CreateServiceTypeDto>,
  ): Promise<ServiceType> {
    const serviceType = await this.findOne(id);
    Object.assign(serviceType, updateData);
    return this.serviceTypeRepository.save(serviceType);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }
  }
}
