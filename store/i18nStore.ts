import { getLocales } from 'expo-localization';
import { create } from 'zustand';

import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import i18n from '@/i18n/index';
import { preferencesStorage } from '@/storage/preferences';

interface I18nState {
  language: string;
  isReady: boolean;
}

interface I18nActions {
  _initialize: () => Promise<void>;
  setLanguage: (lang: string) => Promise<void>;
}

type I18nStore = I18nState & I18nActions;

const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code) as string[];

export const useI18nStore = create<I18nStore>((set) => ({
  language: 'en',
  isReady: false,

  async _initialize() {
    const saved = await preferencesStorage.getLanguage();

    let resolved = 'en';
    if (saved && supportedCodes.includes(saved)) {
      resolved = saved;
    } else {
      const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
      if (supportedCodes.includes(deviceLocale)) {
        resolved = deviceLocale;
      }
    }

    await i18n.changeLanguage(resolved);
    set({ language: resolved, isReady: true });
  },

  async setLanguage(lang) {
    await i18n.changeLanguage(lang);
    await preferencesStorage.setLanguage(lang);
    set({ language: lang });
  },
}));
