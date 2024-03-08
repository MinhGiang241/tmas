import React, { Suspense, useEffect, useState } from "react";
import Header from "../components/Header";
import { redirect, useRouter } from "next/navigation";
import LoadingPage from "../loading";
import { getUserMe } from "@/services/api_services/auth_service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchDataUser, setUserData } from "@/redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { UserData } from "@/data/user";
import { setLoadingMember, setMemberData } from "@/redux/members/MemberSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  getInvitaionEmailMember,
  getMemberListInStudio,
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

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

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
      {loading ? (
        <main className="bg-neutral-100 text-m_neutral_900">
          <Header />
          <LoadingPage />
        </main>
      ) : (
        <main className="bg-neutral-100  h-fit min-h-screen text-m_neutral_900">
          <Header />
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
