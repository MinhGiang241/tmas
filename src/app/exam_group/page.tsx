"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import { Tabs, TabsProps } from "antd";

function ExamGroup() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tab 1",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  const onChangeTab = () => {};

  return (
    <HomeLayout>
      <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
    </HomeLayout>
  );
}

export default ExamGroup;
