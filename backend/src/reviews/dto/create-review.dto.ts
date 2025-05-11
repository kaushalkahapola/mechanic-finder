import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  mechanicId: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
