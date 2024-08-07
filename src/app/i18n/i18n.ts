import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LOGIN_VI from "./locales/vi/common.json";
import LOGIN_EN from "./locales/en/common.json";
import ACCOUNT_VI from "./locales/vi/account.json";
import ACCOUNT_EN from "./locales/en/account.json";
import EXAM_EN from "./locales/en/exam.json";
import EXAM_VI from "./locales/vi/exam.json";
import QUESTION_EN from "./locales/en/question.json";
import QUESTION_VI from "./locales/vi/question.json";
import OVERVIEW_EN from "./locales/en/overview.json";
import OVERVIEW_VI from "./locales/vi/overview.json";
import INTRODUCE_EN from "./locales/en/introduce.json";
import INTRODUCE_VI from "./locales/vi/introduce.json";

import { LOCALES } from "./locales/locales";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    common: LOGIN_EN,
    account: ACCOUNT_EN,
    exam: EXAM_EN,
    question: QUESTION_EN,
    overview: OVERVIEW_EN,
    introduce: INTRODUCE_EN,
  },
  vi: {
    common: LOGIN_VI,
    account: ACCOUNT_VI,
    exam: EXAM_VI,
    question: QUESTION_VI,
    overview: OVERVIEW_VI,
    introduce: INTRODUCE_VI,
  },
} as const;

export const defaultNS = "common";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: LOCALES.VIETNAM,
    ns: ["common", "account", "exam", "question", "overview", "introduce"],
    fallbackLng: "vi",
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
  });
