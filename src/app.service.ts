import { Injectable } from '@nestjs/common';
import { Command, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class AppService {
  @Command('start')
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome to the bot');
  }
}
