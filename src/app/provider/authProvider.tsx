"use client";
import useWindowSize from "@/services/ui/useWindowSize";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SWRConfig } from "swr";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const size = useWindowSize();
  useEffect(() => {
    setLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = async () => {
    var lang = localStorage.getItem("lang");

    i18n.changeLanguage(lang ?? "vi");
  };
  return (
    <SWRConfig>
      {children}
      <Toaster
        containerStyle={{ top: 0, bottom: 0, left: 0, right: 0 }}
        toastOptions={{ custom: { duration: 300000 } }}
      />
    </SWRConfig>
  );
}

export default AuthProvider;
