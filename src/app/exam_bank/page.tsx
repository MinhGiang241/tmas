"use client";
import React from "react";
import HomeLayout from "../layouts/HomeLayout";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import MyQuestionTab from "./tabs/MyQuestionTab";
import ExamTmasTab from "./tabs/ExamTmasTab";
import QuestionTmasTab from "./tabs/QuestionTmasTab";

function ExamBank() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  var search = useSearchParams();
  var tab = search.get("tab") ?? "0";
  var index = ["0", "1", "2"].includes(tab) ? tab : "0";

  const router = useRouter();

  return (
    <HomeLayout>
      <div className="h-3  lg:h-1" />
      <div className="w-full flex border-b-m_neutral_200 h-12 border-b mt-4 items-start">
        {["my_question", "tmas_question", "tmas_exam"].map(
          (e: string, i: number) => (
            <button
              key={i}
              onClick={() => {
                router.push(`/exam_bank?tab=${i}`);
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
      <div className="h-3 " />
      {index === "0" && <MyQuestionTab />}
      {index === "1" && <QuestionTmasTab />}
      {index === "2" && <ExamTmasTab />}
      <div className="h-3" />
    </HomeLayout>
  );
}

export default ExamBank;
