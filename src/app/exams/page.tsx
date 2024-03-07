"use client";
import React, { useEffect, useState } from "react";
import HomeLayout from "../layouts/HomeLayout";
import MInput from "../components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import { useSSR, useTranslation } from "react-i18next";
import MDropdown from "../components/config/MDropdown";
import { Collapse, Divider, Pagination, Select, Spin } from "antd";
import EditBlackIcon from "../components/icons/edit-black.svg";
import DeleteRedIcon from "../components/icons/trash-red.svg";
import CopyIcon from "../components/icons/export.svg";
import CupIcon from "../components/icons/cup.svg";
import FolderIcon from "../components/icons/folder.svg";
import LinkIcon from "../components/icons/link-2.svg";
import CalendarIcon from "../components/icons/calendar.svg";
import MessIcon from "../components/icons/message-question.svg";
import MButton from "../components/config/MButton";
import AddIcon from "../components/icons/add.svg";
import SizeIcon from "../components/icons/size.svg";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import MTreeSelect from "../components/config/MTreeSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ExamData, ExamGroupData, ExamListDataResult } from "@/data/exam";
import {
  fetchDataExamGroup,
  setExamGroupList,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { errorToast, successToast } from "../components/toast/customToast";
import {
  deleteExamination,
  getExaminationList,
} from "@/services/api_services/examination_api";
import { FormattedDate } from "react-intl";
import ConfirmModal from "../components/modals/ConfirmModal";

function ExamsPage() {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  const examGroup = useSelector((state: RootState) => state.examGroup?.list);

  const [examList, setExamList] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
      loadExamList(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [list, setList] = useState<ExamData[]>([]);

  const loadExamList = async (init: boolean) => {
    if (init) {
      setLoading(true);
    }
    const res: APIResults = await getExaminationList({
      "Paging.RecordPerPage": recordNum,
      "Paging.StartIndex": (indexPage - 1) * recordNum,
      StudioId: user?.studio?._id,
    });
    console.log("rsss", res);
    if (res?.code != 0) {
      setLoading(false);
      setExamList([]);
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

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [active, setActive] = useState<ExamData | undefined>(undefined);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const handleDeleteExam = async () => {
    setDeleteLoading(true);
    var res: APIResults = await deleteExamination(
      active?.id,
      user?.studio?._id,
    );

    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      setDeleteLoading(false);
      return;
    }
    setDeleteLoading(false);
    setActive(undefined);
    setOpenDelete(false);
    loadExamList(false);
    successToast(common.t("delete_success"));
  };

  return (
    <HomeLayout>
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
      <div className="h-4" />
      <div className="w-full max-lg:px-3">
        <div className="body_semibold_20 mt-3 w-full flex  justify-between items-center ">
          <div className="">{t("exam_list")}</div>
          <MButton
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
          <MInput
            onChange={(e: React.ChangeEvent<any>) => {}}
            className=""
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
          <MTreeSelect
            allowClear={false}
            defaultValue=""
            id="category"
            name="category"
            placeholder=""
            h="h-11"
            className="lg:mx-4"
            options={optionSelect}
          />
          <MDropdown h="h-11" className="" id="category" name="category" />
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
                >
                  <Collapse.Panel
                    key={"saddas"}
                    header={
                      <div className="my-3  w-full flex flex-grow justify-between items-center">
                        <div>
                          <div className=" body_semibold_16 text-m_neutral_900 overflow-hidden text-nowrap lg:max-w-4xl md:max-w-lg  text-ellipsis">
                            {v?.name}
                          </div>
                          <div className="w-full my-3 flex max-lg:flex-wrap">
                            <div className="flex">
                              <CupIcon />
                              <span className="ml-2">
                                {v?.totalPoints} điểm
                              </span>
                            </div>
                            <div className="flex mx-8">
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
                              <LinkIcon />
                              <span className="ml-2">0 đợt thi</span>
                            </div>
                            <div className="flex mx-8">
                              <MessIcon />
                              <span className="ml-2">0 câu hỏi</span>
                            </div>
                            <div className="flex">
                              <FolderIcon />
                              <span className="ml-2">{group?.name ?? ""}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex ">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <EditBlackIcon />
                          </button>
                          <div className="w-3" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/examination/create");
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
                      </div>
                    }
                  >
                    {true ? (
                      <div className="w-full text-m_error_500 italic text-sm">
                        {t("no_examination")}
                      </div>
                    ) : (
                      Array.from({ length: 2 }).map((v: any, i: number) => {
                        return (
                          <div
                            className="rounded-md px-4 text-wrap flex lg:min-h-[60px] min-h-[52px] items-center w-full bg-m_neutral_100 flex-wrap  my-4 justify-between"
                            key={i}
                          >
                            <div>
                              <p className="body_semibold_14">
                                {"Đợt tuyển dụng đầu năm"}
                              </p>
                              <div className="flex">
                                <p className="underline underline-offset-4">
                                  https://tmas.vn/t/cEhfdyuerka
                                </p>
                                <SizeIcon />
                              </div>
                            </div>

                            <div className="flex body_regular_14">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="h-full "
                              >
                                {t("setting")}
                              </button>
                              <div className="w-2" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="h-full mx-2"
                              >
                                {t("result")}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </Collapse.Panel>
                </Collapse>
              );
            })
          )}
        </div>
        {!loading && list.length != 0 && (
          <div className="w-full flex lg:justify-between justify-center">
            <div className="hidden lg:flex items-center">
              <span className="body_regular_14 mr-2">{`${total} ${t(
                "result",
              )}`}</span>
              <Select
                value={recordNum}
                onChange={(v) => {
                  setRecordNum(v);
                }}
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

export default ExamsPage;
