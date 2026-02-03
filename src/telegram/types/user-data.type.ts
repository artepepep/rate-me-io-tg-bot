import { Language } from 'src/shared/enums/languages.enum';

export type UserData = {
  language: Language;
  name: string;
  mediaId: string;
  mediaLink: string;
  mediaType: 'video' | 'photo';
  age: number;
  description: string;
};
