/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import LoadingPage from "../loading";
import { getUserMe } from "@/services/api_services/auth_service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDataUser, setUserData, userClear } from "@/redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { UserData } from "@/data/user";
import { setLoadingMember, setMemberData } from "@/redux/members/MemberSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  changeStudio,
  loadConfig,
} from "@/services/api_services/account_services";

import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { setSettingConfig } from "@/redux/setting/settingSlice";
import { Button, Modal, Tabs, Tooltip } from "antd";
import Image from "next/image";
import BaseModal from "../components/config/BaseModal";
import MButton from "../components/config/MButton";
import Introduce from "../introduce/Introduce";
import { errorToast } from "../components/toast/customToast";
import { deleteToken, getToken, setToken } from "@/utils/cookies";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user?.user);
  // console.log(user);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const search = useSearchParams();
  const studioId = search.get("studioId");
  const onChangeStudio = async (ownerId?: string) => {
    try {
      var data = await changeStudio(ownerId);
      deleteToken();
      if (sessionStorage.getItem("access_token")) {
        sessionStorage.removeItem("access_token");
        sessionStorage.setItem("access_token", data["token"]);
      } else {
        setToken(data["token"]);
      }
      var userNew = data["user"] as UserData;
      dispatch(userClear({}));
      dispatch(setUserData(userNew));

      // await loadMembersWhenChangeStudio();
      // await loadingQuestionsAndExams(true, userNew.studio?._id);
    } catch (e: any) {}
  };

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }

    dispatch(setSettingConfig(res?.data));
  };

  useEffect(() => {
    getSetting();
  }, [user]);

  useEffect(() => {
    if (studioId) {
      onChangeStudio(studioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studioId]);

  useEffect(() => {
    if (user?._id) {
      if (!user?.verified && pathname != "/") {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pathname]);

  useOnMountUnsafe(() => {
    const token = sessionStorage.getItem("access_token") ?? getToken();
    if (!token) {
      setIsLogin(false);
      redirect("/signin");
    } else {
      setIsLogin(true);
      dispatch(fetchDataUser(fetchUser));
    }
  });
  // useEffect(() => {
  //   const token =
  //     sessionStorage.getItem("access_token") ??
  //     localStorage.getItem("access_token");
  //   if (!token) {
  //     setIsLogin(false);
  //     redirect("/signin");
  //   } else {
  //     setIsLogin(true);
  //     dispatch(fetchDataUser(fetchUser));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const fetchUser = async () => {
    try {
      var data = await getUserMe();
      setLoading(false);
      return data["user"];
    } catch (e: any) {
      setLoading(false);

      errorToast(data, e);
      router.push("/signin");
      return {};
    }
  };

  return (
    <>
      {loading || (!user?.verified && pathname != "/") ? (
        <main className="bg-neutral-100 text-m_neutral_900">
          <Header />
          <LoadingPage />
        </main>
      ) : (
        <main className="bg-neutral-100  h-fit min-h-screen text-m_neutral_900 relative">
          <Header />
          {user?._id && !user?.verified && <div className="h-[44px]" />}
          <div className="lg:h-[68px] h-14 " />
          <div className="max-w-[1140px] mx-auto">
            <div className=" w-full text-m_neutral_900">
              {user?._id && children}
            </div>
          </div>
          {(user?.trained === undefined || user?.trained === false) &&
          user?.isSystem != true &&
          user?.verified === true &&
          user?._id ? (
            <Introduce />
          ) : (
            ""
          )}
        </main>
      )}
    </>
  );
}

export default HomeLayout;
