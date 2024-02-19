import React, { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import SecurityAvatar from "../components/icons/security-user.svg";
import Avatar from "../components/icons/green-profile.svg";
import Building from "../components/icons/green-buliding.svg";
import { useTranslation } from "react-i18next";
import StudioInfo from "./components/studio";
import AccountInfo from "./components/account";
import UserProfile from "./components/profile";
import ConfirmModal from "../components/modals/ConfirmModal";

function AccountPage() {
  const [index, setIndex] = useState<number>(0);

  const { t } = useTranslation("account");
  return (
    <HomeLayout>
      <div className="min-h-screen w-full flex text-m_primary_900">
        <div className="h-[400px] bg-white w-1/5 mt-10 rounded-lg p-4">
          <button
            onClick={() => setIndex(0)}
            className={`h-[52px] ${
              index === 0
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <SecurityAvatar />
            <p className="ml-1">{t("account_management")}</p>
          </button>

          <button
            onClick={() => setIndex(1)}
            className={`h-[52px] ${
              index === 1
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <Avatar />
            <p className="ml-1">{t("personal_information")}</p>
          </button>

          <button
            onClick={() => setIndex(2)}
            className={`h-[52px] ${
              index === 2
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <Building />
            <p className="ml-1">{t("business_information")}</p>
          </button>
        </div>
        <div className="w-7" />
        <div className="h-[400px] bg-white w-4/5 mt-10 rounded-lg">
          {index === 0 && <AccountInfo />}
          {index === 1 && <UserProfile />}
          {index === 2 && <StudioInfo />}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AccountPage;
