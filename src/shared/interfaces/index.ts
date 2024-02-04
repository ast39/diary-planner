import { Context as ContextTelegraf } from 'telegraf';

export interface BtnContextInterface extends ContextTelegraf {
  session: {
    type?: 'list' | 'create' | 'update' | 'done' | 'delete';
  };
}
