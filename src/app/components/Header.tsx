import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeadPhoneIcon from "../components/icons/headphone.svg";
import DropdownIcon from "../components/icons/dropdown.svg";
import AvatarIcon from "../components/icons/avatar-default.svg";
import { Popover, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../i18n/locales/locales";
import { useRouter } from "next/navigation";

function Header() {
  const { t, i18n } = useTranslation("account");
  const common = useTranslation();
  const router = useRouter();
  const links = [
    t("overview"),
    t("exam_group"),
    t("exams"),
    t("recruitment_exam_session"),
    t("exam_bank"),
    t("statistics"),
  ];

  var languages = {} as { [key: string]: any };
  languages[LOCALES.VIETNAM] = t(LOCALES.VIETNAM);
  languages[LOCALES.ENGLISH] = t(LOCALES.ENGLISH);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          className="body_regular_14"
          onClick={async () => {
            localStorage.removeItem("access_token");
            router.push("/signin");
          }}
        >
          {common.t("sign_out")}
        </button>
      ),
    },
  ];

  const itemsStudio: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button className="body_regular_14" onClick={async () => {}}>
          My Studio
        </button>
      ),
    },
  ];

  return (
    <div className="w-screen fixed h-[68px] bg-m_primary_500 flex justify-center z-50">
      <div className="w-[1140px] h-full flex items-center justify-between">
        <Image src="/images/white-logo.png" alt="tmas" width={97} height={40} />
        <div className="h-full flex items-center justify-center">
          {links.map((e, i) => (
            <Link
              key={i}
              href={"/"}
              className=" text-center body_semibold_14 text-white px-4"
            >
              {e}
            </Link>
          ))}
        </div>
        <div className="flex h-full items-center">
          <HeadPhoneIcon />

          <Dropdown menu={{ items: itemsStudio }}>
            <button className="mx-3  flex items-center body_semibold_14 text-white">
              {"My studio"}
              <div className="w-2" />
              <DropdownIcon />
            </button>
          </Dropdown>
        </div>

        <div className="h-full flex items-center">
          <button
            className="flex items-center"
            onClick={() => {
              if (i18next.language == "vi") {
                i18n.changeLanguage("en");
              } else {
                i18n.changeLanguage("vi");
              }
            }}
          >
            <Image
              className=""
              src={`/flags/${i18next.language}.png`}
              alt="language"
              width={24}
              height={24}
            />
            <div className="ml-2 body_semibold_14 text-white">
              {i18next.language == "vi" ? "VIE" : "ENG"}
            </div>
          </button>
        </div>
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottom">
          <button className="ml-6">
            <AvatarIcon className="scale-[3]" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
