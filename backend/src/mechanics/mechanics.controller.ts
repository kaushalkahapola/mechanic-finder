import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Request,
  ParseFloatPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMechanicProfileDto } from './dto/create-mechanic-profile.dto';
import { UpdateMechanicLocationDto } from './dto/update-mechanic-location.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  async findMechanics(
    @Query('latitude', new DefaultValuePipe(0), ParseFloatPipe) latitude: number,
    @Query('longitude', new DefaultValuePipe(0), ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(10), ParseFloatPipe) radius: number,
    @Query('serviceType') serviceType?: string,
    @Query('useLocation', new DefaultValuePipe(false)) useLocation?: boolean,
  ) {
    return this.mechanicsService.findMechanics(latitude, longitude, radius, serviceType, useLocation);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MECHANIC)
  async getProfile(@Request() req) {
    return this.mechanicsService.getProfile(req.user.sub);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MECHANIC)
  async createOrUpdateProfile(
    @Request() req,
    @Body() createMechanicProfileDto: CreateMechanicProfileDto,
  ) {
    return this.mechanicsService.createOrUpdateProfile(req.user.sub, createMechanicProfileDto);
  }

  @Put('location')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.MECHANIC)
  async updateLocation(
    @Request() req,
    @Body() updateLocationDto: UpdateMechanicLocationDto,
  ) {
    await this.mechanicsService.updateLocation(req.user.sub, updateLocationDto);
    return { message: 'Location updated successfully' };
  }
} 
