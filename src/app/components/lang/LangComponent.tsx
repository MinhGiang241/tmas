"use client";
import { LOCALES } from "@/app/i18n/locales/locales";
import { Button, Popover } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import i18next from "i18next";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

function LangComponent() {
  const { t, i18n } = useTranslation();
  const [openLang, setOpenLang] = useState(false);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  var languages = {} as { [key: string]: any };
  languages[LOCALES.VIETNAM] = t(LOCALES.VIETNAM);
  languages[LOCALES.ENGLISH] = t(LOCALES.ENGLISH);

  const hide = () => {
    setOpenLang(false);
  };

  const handleOpenChangeLang = (newOpen: boolean) => {
    setOpenLang(newOpen);
  };

  const content = (
    <div className="flex flex-col">
      {Object.keys(languages).map((v, _) => (
        <Button
          key={v}
          className="flex items-center border-0"
          onClick={() => {
            changeLanguage(v);
            hide();
          }}
        >
          <Image
            loading="lazy"
            src={`/flags/${v}.png`}
            alt={v}
            width={20}
            height={10}
          />
          <div className="ml-2 body_semibold_14">{languages[v]}</div>
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <button
        onClick={() => {
          if (i18next.language == "vi") {
            localStorage.setItem("lang", "en");
            changeLanguage("en");
          } else {
            localStorage.setItem("lang", "vi");
            changeLanguage("vi");
          }
        }}
        className="flex h-7 justify-around items-center w-20 px-1 border border-m_gray-200 rounded-sm border-m_neutral_200"
      >
        <Image
          loading="lazy"
          src={`/flags/${i18next.language}.png`}
          alt={languages[i18next.language]}
          width={20}
          height={10}
        />
        <div className="body_semibold_14">
          {i18next.language == "vi" ? "VIE" : "ENG"}
        </div>
        {/* {openLang ? <UpOutlined /> : <DownOutlined />} */}
      </button>
    </>
  );
}

/**
<Popover
  content={content}
  trigger="click"
  open={openLang}
  onOpenChange={handleOpenChangeLang}
></Popover>;
**/

export default LangComponent;
