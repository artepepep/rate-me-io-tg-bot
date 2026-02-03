import { WizardContext } from 'telegraf/scenes';
import { WizardState } from './wizard-state.type';

export type CreateProfileWizardContext = WizardContext & {
  wizard: WizardContext['wizard'] & {
    state: WizardState;
  };
};
