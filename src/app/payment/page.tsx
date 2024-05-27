"use client";
import React, { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import { useTranslation } from "react-i18next";
import { Divider, Radio } from "antd";
import Image from "next/image";
import MInput from "../components/config/MInput";
import MButton from "../components/config/MButton";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FormattedNumber } from "react-intl";
import {
  checkDistcountCode,
  loadConfig,
  makePayment,
} from "@/services/api_services/account_services";
import { error } from "console";
import { errorToast, successToast } from "../components/toast/customToast";
import { useRouter, useSearchParams } from "next/navigation";
import { parseInt } from "lodash";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { SettingData } from "@/data/user";

function Payment() {
  const { t } = useTranslation("account");
  const [method, setMethod] = useState<string>();
  const user = useAppSelector((state: RootState) => state.user.user);
  const payment = useAppSelector((state: RootState) => state.payment);
  const router = useRouter();
  const search = useSearchParams();
  var searchType = search.get("type");
  var searchPackageId = search.get("packageId");
  var searchGoldId = search.get("goldId");
  var searchPrice = search.get("price");
  var searchName = search.get("name");
  const [config, setConfig] = useState<SettingData | undefined>();

  const [discountCode, setDiscountCode] = useState<string | undefined>();
  const [discountPrice, setDiscountPrice] = useState<number | undefined>();
  const pay = async () => {
    const res = await makePayment({
      goldId:
        searchGoldId ?? (payment.type == "Gold" ? payment?.goldId : undefined),
      packageId:
        searchPackageId ??
        (payment.type == "Package" ? payment?.packageId : undefined),
      product_type: searchType ?? (payment.type as any),
    });

    if (res?.code != 0) {
      errorToast(res.message ?? "");
      return;
    }
    router.push(res.data);
  };

  useOnMountUnsafe(() => {
    getSetting();
  });

  const getSetting = async () => {
    var res = await loadConfig();
    if (res.code != 0) {
      return;
    }
    setConfig(res.data);
  };
  const [loadingDiscount, setLoadingDiscount] = useState<boolean>(false);
  const applyCode = async (e: any) => {
    e.preventDefault();
    setLoadingDiscount(true);
    var res = await checkDistcountCode({
      discount_code: discountCode?.trim(),
      goldId: searchType == "Gold" ? searchGoldId ?? undefined : undefined,
      packageId:
        searchType == "packageId" ? searchPackageId ?? undefined : undefined,
      product_type: searchType ?? undefined,
    });
    setLoadingDiscount(false);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setDiscountPrice(res?.data ? parseInt(res?.data ?? "0") : 0);
    console.log("resdataa", res);
  };

  return (
    <HomeLayout>
      <div className="body_semibold_20 mb-4 mt-6 max-lg:mx-5">
        {t("pay_package")}
      </div>
      <div className="flex max-lg:flex-col max-lg:mx-5">
        <div className="p-5 lg:w-3/5 bg-white rounded-lg">
          <div className="body_semibold_20 mb-4">
            {t("select_payment_method")}
          </div>
          <Radio.Group className="w-full" value={method}>
            {config?.payment?.bank && (
              <button
                onClick={() => {
                  setMethod("atm");
                }}
                className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                  method == "atm" ? "bg-m_primary_100 " : ""
                }`}
              >
                <Radio value={"atm"}>
                  <div className="body_regular_16 w-full flex justify-start text-start">
                    {t("atm_method")}
                  </div>
                </Radio>
                <Image
                  src={"/images/pay.png"}
                  alt="pay"
                  width={40}
                  height={40}
                />
              </button>
            )}
            {config?.payment?.momo && (
              <button
                onClick={() => {
                  setMethod("momo");
                }}
                className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                  method == "momo" ? "bg-m_primary_100 " : ""
                }`}
              >
                <Radio value={"momo"}>
                  <div className="body_regular_16 w-full flex justify-start text-start">
                    {t("momo_method")}
                  </div>
                </Radio>
                <Image
                  src={"/images/momo.png"}
                  alt="momo"
                  width={40}
                  height={40}
                />
              </button>
            )}
            {config?.payment?.visa && (
              <button
                onClick={() => {
                  setMethod("visa");
                }}
                className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                  method == "visa" ? "bg-m_primary_100 " : ""
                }`}
              >
                <Radio value={"visa"}>
                  <div className="body_regular_16 w-full flex justify-start text-start">
                    {t("visa_method")}
                  </div>
                </Radio>
                <Image
                  src={"/images/visa.png"}
                  alt="visa"
                  width={40}
                  height={40}
                />
              </button>
            )}
            {config?.payment?.vnpay && (
              <button
                onClick={() => {
                  setMethod("vnpay");
                }}
                className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                  method == "vnpay" ? "bg-m_primary_100 " : ""
                }`}
              >
                <Radio value={"vnpay"}>
                  <div className="body_regular_16 w-full flex justify-start text-start">
                    {t("vnpay_method")}
                  </div>
                </Radio>
                <Image
                  src={"/images/vnpay.png"}
                  alt="vnpay"
                  width={40}
                  height={40}
                />
              </button>
            )}
          </Radio.Group>
        </div>
        <div className="lg:w-6 max-lg:h-6" />
        <div className=" lg:w-2/5 bg-white rounded-lg">
          <div className="px-5 pt-5 w-full">
            <div className="body_semibold_20 mb-3">{t("customer_info")}</div>
            <div className="flex justify-between">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "full_name",
              )}:`}</div>
              <div className="body_semibold_16">{user.full_name}</div>
            </div>
            <div className="flex justify-between my-2">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "phone_number",
              )}:`}</div>
              <div className="body_semibold_16">{user?.phone}</div>
            </div>
            <div className="flex justify-between">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "email",
              )}:`}</div>
              <div className="body_semibold_16">{user?.email}</div>
            </div>
            <Divider className="my-4" />
            <div className="body_semibold_20 mb-3">{t("order_info")}</div>
            <div className="flex justify-between">
              <div className="body_regular_16 text-m_neutral_500">
                {payment.type == "Gold"
                  ? t("pay_gold", { name: searchName ?? payment?.name ?? "" })
                  : `${t("bussiness_package", { name: searchName })}`}
                :
              </div>
              <div className="body_semibold_16">
                <FormattedNumber
                  value={
                    searchPrice ? parseInt(searchPrice) : payment?.price ?? 0
                  }
                  style="decimal"
                  maximumFractionDigits={2}
                />
                {` VNĐ`}
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="body_regular_16 text-m_neutral_500 ">{`${t(
                "discount_price",
              )}:`}</div>
              <div className="body_semibold_16">
                <FormattedNumber
                  value={discountPrice ?? 0}
                  style="decimal"
                  maximumFractionDigits={2}
                />{" "}
                VNĐ
              </div>
            </div>
            <form onSubmit={applyCode}>
              <MInput
                isTextRequire={false}
                className="mt-3"
                placeholder={t("discount_code")}
                h="h-11"
                id="apply"
                name="apply"
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                }}
                suffix={
                  <button
                    disabled={loadingDiscount || !discountCode}
                    type="submit"
                    className={`${
                      loadingDiscount || !discountCode
                        ? "bg-m_neutral_400"
                        : "bg-m_primary_500"
                    } w-20 lg:h-11 h-11 rounded-r-lg text-white`}
                  >
                    {t("apply")}
                  </button>
                }
              />
            </form>
          </div>
          <Divider className="my-5" />
          <div className="flex justify-between items-center mx-5 mb-5">
            <div>
              <div className="body_regular_16 text-m_neutral_500">
                {t("total_pay")}
              </div>
              <div className="title_bold_24 text-m_primary_500">
                <FormattedNumber
                  value={
                    (searchPrice
                      ? parseInt(searchPrice)
                      : payment?.price ?? 0) - (discountPrice ?? 0)
                  }
                  style="decimal"
                  maximumFractionDigits={2}
                />
                {` VNĐ`}
              </div>
            </div>
            <MButton
              disabled={!method}
              onClick={() => {
                if (method == "vnpay") {
                  pay();
                }
              }}
              h="h-11"
              className="w-[142px]"
              text={t("pay")}
            />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Payment;
