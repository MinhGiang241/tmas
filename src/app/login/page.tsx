"use client";
import React, { useState } from "react";
import { Button, Divider, Input, Popover } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import MInput from "../components/config/MInput";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../i18n/locales/locales";
import i18next from "i18next";
import { auth, googleProvider, facebookProvider } from "@/firebase/config";
import { signInWithPopup } from "firebase/auth";

function LoginPage() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  var languages = {};
  languages[LOCALES.VIETNAM] = t(LOCALES.VIETNAM);
  languages[LOCALES.ENGLISH] = t(LOCALES.ENGLISH);

  const [captcha, setCaptcha] = useState<string | null>();
  const [openLang, setOpenLang] = useState(false);

  const hide = () => {
    setOpenLang(false);
  };

  const handleOpenChangeLang = (newOpen: boolean) => {
    setOpenLang(newOpen);
  };

  const content = (
    <div className="flex flex-col">
      {Object.keys(languages).map((v, i) => (
        <Button
          key={v}
          className="flex items-center border-0"
          onClick={() => {
            changeLanguage(v);
            hide();
          }}
        >
          <Image src={`/flags/${v}.png`} alt={v} width={20} height={10} />
          <div className="ml-4">{languages[v]}</div>
        </Button>
      ))}
    </div>
  );

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
    <div className=" w-full h-screen flex">
      <div className="w-1/2 h-full bg-[url('/images/background.png')] bg-cover"></div>
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        <div className="flex  flex-col w-1/2">
          <div className="w-full flex justify-center">
            <Image src="/images/logo.png" alt="logo" width={325} height={98} />
          </div>
          <div className="h-9" />
          <div className="mb-4 flex justify-between">
            <p className="text-m_primary_500 font-bold text-2xl">
              {t("login")}
            </p>
            <Popover
              content={content}
              trigger="click"
              open={openLang}
              onOpenChange={handleOpenChangeLang}
            >
              {
                <button className="flex justify-center items-center w-36 px-2 border border-m_gray-200 rounded-lg">
                  <Image
                    src={`/flags/${i18next.language}.png`}
                    alt={languages[i18next.language]}
                    width={20}
                    height={10}
                  />
                  <div className="ml-2">{languages[i18next.language]}</div>
                </button>
              }
            </Popover>
          </div>
          <MInput title={t("email")} placeholder={t("enter_email")} />{" "}
          <MInput title={t("password")} placeholder={t("enter_password")} />
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={setCaptcha}
            className="mx-auto"
          />
        </div>
        <div className="w-1/2">
          <Divider className="text-m_neutral_200 w-1/2" />
        </div>
        {value && <div>{value}</div>}
        <Button className="w-1/2 mb-4" onClick={signInGoogle}>
          SignIn with google
        </Button>
        <Button className="w-1/2 mb-4" onClick={signInFacebook}>
          SignIn with facebook
        </Button>

        <Button onClick={() => console.log("captcha", captcha)}>
          {t("login")}
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
