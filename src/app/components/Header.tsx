import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeadPhoneIcon from "../components/icons/headphone.svg";
import DropdownIcon from "../components/icons/dropdown.svg";
import AvatarIcon from "../components/icons/avatar-default.svg";
import { Popover, Dropdown, Space, Drawer, Button, Divider } from "antd";
import type { MenuProps } from "antd";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../i18n/locales/locales";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLoadingMember, setMemberData } from "@/redux/members/MemberSlice";
import {
  MenuOutlined,
  CloseOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import {
  changeStudio,
  getInvitaionEmailMember,
  getMemberListInStudio,
} from "@/services/api_services/account_services";
import { errorToast } from "./toast/customToast";
import { setUserData } from "@/redux/user/userSlice";
import useWindowSize from "@/services/ui/useWindowSize";
import { setHomeIndex } from "@/redux/home/homeSlice";

function Header({ path }: { path?: string }) {
  const { t, i18n } = useTranslation("account");
  const common = useTranslation();
  const router = useRouter();
  const links = [
    "overview",
    "exam_group",
    "exams",
    "examination",
    "exam_bank",
    "statistics",
  ];

  const user = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
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
            setOpenDrawer(false);
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
      localStorage.removeItem("access_token");
      localStorage.setItem("access_token", data["token"]);
      dispatch(setUserData(data["user"]));
      console.log("1------", data["user"]);
      await loadMembersWhenChangeStudio();

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

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openPop, setOpenPop] = useState<boolean>(false);

  const size = useWindowSize();

  return (
    <div className="w-screen fixed lg:h-[68px] h-14 bg-m_primary_500 flex justify-center z-50">
      <Drawer
        headerStyle={{ display: "none" }}
        className="lg:hidden"
        title="Drawer with extra actions"
        placement={"left"}
        width={400}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <div>
          <div className="w-full flex justify-between">
            <Dropdown
              menu={{ items: itemsStudio }}
              trigger={["click"]}
              placement={"bottom"}
            >
              <button className="flex  items-center body_semibold_14 ">
                {user?.studio?._id === user._id
                  ? common.t("my_studio")
                  : user?.studio?.studio_name ?? user?.studio?.full_name}
                <div className="w-2" />
                <CaretDownOutlined />
              </button>
            </Dropdown>
            <button onClick={() => setOpenDrawer(false)}>
              <CloseOutlined />
            </button>
          </div>
          <div className="h-4" />
          {links.map((v, i) => (
            <button
              onClick={() => setOpenDrawer(false)}
              className="block mb-2 body_regular_14"
              key={i}
            >
              {v}
            </button>
          ))}
          <Divider />
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
                loading="lazy"
                className=""
                src={`/flags/${i18next.language}.png`}
                alt="language"
                width={24}
                height={24}
              />
              <div className="ml-2 body_semibold_14 ">
                {i18next.language == "vi" ? "VIE" : "ENG"}
              </div>
            </button>
          </div>
        </div>
      </Drawer>
      <button className="lg:hidden mx-3" onClick={() => setOpenDrawer(true)}>
        <MenuOutlined className="text-white text-base" />
      </button>
      <div className="w-[1140px] h-full flex items-center justify-between">
        <Image
          loading="lazy"
          src="/images/white-logo.png"
          alt="tmas"
          width={97}
          height={40}
        />
        <div className="hidden h-full lg:flex items-center justify-center">
          {links.map((e, i) => (
            <Link
              key={i}
              href={e == "exam_group" ? `/${e}` : "/"}
              className={`flex items-center text-center body_semibold_14 text-white px-4 h-full ${
                pathname.includes(e)
                  ? "bg-m_primary_400 after:content-[''] border-b-white border-b-4"
                  : ""
              }`}
            >
              <p>{t(e)}</p>
            </Link>
          ))}
        </div>

        <div className="lg:flex hidden h-full items-center">
          <HeadPhoneIcon className="lg:flex hidden" />

          <Dropdown menu={{ items: itemsStudio }}>
            <button className="mx-3 lg:flex hidden items-center body_semibold_14 text-white">
              {user?.studio?._id === user._id
                ? common.t("my_studio")
                : user?.studio?.studio_name ?? user?.studio?.full_name}
              <div className="w-2" />
              <DropdownIcon />
            </button>
          </Dropdown>
        </div>

        <div className="h-full lg:flex hidden items-center">
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
              loading="lazy"
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
        <Popover
          onOpenChange={(v) => {
            setOpenPop(v);
          }}
          open={openPop}
          placement="leftBottom"
          trigger={["click"]}
          content={
            <div className="w-full flex flex-col body_regular_14 p-2 items-start">
              <button
                onClick={() => {
                  setOpenPop(false);
                  dispatch(setHomeIndex(0));
                  if (pathname != "/") {
                    router.push("/");
                  }
                }}
                className="py-1 hover:bg-m_neutral_100 w-full flex justify-start"
              >
                {t("account_management")}
              </button>
              <button
                onClick={() => {
                  setOpenPop(false);
                  dispatch(setHomeIndex(1));
                  if (pathname != "/") {
                    router.push("/");
                  }
                }}
                className="py-1 hover:bg-m_neutral_100 w-full flex justify-start"
              >
                {t("personal_information")}
              </button>
              <button
                onClick={() => {
                  setOpenPop(false);
                  dispatch(setHomeIndex(2));
                  if (pathname != "/") {
                    router.push("/");
                  }
                }}
                className="py-1 hover:bg-m_neutral_100 w-full flex justify-start"
              >
                {t("business_information")}
              </button>
              <button className="py-1 hover:bg-m_neutral_100 w-full flex justify-start">
                {common.t("support")}
              </button>
              <button className="py-1 hover:bg-m_neutral_100 w-full flex justify-start">
                {common.t("change_pass")}
              </button>

              <Divider className="my-3" />
              <button
                onClick={() => {
                  dispatch(setHomeIndex(0));
                  setOpenPop(false);
                  localStorage.removeItem("access_token");
                  router.push("/signin");
                }}
                className="py-1 w-full hover:bg-m_error_100 text-m_error_500 flex justify-start"
              >
                {common.t("sign_out")}
              </button>
            </div>
          }
        >
          <button
            onClick={() => setOpenPop(true)}
            className="lg:ml-6  cursor-pointer"
          >
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
              <div className="h-fit">
                <AvatarIcon className=" scale-[3] max-lg:-translate-x-8" />
              </div>
            )}
          </button>
        </Popover>
        <div className="hidden lg:block lg:w-4 " />
      </div>
    </div>
  );
}

export default Header;
