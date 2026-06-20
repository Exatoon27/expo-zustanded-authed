import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  THEME: 'pref_theme',
  LANGUAGE: 'pref_language',
  NOTIFICATIONS_ENABLED: 'pref_notifications_enabled',
} as const;

export const preferencesStorage = {
  async getTheme(): Promise<'light' | 'dark' | 'system' | null> {
    const val = await AsyncStorage.getItem(KEYS.THEME);
    return (val as 'light' | 'dark' | 'system') ?? null;
  },

  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  },

  async getNotificationsEnabled(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
    return val !== 'false';
  },

  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, String(enabled));
  },

  async getLanguage(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.LANGUAGE);
  },

  async setLanguage(lang: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
  },
};
