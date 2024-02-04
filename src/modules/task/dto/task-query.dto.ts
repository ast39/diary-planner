import { TaskQueryPaginationDto } from './task-query-pagination.dto';
import { IsEnum, IsInt } from 'class-validator';
import { StatusEnum } from '../../../shared/enums/status.enum';

export class TaskQueryDto extends TaskQueryPaginationDto {
  @IsInt()
  @IsEnum(StatusEnum)
  status?: number;
}
