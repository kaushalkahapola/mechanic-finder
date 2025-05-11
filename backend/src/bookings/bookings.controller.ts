import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UserRole } from '../user/entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(UserRole.USER)
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.sub, createBookingDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.USER, UserRole.MECHANIC)
  async findAll(@Request() req, @Query() queryDto: QueryBookingDto) {
    return this.bookingsService.findAll(req.user.sub, req.user.role, queryDto);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.USER, UserRole.MECHANIC)
  async findOne(@Request() req, @Param('id') id: string) {
    return this.bookingsService.findOne(req.user.sub, id);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(UserRole.USER, UserRole.MECHANIC)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(req.user.sub, req.user.role, id, updateBookingDto);
  }
} 
