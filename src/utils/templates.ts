import { Markup } from 'telegraf';
import { ButtonsEnum } from './buttons.enum';

export const showList = (tasks) =>
  `Мои задачи\n\n${tasks
    .map(
      (task) =>
        task.userTaskId +
        ': ' +
        (task.status == 1 ? '✅' : '📌') +
        ' ' +
        task.title +
        '\n',
    )
    .join('')}`;

export const notify = (tasks) =>
  `У вас все еще есть невыполненные задачи:\n\n${tasks
    .map((task) => task.userTaskId + ': ' + task.title + '\n')
    .join('')}`;

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(ButtonsEnum.create, 'create', false),
      Markup.button.callback(ButtonsEnum.done, 'done', false),
      Markup.button.callback(ButtonsEnum.update, 'update', false),
      Markup.button.callback(ButtonsEnum.delete, 'delete', false),
      Markup.button.callback(ButtonsEnum.list, 'list', false),
    ],
    {
      columns: 2,
    },
  );
}

// export function staticButtons() {
//   return Markup.keyboard([Markup.button.callback('Начать', 'start')], {
//     columns: 1,
//   });
// }
