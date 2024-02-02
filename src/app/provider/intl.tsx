"use client";
import { IntlProvider } from "react-intl";
import "../i18n/i18n";
import { LOCALES } from "../i18n/locales/locales";

const LangProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <IntlProvider locale={LOCALES.VIETNAM} defaultLocale={LOCALES.VIETNAM}>
      {children}
    </IntlProvider>
  );
};

export default LangProvider;
