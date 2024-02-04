import { Ctx, Hears, Message, On, Start, Update } from 'nestjs-telegraf';
import { TaskService } from './modules/task/task.service';
import { ButtonsEnum } from './utils/buttons.enum';
import { actionButtons, showList } from './utils/templates';
import { BtnContextInterface } from './shared/interfaces';

@Update()
export class AppWatching {
  constructor(private readonly taskService: TaskService) {}

  // Инициализация бота
  @Start()
  async startCommand(ctx: BtnContextInterface) {
    await ctx.reply(
      'Привет, ' +
        ctx.from.first_name +
        '! Я помогу тебе не забыть о важных делах!',
    );
    await ctx.reply('Выбери действие в меню', actionButtons());
  }

  // Список моих задач
  @Hears(ButtonsEnum.list)
  async getAll(ctx: BtnContextInterface) {
    const tasks = await this.taskService.getAll(Number(ctx.from.id));
    if (tasks.length < 1) {
      await ctx.reply(
        'У вас нет ни одной задачи =( Самое время добавить новую?',
      );
    } else {
      await ctx.reply(showList(tasks));
    }
  }

  @Hears(ButtonsEnum.create)
  async create(ctx: BtnContextInterface) {
    await ctx.replyWithHTML('Напишите суть задачи:');
    ctx.session.type = 'create';
  }

  @Hears(ButtonsEnum.update)
  async edit(ctx: BtnContextInterface) {
    await ctx.replyWithHTML(
      'Напишите ID и новое название задачи: \n\n' +
        'в формате - <b>1:название</b>',
    );
    ctx.session.type = 'update';
  }

  // Завершить задачу
  @Hears(ButtonsEnum.done)
  async done(ctx: BtnContextInterface) {
    await ctx.reply('Напишите ID задачи: ');
    ctx.session.type = 'done';
  }

  // Удалить задачу
  @Hears(ButtonsEnum.delete)
  async delete(ctx: BtnContextInterface) {
    await ctx.reply('Напишите ID задачи: ');
    ctx.session.type = 'delete';
  }

  // Реакции на ответы пользователя
  @On('text')
  async getMessage(
    @Message('text') message: string,
    @Ctx() ctx: BtnContextInterface,
  ) {
    if (!ctx.session.type) return;

    // Добавить задачу
    if (ctx.session.type === 'create') {
      await this.taskService.createTask({
        userId: Number(ctx.from.id),
        title: message,
        status: 0,
      });

      await ctx.reply('Задача "' + message + '" добавлена');
    }

    // Изменить задачу
    if (ctx.session.type === 'update') {
      const [taskId, taskTitle] = message.split(':');
      const task = await this.taskService.getOne(Number(taskId));

      if (!task) {
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }

      if (task.userId !== Number(ctx.from.id)) {
        await ctx.reply('Это чужая задача, вы не можете ее изменить');
        return;
      }

      await this.taskService.updateTask(task.id, {
        title: taskTitle,
      });

      await ctx.reply('Задача обновлена');
    }

    // Завершить задачу
    if (ctx.session.type === 'done') {
      const task = await this.taskService.getOne(Number(message));

      if (!task) {
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }

      if (task.userId !== Number(ctx.from.id)) {
        await ctx.reply('Это чужая задача, вы не можете ее завершить');
        return;
      }

      await this.taskService.updateTask(task.id, {
        status: 1,
      });

      await ctx.reply('Задача "' + task.title + '" завершена');
    }

    // удаление задачи
    if (ctx.session.type === 'delete') {
      const task = await this.taskService.getOne(Number(message));

      if (!task) {
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }

      if (task.userId !== Number(ctx.from.id)) {
        await ctx.reply('Это чужая задача, вы не можете ее удалить');
        return;
      }

      await this.taskService.delete(task.id);
      await ctx.reply('Задача "' + task.title + '" удалена');
    }
  }
}
