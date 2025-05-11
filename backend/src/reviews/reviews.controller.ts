import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.USER)
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, createReviewDto);
  }

  @Get(':mechanicId')
  async findByMechanic(
    @Param('mechanicId') mechanicId: string,
    @Query() queryDto: QueryReviewDto,
  ) {
    return this.reviewsService.findByMechanic(mechanicId, queryDto);
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.USER)
  async update(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() updateData: Partial<CreateReviewDto>,
  ) {
    return this.reviewsService.update(req.user.sub, reviewId, updateData);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.USER)
  async delete(@Request() req, @Param('reviewId') reviewId: string) {
    await this.reviewsService.delete(req.user.sub, reviewId);
    return { message: 'Review deleted successfully' };
  }
}
