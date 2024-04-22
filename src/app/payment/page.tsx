"use client";
import React, { useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import { useTranslation } from "react-i18next";
import { Divider, Radio } from "antd";
import Image from "next/image";
import MInput from "../components/config/MInput";
import MButton from "../components/config/MButton";

function Payment() {
  const { t } = useTranslation("account");
  const [method, setMethod] = useState<string>("atm");
  return (
    <HomeLayout>
      <div className="body_semibold_20 my-4  max-lg:mx-5">
        {t("pay_package")}
      </div>
      <div className="flex w-full max-lg:flex-col max-lg:mx-5">
        <div className="p-5 lg:w-3/5 bg-white rounded-lg">
          <div className="body_semibold_20 mb-4">
            {t("select_payment_method")}
          </div>
          <Radio.Group className="w-full" value={method}>
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
              <Image src={"/images/pay.png"} alt="pay" width={40} height={40} />
            </button>
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
            <button
              onClick={() => {
                setMethod("shopee");
              }}
              className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                method == "shopee" ? "bg-m_primary_100 " : ""
              }`}
            >
              <Radio value={"shopee"}>
                <div className="body_regular_16 w-full flex justify-start text-start">
                  {t("shopee_method")}
                </div>
              </Radio>
              <Image
                src={"/images/shopee.png"}
                alt="shopee"
                width={40}
                height={40}
              />
            </button>
            <button
              onClick={() => {
                setMethod("qr");
              }}
              className={`mb-5 justify-between w-full flex items-center border px-6 py-3 rounded-lg body_regular_16 ${
                method == "qr" ? "bg-m_primary_100 " : ""
              }`}
            >
              <Radio value={"qr"}>
                <div className="body_regular_16 w-full flex justify-start text-start">
                  {t("qr_method")}
                </div>
              </Radio>
              <Image src={"/images/qr.png"} alt="qr" width={40} height={40} />
            </button>
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
              <div className="body_semibold_16">Dung</div>
            </div>
            <div className="flex justify-between my-2">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "phone_number",
              )}:`}</div>
              <div className="body_semibold_16">0988987643</div>
            </div>
            <div className="flex justify-between">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "email",
              )}:`}</div>
              <div className="body_semibold_16">dungntt2@gmail.com</div>
            </div>
            <Divider className="my-4" />
            <div className="body_semibold_20 mb-3">{t("order_info")}</div>
            <div className="flex justify-between">
              <div className="body_regular_16 text-m_neutral_500">{`${t(
                "bussiness_package",
              )}:`}</div>
              <div className="body_semibold_16">6.000.000 VNĐ</div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="body_regular_16 text-m_neutral_500 ">{`${t(
                "discount_price",
              )}:`}</div>
              <div className="body_semibold_16">0 VNĐ</div>
            </div>
            <MInput
              isTextRequire={false}
              className="mt-3"
              placeholder={t("discount_code")}
              h="h-11"
              id="apply"
              name="apply"
              suffix={
                <button
                  type="submit"
                  className="bg-m_primary_500 w-20 lg:h-11 h-11 rounded-r-lg text-white"
                >
                  {t("apply")}
                </button>
              }
            />
          </div>
          <Divider className="my-5" />
          <div className="flex justify-between items-center mx-5 mb-5">
            <div>
              <div className="body_regular_16 text-m_neutral_500">
                {t("total_pay")}
              </div>
              <div className="title_bold_24 text-m_primary_500">
                6.000.000 VNĐ
              </div>
            </div>
            <MButton h="h-11" className="w-[142px]" text={t("pay")} />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Payment;
