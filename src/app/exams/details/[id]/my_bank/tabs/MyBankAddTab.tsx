/* eslint-disable react-hooks/exhaustive-deps */
import { BaseQuestionData, QuestionType } from "@/data/question";
import React, { useEffect, useState } from "react";
import Random from "../../question/Random";
import FillBlank from "../../question/FillBlank";
import Connect from "../../question/Connect";
import Sql from "../../question/Sql";
import Coding from "../../question/Coding";
import Explain from "../../question/Explain";
import TrueFalse from "../../question/TrueFalse";
import ManyResult from "../../question/ManyResult";
import { QuestionGroupData } from "@/data/exam";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getQuestionList } from "@/services/api_services/question_api";
import { errorToast } from "@/app/components/toast/customToast";
import { Checkbox, Pagination, Select, Spin, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import DeleteIcon from "@/app/components/icons/trash-red.svg";
import AddIcon from "@/app/components/icons/add.svg";

function MyBankAddTab({ hidden }: { hidden?: boolean }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [questionList, setQuestionList] = useState<BaseQuestionData[]>([]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.user.user);
  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  useEffect(() => {
    loadQuestionList(true);
  }, [user, recordNum, indexPage]);

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
  const onChangeCheck = (checkedList: any) => {};
  const renderQuestion: (
    e: BaseQuestionData,
    index: number,
  ) => React.ReactNode = (e: BaseQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.idGroupQuestion);
    switch (e.questionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={() => {}}
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
  const CheckboxGroup = Checkbox.Group;
  const plainOptions = [];
  const defaultCheckedList = [];
  const [selectedList, setSelectedList] = useState<any>([]);

  const onCheckAllChange = (e: any) => {
    setSelectedList(e.target.checked ? questionList?.map((e) => e?.id) : []);
    setCheckedAll(e.target.checked);
  };
  const [checkedAll, setCheckedAll] = useState<boolean>(false);

  return (
    <>
      <div className="w-full flex">
        <form className="flex w-full max-lg:flex-col max-lg:mx-5">
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
          <MDropdown
            className="tag-big"
            popupClassName="hidden"
            id="tags"
            name="tags"
            mode="tags"
          />
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
          <div className="w-full flex justify-between min-h-12 items-center">
            <Checkbox
              checked={checkedAll}
              indeterminate={
                selectedList.length > 0 &&
                selectedList.length < questionList.length
              }
              onChange={onCheckAllChange}
            >
              {t("check_all")}
            </Checkbox>
            {selectedList.length != 0 && (
              <div className="flex">
                <Tooltip placement="bottom" title={t("add_selected")}>
                  <button
                    onClick={(e) => {
                      setSelectedList([]);
                      setCheckedAll(false);
                    }}
                    className="rounded-lg py-2 px-[10px] border border-m_primary_500"
                  >
                    <AddIcon />
                  </button>
                </Tooltip>
                <div className="w-2" />
                <Tooltip placement="bottom" title={t("delete_selected")}>
                  <button
                    onClick={(e) => {
                      setSelectedList([]);
                      setCheckedAll(false);
                    }}
                    className="rounded-lg p-2 border border-m_error_500"
                  >
                    <DeleteIcon />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="h-3" />
          <CheckboxGroup
            value={selectedList}
            onChange={(e) => {
              console.log("checkedList", e);
              setSelectedList(e);
            }}
            className="flex flex-col"
          >
            {questionList.map((e: BaseQuestionData, i: number) =>
              renderQuestion(e, i),
            )}
          </CheckboxGroup>
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
                ...[15, 25, 30, 50, 100].map((i: number) => ({
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

export default MyBankAddTab;
