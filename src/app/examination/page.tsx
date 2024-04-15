"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import MButton from "../components/config/MButton";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AddIcon from "../components/icons/add.svg";
import MInput from "../components/config/MInput";
import MDropdown from "../components/config/MDropdown";
import { Divider, Pagination, Popover, Select, Spin, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditBlackIcon from "../components/icons/edit-black.svg";
import DeleteRedIcon from "../components/icons/trash-red.svg";
import CopyIcon from "../components/icons/size.svg";
import LinkIcon from "../components/icons/link-2.svg";
import CalendarIcon from "../components/icons/calendar.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { AppovedState, ExamGroupData, ExaminationData } from "@/data/exam";
import copy from "copy-text-to-clipboard";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import MTreeSelect from "../components/config/MTreeSelect";
import {
  createExamination,
  deleteExaminationById,
  duplicateExamination,
  getExaminationTestList,
  updateExamination,
} from "@/services/api_services/examination_api";
import {
  errorToast,
  notifyToast,
  successToast,
} from "../components/toast/customToast";
import { ExaminationFormData } from "@/data/form_interface";
import { FormattedDate } from "react-intl";
import ConfirmModal from "../components/modals/ConfirmModal";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import SendExaminationInfo from "./modals/SendExaminationInfo";

function ExaminationPage() {
  const router = useRouter();
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const user = useAppSelector((state: RootState) => state.user.user);
  const examGroup = useAppSelector((state: RootState) => state.examGroup?.list);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState();
  const [groupId, setGroupId] = useState();
  const [sort, setSort] = useState("time");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamination(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, recordNum, indexPage, groupId, sort, status]);

  const loadExamination = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const dataExamination: APIResults = await getExaminationTestList(
      search
        ? {
            LockState:
              status === "Lock" || status === "Unlock" ? status : undefined,
            ApprovedState:
              status === "Approved" ||
              status === "Pending" ||
              status === "Rejected"
                ? status
                : undefined,
            isIncludeExamVersion: true,
            "FilterByName.Name": "Name",
            "FilterByName.InValues": search ?? undefined,
            "FilterByExamGroupId.InValues": !groupId ? undefined : groupId,
            "FilterByExamGroupId.Name": "Name",
            "Paging.RecordPerPage": recordNum,
            "Paging.StartIndex": indexPage, //(indexPage - 1) * recordNum,
            "SorterByName.isAsc": sort == "name" ? true : undefined,
            "SorterByCreateTime.IsAsc": sort == "time" ? false : undefined,
          }
        : {
            LockState:
              status === "Lock" || status === "Unlock" ? status : undefined,
            ApprovedState:
              status === "Approved" ||
              status === "Pending" ||
              status === "Rejected"
                ? status
                : undefined,

            isIncludeExamVersion: true,
            "FilterByExamGroupId.InValues": !groupId ? undefined : groupId,
            "FilterByExamGroupId.Name": "Name",
            "Paging.RecordPerPage": recordNum,
            "Paging.StartIndex": indexPage, //(indexPage - 1) * recordNum,
            "SorterByName.isAsc": sort == "name" ? true : undefined,
            "SorterByCreateTime.IsAsc": sort == "time" ? false : undefined,
          },
    );
    console.log("exminationlist", dataExamination);
    if (dataExamination?.code != 0) {
      setLoading(false);
      setList([]);
      errorToast(dataExamination?.message ?? "");
      return;
    }
    var data: any = dataExamination.data;
    setList(data?.records ?? []);
    setTotal(data?.totalOfRecords ?? 0);

    setLoading(false);
  };

  const genStateWidget = (state?: string) => {
    switch (state) {
      case "Rejected":
        return (
          <div className="p-2  rounded-lg bg-m_error_100 text-m_error_600">
            {t(state)}
          </div>
        );
      case "Pending":
        return (
          <div className="p-2  rounded-lg bg-m_warning_100 text-m_warning_700">
            {t(state)}
          </div>
        );
      case "Approved":
        return (
          <div className="p-2  rounded-lg bg-m_success_100 text-m_success_700">
            {t(state)}
          </div>
        );
      default:
        return null;
    }
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

  const dateFormat = "DD/MM/YYYY HH:mm";

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [active, setActive] = useState<ExaminationData | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const handleDeleteExam = async () => {
    setDeleteLoading(true);
    console.log("active", active);

    var res: APIResults = await deleteExaminationById(active?.id);

    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      setDeleteLoading(false);
      return;
    }
    setDeleteLoading(false);
    setActive(undefined);
    setOpenDelete(false);
    loadExamination(false);
    successToast(common.t("delete_success_examination"));
  };

  const [dupLoading, setDupLoading] = useState<boolean>(false);
  const [openDup, setOpenDup] = useState<boolean>(false);

  const handleDuplicate = async () => {
    setDupLoading(true);

    var data = await duplicateExamination({ ids: [active?.id as string] });
    if (data?.code != 0) {
      errorToast(data?.message ?? "");
      setActive(undefined);
      setDupLoading(false);
      return;
    }
    setDupLoading(false);
    successToast(common.t("success_create_new"));
    setActive(undefined);
    loadExamination(false);
    setOpenDup(false);
  };
  const [openPop, setOpenPop] = useState<string | undefined>();
  const [openExaminationInfo, setOpenExaminationInfo] =
    useState<boolean>(false);
  return (
    <HomeLayout>
      <SendExaminationInfo
        open={openExaminationInfo}
        onCancel={() => {
          setOpenExaminationInfo(false);
        }}
        onOk={() => {
          setOpenExaminationInfo(false);
        }}
      />
      <ConfirmModal
        action={common.t("duplicate")}
        loading={dupLoading}
        text={t("confirm_dup_examination")}
        open={openDup}
        onCancel={() => {
          setActive(undefined);
          setOpenDup(false);
        }}
        onOk={handleDuplicate}
      />
      <ConfirmModal
        loading={deleteLoading}
        text={t("confirm_delete_examination")}
        open={openDelete}
        onCancel={() => {
          setActive(undefined);
          setOpenDelete(false);
        }}
        onOk={handleDeleteExam}
      />

      <div className="h-4" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("examination_list")}</div>
          <MButton
            h="h-11"
            onClick={() => {
              router.push("/exams");
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
              loadExamination(true);
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
          <MDropdown
            value={status}
            setValue={(name: any, value: any) => {
              setStatus(value);
            }}
            placeholder={t("status")}
            options={[
              "Public",
              "Pending",
              "Approved",
              "Rejected",
              "Lock",
              "Unlock",
            ].map((e: any) => ({
              value: e,
              label: t(e),
            }))}
            h="h-11"
            className="ml-4"
            id="public_free"
            name="public_free"
          />
        </div>
        <Divider className="mt-1 mb-6" />

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
          Array.from(list).map((v: ExaminationData, i: number) => {
            console.log(
              "compare",
              dayjs(v?.validAccessSetting?.validTo).isAfter(Date()),
            );

            return (
              <div
                key={i}
                className="w-full p-3 min-h-[100px] mb-4 flex items-center justify-between rounded-lg bg-white"
              >
                <div className="flex max-lg:flex-col w-full lg:items-center justify-between">
                  <div className="flex-1 items-start justify-start flex-grow flex flex-col">
                    <div className="flex items-center ">
                      <div
                        className={`ml-1 mr-3 rounded-[50%] min-w-3 w-3 h-3 ${
                          v?.isActive &&
                          (!v?.validAccessSetting?.validTo ||
                            dayjs(v?.validAccessSetting?.validTo).isAfter(
                              Date(),
                            ))
                            ? "bg-m_success_500"
                            : "bg-m_neutral_300"
                        }`}
                      />
                      <div className="w-full flex justify-start">
                        <div className={`body_semibold_16`}>{v.name}</div>

                        <div
                          className={`ml-8 ${
                            v?.sharingSetting == "Public"
                              ? "text-[#366DFF]"
                              : "text-[#FF9736]"
                          }`}
                        >
                          {v?.sharingSetting === "Public" &&
                          v?.goldSetting?.isEnable &&
                          v?.goldSetting.goldPrice != 0
                            ? `#Public_${v?.goldSetting?.goldPrice}`
                            : v?.sharingSetting === "Public"
                              ? `#Public_Free`
                              : `#Private`}
                        </div>
                      </div>
                    </div>
                    <div className="w-full items-center justify-start my-3 flex max-lg:flex-wrap">
                      <div className="flex items-center">
                        <CalendarIcon />
                        <span className="body_regular_14 ml-2">
                          <FormattedDate
                            value={v?.createdTime}
                            day="2-digit"
                            month="2-digit"
                            year="numeric"
                          />
                        </span>
                      </div>
                      <div className="flex mx-4 items-center">
                        <span className="mx-4 body_regular_14">
                          {!v?.validAccessSetting?.validFrom &&
                          !v?.validAccessSetting?.validTo
                            ? t("no_limit_time")
                            : `${dayjs(v?.validAccessSetting?.validFrom).format(
                                dateFormat,
                              )} - ${dayjs(
                                v?.validAccessSetting?.validTo,
                              ).format(dateFormat)}`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="min-w-6">
                          <LinkIcon />
                        </div>

                        <button
                          onClick={() => {
                            copy(v?.linkJoinTest ?? "");
                            toast(common?.t("success_copy"));
                          }}
                          className="ml-2 body_regular_14 cursor-copy break-all"
                        >
                          {v?.linkJoinTest ?? ""}
                        </button>
                      </div>
                    </div>
                    <div className="body_semibold_14">
                      <span className="body_regular_14 mr-2">
                        {t("created_date")}:
                      </span>
                      {dayjs(v?.createdTime ?? "").format(dateFormat)}
                    </div>

                    <div className=" flex body_semibold_14 items-center w-full">
                      <div>
                        <span className="body_regular_14 mr-2">
                          {t("approved_date")}:
                        </span>
                        {dayjs(v?.createdTime ?? "").format(dateFormat)}
                      </div>
                      <div className="w-1/3" />
                      <div className="flex items-center">
                        <span className="body_regular_14 mr-2">
                          {t("status")}:{" "}
                        </span>
                        {genStateWidget(
                          v?.examVersion?.exam?.approvedState?.approvedState ??
                            "",
                        )}
                      </div>
                    </div>
                    {v?.examTestCode && (
                      <div className="body_regular_14 italic mt-3">
                        <span className="mr-2">{t("approve_code")}:</span>
                        {v?.examTestCode ?? ""}
                      </div>
                    )}
                  </div>
                  <div className="lg:flex ">
                    <div className="flex items-center mb-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          router.push(`/examination/${v?.id}`);
                        }}
                      >
                        <EditBlackIcon />
                      </button>
                      <div className="w-3" />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          setActive(v);
                          setOpenDup(true);
                        }}
                      >
                        <CopyIcon />
                      </button>
                      <div className="w-3" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (v?.sharingSetting === "Public") {
                            notifyToast(t("not_delete_public"));
                            return;
                          }
                          setActive(v);
                          setOpenDelete(true);
                        }}
                      >
                        <DeleteRedIcon />
                      </button>
                      <div className="mx-4">
                        <Switch
                          className="scale-[1.18]"
                          onChange={async (t: any) => {
                            console.log("t", t);

                            var data = await updateExamination({
                              ...v,
                              isActive: t,
                            });
                            if (data?.code != 0) {
                              errorToast(data?.message ?? "");
                              return;
                            }

                            loadExamination(false);
                          }}
                          value={v?.isActive ?? false}
                          size="small"
                        />
                      </div>
                    </div>
                    <div className="flex max-lg:mt-3">
                      <MButton
                        type="secondary"
                        text={t("result")}
                        h="h-9"
                        className="w-[114px]"
                      />
                      <div className="w-3" />
                      <Popover
                        open={openPop === v.id}
                        trigger={"click"}
                        placement="bottom"
                        content={
                          <div className="flex flex-col items-start">
                            <button
                              onClick={() => {
                                setOpenPop(undefined);
                                setOpenExaminationInfo(true);
                              }}
                              className="flex justify-start hover:bg-m_primary_100 p-1 rounded-sm w-full"
                            >
                              {t("send_exam_info")}
                            </button>

                            <button
                              onClick={() => {
                                setOpenPop(undefined);
                              }}
                              className="flex justify-start hover:bg-m_primary_100 p-1 rounded-sm w-full"
                            >
                              {t("send_result_info")}
                            </button>
                          </div>
                        }
                      >
                        <MButton
                          onClick={() => setOpenPop(v.id)}
                          text={t("send_info")}
                          h="h-9"
                          className=""
                        />
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {list.length != 0 && (
          <div className="w-full flex h-12 items-center  justify-center">
            <span className="body_regular_14 mr-2">{`${total} ${t(
              "result",
            )}`}</span>
            <Pagination
              i18nIsDynamicList
              pageSize={recordNum}
              onChange={(v) => {
                setIndexPage(v);
              }}
              current={indexPage}
              total={total}
              showSizeChanger={false}
            />
            <div className="hidden ml-2 h-12 lg:flex items-center">
              <Select
                optionRender={(oriOption) => (
                  <div className="flex justify-center">{oriOption?.label}</div>
                )}
                rootClassName="m-0 p-0"
                onChange={(v) => {
                  setRecordNum(v);
                }}
                defaultValue={15}
                options={[
                  ...[15, 25, 30, 50, 100].map((i: number) => ({
                    value: i,
                    label: (
                      <span className=" body_regular_14">{`${i}/${common.t(
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
    </HomeLayout>
  );
}

export default ExaminationPage;
