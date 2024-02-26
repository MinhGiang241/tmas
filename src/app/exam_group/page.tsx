"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import { Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import TabPane from "antd/es/tabs/TabPane";
import ExamGroupTab from "./tabs/ExamGroup";

function ExamGroup() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("exam_group"),
      children: <ExamGroupTab />,
    },
    {
      key: "2",
      label: t("question_group"),
      children: <div />,
    },
  ];

  const onChangeTab = () => {};

  return (
    <HomeLayout>
      <Tabs
        destroyInactiveTabPane
        size="large"
        defaultActiveKey="1"
        items={items}
        onChange={onChangeTab}
      />
    </HomeLayout>
  );
}

export default ExamGroup;
