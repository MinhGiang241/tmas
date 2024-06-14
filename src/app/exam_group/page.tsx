"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import { Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import TabPane from "antd/es/tabs/TabPane";
import ExamGroupTab from "./tabs/ExamGroup";
import QuestionGroup from "./tabs/QuestionGroup";
import { useRouter, useSearchParams } from "next/navigation";

function ExamGroup() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  var search = useSearchParams();
  var tab = search.get("tab") ?? "0";
  var index = ["0", "1"].includes(tab) ? tab : "0";

  const router = useRouter();

  const onChangeTab = (i: any) => {
    router.push(`/exam_group?tab=${i}`);
  };

  return (
    <HomeLayout>
      <div className="h-3  lg:h-1" />

      <div className="w-full flex border-b-m_neutral_200 h-11 border-b mt-4">
        <button
          onClick={() => {
            router.push("/exam_group?tab=0");
          }}
          className={`${
            index === "0"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 px-2 body_semibold_16 lg:px-4 max-lg:w-1/2`}
        >
          {t("exam_group")}
        </button>
        <button
          onClick={() => {
            router.push("/exam_group?tab=1");
          }}
          className={`${
            index === "1"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 body_semibold_16 lg:px-4 max-lg:w-1/2 `}
        >
          {t("question_group")}
        </button>
      </div>
      <div className="h-3 " />

      <ExamGroupTab hidden={index != "0"} />

      <QuestionGroup hidden={index != "1"} />
      <div className="h-3" />
    </HomeLayout>
  );
}

export default ExamGroup;
