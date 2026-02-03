import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { MESSAGES } from '../messages';
import { Language } from 'src/shared/enums/languages.enum';
import type { CreateProfileWizardContext } from '../types/create-profile-wizard-context.type';
import { handleReply } from 'src/shared/helpers/handleReply';
import { Markup } from 'telegraf';

@Wizard('createUserScene')
export class CreateProfileScene {
  constructor() {}

  @WizardStep(1)
  async step1(@Context() ctx: CreateProfileWizardContext) {
    const userLangCode = ctx.from?.language_code?.toLocaleUpperCase() as Language;

    ctx.wizard.state.userData = {};
    ctx.wizard.state.telegramUserId = ctx.from?.id;
    ctx.wizard.state.chatId = ctx.chat?.id;

    if (ctx.from?.language_code === MESSAGES.RU_LANGUAGE) {
      ctx.wizard.state.userData.language = Language.RU;
    }
    if (ctx.from?.language_code === MESSAGES.UA_LANGUAGE) {
      ctx.wizard.state.userData.language = Language.UK;
    } else {
      ctx.wizard.state.userData.language = Language.RU;
    }

    await handleReply(ctx, 'YOUR_AGE', userLangCode);

    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Context() ctx: CreateProfileWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) return;
    const text = ctx.message.text.trim();

    if (text.startsWith('/')) return;
    if (!/^\d+$/.test(text)) {
      await handleReply(ctx, 'ERROR.AGE_INCORRECT', ctx.wizard.state.userData.language);
      return;
    }
    const age = Number(text);
    if (age < 10 || age > 99) {
      await handleReply(ctx, 'ERROR.AGE_INCORRECT', ctx.wizard.state.userData.language);
      return;
    }

    ctx.wizard.state.userData.age = age;

    ctx.wizard.state.userData.age = Number(ctx.message.text);
    await handleReply(ctx, 'YOUR_NAME', ctx.wizard.state.userData.language);
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Context() ctx: CreateProfileWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) return;
    if (ctx.message.text.startsWith('/')) return;

    ctx.wizard.state.userData.name = ctx.message.text;

    await handleReply(ctx, 'YOUR_PHOTO', ctx.wizard.state.userData.language);
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Context() ctx: CreateProfileWizardContext) {
    if (!ctx.message) return;

    let fileId: string | undefined;

    if ('photo' in ctx.message) {
      fileId = ctx.message.photo.at(-1)?.file_id;
      ctx.wizard.state.userData.mediaType = 'photo';
    } else if ('video' in ctx.message) {
      fileId = ctx.message.video.file_id;
      ctx.wizard.state.userData.mediaType = 'video';
    }

    if (!fileId) {
      await handleReply(ctx, 'ERROR.NOT_MEDIA', ctx.wizard.state.userData.language);
      return;
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);

    ctx.wizard.state.userData.mediaId = fileId;
    ctx.wizard.state.userData.mediaLink = fileLink.href;

    const userLang = ctx.wizard.state.userData.language;
    let keyboard = Markup.keyboard([[MESSAGES[Language.RU].SKIP_STEP]]).resize();
    if (userLang) {
      keyboard = Markup.keyboard([[MESSAGES[userLang].SKIP_STEP]]).resize();
    }

    await handleReply(ctx, 'YOUR_DESCRIPTION', ctx.wizard.state.userData.language, keyboard);
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Context() ctx: CreateProfileWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }
    if (ctx.message.text.startsWith('/')) {
      return;
    }
    if (ctx.message.text.length > 300) {
      await handleReply(ctx, 'ERROR.DESCRIPTION_TOO_LONG', ctx.wizard.state.userData.language);
      return;
    }

    const lang = ctx.wizard.state.userData.language ?? Language.RU;
    const text = ctx.message.text.trim();

    console.log(`From step5: ${text === MESSAGES[lang].SKIP_STEP}`);
    if (text === MESSAGES[lang].SKIP_STEP) {
      ctx.wizard.state.userData.description = undefined;
    } else {
      ctx.wizard.state.userData.description = text;
    }

    const { age, name, description, mediaId, mediaType } = ctx.wizard.state.userData;
    console.log(ctx.wizard.state.userData);

    const caption = `${name}, ${age}\n${description}\nRating: 🌑/🌑`.trim();

    if (mediaType === 'photo' && mediaId) {
      await ctx.replyWithPhoto(mediaId, { caption });
    } else if (mediaType === 'video' && mediaId) {
      await ctx.replyWithVideo(mediaId, { caption });
    }

    const keyboard = Markup.keyboard([[MESSAGES.YES, MESSAGES.NO]]).resize();
    await handleReply(ctx, 'IS_CORRECT_PROFILE', ctx.wizard.state.userData.language, keyboard);

    ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(@Context() ctx: CreateProfileWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) return;

    console.log(`From step6: ${ctx.message.text === MESSAGES.YES}`);
    if (ctx.message.text === MESSAGES.YES) {
      await handleReply(ctx, 'PROFILE_CREATION');
      // todo: User creation
      await handleReply(ctx, 'PROFILE_CREATED', ctx.wizard.state.userData.language, {
        reply_markup: Markup.removeKeyboard().reply_markup,
      });
      await ctx.scene.leave();
    }

    if (ctx.message.text === MESSAGES.NO) {
      await handleReply(ctx, 'CREATE_AGAIN', ctx.wizard.state.userData.language, {
        reply_markup: Markup.removeKeyboard().reply_markup,
      });
      ctx.wizard.state.userData = {};
      ctx.wizard.selectStep(1);
    }
  }
}
