import MInput from "@/app/components/config/MInput";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";
import MDropdown from "@/app/components/config/MDropdown";
import { useEffect, useState } from "react";
import { Collapse, Pagination, Select, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  BaseTmasQuestionExamData,
  ExamData,
  ExamGroupData,
  ExaminationData,
  TmasData,
  TmasExamData,
  TmasStudioExamData,
  TmasVersionData,
} from "@/data/exam";
//import CopyIcon from "@/app/components/icons/size.svg";
import LinkIcon from "@/app/components/icons/link-2.svg";
import MessIcon from "@/app/components/icons/message-question.svg";
import SizeIcon from "@/app/components/icons/size.svg";
import CalendarIcon from "@/app/components/icons/calendar.svg";
import CupIcon from "@/app/components/icons/cup.svg";
import AddIcon from "@/app/components/icons/add.svg";
import RedDeleteIcon from "@/app/components/icons/trash-red.svg";
import _ from "lodash";

import { FormattedDate, FormattedNumber } from "react-intl";
import MButton from "@/app/components/config/MButton";
import {
  deleteExamination,
  getTmasExaminationList,
} from "@/services/api_services/examination_api";
import { APIResults } from "@/data/api_results";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import AddBankTmasExam from "../components/AddBankTmasExam";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { getTags } from "@/services/api_services/tag_api";
import { TagData } from "@/data/tag";
import { importTmasExamData } from "@/services/api_services/question_api";
import { DocumentObject, PartObject } from "@/data/form_interface";
import { mapStudioToTmaslanguage } from "@/services/ui/coding_services";
import { mapTmasQuestionToStudioQuestion } from "@/services/ui/mapTmasToSTudio";
import { countExamQuestion } from "@/services/api_services/count_exam_api";

