import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class TaskQueryPaginationDto {
  @Type(() => Number)
  @Min(1, { message: 'Минимальное значение страницы 1' })
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @Min(0)
  @IsOptional()
  limit?: number = 10;
}
