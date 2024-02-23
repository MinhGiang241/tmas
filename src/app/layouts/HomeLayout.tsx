import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { redirect, useRouter } from "next/navigation";
import LoadingPage from "../loading";
import { getUserMe } from "@/services/api_services/auth_service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserData } from "@/redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { UserData } from "@/data/user";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLogin(false);
      redirect("/signin");
    } else {
      setIsLogin(true);
      getUserMe()
        .then((v) => {
          var user = v["user"] as UserData;
          console.log(user);

          dispatch(setUserData(user));
          if (user.lang === "vi_VN") {
            i18n.changeLanguage("vi");
          } else {
            i18n.changeLanguage("en");
          }
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          router.push("/signin");
        });
    }
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <main className="bg-neutral-100 text-m_neutral_900">
          <Header />
          <div className="lg:h-[68px] h-14 " />
          <div className="max-w-[1140px] mx-auto">
            <div className="min-h-screen w-full text-m_neutral_900">
              {children}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default HomeLayout;
