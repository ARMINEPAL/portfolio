import i18next from 'i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';

const savedLanguage = localStorage.getItem('language');

const initialLanguage = savedLanguage === 'en' ? 'en' : 'ru';

const i18n = i18next.createInstance();

await i18n.init({
  lng: initialLanguage,
  fallbackLng: 'ru',
  resources: {
    ru,
    en,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;