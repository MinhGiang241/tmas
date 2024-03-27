"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import { errorToast } from "@/app/components/toast/customToast";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData, ExamGroupData, QuestionGroupData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CodingQuestion from "./questions_components/CodingQuestion";
import SqlQuestion from "./questions_components/SqlQuestion";
import ManyResultsQuestion from "./questions_components/ManyResultsQuestion";
import TrueFalseQuestion from "./questions_components/TrueFalseQuestion";
import ExplainQuestion from "./questions_components/ExplainQuestion";
import ConnectQuestion from "./questions_components/ConnectQuestion";
import FillBlankQuestion from "./questions_components/FillBlankQuestion";
import RandomQuestion from "./questions_components/RandomQuestion";
import { APIResults } from "@/data/api_results";
import {
  getExamGroupTest,
  getQuestionGroups,
} from "@/services/api_services/exam_api";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  resetConnectAnswer,
  resetMultiAnswer,
} from "@/redux/questions/questionSlice";
import { getQuestionById } from "@/services/api_services/question_api";
import { renderQuestTypeRoute } from "@/services/ui/navigate";

function CreateQuestionPage({ params, question }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state?.user?.user);
  const questionGroups = useAppSelector(
    (state: RootState) => state?.examGroup?.list,
  );
  var search = useSearchParams();
  var questionType = search.get("question");
  var partId = search.get("partId");
  var questId = search.get("questId");

  const [exam, setExam] = useState<ExamData | undefined>();

  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setExam(res?.data?.records[0]);
    console.log("exam", exam);
  };

  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setquestionGroupLoading(true));
    }

    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadQuestionGroupList(true)));
    }

    loadExamById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const questionLoading = useAppSelector(
    (state: RootState) => state.question.loading,
  );

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

  const submitRef = useRef(undefined);
  return (
    <HomeLayout>
      <div className="w-full flex mt-4 items-center justify-between">
        <MBreadcrumb
          items={[
            { text: t("exam_list"), href: "/exams" },
            { text: exam?.name, href: `/exams/details/${exam?.id}` },
            {
              text: question ? common.t("edit") : t("manual_add"),
              href: question ? `` : `/exams/details/${exam?.id}/add`,
              active: true,
            },
          ]}
        />
        <div className="flex items-center">
          <MButton
            h="h-11"
            className="min-w-20"
            onClick={() => {
              dispatch(resetMultiAnswer(1));

              router.push(`/exams/details/${params.id}`);
            }}
            type="secondary"
            text={common.t("cancel")}
          />
          <div className="w-4" />
          <MButton
            loading={questionLoading}
            className="min-w-20"
            h="h-11"
            onClick={() => {
              (submitRef.current as any).click();
            }}
            text={question ? common.t("edit") : common.t("create_new")}
          />
        </div>
      </div>

      <div className="max-lg:ml-5 flex mt-5 flex-wrap">
        {questionList.map((a: any, i: number) => (
          <button
            onClick={() => {
              if (question) {
                router.push(
                  `?partId=${partId}&questId=${questId}&question=${a}`,
                );
                return;
              }
              if (a != "many_results") {
                dispatch(resetMultiAnswer(1));
              }
              if (a != "connect_quest") {
                dispatch(resetConnectAnswer(0));
              }
              router.push(`/exams/details/${params.id}/add?question=${a}`, {
                scroll: false,
              });
            }}
            className={`body_semibold_14 text-m_primary_500 px-6 py-2 mr-3 mb-2 rounded-lg ${
              a == "many_results" &&
              !questionList.some((a: any) => a == questionType)
                ? "bg-m_primary_100"
                : a == questionType
                  ? "bg-m_primary_100"
                  : "bg-white "
            }`}
            key={i}
          >
            {t(a)}
          </button>
        ))}
      </div>
      <div className="h-4" />
      {(questionType == "many_results" ||
        !questionList.some((a: any) => a == questionType)) && (
        <ManyResultsQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "true_false" && (
        <TrueFalseQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "explain" && (
        <ExplainQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "connect_quest" && (
        <ConnectQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "coding" && (
        <CodingQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "sql" && (
        <SqlQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "fill_blank" && (
        <FillBlankQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
      {questionType == "random" && (
        <RandomQuestion
          question={question}
          questionGroups={questionGroups}
          submitRef={submitRef}
          idExam={params?.id}
        />
      )}
    </HomeLayout>
  );
}

export default CreateQuestionPage;