function ExamTmasTab() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  // // const [list, setList] = useState<any[]>([]);
  // const list = useAppSelector((state: RootState) => state.examGroup.list);
  const [list, setList] = useState<TmasVersionData[]>([]);
  const [search, setSearch] = useState<string | undefined>();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const user = useAppSelector((state: RootState) => state.user.user);
  const loadTmasExamList = async (init: boolean) => {
    if (init) {
      setLoadingPage(true);
    }
    const res: APIResults = await getTmasExaminationList({
      skip: (indexPage - 1) * recordNum,
      limit: recordNum,
      fields: {},
      text: search,
      tags,
    });
    setLoadingPage(false);
    console.log("res", res);
    if (res.code != 0) {
      errorToast(res, res.message ?? "");
      return;
    }

    // var tmasList = res.data as TmasExamData[];
    const examList = (res.data ?? []).map((e: TmasData) => e);
    console.log("examList", examList);
    setTotal(res?.records ?? 0);
    setList(examList);
  };

  const [isAdd, setIsAdd] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]);
  const [active, setActive] = useState<TmasData | undefined>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    //        dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
    loadTmasExamList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexPage, recordNum, user, tags]);
  const [openSelectExam, setOpenSelectExam] = useState<boolean>(false);
  useOnMountUnsafe(() => {
    onSearchTags("");
    dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
  }, []);
  const loadExamGroupList = async (init?: boolean) => {
    if (init) {
      dispatch(setExamGroupLoading(true));
    }

    var dataResults: APIResults = await getExamGroupTest({
      text: "",
      studioId: user?.studio?._id,
    });

    if (dataResults.code != 0) {
      return [];
    } else {
      var data = dataResults?.data as ExamGroupData[];
      var levelOne = data?.filter((v: ExamGroupData) => v.level === 0);
      var levelTwo = data?.filter((v: ExamGroupData) => v.level === 1);

      var list = levelOne.map((e: ExamGroupData) => {
        var childs = levelTwo.filter(
          (ch: ExamGroupData) => ch.idParent === e.id
        );
        return { ...e, childs };
      });
      return list;
    }
  };
  const [loadingClone, setLoadingClone] = useState<boolean>(false);
  const [optionTag, setOptionTag] = useState<any[]>([]);
  const onSearchTags = async (searchKey: any) => {
    console.log("onSearchKey", searchKey);
    const data = await getTags(
      searchKey
        ? {
            "Names.Name": "Name",
            "Names.InValues": searchKey,
            "Paging.StartIndex": 1,
            "Paging.RecordPerPage": 100,
          }
        : { "Paging.StartIndex": 1, "Paging.RecordPerPage": 100 }
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

  const handleCloneExam = async (name?: string, idGroup?: string) => {
    setLoadingClone(true);
    console.log("active", active);

    var documentObj: DocumentObject[] = (
      active?.version?.examData?.Documents ?? []
    ).map((e) => ({
      contentType: e?.ContentType,
      createdBy: e?.CreatedBy,
      createdTime: e?.CreatedTime,
      fileName: e?.FileName,
      fileSize: e?.FileSize,
      fileType: e?.FileType,
      id: e?.Id,
      idSession: e?.IdSession,
      link: e?.Link,
      ownerId: e?.OwnerId,
      studioId: e?.StudioId,
      updateBy: e?.UpdatedBy,
      updateTime: e?.UpdateTime,
    }));

    var partObj: PartObject[] = (active?.version?.examData?.Parts ?? []).map(
      (e) => ({
        id: e?._id,
        description: e?.Description,
        name: e?.Name,
        jsonExamQuestions: e?.Questions?.map((d) => {
          var q = _.cloneDeep(d?.Base) as BaseTmasQuestionExamData;

          q.IsQuestionBank = false;
          q.GroupQuestionName = d.GroupQuestionName;
          var baseQuestion = JSON.stringify(mapTmasQuestionToStudioQuestion(q));

          return baseQuestion;
        }),
      })
    );

    var examObj: ExamData = {
      timeLimitMinutes: active?.version?.examData?.TimeLimitMinutes,
      changePositionQuestion: active?.version?.examData?.ChangePositionQuestion,
      description: active?.version?.examData?.Description,
      examNextQuestion: active?.version?.examData?.ExamNextQuestion,
      examViewQuestionType: active?.version?.examData?.ExamViewQuestionType,
      externalLinks: active?.version?.examData?.ExternalLinks,
      idDocuments: active?.version?.examData?.IdDocuments,
      idExamGroup: idGroup,
      idSession: active?.version?.examData?.IdSession,
      studioId: active?.version?.examData?.StudioId,
      name,
      numberOfQuestions: active?.version?.examData?.NumberOfQuestions,
      numberOfTests: active?.version?.examData?.NumberOfTests,
      totalPoints: (active?.version?.examData?.TotalPointsAsInt ?? 0) / 100,
      tags: active?.version?.examData?.Tags,
      playAudio: active?.version?.examData?.PlayAudio,
      version: active?.version?.examData?.Version,
      examType: active?.version?.examData?.ExamType,
      scoreRanks: active?.version?.examData?.ScoreRanks?.map((k) => ({
        label: k?.Label,
        fromScore: k?.FromScore,
        toScore: k?.ToScore,
      })),
    };
    console.log("active part", active?.version?.examData?.Parts);

    console.log(
      "quest",
      (partObj ?? []).reduce(
        (a: any, b: any) => [...a, ...(b?.jsonExamQuestions ?? [])],
        []
      )
    );

    // return;
    var res = await importTmasExamData({
      examFulls: [
        {
          documents: documentObj,
          exam: examObj,
          jsonExamQuestions: (partObj ?? []).reduce(
            (a: any, b: any) => [...a, ...(b?.jsonExamQuestions ?? [])],
            []
          ),
          parts: partObj,
        },
      ],
    });
    setLoadingClone(false);

    if (res.code != 0) {
      errorToast(res, res.message ?? "");
      return;
    }
    await countExamQuestion(active?.version?._id);
    loadTmasExamList(false);
    successToast(res?.message ?? t("success_add_my_exam"));
    var isAddClone = _.cloneDeep(isAdd);
    isAddClone[active?.code!] = res?.data[0]?.idExam;
    console.log("isAddClone", isAddClone);

    setIsAdd(isAddClone);

    setOpenSelectExam(false);
    setActive(undefined);
  };

  const handleDeleteExam = async (id: string) => {
    setLoadingClone(true);
    const res = await deleteExamination(isAdd[id]);
    setLoadingClone(false);
    if (res?.code != 0) {
      errorToast(res, res?.message ?? "");
      return;
    }

    successToast(res?.message ?? t("success_delete_my_exam"));
    var isAddClone = _.cloneDeep(isAdd);
    isAddClone[id] = undefined;
    setActive(undefined);
    setIsAdd(isAddClone);
  };

  // const [count, setCount] = useState();
  // const countExam = async (versionId: any) => {
  //   const res = await countExamQuestion(versionId)
  //   if (res) {
  //     setCount(res)
  //   }
  // }

  return (
    <>
      <AddBankTmasExam
        exam={active?.version?.examData}
        loading={loadingClone}
        open={openSelectExam}
        examGroup={
          useAppSelector((state: RootState) => state?.examGroup.list) ?? []
        }
        onCancel={() => {
          setOpenSelectExam(false);
          setActive(undefined);
        }}
        onOk={handleCloneExam}
      />
      <div className="w-full flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadTmasExamList(true);
          }}
          className="flex w-full max-lg:flex-col max-lg:mx-5"
        >
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {
              setSearch(e.target.value);
              setIndexPage(1);
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
            placeholder={t("enter_tags_to_search")}
            onChange={(c) => {
              console.log("change", c);
            }}
            onSearch={onSearchTags}
            options={optionTag}
            setValue={(name: any, value: any) => {
              setTags(() => value);
              setIndexPage(1);
            }}
            className="tag-big"
            id="tags"
            name="tags"
            mode="tags"
          />
          <div className="w-11" />
          <div className="w-full" />
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
      ) : !list || list?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-28">
          <div className="  w-[350px] h-[213px]  bg-[url('/images/empty.png')] bg-no-repeat bg-contain " />
          <div className="body_regular_14">{common.t("empty_list")}</div>
        </div>
      ) : (
        <>
          {list.map((a: TmasData, i: number) => (
            <Collapse
              key={i}
              ghost
              expandIconPosition="end"
              className="mb-3 rounded-lg bg-white overflow-hidden max-lg:mx-5"
            >
              <Collapse.Panel
                key={i + 1}
                header={
                  <div className="w-full p-2 min-h-[100px] flex items-center justify-between rounded-lg bg-white">
                    <div className="flex max-lg:flex-col w-full lg:items-center justify-between">
                      <div className="flex-1 items-start justify-start flex-grow flex flex-col">
                        <div className="body_semibold_16">
                          {a?.version?.examData?.Name ?? ""}
                        </div>
                        <div className="h-2" />
                        <div className="w-full justify-start my-1 flex max-lg:flex-wrap">
                          <div className="flex items-center">
                            <CalendarIcon />
                            <span className="body_regular_14 ml-2">
                              <FormattedDate
                                value={a?.version?.examData?.CreatedTime}
                                day="2-digit"
                                month="2-digit"
                                year="numeric"
                              />
                            </span>
                          </div>
                          <div className="flex items-center mx-8">
                            <MessIcon />
                            <span className="ml-2 body_regular_14">
                              {`${
                                a?.version?.examData?.NumberOfQuestions ?? ""
                              } ${t("question")?.toLowerCase()}`}
                            </span>
                          </div>
                          <div className="flex items-center ml-2">
                            <CupIcon />
                            <span className="mr-4 ml-2 body_regular_14">
                              {`${
                                (a?.version?.examData?.TotalPointsAsInt ?? 0) /
                                100
                              } ${t("point")}`}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <SizeIcon />
                            <span className="ml-2 body_regular_14">
                              <FormattedNumber
                                value={a?.usage?.total ?? 0}
                                style="decimal"
                                maximumFractionDigits={2}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      {isAdd[a?.code!] ? (
                        <MButton
                          loading={active === a.code}
                          className="flex items-center max-lg:justify-center max-lg:mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (active) {
                              return;
                            }
                            setActive(a);
                            handleDeleteExam(a?.code ?? "");
                          }}
                          h="h-11"
                          type="error"
                          icon={<RedDeleteIcon />}
                          text={t("delete_my_exam")}
                        />
                      ) : (
                        <MButton
                          loading={active === a?.code && !openSelectExam}
                          className="flex items-center max-lg:justify-center max-lg:mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (active) {
                              return;
                            }
                            setActive(a);
                            setOpenSelectExam(true);
                          }}
                          h="h-11"
                          type="secondary"
                          icon={<AddIcon />}
                          text={t("add_my_exam")}
                        />
                      )}
                    </div>
                  </div>
                }
              >
                <div className="body_semibold_14 text-m_primary_500 mb-2">
                  {t("preview_5_question")}
                </div>
                {(
                  a?.version?.examData?.Parts?.reduce(
                    (acc, i) => [...acc, ...(i?.Questions ?? [])] as any,
                    []
                  ) ?? []
                ).map(function (q: any, i: number) {
                  if (i > 4) {
                    return null;
                  }
                  return (
                    <div className="mb-1 flex " key={i}>
                      <div className="body_semibold_14 min-w-20 mt-[1px]">{`${t(
                        "question"
                      )} ${i + 1}: `}</div>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (q as any)?.Base?.Question,
                        }}
                      ></span>
                    </div>
                  );
                })}
              </Collapse.Panel>
            </Collapse>
          ))}
        </>
      )}
      <div className="h-9" />
      {(list ?? []).length != 0 && (
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

export default ExamTmasTab;
