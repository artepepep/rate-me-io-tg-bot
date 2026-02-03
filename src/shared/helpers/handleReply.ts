/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MESSAGES } from 'src/telegram/messages';
import { Language } from '../enums/languages.enum';
import { Context } from 'telegraf';
import {
  ForceReply,
  InlineKeyboardMarkup,
  LinkPreviewOptions,
  MessageEntity,
  ParseMode,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ReplyParameters,
} from 'telegraf/types';

export const handleReply = async (
  ctx: Context,
  key: string,
  language?: Language,
  extra?: Omit<
    {
      chat_id: number | string;
      message_thread_id?: number;
      text: string;
      parse_mode?: ParseMode;
      entities?: MessageEntity[];
      link_preview_options?: LinkPreviewOptions;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_parameters?: ReplyParameters;
      reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
    },
    'chat_id' | 'text'
  >,
) => {
  const lang = language ?? Language.RU;

  const text = key.split('.').reduce((obj: any, k) => obj?.[k], MESSAGES[lang]);

  if (!text) return;

  await ctx.reply(text, extra);
};
