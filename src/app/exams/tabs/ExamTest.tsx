import React, { useEffect, useState } from "react";
import MInput from "../../components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import MDropdown from "../../components/config/MDropdown";
import { Collapse, Divider, Pagination, Select, Spin, Tooltip } from "antd";
import EditBlackIcon from "../../components/icons/edit-black.svg";
import DeleteRedIcon from "../../components/icons/trash-red.svg";
import CopyIcon from "../../components/icons/export.svg";
import CupIcon from "../../components/icons/cup.svg";
import FolderIcon from "../../components/icons/folder.svg";
import LinkIcon from "../../components/icons/link-2.svg";
import CalendarIcon from "../../components/icons/calendar.svg";
import MessIcon from "../../components/icons/message-question.svg";
import MButton from "../../components/config/MButton";
import AddIcon from "../../components/icons/add.svg";
import SizeIcon from "../../components/icons/size.svg";
import { useRouter } from "next/navigation";
import MTreeSelect from "../../components/config/MTreeSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  ExamData,
  ExamGroupData,
  ExamListDataResult,
  ExaminationData,
} from "@/data/exam";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { errorToast, successToast } from "../../components/toast/customToast";
import {
  deleteExamination,
  getExaminationList,
  getExaminationTestList,
} from "@/services/api_services/examination_api";
import { FormattedDate } from "react-intl";
import ConfirmModal from "../../components/modals/ConfirmModal";
import copy from "copy-text-to-clipboard";
import toast from "react-hot-toast";
import { createExaminationVersion } from "@/services/api_services/examination_bc_api";
import { UploadOutlined, ProfileOutlined } from "@ant-design/icons";

