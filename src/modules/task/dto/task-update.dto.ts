import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @IsInt()
  @IsOptional()
  userTaskId?: number;

  @IsString()
  @MaxLength(100, { message: 'Максимальная длина символов 100' })
  @IsOptional()
  title?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  status?: number;
}
