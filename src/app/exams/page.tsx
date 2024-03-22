"use client";
import React, { useEffect, useState } from "react";
import ExamTestTab from "./tabs/ExamTest";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import HomeLayout from "../layouts/HomeLayout";
import Collaborator from "./tabs/Collaborator";

function ExamsPage() {
  const { t } = useTranslation("exam");
  const acc = useTranslation("account");
  const router = useRouter();
  var search = useSearchParams();
  var tab = search.get("tab") ?? "0";
  var index = ["0", "1"].includes(tab) ? tab : "0";

  return (
    <HomeLayout>
      <div className="h-3  lg:h-1" />

      <div className="w-full flex border-b-m_neutral_200 h-11 border-b mt-4">
        <button
          onClick={() => {
            router.push("/exams?tab=0");
          }}
          className={`${
            index === "0"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 px-2 body_semibold_16 lg:px-4 max-lg:w-1/2`}
        >
          {acc.t("exams")}
        </button>
        <button
          onClick={() => {
            router.push("/exams?tab=1");
          }}
          className={`${
            index === "1"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 body_semibold_16 lg:px-4 max-lg:w-1/2 `}
        >
          {t("history_push_approve")}
        </button>
      </div>
      <div className="h-3 " />
      <ExamTestTab hidden={index != "0"} />
      <Collaborator hidden={index != "1"} />
      <div className="h-3" />
    </HomeLayout>
  );
}

export default ExamsPage;
