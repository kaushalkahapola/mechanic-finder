import { IsString, IsNumber } from 'class-validator';

export class PayhereWebhookDto {
  @IsString()
  merchant_id: string;

  @IsString()
  order_id: string;

  @IsNumber()
  payhere_amount: number;

  @IsString()
  payhere_currency: string;

  @IsNumber()
  status_code: number;

  @IsString()
  md5sig: string;

  @IsString()
  subscription_id: string;

  @IsString()
  customer_token: string;
}
