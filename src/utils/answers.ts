import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SuccessResponseDto {
  @Type(() => Boolean)
  @IsBoolean()
  success: boolean = true;
}
