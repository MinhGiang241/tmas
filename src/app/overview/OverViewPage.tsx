"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import OverviewTab from "./tabs/OverviewTab";
import PerformanceTestTab from "./tabs/PerformanceTestTab";
import IncomeTab from "./tabs/IncomeTab";
import ReloadIcon from "@/app/components/icons/reload.svg";

function OverViewPage() {
  const router = useRouter();
  const { t } = useTranslation("overview");
  var search = useSearchParams();
  var tab = search.get("tab") ?? "0";
  var index = ["0", "1", "2"].includes(tab) ? tab : "0";

  return (
    <HomeLayout>
      <div className="h-3  lg:h-1" />
      <div className="flex justify-between items-center">
        <div className="w-full flex border-b-m_neutral_200 h-12 border-b mt-4 items-start">
          {["overview", "performance_test", "income"].map(
            (e: string, i: number) => (
              <button
                key={i}
                onClick={() => {
                  router.push(`/?tab=${i}`);
                }}
                className={`${
                  index === `${i}`
                    ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
                    : "text-m_neutral_500"
                } h-12 text-center lg:min-w-40 px-2 body_semibold_16 lg:px-4 max-lg:w-1/2 pb-1`}
              >
                {t(e)}
              </button>
            ),
          )}
        </div>
        <button
          onClick={() => {
            router.refresh();
          }}
          className="border-b-m_neutral_200 border-b py-[12px]"
        >
          <ReloadIcon />
        </button>
      </div>
      <div className="h-3 " />
      {index === "0" && <OverviewTab />}
      {index === "1" && <PerformanceTestTab />}
      {index === "2" && <IncomeTab />}
      <div className="h-3" />
    </HomeLayout>
  );
}

export default OverViewPage;
