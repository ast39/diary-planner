import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'integer',
    nullable: false,
    comment: 'Телеграм ID',
  })
  userId: number;

  @Column({
    name: 'user_task_id',
    type: 'integer',
    nullable: false,
    comment: 'ID задачи пользователя',
  })
  userTaskId: number;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: 'Название задачи',
  })
  title: string;

  @Column({
    name: 'status',
    type: 'integer',
    nullable: false,
    default: 0,
    comment: 'Статус задачи',
  })
  status: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}
