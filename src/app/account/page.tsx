"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import SecurityAvatar from "../components/icons/security-user.svg";
import Avatar from "../components/icons/green-profile.svg";
import BuildingIcon from "../components/icons/green-buliding.svg";
import ClockIcon from "@/app/components/icons/clock.svg";
import { useTranslation } from "react-i18next";
import StudioInfo from "./studio-info/StudioInfo";
import AccountInfo from "./account-info/AccountInfo";
import UserProfile from "./profile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setHomeIndex } from "@/redux/home/homeSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Gold from "./gold/Gold";
import HistoryUpgrade from "./history-upgrade/HistoryUpgrade";
import SuccessPayModal, { PayModalType } from "./modals/SuccessPayModal";
import { loadResultTransaction } from "@/services/api_services/account_services";
import {
  GoldData,
  LicenceData,
  PackageData,
  TransactionData,
} from "@/data/user";
import { FormattedNumber } from "react-intl";
import dayjs from "dayjs";
import { sendNotification } from "@/notifiCations/pushService";
import BellIcon from "@/app/components/icons/blue-noti.svg";
import SettingNotify from "../settings-notify/settings-notification";
import { useAppSelector } from "@/redux/hooks";

function AccountPage() {
  const user = useAppSelector((state: RootState) => state.user.user);
  const index = useSelector((state: RootState) => state.home.index);
  const dispatch = useDispatch();
  const { t } = useTranslation("account");
  const search = useSearchParams();
  const indexTab = search.get("tab");
  const router = useRouter();
  const vnp_Amount = search.get("vnp_Amount");

  const vnp_BankTranNo = search.get("vnp_BankTranNo");
  const vnp_BankCode = search.get("vnp_BankCode");
  const vnp_CardType = search.get("vnp_CardType");
  const vnp_OrderInfo = search.get("vnp_OrderInfo");
  const vnp_PayDate = search.get("vnp_PayDate");
  const vnp_ResponseCode = search.get("vnp_ResponseCode");
  const vnp_TmnCode = search.get("vnp_TmnCode");
  const vnp_TransactionNo = search.get("vnp_TransactionNo");
  const vnp_TransactionStatus = search.get("vnp_TransactionStatus");
  const vnp_TxnRef = search.get("vnp_TxnRef");
  const vnp_SecureHash = search.get("vnp_SecureHash");

  // console.log("vnp_Amount", vnp_Amount);
  // console.log("vnp_BankCode", vnp_BankCode);
  // console.log("vnp_BankTranNo", vnp_BankTranNo);
  // console.log("vnp_CardType", vnp_CardType);
  // console.log("vnp_OrderInfo", vnp_OrderInfo);
  // console.log("vnp_PayDate", vnp_PayDate);
  // console.log("vnp_ResponseCode", vnp_ResponseCode);
  // console.log("vnp_TmnCode", vnp_TmnCode);
  // console.log("vnp_TransactionNo", vnp_TransactionNo);
  // console.log("vnp_TransactionStatus", vnp_TransactionStatus);
  // console.log("vnp_TxnRef", vnp_TxnRef);
  // console.log("vnp_SecureHash", vnp_SecureHash);

  useEffect(() => {
    if (vnp_TxnRef) {
      loadTransaction(vnp_TxnRef);
    }
    dispatch(
      setHomeIndex(
        ["0", "1", "2", "3", "4", "5"].includes(indexTab ?? "")
          ? indexTab
          : "0",
      ),
    );
    sendNotification();
    console.log("Sendtest noti");
  }, [dispatch, indexTab]);

  const [transaction, setTransaction] = useState<TransactionData | undefined>();
  const [licence, setLicence] = useState<LicenceData | undefined>();
  const [packageData, setPackageData] = useState<PackageData | undefined>();
  const [goldSetting, setGoldSetting] = useState<GoldData | undefined>();

  const loadTransaction = async (ref: string) => {
    const res = await loadResultTransaction(ref);
    if (res?.code != 0) {
      return;
    }
    var trans: TransactionData = (res?.data as any).transaction;
    setTransaction(trans);
    if (trans.product_type == "Gold") {
      setGoldSetting((res?.data as any).goldsetting);
      router.push(`/account?tab=1&vnp_ResponseCode=${vnp_ResponseCode}`);
    }
    if (trans.product_type == "Package") {
      setPackageData((res?.data as any).package);
      setLicence((res?.data as any).licence);
      router.push(`/account?tab=4&vnp_ResponseCode=${vnp_ResponseCode}`);
    }
    setOpenModal(true);
    console.log("reff", res);
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <HomeLayout>
      <SuccessPayModal
        width={450}
        type={
          vnp_ResponseCode === "00" ? PayModalType.SUCCESS : PayModalType.ERROR
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => {
          setOpenModal(false);
          if (vnp_ResponseCode === "00") {
            if (transaction?.product_type === "Gold") {
              router.push(process.env.NEXT_PUBLIC_MARKET_URL!);
            } else {
              setOpenModal(false);
            }
          } else {
            if (transaction?.product_type === "Gold") {
              router.push(
                `/payment?type=Gold&goldId=${transaction?.goldId ?? ""}&price=${
                  goldSetting?.cost ?? 0
                }&name=${goldSetting?.name}`,
              );
            } else {
              router.push(
                `/payment?type=Package&packageId=${
                  transaction?.packageId ?? ""
                }&price=${packageData?.price ?? 0}&name=${
                  packageData?.name ?? ""
                }`,
              );
            }
          }
        }}
        content={
          vnp_ResponseCode != "00" ? (
            <div className="w-full">
              <div>
                {transaction?.product_type == "Gold"
                  ? t("buy_gold_fail")
                  : t("upgrade_package_fail")}
              </div>
              <div>{t("re_pay")}</div>
            </div>
          ) : transaction?.product_type == "Gold" ? (
            <div className="w-full">
              <div>
                <span className="text-m_neutral_700">{t("num_gold_add")}:</span>
                <span className="font-semibold ml-1">
                  {transaction?.gold} gold
                </span>
              </div>

              <div>
                <span className="text-m_neutral_700">{t("total_pay")}:</span>
                <span className="font-semibold ml-1 text-m_primary_500">
                  <FormattedNumber
                    value={transaction?.bill_amount ?? 0}
                    style="decimal"
                    maximumFractionDigits={2}
                  />{" "}
                  đ
                </span>
              </div>

              <div className="mt-2">{t("market_gold")}</div>
            </div>
          ) : (
            <div className="w-full">
              <div>
                <span className="text-m_neutral_700">
                  {t("upgraded_package")}:
                </span>
                <span className="font-semibold ml-1">{licence?.pkg_name}</span>
              </div>

              <div>
                <span className="text-m_neutral_700">{t("total_pay")}:</span>

                <span className="font-semibold ml-1 text-m_primary_500">
                  <FormattedNumber
                    value={transaction?.bill_amount ?? 0}
                    style="decimal"
                    maximumFractionDigits={2}
                  />{" "}
                  đ
                </span>
              </div>
              <div className="mt-2">
                {t("deadline_package")}:{" "}
                {dayjs(licence?.active_date).format("DD/MM/YYYY")} -
                {licence?.nonstop
                  ? t("no_limit_time")
                  : dayjs(licence?.expire_date).format("DD/MM/YYYY")}
              </div>
            </div>
          )
        }
      />

      <div className="w-full flex justify-center mt-3">
        <div className="lg:block hidden max-h-[400px] bg-white w-[267px] mt-10 rounded-lg p-4">
          <button
            onClick={() => {
              router.push("/account?tab=0");
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

          {user?.studio?.role === "Owner" && (
            <button
              onClick={() => {
                router.push("/account?tab=1");
              }}
              className={`h-[52px] ${
                index === "1"
                  ? "bg-m_primary_100 body_semibold_14"
                  : "body_regular_14"
              } flex items-center justify-start rounded-lg w-full pl-1`}
            >
              <Avatar className="min-w-5" />
              <p className="mx-2">{t("gold_manage")}</p>
            </button>
          )}
          <button
            onClick={() => {
              router.push("/account?tab=2");
            }}
            className={`h-[52px] ${
              index === "2"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <Avatar className="min-w-5" />
            <p className="mx-2">{t("personal_information")}</p>
          </button>

          <button
            onClick={() => {
              router.push("/account?tab=3");
            }}
            className={`h-[52px] ${
              index === "3"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <BuildingIcon className="min-w-5" />
            <p className="mx-2">{t("business_information")}</p>
          </button>

          {user?.studio?.role === "Owner" && (
            <button
              onClick={() => {
                router.push("/account?tab=4");
              }}
              className={`h-[52px] ${
                index === "4"
                  ? "bg-m_primary_100 body_semibold_14"
                  : "body_regular_14"
              } flex items-center justify-start rounded-lg w-full pl-1`}
            >
              <ClockIcon className="min-w-5" />
              <p className="mx-2">{t("history_upgrade")}</p>
            </button>
          )}

          <button
            onClick={() => {
              router.push("/account?tab=5");
            }}
            className={`h-[52px] ${
              index === "5"
                ? "bg-m_primary_100 body_semibold_14"
                : "body_regular_14"
            } flex items-center justify-start rounded-lg w-full pl-1`}
          >
            <BellIcon className="min-w-5" />
            <p className="mx-2">{"Quản lý thông báo"}</p>
          </button>
        </div>
        <div className="hidden lg:block w-6" />
        <div className="h-screen lg:h-fit bg-white lg:w-4/5 w-full lg:mt-10 rounded-lg">
          {index === "0" && <AccountInfo />}
          {index === "1" && <Gold />}
          {index === "2" && <UserProfile />}
          {index === "3" && <StudioInfo />}
          {index === "4" && <HistoryUpgrade />}
          {index === "5" && <SettingNotify />}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AccountPage;
