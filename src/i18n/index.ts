import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import pt from '../locales/pt.json';
import it from '../locales/it.json';
import ar from '../locales/ar.json';
import uk from '../locales/uk.json';
import ru from '../locales/ru.json';

export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' as const },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' as const },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' as const },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' as const },
  zh: { name: 'Chinese', nativeName: '中文', dir: 'ltr' as const },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' as const },
  ko: { name: 'Korean', nativeName: '한국어', dir: 'ltr' as const },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr' as const },
  it: { name: 'Italian', nativeName: 'Italiano', dir: 'ltr' as const },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' as const },
  uk: { name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr' as const },
  ru: { name: 'Russian', nativeName: 'Русский', dir: 'ltr' as const },
};

export type SupportedLanguage = keyof typeof supportedLanguages;

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  pt: { translation: pt },
  it: { translation: it },
  ar: { translation: ar },
  uk: { translation: uk },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: Object.keys(supportedLanguages),

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language-preference',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: true,
    },
  });

// Update document direction on language change
i18n.on('languageChanged', (lng) => {
  const lang = lng as SupportedLanguage;
  if (supportedLanguages[lang]) {
    document.documentElement.dir = supportedLanguages[lang].dir;
    document.documentElement.lang = lang;
  }
});

export default i18n;
