import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LOGIN_VI from "./locales/vi/common.json";
import LOGIN_EN from "./locales/en/common.json";
import { LOCALES } from "./locales/locales";

export const resources = {
  en: {
    common: LOGIN_EN,
  },
  vi: {
    common: LOGIN_VI,
  },
} as const;

export const defaultNS = "common";

i18n.use(initReactI18next).init({
  resources,
  lng: LOCALES.VIETNAM,
  ns: ["common"],
  fallbackLng: "vi",
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});
