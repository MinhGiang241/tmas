"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import { errorToast } from "@/app/components/toast/customToast";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CodingQuestion from "./questions_components/CodingQuestion";
import SqlQuestion from "./questions_components/SqlQuestion";
import ManyResultsQuestion from "./questions_components/ManyResultsQuestion";
import TrueFalseQuestion from "./questions_components/TrueFalseQuestion";
import ExplainQuestion from "./questions_components/ExplainQuestion";
import ConnectQuestion from "./questions_components/ConnectQuestion";
import FillBlankQuestion from "./questions_components/FillBlankQuestion";
import RandomQuestion from "./questions_components/RandomQuestion";

function CreateQuestionPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  var search = useSearchParams();
  var question = search.get("question");

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

  const [activeTab, setActiveTab] = useState<string>("many_results");

  const questionList = [
    "many_results",
    "true_false",
    "connect_quest",
    "explain",
    "coding",
    "sql",
    "fill_blank",
    "random",
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
            onClick={() => {}}
            text={common.t("create_new")}
          />
        </div>
      </div>

      <div className="flex mt-5">
        {questionList.map((a: any, i: number) => (
          <button
            onClick={() => {
              // setActiveTab(a);
              router.push(`/exams/details/${params.id}/add?question=${a}`, {
                scroll: false,
              });
            }}
            className={`body_semibold_14 text-m_primary_500 px-6 py-2 mr-3 rounded-lg ${
              a == question ? "bg-m_primary_100" : "bg-white "
            }`}
            key={i}
          >
            {t(a)}
          </button>
        ))}
      </div>
      <div className="h-4" />
      {(question == "many_results" ||
        !questionList.some((a: any) => a == question)) && (
        <ManyResultsQuestion />
      )}
      {question == "true_false" && <TrueFalseQuestion />}
      {question == "explain" && <ExplainQuestion />}
      {question == "connect_quest" && <ConnectQuestion />}
      {question == "coding" && <CodingQuestion />}
      {question == "sql" && <SqlQuestion />}
      {question == "fill_blank" && <FillBlankQuestion />}
      {question == "random" && <RandomQuestion />}
    </HomeLayout>
  );
}

export default CreateQuestionPage;
