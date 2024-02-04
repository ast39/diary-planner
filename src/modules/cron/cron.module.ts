import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
