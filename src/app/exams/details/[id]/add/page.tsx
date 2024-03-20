"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import { errorToast } from "@/app/components/toast/customToast";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CodingQuestion from "./questions_components/CodingQuestion";

function CreateQuestionPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();

  const [exam, setExam] = useState<ExamData | undefined>();

  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res?.code != 0) {
      return;
    }

    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setExam(res?.data?.records[0]);
  };

  useEffect(() => {
    loadExamById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeTab, setActiveTab] = useState<string>(t("many_results"));

  const questionList = [
    t("many_results"),
    t("true_false"),
    t("connect_quest"),
    t("explain"),
    t("coding"),
    t("sql"),
    t("fill_blank"),
    t("random"),
  ];
  return (
    <HomeLayout>
      <div className="w-full flex mt-4 items-center justify-between">
        <MBreadcrumb
          items={[
            { text: t("exam_list"), href: "/exams" },
            { text: exam?.name, href: `/exams/details/${exam?.id}` },
            {
              text: t("manual_add"),
              href: `/exams/details/${exam?.id}/add`,
              active: true,
            },
          ]}
        />
        <div className="flex items-center">
          <MButton
            h="h-11"
            className="min-w-20"
            onClick={() => {
              router.back();
            }}
            type="secondary"
            text={common.t("cancel")}
          />
          <div className="w-4" />
          <MButton
            className="min-w-20"
            h="h-11"
            onClick={() => { }}
            text={common.t("create_new")}
          />
        </div>
      </div>

      <div className="flex mt-5">
        {questionList.map((a: any, i: number) => (
          <button
            onClick={() => {
              setActiveTab(a);
            }}
            className={`body_semibold_14 text-m_primary_500 px-6 py-2 mr-3 rounded-lg ${activeTab == a ? "bg-m_primary_100" : "bg-white "
              }`}
            key={i}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="h-4" />
      {activeTab == t("coding") && <CodingQuestion />}
    </HomeLayout>
  );
}

export default CreateQuestionPage;
