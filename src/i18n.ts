import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "gameTitle": "Egypt Open World",
      "enterNeighborhood": "Enter Neighborhood",
      "character": "Character",
      "leaderboard": "Leaderboard",
      "settings": "Settings",
      "language": "Language",
      "english": "English",
      "arabic": "Arabic"
    }
  },
  ar: {
    translation: {
      "gameTitle": "مصر العالم المفتوح",
      "enterNeighborhood": "ادخل الحي",
      "character": "الشخصية",
      "leaderboard": "لوحة المتصدرين",
      "settings": "الإعدادات",
      "language": "اللغة",
      "english": "الإنجليزية",
      "arabic": "العربية"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
