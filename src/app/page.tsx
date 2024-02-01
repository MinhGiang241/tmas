"use client";
import Image from "next/image";
import Link from "next/link";
import { auth, googleProvider, facebookProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { LOCALES } from "./i18n/locales/locales";

export default function Home() {
  const content = (
    <div className="flex flex-col">
      <Button
        onClick={() => {
          changeLanguage(LOCALES.ENGLISH);
          hide();
        }}
      >
        English
      </Button>
      <Button
        onClick={() => {
          changeLanguage(LOCALES.VIETNAM);
          hide();
        }}
      >
        Tiếng Việt
      </Button>
    </div>
  );
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const [value, setValue] = useState("ss");
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

  // useEffect()
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button>Click me</Button>
      </Popover>

      <Link
        className="mb-20 w-24 h-12 bg-sky-600 text-white text-center rounded-lg"
        href={"/blog"}
      >
        Blog
      </Link>
      {value && <div>{value}</div>}
      <Button onClick={signInGoogle}>SignIn with google</Button>
      <Button onClick={signInFacebook}>SignIn with facebook</Button>
      {t("language")}
      <Link
        className="w-24 h-12 bg-sky-600 text-white text-center rounded-lg"
        href={"/about"}
      >
        about
      </Link>
    </main>
  );
}
