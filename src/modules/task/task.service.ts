import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from './dto/task-create.dto';
import { TaskDto } from './dto/task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskNotFoundException } from '../../utils/exceptions';
import { SuccessResponseDto } from '../../utils/answers';
import { TaskRepository } from './task.repository';
import { UpdateTaskDto } from './dto/task-update.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly taskRepo: TaskRepository,
  ) {}

  // Добавить задачу
  async createTask(body: CreateTaskDto): Promise<TaskDto> {
    return await this.dataSource.transaction(async (transaction) => {
      const userTaskId = await this.taskRepo.getLastUserTask(body.userId);

      const newTask = await transaction
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .insert()
        .values({
          userId: body.userId,
          userTaskId: userTaskId,
          title: body.title,
          status: body.status ?? 0,
        })
        .execute();

      const task = await this.taskRepo.findTaskById(
        newTask.identifiers[0].id,
        transaction,
      );

      return this.responseLikeDto(task);
    });
  }

  // Получить 1 задачу
  async getOne(taskId: number): Promise<TaskDto> {
    const task = await this.dataSource
      .getRepository(TaskEntity)
      .createQueryBuilder('task')
      .where({ id: taskId })
      .getOne();

    if (!task) {
      throw new TaskNotFoundException();
    }

    return this.responseLikeDto(task);
  }

  // Получить список задач
  async getAll(userId: number): Promise<TaskDto[]> {
    return await this.dataSource.transaction(async (transaction) => {
      const tasks = await transaction
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where({ userId: userId })
        .orderBy({ 'task.status': 'ASC' })
        .orderBy({ 'task.createdAt': 'ASC' })
        .getMany();

      return tasks.map((task) => this.responseLikeDto(task));
    });
  }

  // Добавить задачу
  async updateTask(taskId: number, body: UpdateTaskDto): Promise<TaskDto> {
    return await this.dataSource.transaction(async (transaction) => {
      const task = await transaction
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where({ id: taskId })
        .getOne();

      if (!task) {
        throw new TaskNotFoundException();
      }

      task.title = body.title ?? task.title;
      task.status = body.status ?? task.status;

      await transaction
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .update()
        .where({ id: task.id })
        .set({
          title: task.title,
          status: task.status,
          updatedAt: new Date(),
        })
        .execute();

      return this.responseLikeDto(task);
    });
  }

  // Удаление задачи
  async delete(taskId: number): Promise<SuccessResponseDto> {
    return await this.dataSource.transaction(async (transaction) => {
      const task = await transaction
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where({ id: taskId })
        .getOne();

      if (!task) {
        throw new TaskNotFoundException();
      }

      await transaction.getRepository(TaskEntity).delete({ id: task.id });

      return {
        success: true,
      };
    });
  }

  private responseLikeDto(body: TaskEntity): TaskDto {
    return {
      id: body.id,
      userId: body.userId,
      userTaskId: body.userTaskId,
      title: body.title,
      status: body.status,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    };
  }
}
