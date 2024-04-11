import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { BaseQuestionFormData } from "@/data/form_interface";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import MDropdown from "@/app/components/config/MDropdown";
import { Pagination, Select, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  cloneQuestionFromTmas,
  deleteQuestionById,
  getQuestionList,
  getTmasQuestList,
} from "@/services/api_services/question_api";
import {
  BaseTmasQuestionData,
  ExamGroupData,
  QuestionGroupData,
} from "@/data/exam";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { RootState } from "@/redux/store";
import {
  fetchDataQuestionGroup,
  setquestionGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { BaseQuestionData, QuestionType } from "@/data/question";
import FillBlank from "@/app/exams/details/[id]/question/FillBlank";
import Sql from "@/app/exams/details/[id]/question/Sql";
import Connect from "@/app/exams/details/[id]/question/Connect";
import ManyResult from "@/app/exams/details/[id]/question/ManyResult";
import TrueFalse from "@/app/exams/details/[id]/question/TrueFalse";
import Explain from "@/app/exams/details/[id]/question/Explain";
import Coding from "@/app/exams/details/[id]/question/Coding";
import { APIResults } from "@/data/api_results";
import { getQuestionGroups } from "@/services/api_services/exam_api";
import Random from "@/app/exams/details/[id]/question/Random";
import AddBankModal from "../components/AddBankModal";
import BaseModal from "@/app/components/config/BaseModal";
import { getTags } from "@/services/api_services/tag_api";
import { TagData } from "@/data/tag";
import { useRouter } from "next/navigation";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { mapTmasQuestionToStudioQuestion } from "@/services/ui/mapTmasToSTudio";
import _ from "lodash";

function QuestionTmasTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();

  const user = useAppSelector((state: RootState) => state.user.user);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [questionList, setQuestionList] = useState<BaseQuestionFormData>([]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [active, setActive] = useState<BaseQuestionData>();
  const [search, setSearch] = useState<string | undefined>();
  const [questionType, setQuestionType] = useState<string | undefined>();

  useEffect(() => {
    loadQuestionList(true);
    loadQuestionGroupList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, recordNum, questionType]);

  useOnMountUnsafe(() => {
    dispatch(fetchDataQuestionGroup(async () => loadQuestionGroupList(true)));
  });

  const dispatch = useAppDispatch();
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
  const questionGroups: ExamGroupData[] | undefined = useAppSelector(
    (state: RootState) => state?.examGroup?.questions,
  );
  const loadQuestionGroupList = async (init?: boolean) => {
    var dataResults: APIResults = await getQuestionGroups(
      "",
      user?.studio?._id,
    );
    console.log("dataResults", dataResults);

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as QuestionGroupData[];
      return data;
    }
  };
  const addExamBank = (e: any, question: any) => {
    console.log("isAdd", isAdd);
    setOpenAdd(true);
    setActive(question);
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
  };

  const [isAdd, setIsAdd] = useState<any>({});
  const renderQuestion: (
    e: BaseTmasQuestionData,
    index: number,
  ) => React.ReactNode = (e: BaseTmasQuestionData, index: number) => {
    var group = questionGroups?.find((v: any) => v.id === e.IdGroupQuestion);
    var questMap = mapTmasQuestionToStudioQuestion(e);
    var isExist = isAdd[e._id as string] ? true : false;
    switch (e.QuestionType) {
      case QuestionType.MutilAnswer:
        return (
          <ManyResult
            isExist={isExist}
            key={e?._id}
            deleteExamBank={deleteExamBank}
            addExamBank={addExamBank}
            tmasQuest
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
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
            key={e?._id}
            deleteExamBank={deleteExamBank}
            tmasQuest
            addExamBank={addExamBank}
            question={questMap}
            index={index + (indexPage - 1) * recordNum + 1}
            questionGroup={group}
            examId={e?.IdExam}
            getData={() => loadQuestionList(false)}
          />
        );
      default:
        return <div />;
    }
  };
  const [optionTag, setOptionTag] = useState<any[]>([]);
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

  const handleCloneQuestion = async (idGroup: string) => {
    console.log("idGroup", idGroup);

    if (active) {
      var cloneQuestion = _.cloneDeep(active);
      cloneQuestion!.idGroupQuestion = idGroup;
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
      setActive(undefined);
      return;
    } else {
      setOpenAdd(false);
      setActive(undefined);

      return;
    }
  };
  const router = useRouter();
  return (
    <>
      <AddBankModal
        questionGroups={questionGroups}
        width={564}
        loading={loadingAdd}
        title={t("add_my_bank_quest")}
        open={openAdd}
        onCancel={() => {
          setActive(undefined);
          setOpenAdd(false);
        }}
        onOk={handleCloneQuestion}
      />

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
              label: !e ? common.t("all") : t(e?.toLowerCase()),
            }))}
          />
          <div className="w-11" />
          <MDropdown
            placeholder={t("enter_tags_to_search")}
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
          {questionList.map((e: BaseTmasQuestionData, i: number) =>
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

export default QuestionTmasTab;
