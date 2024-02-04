import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppUpdate } from './app.update';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './modules/task/task.module';

const sessions = new LocalSession({
  database: 'session_db.json',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TG_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      synchronize: true,
    }),
    TaskModule,
  ],
  controllers: [],
  providers: [AppUpdate],
})
export class AppModule {}
