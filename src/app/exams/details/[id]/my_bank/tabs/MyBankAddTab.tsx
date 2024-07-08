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
import { ExamData, QuestionGroupData } from "@/data/exam";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  cloneQuestionFromTmas,
  createBatchQuestion,
  deleteManyQuestion,
  deleteQuestionById,
  deleteQuestionPartById,
  duplicateQuestion,
  getQuestionList,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { Checkbox, Pagination, Select, Spin, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import DeleteIcon from "@/app/components/icons/trash-red.svg";
import AddIcon from "@/app/components/icons/add.svg";
import _, { parseInt } from "lodash";
import {
  fetchDataQuestionGroup,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import { APIResults } from "@/data/api_results";
import { ExamType } from "@/data/form_interface";
import Evaluation from "../../question/Evaluation";

function MyBankAddTab({
  hidden,
  examQuestList,
  exam,
  partId,
}: {
  hidden?: boolean;
  examQuestList?: BaseQuestionData[];
  exam?: ExamData;
  partId?: string;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [questionList, setQuestionList] = useState<BaseQuestionData[]>([]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.user.user);
  const [questGroupId, setQuestGroupId] = useState<string | undefined>();
  const [questionType, setQuestionType] = useState<string | undefined>("");
  const [search, setSearch] = useState<string | undefined>();
  const [sort, setSort] = useState<string>("recently_create");
  const [valueSearch, setValueSearch] = useState<string | undefined>();
  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadQuestionsList(true);
    dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
  }, [user, recordNum, indexPage, search, questGroupId, questionType, sort]);

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

  const loadQuestionsList = async (init: boolean) => {
    if (init) {
      setLoadingPage(true);
      //setIndexPage(1);
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

      andQuestionTypes:
        exam?.examType == ExamType.Survey
          ? [QuestionType.Essay, QuestionType.Evaluation]
          : questionType
          ? [questionType]
          : undefined,
    });
    setLoadingPage(false);
    if (res.code != 0) {
      errorToast(res.message ?? "");
      setQuestionList([]);
      return;
    }

    setTotal(res?.data?.totalOfRecords ?? 0);
    setQuestionList(res.data?.records);
    console.log("res", res);
  };

  const addExamBank = async (__: any, question: BaseQuestionData) => {
    var cloneQuestion = _.cloneDeep(question);
    cloneQuestion.idExam = exam?.id;
    cloneQuestion.idExamQuestionPart = partId;
    cloneQuestion.isQuestionBank = false;
    const res = await cloneQuestionFromTmas(
      cloneQuestion
      // {idExams: exam?.id ? [exam?.id] : undefined,
      // ids: question?.id ? [question.id] : undefined,
      // newIdExamQuestionPart: partId,}
    );
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    console.log("res", res);

    successToast(t("success_add_into_exam"));
    const isAddClone = _.cloneDeep(isAdd);

    isAddClone[question?.id as string] = res.data;

    setIsAdd(isAddClone);
    setSelectedList([]);
  };

  const deleteExamBank = async (__: any, question: BaseQuestionData) => {
    console.log("isAdd", isAdd);

    const res = await deleteQuestionById(isAdd[question?.id as string]);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    console.log("res", res);
    successToast(t("success_add_into_exam"));
    const isAddClone = _.cloneDeep(isAdd);
    isAddClone[question?.id as string] = undefined;
    setIsAdd(isAddClone);
    setSelectedList([]);
  };

  const [isAdd, setIsAdd] = useState<any>({});
  const onChangeCheck = (checkedList: any) => {};
  const renderQuestion: (
    e: BaseQuestionData,
    index: number
  ) => React.ReactNode = (e: BaseQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.idGroupQuestion);
    var isExist = isAdd[e.id as string] ? true : false;
    switch (e.questionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.YesNoQuestion:
        return (
          <TrueFalse
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.Essay:
        return (
          <Explain
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.Coding:
        return (
          <Coding
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.SQL:
        return (
          <Sql
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.Pairing:
        return (
          <Connect
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.FillBlank:
        return (
          <FillBlank
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.Evaluation:
        return (
          <Evaluation
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
          />
        );
      case QuestionType.Random:
        return (
          <Random
            addText={t("add_quest_to_exam")}
            deleteText={t("delete_quest_to_exam")}
            isExist={isExist}
            deleteExamBank={deleteExamBank}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            key={e?.id}
            question={e}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.idExam}
            getData={() => loadQuestionsList(false)}
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
  const questionGroupOptions = [
    ...(questionGroups ?? []).map((v) => ({
      value: v.id,
      label: v.name,
    })),
    { value: "", label: t("all_category") },
  ];

  const [loadingMany, setLoadingMany] = useState<boolean>(false);
  const removeManyQuestion = async (e: any) => {
    setLoadingMany(true);
    var ids = [];
    for (let i of selectedList) {
      if (isAdd[i]) {
        ids.push(isAdd[i]);
      }
    }
    console.log("is add", isAdd);

    const res = await deleteManyQuestion({
      ids,
    });

    setLoadingMany(false);
    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setIsAdd({});
    successToast(t("success_delete_from_exam"));
    setSelectedList([]);
    setCheckedAll(false);
  };

  const addManyQuestion = async (e: any) => {
    setLoadingMany(true);
    var list = questionList.filter((d) =>
      selectedList.some((s: any) => s === d.id)
    );
    var cloneQuestions = _.cloneDeep(list);
    var cloneQuestionList = cloneQuestions.map((k) => {
      k.isQuestionBank = false;
      k.idExamQuestionPart = partId;
      k.idExam = exam?.id;
      (k as any).content = JSON.stringify((k as any)?.content);
      return k;
    });
    console.log("cloneQuestionList", cloneQuestionList);

    const res = await createBatchQuestion(cloneQuestionList);
    // {ids: [...selectedList],
    // idExams: exam?.id ? [exam?.id] : undefined,
    // newIdExamQuestionPart: partId,}
    setLoadingMany(false);
    console.log("res", res);

    if (res.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    for (let i in res.data) {
      var index = parseInt(i);
      var q = cloneQuestionList[index];

      isAdd[q.id!] = res.data[index]?.idQuestionCreated;
    }
    successToast(t("success_add_quest_to_exam"));
    setSelectedList([]);
    setCheckedAll(false);
  };

  return (
    <>
      <div className="w-full flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(valueSearch);
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setIndexPage(1);
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
            allowClear={false}
            value={questionType}
            setValue={(na: any, val: any) => {
              setIndexPage(1);
              setQuestionType(val);
            }}
            placeholder={t("quest_type")}
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
              label: !e ? t("all_question_type") : t(e?.toLowerCase()),
            }))}
          />
          <div className="w-11" />
          <MDropdown
            placeholder={t("question_group")}
            value={questGroupId}
            setValue={(name: any, value: any) => {
              setIndexPage(1);
              setQuestGroupId(value);
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
                    disabled={loadingMany}
                    onClick={addManyQuestion}
                    className="rounded-lg py-2 px-[10px] border border-m_primary_500"
                  >
                    <AddIcon />
                  </button>
                </Tooltip>
                <div className="w-2" />
                <Tooltip placement="bottom" title={t("delete_selected")}>
                  <button
                    disabled={loadingMany}
                    onClick={removeManyQuestion}
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
              renderQuestion(e, i)
            )}
          </CheckboxGroup>
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

export default MyBankAddTab;
