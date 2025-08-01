import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./en/translation.json";
import translationFR from "./fr/translation.json";
import translationES from "./es/translation.json";
import translationDE from "./de/translation.json";
import { ReadConfigFromLocalStorage, SUPPORTED_LANGUAGES } from "../services/utils";

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES },
  de: { translation: translationDE },
};

// Get stored language preference
const getStoredLanguage = () => {
  try {
    const config = ReadConfigFromLocalStorage();
    return config?.language;
  } catch (error) {
    return null;
  }
};

// Determine initial language
const getInitialLanguage = () => {
  const storedLanguage = getStoredLanguage();
  
  if (storedLanguage && storedLanguage !== 'default') {
    return storedLanguage;
  }
  
  // Use browser language detection for 'default' or no stored preference
  const browserLanguage = navigator.language.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      // Only use language detector if no stored preference
      order: getStoredLanguage() && getStoredLanguage() !== 'default' ? [] : ['navigator'],
      caches: [],
    },
  });

export default i18n;
