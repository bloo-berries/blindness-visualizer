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
import ga from '../locales/ga.json';
import ca from '../locales/ca.json';
import vi from '../locales/vi.json';
import tr from '../locales/tr.json';
import el from '../locales/el.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';

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
  ga: { name: 'Irish', nativeName: 'Gaeilge', dir: 'ltr' as const },
  ca: { name: 'Catalan', nativeName: 'Català', dir: 'ltr' as const },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' as const },
  tr: { name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' as const },
  el: { name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr' as const },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' as const },
  bn: { name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' as const },
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
  ga: { translation: ga },
  ca: { translation: ca },
  vi: { translation: vi },
  tr: { translation: tr },
  el: { translation: el },
  hi: { translation: hi },
  bn: { translation: bn },
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
