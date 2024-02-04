import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsInt()
  @IsNotEmpty({ message: 'Это поле обязательное' })
  userId: number;

  @IsString()
  @MaxLength(100, { message: 'Максимальная длина символов 100' })
  @IsNotEmpty({ message: 'Это поле обязательное' })
  title: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  status: number = 0;
}
