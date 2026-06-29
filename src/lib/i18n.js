import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    zh: { translation: zh },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
  },
});

export default i18n;
