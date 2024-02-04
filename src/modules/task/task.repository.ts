import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { ta } from '../../shared/types';

@Injectable()
export class TaskRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // Получить 1 задачу
  async findTaskById(taskId: number, transaction?: ta): Promise<any> {
    const ta = transaction ?? this.dataSource;

    return ta
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .where({ id: taskId })
      .getOne();
  }

  async getLastUserTask(userId: number, transaction?: ta): Promise<number> {
    const ta = transaction ?? this.dataSource;

    const lastTask = await ta
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .where({ userId: userId })
      .orderBy({ 'task.id': 'DESC' })
      .getOne();

    return lastTask === null ? 1 : lastTask.userTaskId + 1;
  }
}
