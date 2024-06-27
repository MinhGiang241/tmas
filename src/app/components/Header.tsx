import React, { useEffect, useState, useTransition } from "react";
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
  ExclamationCircleFilled,
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
import { setUserData, userClear } from "@/redux/user/userSlice";
import useWindowSize from "@/services/ui/useWindowSize";
import { setHomeIndex } from "@/redux/home/homeSlice";
import {
  compareMembers,
  sortedMemList,
} from "../account/account-info/AccountInfo";
import {
  setExamAndQuestionLoading,
  setExamGroupList,
  setquestionGroupList,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import {
  getExamGroupTest,
  getQuestionGroups,
} from "@/services/api_services/exam_api";
import { APIResults } from "@/data/api_results";
import { ExamGroupData } from "@/data/exam";
import { UserData } from "@/data/user";
import BellIcon from "@/app/components/icons/notification.svg";
import Notification from "../notifications/page";
// import * as Popover from '@radix-ui/react-popover';

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
    "account",
  ];
  const mobileLinks = [
    "overview",
    "exam_group",
    "exams",
    "examination",
    "exam_bank",
    "account?tab=0",
    "account?tab=1",
    "account?tab=2",
    "account?tab=3",
    "account?tab=4",
    "account?tab=5",
  ];

  const user = useSelector((state: RootState) => state.user.user);
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
            sessionStorage.removeItem("access_token");
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
    )
      ?.filter((d: any) => d.role != "Member")
      ?.map((v: any, i: number) => ({
        key: i,
        label: (
          <button
            className="flex w-full mx-0 my-0 body_regular_14 justify-start"
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
      if (sessionStorage.getItem("access_token")) {
        sessionStorage.removeItem("access_token");
        sessionStorage.setItem("access_token", data["token"]);
      } else {
        localStorage.setItem("access_token", data["token"]);
      }
      var userNew = data["user"] as UserData;
      dispatch(userClear({}));
      dispatch(setUserData(userNew));

      // await loadMembersWhenChangeStudio();
      // await loadingQuestionsAndExams(true, userNew.studio?._id);
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
      var invited = await getInvitaionEmailMember();
      var invitedMem = (invited ?? []).map((i: UserData) => ({
        ...i,
        isInvite: true,
      }));

      dispatch(
        setMemberData([...sortedMemList(invitedMem), ...sortedMemList(mem)]),
      );
    } catch (e: any) {
      dispatch(setLoadingMember(false));
      errorToast(e);
    }
  };

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openPop, setOpenPop] = useState<boolean>(false);

  const size = useWindowSize();

  const loadingQuestionsAndExams = async (init: boolean, studioId?: string) => {
    if (init) {
      dispatch(setExamAndQuestionLoading(true));
    }

    var res = await getQuestionGroups("", studioId ?? "");
    if (res.code != 0) {
      dispatch(setquestionGroupList([]));
    }
    dispatch(setquestionGroupList(res.data ?? []));
    var dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: studioId,
    });

    if (dataResults.code != 0) {
      dispatch(setExamGroupList([]));
    } else {
      var data = dataResults?.data as ExamGroupData[];
      var levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      var levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      var list = levelOne.map((e: ExamGroupData) => {
        var childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id,
        );
        return { ...e, childs };
      });

      dispatch(setExamGroupList(list));

      console.log("levelOneHeader", list);
      console.log("dataHeader", dataResults);
    }

    console.log("res=", res);
  };

  return (
    <div className="w-full fixed z-50 ">
      <div className="w-full lg:h-[68px]  h-14 bg-m_primary_500 flex justify-center ">
        <div className="max-lg:hidden absolute h-full w-[233px] left-0 bg-[url('/images/left-header.png')] bg-no-repeat bg-contain" />
        <div className="max-lg:hidden absolute h-full w-[748px] right-0 bg-[url('/images/right-header.png')] bg-no-repeat bg-contain" />
        <div className="max-lg:hidden absolute h-full w-[372px] left-0 bg-[url('/images/left-header-2.png')] bg-no-repeat bg-contain" />
        <div className="max-lg:hidden absolute h-full w-[812px] right-0 bg-[url('/images/right-header-2.png')] bg-no-repeat bg-contain" />

        <div className="max-lg:w-4" />
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
                  {user?.studio?._id === user?._id
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
            {mobileLinks.map((v, i) => (
              <Link
                href={!user?.verified ? "#" : v == "overview" ? "/" : `/${v}`}
                onClick={() => {
                  if (
                    !user?.verified &&
                    [
                      "exam_group",
                      "exams",
                      "examination",
                      "overview",
                      "exam_bank",
                      "statistics",
                    ].some((d) => {
                      return d == v;
                    })
                  ) {
                    errorToast(t("please_verify"));
                  }

                  setOpenDrawer(false);
                }}
                className="block mb-2 body_regular_14 text-m_neutral_900"
                key={i}
              >
                {t(v)}
              </Link>
            ))}
            <Divider />
            <div className="h-full flex items-center">
              <button
                className="flex items-center"
                onClick={() => {
                  if (i18next.language == "vi") {
                    i18n.changeLanguage("en");
                    localStorage.setItem("lang", "en");
                  } else {
                    i18n.changeLanguage("vi");
                    localStorage.setItem("lang", "vi");
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
        <div className="relative w-[1140px] h-full flex items-center justify-between">
          <Image
            onClick={() => router.push("/")}
            className="cursor-pointer"
            loading="lazy"
            src="/images/white-logo.png"
            alt="tmas"
            width={97}
            height={40}
          />
          <div className="flex-1" />
          <div className="hidden h-full lg:flex items-center justify-center">
            {links.map((e, i) => (
              <Link
                key={i}
                href={!user?.verified ? "#" : e == "overview" ? "/" : `/${e}`}
                onClick={() => {
                  if (
                    !user?.verified &&
                    [
                      "exam_group",
                      "exams",
                      "examination",
                      "overview",
                      "exam_bank",
                    ].some((d) => {
                      return d == e;
                    })
                  ) {
                    errorToast(t("please_verify"));
                  }
                }}
                className={`flex items-center text-center body_semibold_14 text-white px-5 h-full ${
                  pathname.includes(e) || (pathname == "/" && e == "overview")
                    ? "bg-m_primary_400 after:content-[''] border-b-white border-b-4"
                    : ""
                }`}
              >
                <p>{t(e)}</p>
              </Link>
            ))}
          </div>
          <div className="flex-1" />

          <div className="lg:flex hidden h-full items-center mr-4">
            <HeadPhoneIcon className=" hidden" />
            <Dropdown menu={{ items: itemsStudio }}>
              <button className="ml-3 w-full lg:flex hidden items-center body_semibold_14 text-white">
                {user?.studio?._id === user?._id
                  ? common.t("my_studio")
                  : user?.studio?.studio_name ?? user?.studio?.full_name}
                <div className="w-2" />
                <DropdownIcon />
              </button>
            </Dropdown>
          </div>

          <div className="h-full lg:flex hidden items-center mr-0">
            <button
              className="flex items-center"
              onClick={() => {
                if (i18next.language == "vi") {
                  i18n.changeLanguage("en");
                  localStorage.setItem("lang", "en");
                } else {
                  i18n.changeLanguage("vi");
                  localStorage.setItem("lang", "vi");
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
          {/* TODO */}

          <Notification />
          <div className="lg:hidden max-lg:w-12" />
          <Popover
            onOpenChange={(v) => {
              setOpenPop(v);
            }}
            open={openPop}
            placement="bottomRight"
            trigger={["click"]}
            content={
              <div className="w-full flex flex-col body_regular_14 p-2 items-start">
                <button
                  onClick={() => {
                    setOpenPop(false);
                    router.push("/account?tab=0");
                  }}
                  className="px-1 rounded py-1 hover:bg-m_neutral_100 w-full flex justify-start"
                >
                  {t("account_management")}
                </button>
                <button
                  onClick={() => {
                    setOpenPop(false);
                    router.push("/account?tab=2");
                  }}
                  className="px-1 rounded py-1 hover:bg-m_neutral_100 w-full flex justify-start"
                >
                  {t("personal_information")}
                </button>
                <button
                  onClick={() => {
                    setOpenPop(false);
                    router.push("/account?tab=3");
                  }}
                  className="px-1 rounded py-1 hover:bg-m_neutral_100 w-full flex justify-start"
                >
                  {t("business_information")}
                </button>
                <button className="px-1 rounded py-1 hover:bg-m_neutral_100 w-full flex justify-start">
                  {common.t("support")}
                </button>
                <button className="px-1 rounded py-1 hover:bg-m_neutral_100 w-full flex justify-start">
                  {common.t("change_pass")}
                </button>

                <Divider className="my-3" />
                <button
                  onClick={() => {
                    dispatch(setHomeIndex(0));
                    setOpenPop(false);
                    router.push("/signin");
                    localStorage.removeItem("access_token");
                    sessionStorage.removeItem("access_token");
                  }}
                  className="px-1 rounded py-1 w-full hover:bg-m_error_100 text-m_error_500 flex justify-start"
                >
                  {common.t("sign_out")}
                </button>
              </div>
            }
          >
            <button
              onClick={() => setOpenPop(true)}
              className="absolute max-lg:pr-5 right-0 lg:ml-6  cursor-pointer"
            >
              {user?.stu_logo ? (
                <div className="w-[34px] h-[34px] relative">
                  <Image
                    className="rounded-full "
                    loading="lazy"
                    src={user?.stu_logo ?? ""}
                    alt="avatar"
                    fill
                  />
                </div>
              ) : (
                <Image
                  className="rounded-full "
                  loading="lazy"
                  src={"/images/avatar-default.png"}
                  alt="avatar"
                  width={34}
                  height={34}
                />
              )}
            </button>
          </Popover>
          <div className=" lg:block lg:w-8 " />
        </div>
      </div>
      {user?._id && !user?.verified && (
        <div className="m-auto truncate flex items-center lg:justify-center justify-start text-[#EC8E00] w-full h-[44px] bg-m_warning_50">
          <div className="min-w-4 mr-4">
            <ExclamationCircleFilled />
          </div>{" "}
          <div className=" body_regular_14">{t("warning_verify_account")}</div>
        </div>
      )}
    </div>
  );
}

export default Header;
