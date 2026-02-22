import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files (alphabetically ordered)
import ar from '../locales/ar.json';
import bn from '../locales/bn.json';
import ca from '../locales/ca.json';
import zh from '../locales/zh.json';
import nl from '../locales/nl.json';
import en from '../locales/en.json';
import fi from '../locales/fi.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import el from '../locales/el.json';
import hi from '../locales/hi.json';
import is from '../locales/is.json';
import ga from '../locales/ga.json';
import it from '../locales/it.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import no from '../locales/no.json';
import pl from '../locales/pl.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';
import sw from '../locales/sw.json';
import sv from '../locales/sv.json';
import tr from '../locales/tr.json';
import uk from '../locales/uk.json';
import vi from '../locales/vi.json';

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

const resources = {
  ar: { translation: ar },
  bn: { translation: bn },
  ca: { translation: ca },
  zh: { translation: zh },
  nl: { translation: nl },
  en: { translation: en },
  fi: { translation: fi },
  fr: { translation: fr },
  de: { translation: de },
  el: { translation: el },
  hi: { translation: hi },
  is: { translation: is },
  ga: { translation: ga },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  no: { translation: no },
  pl: { translation: pl },
  pt: { translation: pt },
  ru: { translation: ru },
  es: { translation: es },
  sw: { translation: sw },
  sv: { translation: sv },
  tr: { translation: tr },
  uk: { translation: uk },
  vi: { translation: vi },
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
