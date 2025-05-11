import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { mechanicId, rating, comment } = createReviewDto;

    // Check if mechanic exists
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: mechanicId },
      relations: ['user'],
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    // Prevent self-reviews
    if (mechanic.user.id === userId) {
      throw new BadRequestException('Cannot review yourself');
    }

    // Check if user has already reviewed this mechanic (including soft-deleted reviews)
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, mechanicId },
      withDeleted: true,
    });

    if (existingReview) {
      if (existingReview.deletedAt) {
        // If the review was soft-deleted, restore it with new data
        existingReview.rating = rating;
        existingReview.comment = comment;
        existingReview.deletedAt = undefined;
        const savedReview = await this.reviewRepository.save(existingReview);
        await this.updateMechanicRating(mechanicId);
        return this.findOne(savedReview.id);
      }
      throw new BadRequestException('You have already reviewed this mechanic');
    }

    // Create review
    const review = this.reviewRepository.create({
      id: uuidv4(),
      userId,
      mechanicId,
      rating,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update mechanic's average rating
    await this.updateMechanicRating(mechanicId);

    return this.findOne(savedReview.id);
  }

  async findByMechanic(
    mechanicId: string,
    queryDto: QueryReviewDto,
  ): Promise<{
    items: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = queryDto;

    // Check if mechanic exists
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: mechanicId },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.mechanicId = :mechanicId', { mechanicId });

    // Get total count of non-deleted reviews
    const total = await query.getCount();

    // Apply sorting
    query.orderBy(`review.${sort}`, order);

    // Apply pagination
    query.skip((page - 1) * limit).take(limit);

    const items = await query.getMany();

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    userId: string,
    reviewId: string,
    updateData: Partial<CreateReviewDto>,
  ): Promise<Review> {
    const review = await this.findOne(reviewId);

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenException("Cannot update someone else's review");
    }

    // Update only allowed fields
    if (updateData.rating !== undefined) {
      review.rating = updateData.rating;
    }
    if (updateData.comment !== undefined) {
      review.comment = updateData.comment;
    }

    const updatedReview = await this.reviewRepository.save(review);

    // Update mechanic's average rating
    await this.updateMechanicRating(review.mechanicId);

    return this.findOne(updatedReview.id);
  }

  async delete(userId: string, reviewId: string): Promise<void> {
    const review = await this.findOne(reviewId);

    // Check ownership
    if (review.userId !== userId) {
      throw new ForbiddenException("Cannot delete someone else's review");
    }

    // Soft delete the review
    await this.reviewRepository.softDelete(reviewId);

    // Update mechanic's average rating
    await this.updateMechanicRating(review.mechanicId);
  }

  private async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'mechanic'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  private async updateMechanicRating(mechanicId: string): Promise<void> {
    // Only consider non-deleted reviews for average rating
    const reviews = await this.reviewRepository.find({
      where: { mechanicId },
    });

    if (reviews.length === 0) {
      await this.mechanicRepository.update(mechanicId, { rating: 0 });
      return;
    }

    const averageRating =
      reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
      reviews.length;
    await this.mechanicRepository.update(mechanicId, { rating: averageRating });
  }
}
