import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/locales';

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'errors', 'home', 'profile'],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
