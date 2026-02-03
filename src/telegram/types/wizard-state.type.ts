import { UserData } from './user-data.type';

export type WizardState = {
  userData: Partial<UserData>;
  chatId?: number;
  telegramUserId?: number;
};