function ExamTestTab({ hidden }: { hidden: boolean }) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const examGroup = useSelector((state: RootState) => state.examGroup?.list);

  const [loading, setLoading] = useState<boolean>(false);

  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<ExamData[]>([]);
  const [search, setSearch] = useState();
  const [groupId, setGroupId] = useState();
  const [sort, setSort] = useState("time");

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamList(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, indexPage, recordNum, groupId, sort]);

  const loadExamList = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const res: APIResults = await getExaminationList({
      "Paging.RecordPerPage": recordNum,
      "Paging.StartIndex": indexPage,
      "FilterByNameOrTag.InValues": search,
      "FilterByNameOrTag.Name": "Name",
      "FilterByExamGroupId.InValues": !groupId ? undefined : groupId,
      "FilterByExamGroupId.Name": "Name",
      "SortByCreateTime.IsAsc": sort == "time" ? false : undefined,
      "SortByName.IsAsc": sort == "name" ? true : undefined,
    });

    console.log("rsss", res);
    if (res?.code != 0) {
      setLoading(false);
      setList([]);
      return;
    }
    var data: ExamListDataResult = res.data;
    setList(data?.records ?? []);
    setTotal(data?.totalOfRecords ?? 0);

    setLoading(false);
  };

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
          (ch: ExamGroupData) => ch.idParent === e.id,
        );
        return { ...e, childs };
      });
      return list;
    }
  };

  const optionSelect = (examGroup ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );
  optionSelect.push({
    title: t("all_category"),
    value: "",
  });

  const getExaminationListByExamID = async (c: any[]) => {
    if (c?.length != 0) {
      var dataResults = await getExaminationTestList({
        "FilterByExamId.Name": "Name",
        "FilterByExamId.InValues": c[0],
        isIncludeExamVersion: false,
      });
      console.log("dataResults", dataResults);
      if (dataResults?.code != 0) {
        return;
      }
      var examinationIndex = list.findIndex(
        (g: ExaminationData) => g?.id == c[0],
      );
      var newValue = {
        ...list[examinationIndex],
        examinations: dataResults?.data?.records,
      };
      var newList = JSON.parse(JSON.stringify(list));
      newList[examinationIndex] = newValue;
      //var newList = list.splice(examinationIndex, 1, newValue);
      //setList(list.splice(examinationIndex, 1, newValue));
      setList(newList);
    }
  };

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [active, setActive] = useState<ExamData | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const handleDeleteExam = async () => {
    setDeleteLoading(true);
    var res: APIResults = await deleteExamination(active?.id);

    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      setDeleteLoading(false);
      return;
    }
    setDeleteLoading(false);
    setActive(undefined);
    setOpenDelete(false);
    loadExamList(false);
    successToast(res?.message ?? common.t("delete_success"));
  };

  const handlePublishExam = async (v: any) => {
    const childsList = (examGroup ?? []).reduce(
      (acc: any, va) => [...acc, ...(va?.childs ?? [])],
      [],
    );
    const group = (childsList ?? []).find((g: any) => g?.id === v?.idExamGroup);
    const result = await createExaminationVersion({
      data: v,
      examId: v.id,
      name: v.name,
      group_name: group?.name || "",
    });
    if (result.code === 0) {
      successToast(result?.message ?? common.t("success"));
    } else {
      errorToast(result?.message ?? "");
    }
  };

  return (
    <div className={`${hidden ? "hidden" : ""}`}>
      <ConfirmModal
        loading={deleteLoading}
        text={t("confirm_delete_exam")}
        open={openDelete}
        onCancel={() => {
          setActive(undefined);
          setOpenDelete(false);
        }}
        onOk={handleDeleteExam}
      />

      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("exam_list")}</div>
          <MButton
            h="h-11"
            onClick={() => {
              router.push("/exams/create");
            }}
            className="flex items-center"
            icon={<AddIcon />}
            type="secondary"
            text={common.t("create_new")}
          />
        </div>
        <div className="w-full mt-3 flex justify-around max-lg:flex-col items-start">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              setIndexPage(1);
              loadExamList(true);
            }}
          >
            <MInput
              value={search}
              onChange={(e: React.ChangeEvent<any>) => {
                setSearch(e.target.value);
              }}
              className=""
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
          </form>
          <MTreeSelect
            value={groupId}
            setValue={(name: any, e: any) => {
              setGroupId(e);
            }}
            allowClear={false}
            defaultValue=""
            id="category"
            name="category"
            placeholder=""
            h="h-11"
            className="lg:mx-4"
            options={optionSelect}
          />
          <MDropdown
            allowClear={false}
            value={sort}
            setValue={(n: any, value: any) => {
              setSort(value);
              setIndexPage(1);
            }}
            options={[
              { value: "name", label: t("sort_by_name") },
              {
                value: "time",
                label: t("sort_by_time"),
              },
            ]}
            h="h-11"
            className=""
            id="category"
            name="category"
          />
        </div>
        <Divider className="mt-1 mb-6" />
        <div className="w-full">
          {loading ? (
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
            list.map((v: ExamData, i: number) => {
              var childsList = (examGroup ?? []).reduce(
                (acc: any, va) => [...acc, ...(va?.childs ?? [])],
                [],
              );
              var group = (childsList ?? []).find(
                (g: any) => g?.id === v?.idExamGroup,
              );

              return (
                <Collapse
                  key={v?.id}
                  ghost
                  expandIconPosition="end"
                  className="mb-5  rounded-lg bg-white overflow-hidden "
                  onChange={(c: any) => {
                    getExaminationListByExamID(c);
                  }}
                >
                  <Collapse.Panel
                    key={v?.id as string}
                    header={
                      <div className="my-3  w-full flex flex-grow justify-between items-center">
                        <div>
                          <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                            {v?.name}
                          </div>
                          <div className=" w-full my-3 flex max-lg:flex-wrap">
                            <div className="flex">
                              <CupIcon />
                              <span className="body_regular_14 ml-2">
                                {v?.totalPoints} {t("point").toLowerCase()}
                              </span>
                            </div>
                            <div className="flex mx-8 body_regular_14">
                              <CalendarIcon />
                              <span className="ml-2 body_regular_14">
                                <FormattedDate
                                  value={v?.createdTime}
                                  day="2-digit"
                                  month="2-digit"
                                  year="numeric"
                                />
                              </span>
                            </div>
                            <div className="flex">
                              <LinkIcon />
                              <span className="ml-2 body_regular_14">{`${v?.numberOfTests} ${t(
                                "examination",
                              ).toLowerCase()}`}</span>
                            </div>
                            <div className="flex mx-8">
                              <MessIcon />
                              <span className="ml-2 body_regular_14">
                                {`${v?.numberOfQuestions} ${t(
                                  "question",
                                )?.toLowerCase()}`}
                              </span>
                            </div>
                            <div className="flex">
                              <FolderIcon />
                              <span className="ml-2 body_regular_14">
                                {group?.name ?? ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishExam(v);
                            }}
                          >
                            <Tooltip
                              placement="top"
                              title={t("push_exam_bank")}
                            >
                              <UploadOutlined className="text-2xl" />
                            </Tooltip>
                          </button>
                          <div className="w-3" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/exams/details/${v.id}`);
                            }}
                          >
                            <Tooltip placement="top" title={t("detail")}>
                              <ProfileOutlined className="text-2xl" />
                            </Tooltip>
                          </button>
                          <div className="w-3" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/exams/${v?.id}`);
                            }}
                          >
                            {" "}
                            <Tooltip placement="top" title={common.t("edit")}>
                              <EditBlackIcon />
                            </Tooltip>{" "}
                          </button>
                          <div className="w-3" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/examination/create?examId=${v?.id}`,
                              );
                            }}
                          >
                            <Tooltip
                              placement="top"
                              title={t("create_examination")}
                            >
                              <CopyIcon />
                            </Tooltip>{" "}
                          </button>
                          <div className="w-3" />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActive(v);
                              setOpenDelete(true);
                            }}
                          >
                            {" "}
                            <Tooltip placement="top" title={common.t("delete")}>
                              <DeleteRedIcon />
                            </Tooltip>
                          </button>
                        </div>
                      </div>
                    }
                  >
                    {v?.numberOfTests == 0 ? (
                      <div className="w-full text-m_error_500 italic text-sm">
                        {t("no_examination")}
                      </div>
                    ) : !v?.examinations || v?.examinations?.length == 0 ? (
                      <div>
                        <Spin />
                      </div>
                    ) : (
                      Array.from(v?.examinations).map(
                        (k: ExaminationData, i: number) => {
                          return (
                            <div
                              className="rounded-md px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  my-4 justify-between"
                              key={i}
                            >
                              <div>
                                <p className="body_semibold_14">{k?.name}</p>
                                <div className="flex">
                                  <Link
                                    target="_blank"
                                    href={k?.linkJoinTest ?? ""}
                                    className="text-m_neutral_900 underline underline-offset-4"
                                  >
                                    {k?.linkJoinTest}
                                  </Link>

                                  <button
                                    onClick={(e) => {
                                      copy(k?.linkJoinTest ?? "");
                                      toast(common.t("success_copy"));
                                    }}
                                    className="ml-4"
                                  >
                                    <SizeIcon />
                                  </button>
                                </div>
                              </div>

                              <div className="flex body_regular_14">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/examination/${k?.id}`);
                                  }}
                                  className="h-full "
                                >
                                  {t("setting")}
                                </button>
                                <div className="w-2" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/exams/examtest_results/${k?.id}?from=ExamList`,
                                    );
                                  }}
                                  className="h-full mx-2"
                                >
                                  {t("result")}
                                </button>
                              </div>
                            </div>
                          );
                        },
                      )
                    )}
                  </Collapse.Panel>
                </Collapse>
              );
            })
          )}
        </div>
        {list.length != 0 && (
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
                  setIndexPage(1);
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
      </div>
      <div className="h-16" />
    </div>
  );
}

export default ExamTestTab;
