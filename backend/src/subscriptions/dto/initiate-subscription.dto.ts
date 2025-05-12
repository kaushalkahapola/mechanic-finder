import { IsUUID } from 'class-validator';

export class InitiateSubscriptionDto {
  @IsUUID()
  planId: string;

  @IsUUID()
  vehicleId: string;
}
