"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import MBreadcrumb from "../components/config/MBreadcrumb";
import { useTranslation } from "react-i18next";
import Menu from "@/app/components/icons/menu.svg";
import Play from "@/app/components/icons/play-cricle.svg";
import MessageQuestion from "@/app/components/icons/message-question.svg";
import Cup from "@/app/components/icons/cup.svg";
import Time from "@/app/components/icons/timer.svg";
import Document from "@/app/components/icons/document.svg";
import Group from "@/app/components/icons/group.svg";
import { Collapse } from "antd";
import Coding from "./questions/Coding";
import ManyResult from "./questions/ManyResult";
import TrueFalse from "./questions/TrueFalse";
import Connect from "./questions/Connect";
import Explain from "./questions/Explain";
import FillBlank from "./questions/FillBlank";
import Sql from "./questions/Sql";
import Random from "./questions/Random";

export default function Question() {
  const { t } = useTranslation("question");
  return (
    <>
      <HomeLayout>
        <div className="h-10" />
        <div className="w-full max-lg:px-3 mb-5">
          <Collapse
            defaultActiveKey={["1"]}
            // defaultActiveKey={defaultActiveKeys}
            // key={key}
            ghost
            expandIconPosition="end"
            className="mb-5 rounded-lg bg-white overflow-hidden"
          >
            <Collapse.Panel
              key="1"
              header={
                <div className="my-3 flex justify-between items-center">
                  <div>
                    <div className="text-base font-semibold">Tên</div>
                    <div className="text-sm text-m_neutral_500">Mô tả</div>
                  </div>
                  <div className="min-w-28  pl-5"></div>
                </div>
              }
            >
              {/* Nhiều đáp án */}
              <ManyResult />
              {/* Đúng sai */}
              <TrueFalse />
              {/* Ghép nối */}
              <Connect />
              {/* Tự luận */}
              <Explain />
              {/* Coding */}
              <Coding />
              {/* Điền vào chỗ trống */}
              <FillBlank />
              {/* SQL */}
              <Sql />
              {/* Ngẫu nhiên */}
              <Random />
            </Collapse.Panel>
          </Collapse>
        </div>
      </HomeLayout>
    </>
  );
}
