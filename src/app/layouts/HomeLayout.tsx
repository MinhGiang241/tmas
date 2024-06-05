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
  getInvitaionEmailMember,
  getMemberListInStudio,
  loadConfig,
} from "@/services/api_services/account_services";
import { sortedMemList } from "../account/account-info/AccountInfo";
import {
  setExamAndQuestionLoading,
  setExamGroupList,
  setquestionGroupList,
} from "@/redux/exam_group/examGroupSlice";
import {
  getExamGroupTest,
  getQuestionGroups,
} from "@/services/api_services/exam_api";
import { APIResults } from "@/data/api_results";
import { ExamGroupData } from "@/data/exam";
import { throws } from "assert";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { setSettingConfig } from "@/redux/setting/settingSlice";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const search = useSearchParams();
  const studioId = search.get("studioId");
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
    } catch (e: any) {}
  };

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }

    dispatch(setSettingConfig(res?.data));
  };

  useOnMountUnsafe(() => {
    getSetting();
  });

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

  useEffect(() => {
    const token =
      sessionStorage.getItem("access_token") ??
      localStorage.getItem("access_token");
    if (!token) {
      setIsLogin(false);
      redirect("/signin");
    } else {
      setIsLogin(true);
      dispatch(fetchDataUser(fetchUser));
      // getUserMe()
      //   .then((v) => {
      //     loadData(v);
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //     router.push("/signin");
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      var data = await getUserMe();
      setLoading(false);
      return data["user"];
    } catch (e: any) {
      setLoading(false);
      router.push("/signin");
      return {};
    }
  };

  const loadData = async (v: any) => {
    try {
      var user = v["user"] as UserData;
      console.log("set User lần 1", user);

      dispatch(setUserData(user));
      setLoading(false);

      // await loadingQuestionsAndExams(false);
    } catch (e: any) {
      console.log(e);

      dispatch(setLoadingMember(false));
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
        <main className="bg-neutral-100  h-fit min-h-screen text-m_neutral_900">
          <Header />
          {user?._id && !user?.verified && <div className="h-[44px]" />}
          <div className="lg:h-[68px] h-14 " />
          <div className="max-w-[1140px] mx-auto">
            <div className=" w-full text-m_neutral_900">{children}</div>
          </div>
        </main>
      )}
    </>
  );
}

export default HomeLayout;
