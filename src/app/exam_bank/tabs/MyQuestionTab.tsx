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

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadQuestionList(true);
    loadQuestionGroupList(true);
    dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, recordNum]);

  const loadQuestionList = async (init: boolean) => {
    if (init) {
      setLoadingPage(true);
    }
    const res = await getQuestionList({
      paging: {
        recordPerPage: recordNum,
        startIndex: indexPage,
      },
      // andIdExamQuestionParts: "",
      // andQuestionTypes: "",
      // idExams: "",
      // andIdGroupQuestions: "",
    });

    if (res.code != 0) {
      errorToast(res.message ?? "");
      setQuestionList([]);
      return;
    }

    setTotal(res?.data?.totalOfRecords ?? 0);
    setQuestionList(res.data?.records);
    setLoadingPage(false);
    console.log("res", res);
  };
  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  const loadQuestionGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setquestionGroupLoading(true));
    }
    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );
    dispatch(setquestionGroupLoading(false));
    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };

  const renderQuestion: (
    e: BaseQuestionData,
    index: number,
  ) => React.ReactNode = (e: BaseQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.idGroupQuestion);
    console.log("questionGroups", questionGroups);
    console.log("group", group);

    switch (e.questionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.YesNoQuestion:
        return (
          <TrueFalse
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
      <div className="w-full flex justify-end max-lg:pr-5">
        <MButton
          onClick={() => {
            router.push(`/exams/details/u/add`);
          }}
          h="h-11"
          text={t("create_question")}
        />
      </div>
      <div className="w-full flex ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              // setSearch(e.target.value);
            }}
            className="max-lg:mt-3"
            placeholder={t("search_test_group")}
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
              "",
            ].map((e: string) => ({
              value: e,
              label: !e ? t("Tất cả ") : t(e?.toLowerCase()),
            }))}
          />
          <div className="w-11" />
          <MDropdown h="h-11" id="category" name="category" options={[]} />
          <div className="w-11" />
          <MDropdown
            h="h-11"
            id="category"
            name="category"
            options={["recently_create", "A-Z"].map((e) => ({
              value: e,
              label: t(e),
            }))}
          />
        </form>
      </div>
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
            renderQuestion(e, i),
          )}
        </div>
      )}
      <div className="h-9" />
      {questionList.length != 0 && (
        <div className="w-full flex items-center justify-center">
          <span className="body_regular_14 mr-2">{`${total} ${t(
            "result",
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
              }}
              options={[
                ...[1, 2, 15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className="pl-3 body_regular_14">{`${i}/${common.t(
                      "page",
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
