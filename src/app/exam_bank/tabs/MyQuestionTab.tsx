"use client";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import { Dropdown, Pagination, Select, Spin } from "antd";
import MDropdown from "@/app/components/config/MDropdown";
import { BaseQuestionFormData } from "@/data/form_interface";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getQuestionList } from "@/services/api_services/question_api";
import { errorToast } from "@/app/components/toast/customToast";
import { BaseQuestionData, QuestionType } from "@/data/question";
import Coding from "@/app/exams/details/[id]/question/Coding";
import Sql from "@/app/exams/details/[id]/question/Sql";
import Connect from "@/app/exams/details/[id]/question/Connect";
import FillBlank from "@/app/exams/details/[id]/question/FillBlank";
import Explain from "@/app/exams/details/[id]/question/Explain";
import TrueFalse from "@/app/exams/details/[id]/question/TrueFalse";
import ManyResult from "@/app/exams/details/[id]/question/ManyResult";
import {
  fetchDataQuestionGroup,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { ExamGroupData, QuestionGroupData } from "@/data/exam";
import Random from "@/app/exams/details/[id]/question/Random";
import { useRouter } from "next/navigation";
import { APIResults } from "@/data/api_results";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import AddBankModal from "../components/AddBankModal";
import Evaluation from "@/app/exams/details/[id]/question/Evaluation";

function MyQuestionTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const user = useAppSelector((state: RootState) => state.user.user);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<BaseQuestionData[]>([]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  const [search, setSearch] = useState<string | undefined>();
  const [questGroupId, setQuestGroupId] = useState<string | undefined>();
  const [questionType, setQuestionType] = useState<string | undefined>();
  const [sort, setSort] = useState<string>("recently_create");
  const [valueSearch, setValueSearch] = useState<string | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadQuestionList(true);
    dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, recordNum, search, questGroupId, questionType, sort]);

  const loadQuestionList = async (init: boolean) => {
    if (init) {
      setLoadingPage(true);
    }
    const res = await getQuestionList({
      paging: {
        recordPerPage: recordNum,
        startIndex: indexPage,
      },
      isQuestionBank: true,
      searchQuestion: search,
      andIdGroupQuestions: questGroupId ? [questGroupId] : undefined,
      studioSorters: [
        sort != "A-Z"
          ? {
              name: "CreatedTime",
              isAsc: false,
            }
          : {
              name: "UnsignedName",
              isAsc: true,
            },
      ],
      sorters: [
        sort != "A-Z"
          ? {
              name: "CreatedTime",
              isAsc: false,
            }
          : {
              name: "UnsignedName",
              isAsc: true,
            },
      ],
      // andIdExamQuestionParts: "",
      andQuestionTypes: questionType ? [questionType] : undefined,
      // idExams: "",
    });
    setLoadingPage(false);
    if (res.code != 0) {
      errorToast(res, res.message ?? "");
      setQuestionList([]);
      return;
    }

    setTotal(res?.data?.totalOfRecords ?? 0);
    setQuestionList(res.data?.records);
    setLoadingPage(false);
    console.log("res", res);
  };
  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions
  );
  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setquestionGroupLoading(true));
    }
    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id
    );
    dispatch(setquestionGroupLoading(false));
    console.log("dataResults", dataResults);

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };

  const questionGroupOptions = [
    ...(questionGroups ?? []).map((v) => ({
      value: v.id,
      label: v.name,
    })),
    { value: "", label: t("all_category") },
  ];

  console.log("questionGroupOptions", questionGroupOptions);

  const renderQuestion: (
    e: BaseQuestionData,
    index: number
  ) => React.ReactNode = (e: BaseQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.idGroupQuestion);

    switch (e.questionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            isBank
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.YesNoQuestion:
        return (
          <TrueFalse
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Essay:
        return (
          <Explain
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Coding:
        return (
          <Coding
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.SQL:
        return (
          <Sql
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Pairing:
        return (
          <Connect
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.FillBlank:
        return (
          <FillBlank
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Evaluation:
        return (
          <Evaluation
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Random:
        return (
          <Random
            isBank
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      default:
        return <div key={e?.id} />;
    }
  };
  return (
    <>
      <div className="w-full flex justify-end max-lg:pr-5 mb-3">
        <MButton
          type="secondary"
          onClick={() => {
            router.push(`/exam_bank/u/add`);
          }}
          h="h-11"
          text={t("create_question")}
        />
      </div>
      <div className="w-full flex ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(valueSearch);
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setValueSearch(e.target.value);
            }}
            className="max-lg:mt-3"
            placeholder={t("enter_key_search")}
            h="h-11"
            id="search"
            name="search"
            suffix={
              <button
                type="submit"
                className="bg-m_primary_500 w-11 lg:h-11 h-11 rounded-r-lg text-white"
              >
                <SearchOutlined className="scale-150" />
              </button>
            }
          />
          <div className="w-11" />
          <MDropdown
            placeholder={t("quest_type")}
            value={questionType}
            setValue={(na: any, val: any) => {
              setQuestionType(val);
              setIndexPage(1);
            }}
            h="h-11"
            id="question_type"
            name="question_type"
            options={[
              "MutilAnswer",
              "YesNoQuestion",
              "SQL",
              "FillBlank",
              "Pairing",
              "Coding",
              "Essay",
              "Evaluation",
              "",
            ].map((e: string) => ({
              value: e,
              label: !e ? t("all_quest_type") : t(e?.toLowerCase()),
            }))}
          />
          <div className="w-11" />
          <MDropdown
            placeholder={t("question_group")}
            value={questGroupId}
            setValue={(name: any, value: any) => {
              setQuestGroupId(value);
              setIndexPage(1);
            }}
            options={questionGroupOptions}
            id="question_group"
            name="question_group"
          />
          <div className="w-11" />
          <MDropdown
            value={sort}
            setValue={(name: any, value: any) => {
              setIndexPage(1);
              setSort(value);
            }}
            h="h-11"
            id="sort"
            name="sort"
            options={["recently_create", "A-Z"].map((e) => ({
              value: e,
              label: t(e),
            }))}
          />
        </form>
      </div>
      {/* {(questionGroupOptions ?? []).map((e, i) => ( */}
      {/*   <div key={i}>{e.value}</div> */}
      {/* ))} */}
      {loadingPage ? (
        <div
          className={
            "bg-m_neutral_100 w-full flex justify-center min-h-40 items-center"
          }
        >
          <Spin size="large" />
        </div>
      ) : !questionList || questionList?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        <div className="flex flex-col p-5 rounded-lg bg-white max-lg:mx-5">
          {questionList.map((e: BaseQuestionData, i: number) =>
            renderQuestion(e, i)
          )}
        </div>
      )}
      <div className="h-9" />
      {questionList.length != 0 && (
        <div className="w-full flex items-center justify-center">
          <span className="body_regular_14 mr-2">{`${total} ${t(
            "result"
          )}`}</span>

          <Pagination
            pageSize={recordNum}
            onChange={(v) => {
              setIndexPage(v);
            }}
            current={indexPage}
            total={total}
            showSizeChanger={false}
          />
          <div className="hidden ml-2 lg:flex items-center">
            <Select
              optionRender={(oriOption) => (
                <div className="flex justify-center">{oriOption?.label}</div>
              )}
              value={recordNum}
              onChange={(v) => {
                setRecordNum(v);
                setIndexPage(1);
              }}
              options={[
                ...[15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className="pl-3 body_regular_14">{`${i}/${common.t(
                      "page"
                    )}`}</span>
                  ),
                })),
              ]}
              className="select-page min-w-[124px]"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MyQuestionTab;
