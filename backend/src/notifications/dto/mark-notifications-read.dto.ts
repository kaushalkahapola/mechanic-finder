import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class MarkNotificationsReadDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  notificationIds: string[];
}
