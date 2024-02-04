import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from '../task/task.service';
import { notify } from '../../utils/templates';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { BtnContextInterface } from '../../shared/interfaces';

@Injectable()
export class CronService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<BtnContextInterface>,
    private readonly taskService: TaskService,
  ) {}

  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_8PM, {
    name: 'notifications',
    timeZone: 'Europe/Paris',
  })
  async handleCron() {
    this.logger.debug('Send notifies to users');
    const tasks = await this.taskService.getAllOpenedTasks();

    const tasksByUser = tasks.map((task) => {
      const userTasks = tasks.filter((taskInset) => {
        return taskInset.userId == task.userId;
      });

      return {
        userId: task.userId,
        tasks: userTasks.map((userTask) => {
          return {
            userTaskId: userTask.userTaskId,
            title: userTask.title,
          };
        }),
      };
    });

    const usersForNotify = [
      ...new Map(tasksByUser.map((item) => [item['userId'], item])).values(),
    ];

    usersForNotify.forEach((user) => {
      this.bot.telegram.sendMessage(user.userId, notify(user.tasks));
    });
  }
}
