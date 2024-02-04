import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskNotFoundException extends HttpException {
  constructor() {
    super({ message: 'Задача не найдена' }, HttpStatus.BAD_REQUEST);
  }
}