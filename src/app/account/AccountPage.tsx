import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import SecurityAvatar from "../components/icons/security-user.svg";
import Avatar from "../components/icons/green-profile.svg";
import BuildingIcon from "../components/icons/green-buliding.svg";
import { useTranslation } from "react-i18next";
import StudioInfo from "./studio-info/StudioInfo";
import AccountInfo from "./account-info/AccountInfo";
import UserProfile from "./profile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setHomeIndex } from "@/redux/home/homeSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function AccountPage() {
  const index = useSelector((state: RootState) => state.home.index);
  const dispatch = useDispatch();
  const { t } = useTranslation("account");
  const search = useSearchParams();
  const indexTab = search.get("tab");
  const router = useRouter();
  useEffect(() => {
    dispatch(
      setHomeIndex(["0", "1", "2"].includes(indexTab ?? "") ? indexTab : "0"),
    );
  }, [dispatch, indexTab]);

  return (
    <HomeLayout>
      <div className="w-full flex justify-center mt-3">
        <div className="lg:block hidden max-h-[400px] bg-white w-[267px] mt-10 rounded-lg p-4">
          <button
            onClick={() => {
              router.push("/?tab=0");
            }}
            className={`h-[52px] ${
              index === "0"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <SecurityAvatar className="min-w-5" />
            <p className="mx-2">{t("account_management")}</p>
          </button>

          <button
            onClick={() => {
              router.push("/?tab=1");
            }}
            className={`h-[52px] ${
              index === "1"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <Avatar className="min-w-5" />
            <p className="mx-2">{t("personal_information")}</p>
          </button>

          <button
            onClick={() => {
              router.push("/?tab=2");
            }}
            className={`h-[52px] ${
              index === "2"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <BuildingIcon className="min-w-5" />
            <p className="mx-2">{t("business_information")}</p>
          </button>
        </div>
        <div className="hidden lg:block w-6" />
        <div className="h-screen lg:h-fit bg-white lg:w-4/5 w-full lg:mt-10 rounded-lg">
          {index === "0" && <AccountInfo />}
          {index === "1" && <UserProfile />}
          {index === "2" && <StudioInfo />}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AccountPage;
