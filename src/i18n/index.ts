import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Only English is statically imported (always needed as fallback).
// All other languages are loaded on demand via dynamic import().
import en from '../locales/en.json';

// Languages sorted alphabetically by English name
export const supportedLanguages = {
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' as const },
  bn: { name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' as const },
  ca: { name: 'Catalan', nativeName: 'Català', dir: 'ltr' as const },
  zh: { name: 'Chinese', nativeName: '中文', dir: 'ltr' as const },
  nl: { name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' as const },
  en: { name: 'English', nativeName: 'English', dir: 'ltr' as const },
  fi: { name: 'Finnish', nativeName: 'Suomi', dir: 'ltr' as const },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' as const },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' as const },
  el: { name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr' as const },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' as const },
  is: { name: 'Icelandic', nativeName: 'Íslenska', dir: 'ltr' as const },
  ga: { name: 'Irish', nativeName: 'Gaeilge', dir: 'ltr' as const },
  it: { name: 'Italian', nativeName: 'Italiano', dir: 'ltr' as const },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' as const },
  ko: { name: 'Korean', nativeName: '한국어', dir: 'ltr' as const },
  no: { name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr' as const },
  pl: { name: 'Polish', nativeName: 'Polski', dir: 'ltr' as const },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr' as const },
  ru: { name: 'Russian', nativeName: 'Русский', dir: 'ltr' as const },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' as const },
  sw: { name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr' as const },
  sv: { name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' as const },
  tr: { name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' as const },
  uk: { name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr' as const },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' as const },
};

export type SupportedLanguage = keyof typeof supportedLanguages;

// Dynamic import map for lazy-loaded languages
const localeImports: Record<string, () => Promise<{ default: Record<string, string> }>> = {
  ar: () => import('../locales/ar.json'),
  bn: () => import('../locales/bn.json'),
  ca: () => import('../locales/ca.json'),
  zh: () => import('../locales/zh.json'),
  nl: () => import('../locales/nl.json'),
  fi: () => import('../locales/fi.json'),
  fr: () => import('../locales/fr.json'),
  de: () => import('../locales/de.json'),
  el: () => import('../locales/el.json'),
  hi: () => import('../locales/hi.json'),
  is: () => import('../locales/is.json'),
  ga: () => import('../locales/ga.json'),
  it: () => import('../locales/it.json'),
  ja: () => import('../locales/ja.json'),
  ko: () => import('../locales/ko.json'),
  no: () => import('../locales/no.json'),
  pl: () => import('../locales/pl.json'),
  pt: () => import('../locales/pt.json'),
  ru: () => import('../locales/ru.json'),
  es: () => import('../locales/es.json'),
  sw: () => import('../locales/sw.json'),
  sv: () => import('../locales/sv.json'),
  tr: () => import('../locales/tr.json'),
  uk: () => import('../locales/uk.json'),
  vi: () => import('../locales/vi.json'),
};

/**
 * Dynamically load a language's translations.
 * Returns immediately if the language is already loaded or is English.
 */
export async function loadLanguage(lng: string): Promise<void> {
  if (lng === 'en' || i18n.hasResourceBundle(lng, 'translation')) return;
  const loader = localeImports[lng];
  if (!loader) return;
  const module = await loader();
  i18n.addResourceBundle(lng, 'translation', module.default, true, true);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en', // Default to English for new users
    fallbackLng: 'en',
    partialBundledLanguages: true,
    supportedLngs: Object.keys(supportedLanguages),

    detection: {
      // Only check localStorage for saved user preference, don't auto-detect from browser
      order: ['localStorage'],
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

// Load the saved language preference (if non-English) on startup
const savedLng = i18n.language;
if (savedLng && savedLng !== 'en') {
  loadLanguage(savedLng).then(() => {
    i18n.changeLanguage(savedLng);
  });
}

// Update document direction on language change, and lazy-load translations
i18n.on('languageChanged', (lng) => {
  const lang = lng as SupportedLanguage;
  if (supportedLanguages[lang]) {
    document.documentElement.dir = supportedLanguages[lang].dir;
    document.documentElement.lang = lang;
  }
  // Ensure translations are loaded for the new language
  loadLanguage(lng);
});

export default i18n;
