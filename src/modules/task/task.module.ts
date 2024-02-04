import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}
