import { Command, Update } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import type { SceneContext } from 'telegraf/scenes';

@Update()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Command('start')
  async startCommand(ctx: SceneContext) {
    await ctx.scene.enter('createUserScene');
  }
}
