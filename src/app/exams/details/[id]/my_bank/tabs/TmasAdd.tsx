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
import {
  QuestionGroupData,
  BaseTmasQuestionData,
  TmasStudioExamData,
  ExamData,
} from "@/data/exam";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  cloneQuestionFromTmas,
  createBatchQuestion,
  deleteManyQuestion,
  deleteQuestionById,
  getQuestionList,
  getTmasQuestList,
} from "@/services/api_services/question_api";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { Checkbox, Pagination, Select, Spin, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import DeleteIcon from "@/app/components/icons/trash-red.svg";
import AddIcon from "@/app/components/icons/add.svg";
import { getTags } from "@/services/api_services/tag_api";
import { TagData } from "@/data/tag";
import _ from "lodash";
import { mapTmasQuestionToStudioQuestion } from "@/services/ui/mapTmasToSTudio";
import AddBankModal from "@/app/exam_bank/components/AddBankModal";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import {
  fetchDataQuestionGroup,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getQuestionGroups } from "@/services/api_services/exam_api";

function TmasAddTab({
  hidden,
  exam,
  partId,
}: {
  hidden?: boolean;
  exam?: ExamData;
  partId?: string;
}) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [questionList, setQuestionList] = useState<BaseTmasQuestionData[]>([]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>();
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.user.user);
  const questionGroups: QuestionGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  const dispatch = useAppDispatch();
  const [questGroupId, setQuestGroupId] = useState<string | undefined>();
  const [questionType, setQuestionType] = useState<string | undefined>();
  const [active, setActive] = useState<BaseQuestionData>();
  useEffect(() => {
    loadQuestionList(true);
    // dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
  }, [user, recordNum, indexPage, questionType]);

  useOnMountUnsafe(() => {
    dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
  });

  const loadQuestionGroupList = async (init?: boolean) => {
    if (user?.studio?._id) {
      var dataResults: APIResults = await getQuestionGroups(
        "",
        user?.studio?._id,
      );
      console.log("group_question", dataResults);

      if (dataResults.code != 0) {
        return [];
      } else {
        var data = dataResults?.data as QuestionGroupData[];
        return data;
      }
    }
  };

  const loadQuestionList = async (init: boolean) => {
    if (init) {
      setLoadingPage(true);
    }
    const res = await getTmasQuestList({
      text: search,
      limit: recordNum,
      skip: (indexPage - 1) * recordNum,
      type: questionType,
    });
    setLoadingPage(false);
    console.log("res", res);

    if (res.code != 0) {
      errorToast(res.message ?? "");
      setQuestionList([]);
      return;
    }

    setTotal(res?.records);
    setQuestionList(res?.data ?? []);
  };
  const onChangeCheck = (checkedList: any) => {};

  const addExamBank = async (__: any, question: BaseQuestionData) => {
    setOpenAdd(true);
    setActive(question);
  };
  const handleCloneQuestion = async (idGroup: string) => {
    if (active) {
      var cloneQuestion = _.cloneDeep(active);
      cloneQuestion!.idExamQuestionPart = partId;
      cloneQuestion!.idGroupQuestion = idGroup;
      cloneQuestion!.idExam = exam?.id;
      const res = await cloneQuestionFromTmas(cloneQuestion!);
      if (res?.code != 0) {
        errorToast(res?.message ?? "");
        return;
      }
      console.log("res", res);

      successToast(t("success_add_into_exam"));
      const isAddClone = _.cloneDeep(isAdd);
      isAddClone[active?.id as string] = res.data;
      setIsAdd(isAddClone);
      setOpenAdd(false);
      setSelectedList([]);
      setActive(undefined);
      return;
    } else {
      setLoadingAdd(true);
      console.log("check", selectedList);
      var selectedQuestion = questionList
        ?.filter((e) => selectedList?.some((i) => i === e?._id))
        .map((q) => {
          var quest = _.cloneDeep(q);
          var studioQuest = mapTmasQuestionToStudioQuestion(quest);
          studioQuest.idGroupQuestion = idGroup;
          studioQuest.idExam = exam?.id;
          studioQuest.idExamQuestionPart = partId;
          (studioQuest as any).content = JSON.stringify(
            (studioQuest as any)?.content,
          );
          return studioQuest;
        });
      console.log("selectedTmasQuestion", selectedQuestion);

      const res = await createBatchQuestion(selectedQuestion);
      setLoadingAdd(false);
      if (res.code != 0) {
        errorToast(res?.message ?? "");
        return;
      }
      successToast(t("success_add_into_exam"));
      const isAddClone = _.cloneDeep(isAdd);
      var idsList = (res.data ?? [])?.map((e: any) => e?.idQuestionCreated);
      console.log("idsList", idsList);

      for (let j of selectedList) {
        for (let i of idsList) {
          isAddClone[j as string] = i;
        }
      }
      console.log("isAdd", isAddClone);
      setIsAdd(isAddClone);
      setOpenAdd(false);
      setSelectedList([]);
      setActive(undefined);

      return;
    }
  };
  const deleteExamBank = async (__: any, question: BaseQuestionData) => {
    console.log("isAdd", isAdd);
    setLoadingAdd(true);
    const res = await deleteQuestionById(isAdd[question?.id as string]);
    setLoadingAdd(false);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    console.log("res", res);
    successToast(t("success_delete_from_exam"));
    const isAddClone = _.cloneDeep(isAdd);
    isAddClone[question?.id as string] = undefined;
    setIsAdd(isAddClone);
    setSelectedList([]);
  };

  const [isAdd, setIsAdd] = useState<any>({});
  const renderQuestion: (
    e: BaseTmasQuestionData,
    index: number,
  ) => React.ReactNode = (e: BaseTmasQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.IdGroupQuestion);
    var questMap = mapTmasQuestionToStudioQuestion(e);
    var isExist = isAdd[e._id as string] ? true : false;
    switch (e?.QuestionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.YesNoQuestion:
        return (
          <TrueFalse
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Essay:
        return (
          <Explain
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Coding:
        return (
          <Coding
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.SQL:
        return (
          <Sql
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Pairing:
        return (
          <Connect
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.FillBlank:
        return (
          <FillBlank
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      case QuestionType.Random:
        return (
          <Random
            isExist={isExist}
            canCheck
            onChangeCheck={onChangeCheck}
            tmasQuest
            addExamBank={addExamBank}
            deleteExamBank={deleteExamBank}
            key={e?._id}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      default:
        return <div key={e?._id} />;
    }
  };
  const CheckboxGroup = Checkbox.Group;

  const [selectedList, setSelectedList] = useState<any[]>([]);

  const onCheckAllChange = (e: any) => {
    setSelectedList(
      (e.target.checked as boolean) ? questionList?.map((e) => e?._id) : [],
    );
    setCheckedAll(e.target.checked);
  };
  const [checkedAll, setCheckedAll] = useState<boolean>(false);

  const [optionTag, setOptionTag] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const onSearchTags = async (searchKey: any) => {
    console.log("onSearchKey", searchKey);
    const data = await getTags(
      searchKey
        ? {
            "Names.Name": "Name",
            "Names.InValues": searchKey,
            "Paging.StartIndex": 0,
            "Paging.RecordPerPage": 100,
          }
        : { "Paging.StartIndex": 0, "Paging.RecordPerPage": 100 },
    );
    if (data?.code != 0) {
      return [];
    }
    console.log("dataTag", data);

    var op = (data?.data?.records ?? []).map((e: TagData) => ({
      value: e?.name,
      label: e.name,
    }));
    setOptionTag(op);
  };

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);

  const cloneManyQuestion = (__: any) => {
    setOpenAdd(true);
  };

  const deleteQuestions = async (__: any) => {
    setLoadingAdd(true);
    var deleteIds = selectedList
      .map((e) => {
        return isAdd[e];
      })
      .filter((t) => t);
    const res = await deleteManyQuestion({ ids: deleteIds });
    setLoadingAdd(false);
    if (res?.code) {
      errorToast(res?.message ?? "");
      return;
    }
    successToast(t("success_delete_from_exam"));
    setIsAdd({});
    setSelectedList([]);
    setCheckedAll(false);
  };

  return (
    <>
      <AddBankModal
        questionGroups={questionGroups}
        width={564}
        title={t("add_my_bank_quest")}
        loading={loadingAdd}
        open={openAdd}
        onCancel={() => {
          setActive(undefined);
          setOpenAdd(false);
        }}
        onOk={handleCloneQuestion}
      />

      <div className="w-full flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadQuestionList(true);
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setSearch(e.target.value);
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
            placeholder={t("quest_type")}
            value={questionType}
            setValue={(na: any, val: any) => {
              setQuestionType(val);
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
              "",
            ].map((e: string) => ({
              value: e,
              label: !e ? t("Tất cả ") : t(e?.toLowerCase()),
            }))}
          />
          <div className="w-11" />
          <MDropdown
            placeholder={t("enter_tags_to_search")}
            setValue={(name: any, value: any) => {
              setTags(() => value);
            }}
            onSearch={onSearchTags}
            options={optionTag}
            className="tag-big"
            popupClassName="hidden"
            id="tags"
            name="tags"
            mode="tags"
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
                    disabled={loadingAdd}
                    onClick={cloneManyQuestion}
                    className="rounded-lg py-2 px-[10px] border border-m_primary_500"
                  >
                    <AddIcon />
                  </button>
                </Tooltip>
                <div className="w-2" />
                <Tooltip placement="bottom" title={t("delete_selected")}>
                  <button
                    disabled={loadingAdd}
                    onClick={deleteQuestions}
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
            {questionList.map((e: BaseTmasQuestionData, i: number) =>
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

export default TmasAddTab;
