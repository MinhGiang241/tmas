"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import Tick from "@/app/components/icons/tick-circle.svg";
import { ToastType, modifyToast } from "../components/toast/customToatsUpgrade";
import { useRouter } from "next/navigation";
import { loadPackage } from "@/services/api_services/upgrade";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FormattedNumber } from "react-intl";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function Upgrage() {
  const [data, setData] = useState<any>();
  const { t } = useTranslation("account");
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state.user.user);
  // console.log('user', user?.licences?.enterprise?.packageId);

  const load = async () => {
    const res = await loadPackage();
    if (res) {
      setData(res?.data);
      // console.log("res", res?.data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <HomeLayout>
      <div className="h-2" />
      <div className="w-full max-lg:px-3 mb-5">
        <div className="body_semibold_20 mt-3 w-full flex justify-between items-center">
          <div>{t("upgrade_package_ser")}</div>
        </div>
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.map((x: any, key: any) =>
            !x?.active || x?.type != "Enterprise" ? (
              ""
            ) : (
              <div
                key={key}
                className={`${
                  x?._id === user?.licences?.enterprise?.packageId
                    ? "max-md:col-span-1 md:col-span-2 lg:col-span-1 border border-m_upgrade_300 rounded-xl bg-white gap-6 relative"
                    : "max-md:col-span-1 md:col-span-2 lg:col-span-1 border boder-m_neutral_200 rounded-xl bg-white py-6 gap-6 relative"
                }`}
              >
                {x?._id === user?.licences?.enterprise?.packageId ? (
                  <div className="flex justify-end">
                    <div className="text-white text-center text-xs font-semibold h-6 bg-m_upgrade_300 w-32 rounded-bl-md rounded-tr-md flex items-center justify-center">
                      {t("in_use")}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`${
                    x?._id === user?.licences?.enterprise?.packageId
                      ? "pt-0 pb-0"
                      : ""
                  }`}
                >
                  <div className="body_semibold_16 pl-6">{x?.name}</div>
                  <div className="flex items-center pl-6">
                    <div className="body_bold_20 title_semibold_20">
                      {x?.price === 0 ? (
                        <div className="flex">Liên hệ</div>
                      ) : (
                        <FormattedNumber
                          value={x?.price ?? 0}
                          style="decimal"
                          maximumFractionDigits={2}
                        />
                      )}
                    </div>
                    <div>
                      {x?.price === 0 ? (
                        ""
                      ) : (
                        <div className="pl-1 body_bold_20">VNĐ&nbsp;</div>
                      )}
                    </div>
                    <div className="text-m_neutral_500 body_regular_14">
                      {x?.nonstop ? (
                        `/ ${t("unlimited")}`
                      ) : !x?.price ? (
                        <div className="h-7" />
                      ) : x?.unit === "year" ? (
                        `/ ${x?.duration} ${t("year")}`
                      ) : x?.unit === "month" ? (
                        `/ ${x?.duration} ${t("month")}`
                      ) : x?.unit === "day" ? (
                        `/ ${x?.duration} ${t("day")}`
                      ) : (
                        <div className="h-7" />
                      )}
                    </div>
                  </div>
                  <div className="py-5 w-full px-6">
                    {x?.features?.map((e: any, key: any) => (
                      <div key={key} className="flex pb-3">
                        <Tick className="min-w-7" />
                        <div className="body_regular_14 text-m_neutral_900">
                          {e?.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-16" />
                  <div className="absolute bottom-0 w-[222px] left-6 max-md:w-[350px]">
                    <hr />
                    {x?.custom_price === true ? (
                      <button
                        onClick={() => {
                          modifyToast(
                            <div>
                              <div className="text-center text-m_neutral_500 font-normal text-sm">
                                {t("intro")}
                              </div>
                              <div className="text-center text-m_neutral_500 font-normal text-sm">
                                {t("hotline")}{" "}
                                <a
                                  className="border-black border-b text-black font-semibold text-sm"
                                  href="tel:+"
                                >
                                  1900 1221
                                </a>
                              </div>
                            </div>,
                            ToastType.SUCCESS,
                          );
                        }}
                        className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_primary_500 body_semibold_14 text-white my-4"
                      >
                        {t("infor")}{" "}
                      </button>
                    ) : !x?.price ? (
                      <button className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_neutral_200 body_semibold_14 text-m_neutral_500 my-4">
                        {t("free")}{" "}
                      </button>
                    ) : x?._id === user?.licences?.enterprise?.packageId ? (
                      <button className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_neutral_200 body_semibold_14 text-m_neutral_500 my-4">
                        {t("deadline")}:&nbsp;
                        {dayjs(user?.licences?.enterprise?.active_date).format(
                          "DD/MM/YYYY",
                        )}
                        &nbsp; - &nbsp;
                        {dayjs(user?.licences?.enterprise?.expire_date).format(
                          "DD/MM/YYYY",
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          router.push(
                            `/payment?type=Package&packageId=${
                              x._id ?? ""
                            }&price=${x?.price ?? 0}&name=${x?.name ?? ""}`,
                          );
                        }}
                        className="flex justify-center items-center rounded-lg w-full h-[44px] bg-m_primary_500 body_semibold_14 text-white my-4"
                      >
                        {t("register_now")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
