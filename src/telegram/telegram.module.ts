import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { ConfigModule } from '@nestjs/config';
import { CreateProfileScene } from './scenes/create-profile.scene';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: process.env.BOT_TOKEN!,
    }),
  ],
  providers: [TelegramService, TelegramController, CreateProfileScene],
})
export class TelegramModule {}
