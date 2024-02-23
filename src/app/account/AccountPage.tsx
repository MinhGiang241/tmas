import React, { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import SecurityAvatar from "../components/icons/security-user.svg";
import Avatar from "../components/icons/green-profile.svg";
import BuildingIcon from "../components/icons/green-buliding.svg";
import { useTranslation } from "react-i18next";
import StudioInfo from "./studio-info/StudioInfo";
import AccountInfo from "./account-info/AccountInfo";
import UserProfile from "./profile/UserProfile";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setHomeIndex } from "@/redux/home/homeSlice";

function AccountPage() {
  const index = useSelector((state: RootState) => state.home.index);
  const dispatch = useDispatch();
  const { t } = useTranslation("account");
  return (
    <HomeLayout>
      <div className="min-h-screen w-full flex text-m_neutral_900">
        <div className="lg:block hidden max-h-[400px] bg-white w-1/5 mt-10 rounded-lg p-4">
          <button
            onClick={() => dispatch(setHomeIndex(0))}
            className={`h-[52px] ${
              index === 0
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <SecurityAvatar className="min-w-5" />
            <p className="ml-1">{t("account_management")}</p>
          </button>

          <button
            onClick={() => dispatch(setHomeIndex(1))}
            className={`h-[52px] ${
              index === 1
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <Avatar className="min-w-5" />
            <p className="ml-1">{t("personal_information")}</p>
          </button>

          <button
            onClick={() => dispatch(setHomeIndex(2))}
            className={`h-[52px] ${
              index === 2
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <BuildingIcon className="min-w-5" />
            <p className="ml-1">{t("business_information")}</p>
          </button>
        </div>
        <div className="hidden lg:block w-7" />
        <div className="h-screen lg:h-fit bg-white lg:w-4/5 w-full lg:mt-10 rounded-lg">
          {index === 0 && <AccountInfo />}
          {index === 1 && <UserProfile />}
          {index === 2 && <StudioInfo />}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AccountPage;
