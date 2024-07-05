"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import MButton from "@/app/components/config/MButton";
import HomeLayout from "@/app/layouts/HomeLayout";
import { ExamData, ExamGroupData, QuestionGroupData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Collapse, Input, Popover, Tooltip } from "antd";
import Menu from "@/app/components/icons/menu.svg";
import Play from "@/app/components/icons/play-cricle.svg";
import MessageQuestion from "@/app/components/icons/message-question.svg";
import Cup from "@/app/components/icons/cup.svg";
import Time from "@/app/components/icons/timer.svg";
import Document from "@/app/components/icons/document.svg";
import Group from "@/app/components/icons/group.svg";
import {
    getExamQuestionPartList,
} from "@/services/api_services/question_api";
import { errorToast } from "@/app/components/toast/customToast";
import { APIResults } from "@/data/api_results";
import Coding from "./question/Coding";
import Connect from "./question/Connect";
import Explain from "./question/Explain";
import FillBlank from "./question/FillBlank";
import Sql from "./question/Sql";
import TrueFalse from "./question/TrueFalse";
import ManyResult from "./question/ManyResult";
import Random from "./question/Random";
import { ExamPrint } from "@/app/exams/details/components/ExamPrint";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchDataExamGroup,
    setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import { UserData } from "@/data/user";
import { getExamDetail } from "@/services/api_services/exam_detail";
import { ExaminationVersionState } from "@/services/api_services/examination_bc_api";

function ExamDetails({ params }: any) {
    const [exam, setExam] = useState<ExamData | undefined>();
    // Dùng cho phần đề thi
    //
    const [data, setData] = useState<any>();
    const [loadDataQuestion, setLoadDataQuestion] = useState<any>(null);
    //
    const router = useRouter();
    const printRef = useRef(null);
    const examTrans = useTranslation("exam");

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
            errorToast(res, res?.message ?? "");
            return;
        }
        console.log(res, "exam");

        setExam(res?.data?.records[0]);
    };

    // console.log("exam", exam);

    useEffect(() => {
        loadExamById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // const getData = async () => {
    //     const res = await getExamQuestionPartList({
    //         paging: { startIndex: 0, recordPerPage: 100 },
    //         studioSorters: [{ name: "createdTime", isAsc: true }],
    //         // truyền idexam thay vì ids
    //         // ids: [params.id],
    //         idExams: [params.id],
    //     });
    //     const data = res.data;
    //     console.log(data);
    //     if (data) {
    //         setData(data);
    //     }
    // };

    const getDataDetail = async (params: any) => {
        const res = await getExamDetail(params)
        console.log(res, "res Detail");
        if (res) {
            setData(res);
        }
    }

    useEffect(() => {
        setLoadDataQuestion([]);
        getDataDetail(params.versionId)
    }, []);
    return (
        <HomeLayout>
            <div className="h-5" />
            <MBreadcrumb
                items={[
                    { text: t("story_list"), href: "/exams?tab=1" },
                    // { text: exam?.name, href: `/exams/details/${exam?.id}` },
                    {
                        href: `/exams/details/${data?.id}`,
                        // text: data?.examData?.Name,
                        text: `${data?.examData?.Name} - ${data?.version}`,
                        active: true,
                    },
                ]}
            />
            <div className="h-2" />

            <div className="w-full max-lg:px-3 mb-5">
                <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
                    <div className="">{data?.code} - {data?.examData?.Name} - {data?.version}</div>
                    <div className="flex">
                    </div>
                </div>
                <div
                    className="text-sm text-m_neutral_500 pt-1"
                    dangerouslySetInnerHTML={{ __html: data?.examData?.Description || "" }}
                />
                <div className="h-[1px] bg-m_neutral_200 mt-10" />
                <div className="flex justify-between items-center mt-6 mb-6">
                    <div className="text-sm text-m_neutral_900 flex">
                        <Menu className="mr-1" />
                        {data?.examData?.Parts.length} {t("part")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <Play className="mr-1" />
                        {data?.examData?.ExamNextQuestion === "FreeByUser"
                            ? t("free_change_part")
                            : t("part_in_row")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <MessageQuestion className="mr-1 scale-75" />
                        {data?.examData?.NumberOfQuestions} {t("quest")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <Cup className="mr-1 scale-75" />
                        {data?.examData?.TotalPointsAsInt / 100} {t("point")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <Time className="mr-1" />
                        {/* {data?.Base?.TimeLimitMinutes ? `${data?.Base?.TimeLimitMinutes} ${t("minute")}` : t("unlimited")} */}
                        {data?.examData?.TimeLimitMinutes
                            ? `${data?.examData?.TimeLimitMinutes} ${t("minute")}`
                            : t("unlimited")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <Document className="mr-1" />
                        {data?.examData?.ExamViewQuestionType === "MultiplePages"
                            ? t("all_quest_page")
                            : t("quest_per_page")}
                    </div>
                    <div className="text-sm text-m_neutral_900 flex">
                        <Group className="mr-1" />
                        {data?.examData?.ChangePositionQuestion === false
                            ? t("keep_quest_order")
                            : t("change_quest_order")}
                    </div>
                </div>
                <div>
                    {data &&
                        data?.examData.Parts?.map((x: any, key: any) => (
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
                                                <div className="text-base font-semibold">{x.Name}</div>
                                                <div className="text-sm text-m_neutral_500">
                                                    {x.Description}
                                                </div>
                                            </div>
                                            <div className="min-w-28  pl-5">
                                            </div>
                                        </div>
                                    }
                                >
                                    {x?.Questions
                                        ?.sort((a: any, b: any) =>
                                            a.createdTime < b.createdTime
                                                ? -1
                                                : a.createdTime > b.createdTime
                                                    ? 1
                                                    : 0,
                                        )
                                        .map((e: any, key: any) => {
                                            var questionGroup = questionGroups?.find(
                                                (v: any) => v.id === e.IdGroupQuestion,
                                            );
                                            // console.log(questionGroup, "questionGroup");

                                            if (e.QuestionType == "Coding") {
                                                return (
                                                    <Coding
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        getData={getDataDetail}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "Pairing") {
                                                return (
                                                    <Connect
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        getData={getDataDetail}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "Essay") {
                                                return (
                                                    <Explain
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        getData={getDataDetail}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "FillBlank") {
                                                return (
                                                    <FillBlank
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        getData={getDataDetail}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "MutilAnswer") {
                                                return (
                                                    <ManyResult
                                                        getData={getDataDetail}
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "SQL") {
                                                return (
                                                    <Sql
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
                                                        question={e}
                                                        getData={getDataDetail}
                                                        questionGroup={questionGroup}
                                                    />
                                                );
                                            }
                                            if (e.QuestionType == "YesNoQuestion") {
                                                return (
                                                    <TrueFalse
                                                        index={key + 1}
                                                        key={e.id}
                                                        examId={params.id}
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
                                                    examId={params.id}
                                                    question={e}
                                                    getData={getDataDetail}
                                                    questionGroup={questionGroup}
                                                />
                                            );
                                        })}
                                </Collapse.Panel>
                            </Collapse>
                        ))}
                </div>
                {/* <ManyResult /> */}
            </div>
            <div className="h-20" />
            <div className="hidden">
                <ExamPrint exam={data?.records} ref={printRef} name={exam?.name} />
            </div>
        </HomeLayout>
    );
}

export default ExamDetails;
function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
