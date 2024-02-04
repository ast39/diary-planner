import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskDto {
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsNumber()
  userId: number;

  @Type(() => Number)
  @IsNumber()
  userTaskId: number;

  @IsString()
  title: string;

  @Type(() => Number)
  @IsNumber()
  status: number;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
