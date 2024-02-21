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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLoadingMember, setMemberData } from "@/redux/members/MemberSlice";
import {
  changeStudio,
  getInvitaionEmailMember,
  getMemberListInStudio,
} from "@/services/api_services/account_services";
import { errorToast } from "./toast/customToast";
import { setUserData } from "@/redux/user/userSlice";

function Header() {
  const { t, i18n } = useTranslation("account");
  const common = useTranslation();
  const router = useRouter();
  const links = [
    t("overview"),
    t("exam_group"),
    t("exams"),
    t("examination"),
    t("exam_bank"),
    t("statistics"),
  ];

  const user = useSelector((state: RootState) => state.user);
  console.log("userrrrrrrrrrrrr", user.studios);

  const dispatch = useDispatch();

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

  var itemsStudio: MenuProps["items"] =
    (typeof user?.studios == "string"
      ? JSON.parse(user?.studios)
      : user?.studios
    )?.map((v: any, i: number) => ({
      key: i,
      label: (
        <button
          className="body_regular_14"
          onClick={async () => {
            await onChangeStudio(v.ownerId);
          }}
        >
          {v.ownerId == user._id ? common.t("my_studio") : v.studio_name}
        </button>
      ),
    })) ?? [];

  const onChangeStudio = async (ownerId?: string) => {
    try {
      var data = await changeStudio(ownerId);
      await localStorage.removeItem("access_token");
      await localStorage.setItem("access_token", data["token"]);
      await dispatch(setUserData(data["user"]));
      console.log("1------", data["user"]);
      await loadMembersWhenChangeStudio();
      // await dispatch(setUserData(data["user"]));
      // await dispatch(setLoadingMember(true));
      // await dispatch(setMemberData([]));
      // var mem = await getMemberListInStudio();
      // var invitedMem = await getInvitaionEmailMember();
      // console.log("mem", mem);
      // console.log("invitedMem", invitedMem);
      //
      // await dispatch(setMemberData([...invitedMem, ...mem]));

      console.log("uuu", user);
    } catch (e: any) {
      errorToast(e);
      dispatch(setMemberData([]));
    }
  };

  const loadMembersWhenChangeStudio = async () => {
    try {
      dispatch(setLoadingMember(true));
      dispatch(setMemberData([]));
      var mem = await getMemberListInStudio();
      var invitedMem = await getInvitaionEmailMember();

      dispatch(setMemberData([...invitedMem, ...mem]));
    } catch (e: any) {
      dispatch(setLoadingMember(false));
      errorToast(e);
    }
  };

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
              {user?.studio?._id === user._id
                ? common.t("my_studio")
                : user?.studio?.full_name}
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
          <div className="ml-6 cursor-pointer">
            {user?.avatar ? (
              <Image
                className="rounded-full"
                loading="lazy"
                src={user.avatar}
                alt="avatar"
                width={34}
                height={34}
              />
            ) : (
              <AvatarIcon className="scale-[3]" />
            )}
          </div>
        </Dropdown>
        <div className="w-4" />
      </div>
    </div>
  );
}

export default Header;
