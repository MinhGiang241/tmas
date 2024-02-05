import { auth, facebookProvider, googleProvider } from "@/firebase/config";
import { Button, Divider } from "antd";
import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FacebookIcon from "../icons/facebook.svg";
import GoogleIcon from "../icons/google.svg";
import { LoginFormData } from "@/data/form_interface";

function SsoLogin({
  signInFacebook,
  signInGoogle,
  isLogin,
}: {
  signInGoogle: Function;
  isLogin?: boolean;
  signInFacebook: Function;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative">
        <Divider className="text-m_neutral_300 w-1/2" />
        <div className="absolute z-10 -translate-y-9 w-full">
          <div className="w-4 mx-auto bg-white z-20">{t("or")}</div>
        </div>
      </div>
      {/* {value && <div>{value}</div>} */}
      <div className="w-full relative">
        <div className="h-full absolute px-4 top-[11px] z-10">
          <GoogleIcon />
        </div>
        <Button className="w-full mb-4 h-12" onClick={() => signInGoogle()}>
          {isLogin ? t("signin_google") : t("register_with_google")}
        </Button>
      </div>
      <div className="w-full relative">
        <div className="h-full absolute px-4 top-[11px] z-10">
          <FacebookIcon />
        </div>

        <Button className="w-full mb-4 h-12" onClick={() => signInFacebook()}>
          {isLogin ? t("signin_facebook") : t("register_with_facebook")}
        </Button>
      </div>
    </>
  );
}

export default SsoLogin;
