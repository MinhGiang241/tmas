"use client";
import React, { useState } from "react";
import { Button, Divider } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import MInput from "../components/config/MInput";
import { useTranslation } from "react-i18next";
import { auth, googleProvider, facebookProvider } from "@/firebase/config";
import { signInWithPopup } from "firebase/auth";
import LockIcon from "../components/icons/lock.svg";
import SmsIcon from "../components/icons/sms.svg";
import FacebookIcon from "../components/icons/facebook.svg";
import GoogleIcon from "../components/icons/google.svg";
import MButton from "../components/config/MButton";
import AuthLayout from "../layouts/AuthLayout";
import Link from "next/link";
import LangComponent from "../components/lang/LangComponent";

function LoginPage() {
  const { t } = useTranslation();

  const [captcha, setCaptcha] = useState<string | null>();

  const [value, setValue] = useState("");
  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider).then((data) => {
      setValue(data?.user?.email ?? "");
      console.log("googleauth", data);
    });
  };

  const signInFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((data) => {
        setValue(data?.user?.email ?? "");
        console.log("facebook auth", data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <AuthLayout>
      <div className="mb-4 flex justify-between">
        <p className="text-m_primary_500 title_bold_24">{t("login")}</p>
        <LangComponent />
      </div>
      <MInput
        prefix={<LockIcon />}
        id="email"
        name="email"
        title={t("email")}
        placeholder={t("enter_email")}
      />{" "}
      <MInput
        prefix={<SmsIcon />}
        id="password"
        name="password"
        title={t("password")}
        placeholder={t("enter_password")}
        isPassword
      />
      <div className="flex w-full justify-end text-m_primary_500 text-sm font-semibold">
        <button className="pl-auto active:opacity-70">
          {" "}
          {t("forgot_pass")}
        </button>
      </div>
      <MButton
        text={t("login")}
        className="h-12 my-4"
        onClick={() => console.log("captcha", captcha)}
      />
      <div className="h-5" />
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        onChange={setCaptcha}
        className="mr-auto"
      />
      <div className="w-full relative">
        <Divider className="text-m_neutral_300 w-1/2" />
        <div className="absolute z-10 -translate-y-9 w-full">
          <div className="w-4 mx-auto bg-white z-20">{t("or")}</div>
        </div>
      </div>
      {value && <div>{value}</div>}
      <div className="w-full relative">
        <div className="h-full absolute px-4 top-[11px] z-10">
          <GoogleIcon />
        </div>
        <Button className="w-full mb-4 h-12" onClick={signInGoogle}>
          {t("signin_google")}
        </Button>
      </div>
      <div className="w-full relative">
        <div className="h-full absolute px-4 top-[11px] z-10">
          <FacebookIcon />
        </div>

        <Button className="w-full mb-4 h-12" onClick={signInFacebook}>
          {t("signin_facebook")}
        </Button>
      </div>
      <div className="w-full flex justify-center mt-5">
        <span className="text-sm mr-1">{t("no_account")}</span>
        <Link href="/register" className="text-sm font-bold">
          {t("register_now")}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
