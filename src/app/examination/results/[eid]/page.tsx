/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Divider, Pagination, Select, Table } from "antd";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _, { keys } from "lodash";
import MButton from "@/app/components/config/MButton";
import DownloadIcon from "@/app/components/icons/download.svg";
import FilterIcon from "@/app/components/icons/filter.svg";
import EyeIcon from "@/app/components/icons/eye.svg";
import EditIcon from "@/app/components/icons/edit-black.svg";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import FilterModal from "./components/FilterModal";
import { FormikErrors, useFormik } from "formik";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import {
  exportExelFile,
  getOverViewExamination,
} from "@/services/api_services/examination_api";
import {
  Condition,
  ExamCompletionState,
  ExamGroupData,
  ExamTestResulstData,
  ExaminationData,
} from "@/data/exam";
import Chart from "./components/Chart";
import { getPagingAdminExamTestResult } from "@/services/api_services/result_exam_api";
import { saveAs } from "file-saver";
import axios from "axios";
import { errorToast } from "@/app/components/toast/customToast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import examGroupSlice, {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { APIResults } from "@/data/api_results";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function ResultPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const dateFormat = "HH:mm DD/MM/YYYY";
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(1);
  const router = useRouter();

  interface TableValue {
    id?: string;
    full_name?: string;
    percent_complete?: string;
    point?: number;
    complete_time?: string;
    test_date?: string;
    status?: string;
    email?: string;
    phone?: string;
    group?: string;
    identify_code?: string;
    seconds?: number;
  }
  interface FilterObject {
    fieldName?: string;
    value?: any;
    condition?: Condition;
  }

  const [infos, setInfos] = useState<TableValue[]>([]);
  const [filters, setFilters] = useState<FilterObject[]>([]);

  const [examination, setExamination] = useState<ExaminationData | undefined>();

  const getExaminationDetail = async () => {
    var res = await getOverViewExamination(params.eid, false);
    if (res.code != 0) {
      return;
    }
    setExamination(res?.data?.records[0]);
    getListResults(res?.data?.records[0]);
  };
  const examGroups = useAppSelector(
    (state: RootState) => state?.examGroup?.list,
  );
  const getListResults = async (examTest?: ExaminationData) => {
    var res = await getPagingAdminExamTestResult({
      paging: {
        recordPerPage: recordNum,
        startIndex: indexPage,
      },
      filters: [
        {
          fieldName: "idExamTest",
          value: examTest?.id,
          condition: Condition.eq,
        },
        ...filters,
      ],
    });
    if (res.code != 0) {
      return;
    }
    var data: ExamTestResulstData[] = res.data?.records;
    var s = data?.map<TableValue>((e) => ({
      id: e.id,
      email: e?.candidate?.email,
      full_name: e?.candidate?.fullName,
      identify_code: e?.candidate?.identifier,
      point: e?.result?.score,
      complete_time: e?.timeLine?.mustStopDoTestAt ?? e?.timeLine?.commitTestAt,
      test_date: e?.timeLine?.startDoTestAt,
      percent_complete: `${e?.result?.percentComplete} %`,
      phone: e?.candidate?.phoneNumber,
      status: e?.result?.completionState,
      seconds: e?.timeLine?.totalTimeDoTestSeconds,
      group: e?.candidate?.groupTest,
    }));

    setTotal(res?.data?.totalOfRecords);
    setInfos(s);
    console.log("esss", res);
  };

  const [filterValues, setFilterValues] = useState<FormFilterValue>({});
  const downloadExcell = async () => {
    var res = await exportExelFile(params.eid);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    saveAs(res?.data, "data.xlsx");
  };

  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const chilGroups = examGroups?.reduce(
    (a: any, b: any) => [...a, ...(b.childs ?? [])],
    [],
  );

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

  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,

      title: <div className="w-full flex justify-start">{t("STT")}</div>,
      dataIndex: "stt",
      key: "stt",
      render: (text, data, index) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {index + 1}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="min-w-36 w-full break-all  flex justify-start">
          {t("full_name")}
        </div>
      ),
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <p
          key={text}
          className="w-full break-all flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="min-w-32 w-full flex justify-start">
          {t("percent_complete")}
        </div>
      ),
      dataIndex: "percent_complete",
      key: "complete_percent",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="w-full flex justify-start">{t("point")}</div>,
      dataIndex: "point",
      key: "point",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,

      title: (
        <div className="min-w-32 flex justify-start">{t("complete_time")}</div>
      ),
      dataIndex: "complete_time",
      key: "complete_time",
      render: (text, data) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {`${dayjs.duration((data?.seconds ?? 0) * 1000).format("HH:mm:ss")}`}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="min-w-32 w-full flex justify-start">
          {t("test_date")}
        </div>
      ),
      dataIndex: "test_date",
      key: "test_date",
      render: (text) => (
        <p
          key={text}
          className="w-full flex  min-w-32 justify-start caption_regular_14"
        >
          {`${dayjs(text).format("HH:mm:ss DD/MM/YYYY")}`}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="min-w-32 w-full flex justify-start">{t("status")}</div>
      ),
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {t(text)}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="min-w-36 w-full flex justify-start">{t("email")}</div>
      ),
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="min-w-32 w-full flex justify-start">{t("phone")}</div>
      ),
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="min-w-24 w-full flex justify-start">{t("group")}</div>
      ),
      dataIndex: "group",
      key: "group",
      render: (text) => {
        return (
          <p
            key={text}
            className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
          >
            {text}
          </p>
        );
      },
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="min-w-24 w-full flex justify-start">
          {t("identify_code")}
        </div>
      ),
      dataIndex: "identify_code",
      key: "identify-code",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="min-w-24 w-full flex justify-start">{t("detail")}</div>
      ),
      dataIndex: "detail",
      key: "detail",
      render: (text, data) => (
        <div className="w-full flex justify-start">
          <button
            onClick={() => {
              from == "ExamList"
                ? router.push(
                    `/exams/examtest_results/${params?.eid}/${data?.id}?from=${from}`,
                  )
                : router.push(
                    `/examination/results/${params?.eid}/${data?.id}?from=${from}`,
                  );
            }}
          >
            <EyeIcon />
          </button>
        </div>
      ),
    },
  ];
  const [openFilter, setOpenFilter] = useState(false);

  interface FormFilterValue {
    email?: string;
    identify_code?: string;
    full_name?: string;
    group?: string;
    phone_number?: string;
    test_date?: string[];
  }
  const validate = (values: FormFilterValue) => {
    const errors: FormikErrors<FormFilterValue> = {};
    return errors;
  };
  const formik = useFormik({
    initialValues: {},
    validate,
    onSubmit: (values: FormFilterValue) => {
      console.log("values", values);

      var valuesClone = _.cloneDeep(values);
      setFilterValues(valuesClone);
      var newFilters = [];
      for (let i in values) {
        if (!!(values as any)[i]) {
          switch (i) {
            case "email":
              newFilters.push({
                fieldName: "candidate.email",
                value: `/${values[i]?.trim()}/i`,
                condition: Condition.regex,
              });
              break;
            case "identify_code":
              newFilters.push({
                fieldName: "candidate.identifier",
                value: `/${values[i]?.trim()}/i`,
                condition: Condition.regex,
              });

              break;
            case "group":
              newFilters.push({
                fieldName: "candidate.groupTest",
                value: `/${values[i]?.trim()}/i`,
                condition: Condition.regex,
              });

              break;
            case "full_name":
              newFilters.push({
                fieldName: "candidate.unsignedFullName",
                value: `/${values[i]?.trim()}/i`,
                condition: Condition.regex,
                ConvertTextToUnsigned: true,
              });

              break;
            case "phone_number":
              newFilters.push({
                fieldName: "candidate.phoneNumber",
                value: `/${values[i]?.trim()}/i`,
                condition: Condition.regex,
              });

              break;
            case "test_date":
              var gte = {
                fieldName: "createdTime",
                value:
                  values[i] && values[i]!.length >= 1
                    ? `${dayjs(
                        (values[i] as any)[0],
                        "DD/MM/YYYY",
                      ).toISOString()}`
                    : undefined,
                condition: Condition.gte,
              };
              console.log("gte", gte);
              var lt = {
                fieldName: "createdTime",
                value:
                  values[i] && values[i]!.length >= 2
                    ? `${dayjs((values[i] as any)[1], "DD/MM/YYYY")
                        ?.add(1, "day")
                        ?.toISOString()}`
                    : undefined,
                condition: Condition.lt,
              };
              console.log("lt", gte, lt);
              newFilters.push(gte);
              newFilters.push(lt);
              break;

            default:
              break;
          }
        }
      }
      setFilters(newFilters);
    },
  });
  const search = useSearchParams();
  var from = search.get("from");
  const [testDate, setTestDate] = useState<string | undefined>();
  useEffect(() => {
    getExaminationDetail();
    if (user?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
    }
  }, [user, filters, testDate, recordNum, indexPage]);

  return (
    <HomeLayout>
      <FilterModal
        clearFieldValue={async (fields: any) => {
          await formik.setFieldValue(fields, undefined);
          var cloneFilter: FormFilterValue = _.cloneDeep(filterValues);
          (cloneFilter as any)[fields] = undefined;
          setFilterValues(cloneFilter);
          switch (fields) {
            case "email":
              setFilters([
                ...filters?.filter((d) => d.fieldName != "candidate.email"),
              ]);
              break;
            case "group":
              setFilters([
                ...filters?.filter((d) => d.fieldName != "candidate.groupTest"),
              ]);
              break;
            case "phone_number":
              setFilters([
                ...filters?.filter(
                  (d) => d.fieldName != "candidate.phoneNumber",
                ),
              ]);
              break;
            case "full_name":
              setFilters([
                ...filters?.filter(
                  (d) => d.fieldName != "candidate.unsignedFullName",
                ),
              ]);
              break;
            case "identify_code":
              setFilters([
                ...filters?.filter(
                  (d) => d.fieldName != "candidate.identifier",
                ),
              ]);
              break;
            case "test_date":
              setFilters([
                ...filters?.filter((d) => d.fieldName != "createdTime"),
              ]);
              setTestDate(undefined);
              break;
          }
        }}
        formik={formik}
        open={openFilter}
        onOk={() => {
          formik.handleSubmit();
          setOpenFilter(false);
        }}
        onCancel={() => {
          setOpenFilter(false);
        }}
      />
      <div className="h-5" />
      <MBreadcrumb
        items={[
          {
            text: from == "ExamList" ? t("exam_list") : t("exam_test"),
            href: from == "ExamList" ? "/exams" : "/examination",
          },
          {
            href:
              from == "EditExam"
                ? `/examination/${params?.eid}`
                : `/examination/results/${params?.eid}?from=${from}`,
            text: from == "EditExam" ? examination?.name : examination?.name,
            active: from != "EditExam",
          },
          {
            href: `/examination/results/${params?.eid}?from=${from}`,
            text: t("view_result"),
            active: true,
            hidden: from != "EditExam",
          },
        ]}
      />
      <div className="body_bold_20 mb-5">
        {t("result_examnination_evaluation")?.toUpperCase()}
      </div>
      <div className="grid grid-cols-3 gap-5 w-full  mb-5">
        <div className="col-span-1 rounded-lg   bg-white mr-[7px]">
          <div className=" w-full flex p-5 items-center">
            <div className="w-1/3 text-5xl">😊</div>
            <div className="w-2/3 flex flex-col items-start">
              <div>{t("examination_expect")}</div>
              <div className={`text-m_warning_500 title_semibold_24 `}>
                {t("not_expected")}
              </div>
            </div>
          </div>
          <div className="h-8 body_semibold_14 w-full bg-neutral-300 flex justify-start pl-5 items-center">
            {t("result")}
          </div>
          <div className="mt-5 my-5 grid grid-cols-3 gap-3 w-full ">
            <div className="ml-3 p-3 border rounded-lg h-20 flex flex-col justify-center items-center col-span-1">
              <div>{t("require")}</div>
              <div className="title_semibold_20 text-m_primary_500">{"10"}</div>
            </div>
            <div className="mr-3 p-3 border rounded-lg h-20 col-span-2 flex flex-col">
              <div className="w-full text-center">{t("actual")}</div>
              <div className="flex justify-between mx-3">
                <div className="flex items-center">
                  <span>{t("pass")}</span>
                  <span className="ml-1 body_semibold_14 text-m_primary_500">
                    {"8"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span>{t("account_for")}</span>
                  <span className="ml-1 body_semibold_14 text-m_primary_500">
                    {"8"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-lg  bg-white  ">
          <div className="px-5 pt-5 flex w-full justify-between items-center">
            <div>{t("overvie_judgement")}</div>
            <button>
              <EditIcon />
            </button>
          </div>

          <Divider className="my-2" />
          <div className=" mx-5 h-44 overflow-y-scroll scroll-smooth break-all ">
            {""}
          </div>
        </div>
      </div>

      <div className="flex justify-between  max-lg:flex-col max-lg:gap-3 max-lg:items-center max-lg:mx-5">
        <Chart
          data={[
            {
              label: "pass",
              name: t("pass"),
              value: examination?.statisticExamTest?.statistic?.totalPass ?? 0,
            },
            {
              label: "not_pass",
              name: t("not_pass"),
              value:
                examination?.statisticExamTest?.statistic?.totalFailed ?? 0,
            },
          ]}
        />
        <Chart
          data={[
            {
              label: "doing_exam",
              name: t("doing_exam"),
              value:
                examination?.statisticExamTest?.statistic?.completionByState
                  ?.totalDoing,
            },
            {
              label: "checking_exam",
              name: t("checking_exam"),
              value:
                examination?.statisticExamTest?.statistic?.completionByState
                  ?.totalChecking,
            },
            {
              label: "done_exam",
              name: t("done_exam"),
              value:
                examination?.statisticExamTest?.statistic?.completionByState
                  ?.totalDone,
            },
          ]}
        />
        <Chart
          data={[
            {
              label: "correct_answer",
              name: t("correct_answer"),
              value:
                examination?.statisticExamTest?.couter
                  ?.numberOfQuestionCorrect ?? 0,
            },
            {
              label: "incorrect_answer",
              name: t("incorrect_answer"),
              value:
                (examination?.statisticExamTest?.couter?.numberOfQuestions ??
                  0) -
                (examination?.statisticExamTest?.couter
                  ?.numberOfQuestionNotComplete ?? 0) -
                (examination?.statisticExamTest?.couter
                  ?.numberOfQuestionCorrect ?? 0),
            },
            {
              label: "not_answer",
              name: t("not_answer"),
              value:
                examination?.statisticExamTest?.couter
                  ?.numberOfQuestionNotComplete ?? 0,
            },
          ]}
        />
      </div>
      <div className="w-full p-3 bg-white rounded-lg mt-5">
        <div className="flex items-center w-full justify-between">
          <div className="body_semibold_20">{t("list")}</div>
          <div className="flex">
            <MButton
              onClick={() => {
                setOpenFilter(true);
              }}
              className="flex items-center"
              icon={<FilterIcon />}
              h="h-11"
              type="secondary"
              text={t("advance_filter")}
            />
            <div className="w-3" />
            <MButton
              onClick={downloadExcell}
              className="flex items-center"
              icon={<DownloadIcon />}
              h="h-11"
              type="secondary"
              text={t("download_file")}
            />
          </div>
        </div>
        <div className="h-2" />
        <div className="flex flex-wrap">
          {Object.keys(filterValues).map((e) => {
            if (!(filterValues as any)[e]) {
              return null;
            }

            return (
              <div
                key={e}
                className="flex mb-1 py-2 px-3 border border-m_neutral_200 ml-2 rounded-lg items-center bg-m_primary_100"
              >
                <span className="body_semibold_14 mr-1">{`${t(e)}: `}</span>
                <span className="body_regular_14">
                  {" "}
                  {`${
                    e == "test_date"
                      ? (filterValues as any)[e].join(" - ")
                      : (filterValues as any)[e]
                  }`}
                </span>
                <button
                  className="ml-2"
                  onClick={async () => {
                    const formikValue = _.cloneDeep(formik.values);
                    await formik.setFieldValue(e, undefined);
                    (formikValue as any)[e] = undefined;
                    switch (e) {
                      case "email":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "candidate.email",
                          ),
                        ]);
                        break;
                      case "group":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "candidate.groupTest",
                          ),
                        ]);
                        break;
                      case "phone_number":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "candidate.phoneNumber",
                          ),
                        ]);
                        break;
                      case "full_name":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "candidate.unsignedFullName",
                          ),
                        ]);
                        break;
                      case "identify_code":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "candidate.identifier",
                          ),
                        ]);
                        break;
                      case "test_date":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "createdTime",
                          ),
                        ]);
                        setTestDate(undefined);
                        break;
                    }
                    await setFilterValues(formikValue);
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            );
          })}
        </div>
        <Divider className="mb-7" />
        <div className="overflow-scroll ">
          <Table
            className="w-full max-lg:overflow-scroll"
            bordered={false}
            columns={columns}
            dataSource={infos}
            pagination={false}
            rowKey={"id"}
            onRow={(data: any, index: any) =>
              ({
                style: {
                  background: "#FFFFFF",
                  borderRadius: "20px",
                },
              }) as HTMLAttributes<any>
            }
          />
        </div>
        <div className="w-full flex items-center justify-center mt-5">
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
      </div>
    </HomeLayout>
  );
}

export default ResultPage;
