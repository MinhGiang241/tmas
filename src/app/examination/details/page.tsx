"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "@/app/layouts/HomeLayout";
import { useSearchParams } from "next/navigation";
import {
  getExamExport,
  getExamTestId,
} from "@/services/api_services/question_api";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import { useTranslation } from "react-i18next";
import Menu from "@/app/components/icons/menu.svg";
import Play from "@/app/components/icons/play-cricle.svg";
import MessageQuestion from "@/app/components/icons/message-question.svg";
import Cup from "@/app/components/icons/cup.svg";
import Time from "@/app/components/icons/timer.svg";
import Document from "@/app/components/icons/document.svg";
import Group from "@/app/components/icons/group.svg";
import { Collapse } from "antd";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ExamData, ExamGroupData, QuestionGroupData } from "@/data/exam";
import { RootState } from "@/redux/store";
import {
  fetchDataExamGroup,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { UserData } from "@/data/user";
import Coding from "./question/Coding";
import Connect from "./question/Connect";
import Explain from "./question/Explain";
import FillBlank from "./question/FillBlank";
import Sql from "./question/Sql";
import TrueFalse from "./question/TrueFalse";
import ManyResult from "./question/ManyResult";
import Random from "./question/Random";
import { getExamById } from "@/services/api_services/examination_api";
import { errorToast } from "@/app/components/toast/customToast";
import { mapTmasQuestionToStudioQuestion } from "@/services/ui/mapTmasToSTudio";

function DetailsPage({ params }: any) {
  const [data, setData] = useState<any>();
  const [examData, setExamData] = useState<any>();
  const [exam, setExam] = useState<ExamData | undefined>();
  // console.log(params, "params");
  const search = useSearchParams();
  // Id đợt
  const examTestId = search.get("examTestId");
  // console.log(examTestId, "examTestId")
  // id đề
  const examId = search.get("examId");
  // console.log(examId, "examId")
  // const { t } = useTranslation("question");

  const user: UserData | undefined = useAppSelector(
    (state: RootState) => state?.user?.user,
  );
  const dispatchGroup = useAppDispatch();
  const questionGroups: ExamGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.list,
  );
  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatchGroup(setquestionGroupLoading(true));
    }

    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );

    if (dataResults.code != 0) {
      return [];
      loadQuestionGroupList;
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };

  useEffect(() => {
    if (user?.studio?._id) {
      dispatchGroup(
        fetchDataExamGroup(async () => loadQuestionGroupList(true)),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const { t } = useTranslation("question");
  // const common = useTranslation();
  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res?.code != 0) {
      return;
    }

    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    // console.log(res, "exam");

    setExam(res?.data?.records[0]);
  };

  // console.log("exam", exam);

  useEffect(() => {
    loadExamById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const getExamExportData = async () => {
    const res = await getExamExport({
      paging: { startIndex: 0, recordPerPage: 0 },
      filters: [
        {
          fieldName: "id",
          condition: "eq",
          value: examId,
        },
      ],
      sorter: [{ name: "UnsignedName", isAsc: true }],
    });
    // console.log(res, "getExamExportData");
    if (res) {
      if (res?.data?.records?.length > 0) {
        setExamData(res?.data?.records[0]);
      }
      console.log(res?.data?.records[0], "data res");
    }
  };

  const getDataDetail = async () => {
    const res = await getExamTestId({
      IdExamTests: [examTestId],
      "Paging.StartIndex": 1,
      "Paging.RecordPerPage": 15,
    });
    // console.log(res, "data res");
    if (res) {
      if (res?.data?.records?.length > 0) {
        setData(res?.data?.records[0]);
        console.log("dataget", res?.data?.records[0]);
      }
      console.log(res?.data?.records[0], "data res");
    }
  };
  useEffect(() => {
    if (examTestId) {
      getDataDetail();
    } else {
      getExamExportData();
    }
  }, []);
  return (
    <HomeLayout>
      <div className="h-5" />
      <>
        <MBreadcrumb
          items={[
            {
              text: t("examTest_question"),
              href: `/examination/${examTestId}`,
            },
            // { text: exam?.name, href: `/exams/details/${exam?.id}` },
            {
              href: `/exams/details/${data?.id}`,
              // text: data?.name ?? examData?.exam?.name,
              text: data?.examVersion?.exam?.name ?? examData?.exam?.name,
              active: true,
            },
          ]}
        />
        <div className="h-2" />
        <div className="w-full max-lg:px-3 mb-5">
          <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
            <div className="">
              {data?.examVersion?.exam?.name ?? examData?.exam?.name}
            </div>
            {/* <div className="">{data?.name ?? examData?.exam?.name}</div> */}
            <div className="flex"></div>
          </div>
          <div
            className="text-sm text-m_neutral_500 pt-1"
            dangerouslySetInnerHTML={{
              __html: data?.description || examData?.exam?.description || "",
            }}
          />
          <div className="h-[1px] bg-m_neutral_200 mt-10" />
          <div className="flex justify-between items-center mt-6 mb-6">
            <div className="text-sm text-m_neutral_900 flex">
              <Menu className="mr-1" />
              {data?.examVersion?.parts.length ?? examData?.parts.length}{" "}
              {t("part")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <Play className="mr-1" />
              {data?.examVersion?.exam?.examNextQuestion ??
              examData?.exam?.examNextQuestion === "FreeByUser"
                ? t("free_change_part")
                : t("part_in_row")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <MessageQuestion className="mr-1 scale-75" />
              {data?.examVersion?.exam?.numberOfQuestions ??
                examData?.exam?.numberOfQuestions}{" "}
              {t("quest")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <Cup className="mr-1 scale-75" />
              {data?.examVersion?.exam?.totalPoints ??
                examData?.exam?.totalPoints}{" "}
              {t("point")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <Time className="mr-1" />
              {/* {data?.Base?.TimeLimitMinutes ? `${data?.Base?.TimeLimitMinutes} ${t("minute")}` : t("unlimited")} */}
              {data?.examVersion?.exam?.timeLimitMinutes ??
              examData?.exam?.timeLimitMinutes
                ? `${
                    data?.examVersion?.exam?.timeLimitMinutes ??
                    examData?.exam?.timeLimitMinutes
                  } ${t("minute")}`
                : t("unlimited")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <Document className="mr-1" />
              {data?.examVersion?.exam?.examViewQuestionType ??
              examData?.exam?.examViewQuestionType === "MultiplePages"
                ? t("all_quest_page")
                : t("quest_per_page")}
            </div>
            <div className="text-sm text-m_neutral_900 flex">
              <Group className="mr-1" />
              {data?.examVersion?.exam?.changePositionQuestion ??
              examData?.exam?.changePositionQuestion === false
                ? t("keep_quest_order")
                : t("change_quest_order")}
            </div>
          </div>
          <div>
            {(data?.examVersion?.parts ?? examData?.parts)?.map(
              (x: any, key: any) => (
                // console.log(x,"x");
                <Collapse
                  defaultActiveKey={["1"]}
                  // defaultActiveKey={defaultActiveKeys}
                  key={key}
                  ghost
                  expandIconPosition="end"
                  className="mb-5 rounded-lg bg-white overflow-hidden"
                >
                  <Collapse.Panel
                    key="1"
                    header={
                      <div className="my-3 flex justify-between items-center">
                        <div>
                          <div className="text-base font-semibold">
                            {x.name}
                          </div>
                          <div className="text-sm text-m_neutral_500">
                            {x.description}
                          </div>
                        </div>
                        <div className="min-w-28  pl-5"></div>
                      </div>
                    }
                  >
                    {(
                      (data && data.examQuestions) ||
                      (examData && examData.jsonExamQuestions)?.map(
                        (x: any) => {
                          var e = JSON.parse(x);
                          console.log(e, "eeeee");
                          e.content = JSON.parse(e.content);
                          // var d = mapTmasQuestionToStudioQuestion(e)
                          // console.log('d', d);
                          return e;
                        },
                      )
                    )
                      ?.filter((a: any) => a.idExamQuestionPart == x.id)
                      ?.sort((a: any, b: any) =>
                        a.createdTime < b.createdTime
                          ? -1
                          : a.createdTime > b.createdTime
                            ? 1
                            : 0,
                      )
                      .map((e: any, key: any) => {
                        var questionGroup = questionGroups?.find(
                          (v: any) => v.id === e.idGroupQuestion,
                        );

                        if (e.questionType == "Coding") {
                          return (
                            <Coding
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "Pairing") {
                          return (
                            <Connect
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "Essay") {
                          return (
                            <Explain
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "FillBlank") {
                          return (
                            <FillBlank
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "MutilAnswer") {
                          return (
                            <ManyResult
                              getData={getDataDetail}
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "SQL") {
                          return (
                            <Sql
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        if (e.questionType == "YesNoQuestion") {
                          return (
                            <TrueFalse
                              index={key + 1}
                              key={e.id}
                              examId={examId}
                              question={e}
                              getData={getDataDetail}
                              questionGroup={questionGroup}
                            />
                          );
                        }
                        return (
                          <Random
                            index={key + 1}
                            key={e.id}
                            examId={examId}
                            question={e}
                            getData={getDataDetail}
                            questionGroup={questionGroup}
                          />
                        );
                      })}
                  </Collapse.Panel>
                </Collapse>
              ),
            )}
            {/* <div>123123</div> */}
          </div>
          {/* <ManyResult /> */}
        </div>
        <div className="h-20" />
      </>
    </HomeLayout>
  );
}

export default DetailsPage;
