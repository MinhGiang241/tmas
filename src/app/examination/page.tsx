"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import MButton from "../components/config/MButton";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AddIcon from "../components/icons/add.svg";
import MInput from "../components/config/MInput";
import MDropdown from "../components/config/MDropdown";
import { Divider, Pagination, Select, Spin, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditBlackIcon from "../components/icons/edit-black.svg";
import DeleteRedIcon from "../components/icons/trash-red.svg";
import CopyIcon from "../components/icons/size.svg";
import LinkIcon from "../components/icons/link-2.svg";
import CalendarIcon from "../components/icons/calendar.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamGroupData, ExaminationData } from "@/data/exam";
import { useDispatch } from "react-redux";
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
  getExaminationTestList,
  updateExamination,
} from "@/services/api_services/examination_api";
import { errorToast, successToast } from "../components/toast/customToast";
import { ExaminationFormData } from "@/data/form_interface";
import { FormattedDate } from "react-intl";
import ConfirmModal from "../components/modals/ConfirmModal";
import dayjs from "dayjs";

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamination(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, recordNum, indexPage, groupId, sort]);

  const loadExamination = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const dataExamination: APIResults = await getExaminationTestList({
      "FilterByName.InValues": search,
      "FilterByExamGroupId.InValues": !groupId ? undefined : groupId,
      "FilterByExamGroupId.Name": "Name",
      "Paging.RecordPerPage": recordNum,
      "Paging.StartIndex": (indexPage - 1) * recordNum,
      "SorterByName.isAsc": sort == "name" ? true : undefined,
      "SorterByCreateTime.IsAsc": sort == "time" ? true : undefined,
    });
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

  return (
    <HomeLayout>
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
          />{" "}
          <MDropdown
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
            return (
              <div
                key={i}
                className="w-full p-3 min-h-[100px] mb-4 flex items-center justify-between rounded-lg bg-white"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex-1 items-start justify-start flex-grow flex flex-col">
                    <div className="flex items-center ">
                      <div
                        className={`ml-1 mr-3 rounded-[50%] w-3 h-3 ${
                          v?.isActive ? "bg-m_success_500" : "bg-m_neutral_300"
                        }`}
                      />
                      <div className="body_semibold_16">{v.name}</div>
                    </div>
                    <div className="w-full justify-start my-3 flex max-lg:flex-wrap">
                      <div className="flex ">
                        <CalendarIcon />
                        <span className="ml-2">
                          <FormattedDate
                            value={v?.createdTime}
                            day="2-digit"
                            month="2-digit"
                            year="numeric"
                          />
                        </span>
                      </div>
                      <div className="flex">
                        <span className="mx-4">
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
                      <div className="flex">
                        <LinkIcon />

                        <span className="ml-2">{v?.linkJoinTest ?? ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ">
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
                        var submitData: ExaminationFormData = {
                          ...v,
                          name: v?.name + " Copy",
                        };

                        var data = await createExamination(submitData);
                        if (data?.code != 0) {
                          errorToast(data?.message ?? "");
                          return;
                        }
                        successToast(common.t("success_create_new"));
                        loadExamination(false);
                      }}
                    >
                      <CopyIcon />
                    </button>
                    <div className="w-3" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(v);
                        setOpenDelete(true);
                      }}
                    >
                      <DeleteRedIcon />
                    </button>
                  </div>
                  <div className="mx-4">
                    <Switch
                      onChange={async (t: any) => {
                        console.log("t", t);

                        await updateExamination({ ...v, isActive: t });
                        loadExamination(false);
                      }}
                      value={v?.isActive ?? false}
                      size="small"
                    />
                  </div>
                  <MButton text={t("result")} h="h-9" className="w-[114px]" />
                </div>
              </div>
            );
          })
        )}
        {list.length != 0 && (
          <div className="w-full flex lg:justify-between justify-center">
            <div className="hidden lg:flex items-center">
              <span className="body_regular_14 mr-2">{`${total} ${t(
                "result",
              )}`}</span>
              <Select
                onChange={(v) => {
                  setRecordNum(v);
                }}
                defaultValue={15}
                options={[
                  ...[15, 25, 30, 50, 100].map((i: number) => ({
                    value: i,
                    label: (
                      <span className="body_regular_14">{`${i}/${common.t(
                        "page",
                      )}`}</span>
                    ),
                  })),
                ]}
                className="min-w-[124px]"
              />
            </div>
            <Pagination
              pageSize={recordNum}
              onChange={(v) => {
                setIndexPage(v);
              }}
              current={indexPage}
              total={total}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default ExaminationPage;
