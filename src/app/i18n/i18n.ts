import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LOGIN_VI from "./locales/vi/common.json";
import LOGIN_EN from "./locales/en/common.json";
import ACCOUNT_VI from "./locales/vi/account.json";
import ACCOUNT_EN from "./locales/en/account.json";

import { LOCALES } from "./locales/locales";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    common: LOGIN_EN,
    account: ACCOUNT_EN,
  },
  vi: {
    common: LOGIN_VI,
    account: ACCOUNT_VI,
  },
} as const;

export const defaultNS = "common";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: LOCALES.VIETNAM,
    ns: ["common", "account"],
    fallbackLng: "vi",
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });
