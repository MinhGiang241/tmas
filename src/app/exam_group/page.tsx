"use client";
import React, { useState } from "react";
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
  var index = search.get("tab");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("exam_group"),
      children: <ExamGroupTab />,
    },
    {
      key: "2",
      label: t("question_group"),
      children: <QuestionGroup />,
    },
  ];

  const router = useRouter();

  const onChangeTab = (i: any) => {
    router.push(`/exam_group?tab=${i}`);
  };

  // const [index, setIndex] = useState<number>(0);

  return (
    <HomeLayout>
      {/*
      <div className="w-full flex border-b-m_neutral_200 h-11 border-b mt-4">
        <button
          onClick={() => {
            setIndex(0);
          }}
          className={`${
            index === 0
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center body_semibold_16 lg:px-4 max-lg:w-1/2`}
        >
          {t("exam_group")}
        </button>
        <button
          onClick={() => {
            setIndex(1);
          }}
          className={`${
            index === 1
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center body_semibold_16 lg:px-4 max-lg:w-1/2 `}
        >
          {t("question_group")}
        </button>
      </div>

      {index === 0 ? <ExamGroupTab /> : <div />}
      */}
      <div className="h-3  lg:h-1" />
      <Tabs
        destroyInactiveTabPane
        size="large"
        defaultActiveKey={index ?? "1"}
        items={items}
        onChange={onChangeTab}
      />
    </HomeLayout>
  );
}

export default ExamGroup;
