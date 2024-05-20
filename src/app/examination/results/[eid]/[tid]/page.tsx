"use client";
import React, { useEffect, useState } from "react";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Button, Collapse } from "antd";
import "./style.css";
import ManyResult from "./questions/ManyResult";
import TrueFalse from "./questions/TrueFalse";
import Connect from "./questions/Connect";
import Explain from "./questions/Explain";
import Coding from "./questions/Coding";
import FillBlank from "./questions/FillBlank";
import Random from "./questions/Random";
import Pause from "@/app/components/icons/pause-circle.svg";
import Edit from "@/app/components/icons/edit-2.svg";
import Play from "@/app/components/icons/video-circle.svg";
import Close from "@/app/components/icons/close-circle2.svg";
import Sql from "./questions/Sql";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import {
  CandidateAnswers,
  Condition,
  ExamCompletionState,
  ExamTestResulstData,
  ExaminationData,
} from "@/data/exam";
import { getOverViewExamination } from "@/services/api_services/examination_api";
import {
  getAdminExamTestResultById,
  getPagingAdminExamTestResult,
} from "@/services/api_services/result_exam_api";
import { errorToast } from "@/app/components/toast/customToast";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import _ from "lodash";
import { PartObject } from "@/data/form_interface";
import { BaseQuestionData, QuestionType } from "@/data/question";
import MDropdown from "@/app/components/config/MDropdown";

dayjs.extend(duration);

