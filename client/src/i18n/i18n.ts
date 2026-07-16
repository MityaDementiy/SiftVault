import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

const DEFAULT_LANGUAGE = 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

export default i18n;
