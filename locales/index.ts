import en_auth from './en/auth.json';
import en_common from './en/common.json';
import en_errors from './en/errors.json';
import en_home from './en/home.json';
import en_profile from './en/profile.json';
import es_auth from './es/auth.json';
import es_common from './es/common.json';
import es_errors from './es/errors.json';
import es_home from './es/home.json';
import es_profile from './es/profile.json';

export const resources = {
  en: {
    common: en_common,
    auth: en_auth,
    errors: en_errors,
    home: en_home,
    profile: en_profile,
  },
  es: {
    common: es_common,
    auth: es_auth,
    errors: es_errors,
    home: es_home,
    profile: es_profile,
  },
} as const;

// Derives the shape of translation namespaces from the English locale (source of truth).
export type Resources = {
  common: typeof en_common;
  auth: typeof en_auth;
  errors: typeof en_errors;
  home: typeof en_home;
  profile: typeof en_profile;
};