export default function Result({ params }: any) {
  const router = useRouter();
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const handClick = () => {
    router.back();
  };
  const [examination, setExamination] = useState<ExaminationData | undefined>();
  const [examResult, setExamResult] = useState<
    ExamTestResulstData | undefined
  >();

  const [parts, setParts] = useState<PartObject[]>([]);
  const [questions, setQuestions] = useState<BaseQuestionData[]>([]);
  const [yEssay, setYEssay] = useState<boolean>(false);

  const getExamResultDetails = async () => {
    const res = await getAdminExamTestResultById(params?.tid);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setExamResult(res?.data.records[0]);
    var r = res?.data.records[0] as ExamTestResulstData;
    var quests =
      r?.examTestDataCreatedWhenTest?.examVersion?.jsonExamQuestions?.map((o) =>
        JSON.parse(o),
      );
    var p = r?.examTestDataCreatedWhenTest?.examVersion?.parts?.map((e) => {
      var d = _.cloneDeep(e);
      d.questions = quests?.filter((t) => t.idExamQuestionPart == e?.id);
      return d;
    });
    setQuestions(quests ?? []);
    setParts(p ?? []);
  };

  const getExaminationDetail = async () => {
    var res = await getOverViewExamination(params.eid);
    if (res.code != 0) {
      return;
    }
    setExamination(res?.data?.records[0]);
  };

  useOnMountUnsafe(() => {
    getExaminationDetail();
    getExamResultDetails();
  });

  const genQuestion = (
    q: BaseQuestionData,
    index: number,
    answer?: CandidateAnswers,
  ) => {
    switch (q?.questionType) {
      case QuestionType?.MutilAnswer:
        return <ManyResult question={q} index={index} answers={answer} />;
      case QuestionType?.YesNoQuestion:
        return <TrueFalse question={q} index={index} answers={answer} />;

      case QuestionType?.Pairing:
        return <Connect question={q} index={index} answers={answer} />;

      case QuestionType?.Essay:
        return (
          <Explain
            question={q}
            index={index}
            answers={answer}
            idExamTestResult={examResult?.id}
          />
        );

      case QuestionType?.Coding:
        return <Coding question={q} index={index} answers={answer} />;

      case QuestionType?.Random:
        return <Random question={q} index={index} />;

      case QuestionType?.FillBlank:
        return <FillBlank question={q} index={index} answers={answer} />;

      case QuestionType?.SQL:
        return <Sql question={q} index={index} answers={answer} />;
    }
  };

  const [valueFilter, setValueFilter] = useState<
    "all" | "select_question" | "essay_question"
  >("all");

  return (
    <HomeLayout>
      <div className="pt-4" />
      <MBreadcrumb
        items={[
          { text: t("examination_list"), href: "/examination" },
          {
            href: `/examination`,
            text: t(`examination_result`),
          },
          {
            // href: `/`,
            text: examResult?.examTestDataCreatedWhenTest?.examTestInfo?.name,
            active: true,
          },
        ]}
      />
      <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center pb-4">
        <div>{t("test_detail")}</div>
        <button
          onClick={handClick}
          className="w-[91px] h-[44px] bg-m_primary_500 rounded-lg text-white text-sm"
        >
          {common.t("back")}
        </button>
      </div>
      <div className="grid grid-cols-3">
        <div className="col-span-2 mr-2">
          <Collapse
            defaultActiveKey={["1"]}
            // defaultActiveKey={defaultActiveKeys}
            key={""}
            ghost
            expandIconPosition="end"
            className="mb-5 rounded-lg bg-white overflow-hidden arrow"
          >
            <div className="px-4 bg-m_warning_50 text-m_warnig_title py-2 font-semibold text-sm">
              {t("has_essay", {
                num: `${questions?.filter(
                  (quest) => quest?.questionType == QuestionType?.Essay,
                )?.length}`,
              })}
            </div>
            <Collapse.Panel
              key="1"
              header={
                <div>
                  <div className="my-3 flex justify-between items-center">
                    <div className="">
                      <div className="text-base font-semibold">
                        {t("exam_list")}
                      </div>
                    </div>

                    <button
                      className="w-[270px] flex justify-start my-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MDropdown
                        allowClear={false}
                        value={valueFilter}
                        setValue={(name: any, val: any) => {
                          setValueFilter(val);
                          if (val == "essay_question") {
                            var partClone = parts?.map((p) => {
                              var cloneP = _.cloneDeep(p);
                              cloneP.questions = questions?.filter(
                                (que) =>
                                  que?.idExamQuestionPart == p?.id &&
                                  que?.questionType == QuestionType?.Essay,
                              );
                              return cloneP;
                            });

                            setParts(partClone);
                          } else if (val == "select_question") {
                            var partClone = parts?.map((p) => {
                              var cloneP = _.cloneDeep(p);
                              cloneP.questions = questions?.filter(
                                (que) =>
                                  que?.idExamQuestionPart == p?.id &&
                                  que?.questionType != QuestionType?.Essay,
                              );
                              return cloneP;
                            });

                            setParts(partClone);
                          } else {
                            var partClone = parts?.map((p) => {
                              var cloneP = _.cloneDeep(p);
                              cloneP.questions = questions?.filter(
                                (que) => que?.idExamQuestionPart == p?.id,
                              );
                              return cloneP;
                            });
                            setParts(partClone);
                          }
                        }}
                        isTextRequire={false}
                        className="dropdown-flex"
                        name=""
                        id=""
                        options={[
                          "all",
                          "select_question",
                          "essay_question",
                        ].map((a) => ({
                          label: t(a),
                          value: a,
                        }))}
                      />
                    </button>
                    {/* <Button */}
                    {/*   onClick={filterEssay} */}
                    {/*   className="w-[163px] h-[36px] bg-m_primary_500 rounded-lg font-semibold text-sm text-white" */}
                    {/* > */}
                    {/*   {t("essay_question")} */}
                    {/* </Button> */}
                  </div>
                </div>
              }
            >
              {parts.map((r, i) => {
                return (
                  <div key={r?.id}>
                    <div className="body_semibold_16 my-2">{r?.name}</div>
                    {r?.questions?.map((q, index) => {
                      var answerIndex = examResult?.candidateAnswers?.findIndex(
                        (l) => l.idExamQuestion == q.id,
                      );
                      var ans =
                        answerIndex! < 0
                          ? undefined
                          : examResult?.candidateAnswers![
                              answerIndex as number
                            ];

                      return genQuestion(q, index, ans);
                    })}
                  </div>
                );
              })}
            </Collapse.Panel>
          </Collapse>
        </div>
        {!examResult?.timeLine?.commitTestAt &&
          !examResult?.timeLine?.mustStopDoTestAt}
        <div className="col-span-1 h-fit ml-2">
          <div className="bg-white rounded-lg">
            <div
              className={`w-full h-10 ${
                examResult?.result?.completionState ==
                ExamCompletionState.Checking
                  ? `bg-m_primary_100 text-m_primary_500`
                  : examResult?.result?.completionState ==
                      ExamCompletionState.Done
                    ? `bg-m_success_50 text-m_success_500`
                    : `bg-m_warning_50 text-m_warning_500`
              } flex justify-center items-center py-auto rounded-t-lg body_bold_14`}
            >
              {examResult?.result?.completionState ==
              ExamCompletionState.Checking
                ? t("in_testing")?.toUpperCase()
                : examResult?.result?.completionState ==
                    ExamCompletionState.Done
                  ? common.t("complete")?.toUpperCase()
                  : t("checking").toUpperCase()}
            </div>
            <div className="flex justify-between items-center p-4">
              <div className="font-bold text-base text-m_primary_500">
                {examResult?.candidate?.fullName}
              </div>
              <div className="bg-m_success_50 px-4 py-1 flex items-center">
                <div className="font-bold text-lg text-m_success_600">
                  {(examResult?.result?.score ?? 0) / 100}
                </div>
                <div className="text-m_success_600 text-sm">
                  /
                  {examResult?.examTestDataCreatedWhenTest?.examVersion?.exam
                    ?.totalPoints ?? 0}
                  &nbsp;<b>đ</b>
                </div>
              </div>
            </div>
            <hr />
            <div className="p-4">
              <div className="flex justify-between items-center pb-2">
                <div className="text-sm">{t("pass_point")}:</div>
                <div className="text-sm font-semibold">
                  {examResult?.examTestDataCreatedWhenTest?.examTestInfo
                    ?.passingSetting?.passPointPercent ?? 0}
                  %
                </div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <div className="text-sm">{t("percent_complete_true")}</div>
                <div className="text-sm font-semibold">
                  {examResult?.result?.percentCorrect ?? 0}%
                </div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <div className="text-sm">{t("true_answer_num")}</div>
                <div className="text-sm font-semibold">
                  {((examResult?.result?.percentCorrect ?? 0) *
                    (examResult?.examTestDataCreatedWhenTest?.examVersion?.exam
                      ?.numberOfQuestions ?? 0)) /
                    100}
                  /
                  {examResult?.examTestDataCreatedWhenTest?.examVersion?.exam
                    ?.numberOfQuestions ?? 0}
                </div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <div className="text-sm">{t("essay_num")}</div>
                <div className="text-sm font-semibold">1</div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <div className="text-sm">{t("test_time_1")}</div>
                <div className="text-sm font-semibold">
                  {dayjs
                    .duration(
                      1000 *
                        (examResult?.timeLine?.totalTimeDoTestSeconds ?? 0),
                    )
                    .format("HH:mm:ss")}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg mt-4">
            <div className="p-4">
              <div className="font-semibold text-base">
                {t("detail_timeline")}
              </div>
            </div>
            <hr />
            <div className="p-4">
              {examResult?.timeLine?.timeLines
                ?.sort((a, b) => dayjs(a?.createTime).diff(b.createTime))
                .map((e, k) => (
                  <div key={k} className="flex-row">
                    <div className="flex">
                      <div className="pt-[6px] mr-5">
                        <div className="w-3 h-3 bg-m_primary_500 rounded-full mb-1" />
                        {e?.eventType != "End" && (
                          <div className="h-10 ml-[5px] border-dotted border-l-2 border-m_neutral_300" />
                        )}
                      </div>
                      <div>
                        <div className="pb-4">
                          <div className="flex items-center">
                            {e?.eventType == "Start" ? (
                              <Play />
                            ) : e?.eventType == "Rejoin" ? (
                              <Close />
                            ) : e?.eventType == "End" ? (
                              <Pause />
                            ) : null}
                            <div className="font-semibold pl-1 text-sm">
                              {e?.message}
                            </div>
                          </div>
                          <div className="text-sm text-m_neutral_500 pl-5">
                            {dayjs(e?.createTime).format("DD/MM/YYYY HH:mm:ss")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
