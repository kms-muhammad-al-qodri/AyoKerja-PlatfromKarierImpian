import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import idTranslation from './locales/id/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    debug: false,
    resources: {
      id: { translation: idTranslation },
      en: { translation: enTranslation },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ayokerja_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
