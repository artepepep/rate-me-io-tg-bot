import { Command, Update } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { Context } from 'telegraf';

@Update()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Command('start')
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome from reply.io');
  }
}
