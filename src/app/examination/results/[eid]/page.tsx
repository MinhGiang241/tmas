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
import { useRouter } from "next/navigation";
import {
  exportExelFile,
  getOverViewExamination,
} from "@/services/api_services/examination_api";
import {
  Condition,
  ExamCompletionState,
  ExamTestResulstData,
  ExaminationData,
} from "@/data/exam";
import Chart from "./components/Chart";
import { getPagingAdminExamTestResult } from "@/services/api_services/result_exam_api";
import { saveAs } from "file-saver";
import axios from "axios";
import { errorToast } from "@/app/components/toast/customToast";

dayjs.extend(duration);

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
    var res = await getOverViewExamination(params.eid);
    if (res.code != 0) {
      return;
    }
    setExamination(res?.data?.records[0]);
    getListResults(res?.data?.records[0]);
  };

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
      group: undefined,
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

  useEffect(() => {
    getExaminationDetail();
  }, [filters, recordNum, indexPage]);

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
        <div className="w-full break-all  flex justify-start">
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
        <div className="w-full flex justify-start">{t("percent_complete")}</div>
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
        <div className="w-full flex justify-start">{t("complete_time")}</div>
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
      title: <div className="w-full flex justify-start">{t("test_date")}</div>,
      dataIndex: "test_date",
      key: "test_date",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {`${dayjs(text).format(dateFormat)}`}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="w-full flex justify-start">{t("status")}</div>,
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
      title: <div className="w-full flex justify-start">{t("email")}</div>,
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
      title: <div className="w-full flex justify-start">{t("phone")}</div>,
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
      title: <div className="w-full flex justify-start">{t("group")}</div>,
      dataIndex: "group",
      key: "group",
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
        <div className="w-full flex justify-start">{t("identify_code")}</div>
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
      title: <div className="w-full flex justify-start">{t("detail")}</div>,
      dataIndex: "detail",
      key: "detail",
      render: (text, data) => (
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              router.push(`/examination/results/${params?.eid}/${data?.id}`);
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
      console.log({ values });

      setFilterValues(values);
      for (let i in values) {
        console.log("i", i);
        if ((values as any)[i]) {
          switch (i) {
            case "email":
              setFilters([
                ...filters,
                {
                  fieldName: "$candidate.email",
                  value: values[i],
                  condition: Condition.eq,
                },
              ]);
              break;
            case "identify_code":
              setFilters([
                ...filters,
                {
                  fieldName: "identifier",
                  value: values[i],
                  condition: Condition.eq,
                },
              ]);
              break;
            case "group":
              setFilters([
                ...filters,
                {
                  fieldName: "group",
                  value: values[i],
                  condition: Condition.eq,
                },
              ]);
              break;
            case "full_name":
              setFilters([
                ...filters,
                {
                  fieldName: "full_name",
                  value: values[i],
                  condition: Condition.eq,
                },
              ]);
              break;
            case "phone_number":
              setFilters([
                ...filters,
                {
                  fieldName: "phone_number",
                  value: values[i],
                  condition: Condition.eq,
                },
              ]);
              break;
            case "test_date":
              setFilters([
                ...filters,
                {
                  fieldName: "start_date",
                  value:
                    values[i] && values[i]!.length >= 1
                      ? (values[i] as any)[0]
                      : undefined,
                  condition: Condition.lte,
                },
                {
                  fieldName: "end_date",
                  value:
                    values[i] && values[i]!.length >= 2
                      ? (values[i] as any)[2]
                      : undefined,
                  condition: Condition.lte,
                },
              ]);
              break;

            default:
              break;
          }
        }
      }
    },
  });

  return (
    <HomeLayout>
      <FilterModal
        clearFieldValue={async (fields: any) => {
          await formik.setFieldValue(fields, undefined);
          var cloneFilter: FormFilterValue = _.cloneDeep(filterValues);
          (cloneFilter as any)[fields] = undefined;
          setFilterValues(cloneFilter);
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
      <div className="h-3" />
      <MBreadcrumb
        items={[
          { text: t("exam_test"), href: "/examination" },
          {
            href: `/examination/result/${params?.eid}`,
            text: t("examination_result"),
            active: true,
          },
        ]}
      />
      <div className="flex justify-between  max-lg:flex-col max-lg:gap-3 max-lg:items-center max-lg:mx-5">
        <Chart
          data={[
            {
              label: "pass",
              name: t("pass"),
              value: examination?.statisticExamTest?.percentPass ?? 0,
            },
            {
              label: "not_pass",
              name: t("not_pass"),
              value: examination?.statisticExamTest?.percentFailed ?? 0,
            },
          ]}
        />
        <Chart
          data={[
            {
              label: "doing_exam",
              name: t("doing_exam"),
              value: examination?.statisticExamTest?.totalExamTestResult
                ? (examination?.statisticExamTest?.totalExamTestResult as any)[
                    ExamCompletionState.Doing
                  ] ?? 0
                : 0,
            },
            {
              label: "checking_exam",
              name: t("checking_exam"),
              value: examination?.statisticExamTest?.totalExamTestResult
                ? (examination?.statisticExamTest?.totalExamTestResult as any)[
                    ExamCompletionState.Checking
                  ] ?? 0
                : 0,
            },
            {
              label: "done_exam",
              name: t("done_exam"),
              value: examination?.statisticExamTest?.totalExamTestResult
                ? (examination?.statisticExamTest?.totalExamTestResult as any)[
                    ExamCompletionState.Done
                  ] ?? 0
                : 0,
            },
          ]}
        />
        <Chart
          data={[
            {
              label: "correct_answer",
              name: t("correct_answer"),
              value: examination?.statisticExamTest?.percentAnwserCorrect ?? 0,
            },
            {
              label: "incorrect_answer",
              name: t("incorrect_answer"),
              value: examination?.statisticExamTest?.percentAnwserCorrect ?? 0,
            },
            {
              label: "not_answer",
              name: t("not_answer"),
              value: examination?.statisticExamTest?.percentNotAnwser ?? 0,
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
        {/* <div className="h-5" /> */}
        <div className="flex flex-wrap">
          <Divider className="my-4" />
          {Object.keys(filterValues).map((e) => {
            if (!(filterValues as any)[e]) {
              return null;
            }
            return (
              <div
                key={e}
                className="flex py-2 px-3 border border-m_neutral_200 ml-2 mb-2 rounded-lg items-center bg-m_primary_100"
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
                          ...filters?.filter((d) => d.fieldName != "email"),
                        ]);
                        break;
                      case "group":
                        setFilters([
                          ...filters?.filter((d) => d.fieldName != "group"),
                        ]);
                        break;
                      case "phone_number":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "phone_number",
                          ),
                        ]);
                        break;
                      case "full_name":
                        setFilters([
                          ...filters?.filter((d) => d.fieldName != "full_name"),
                        ]);
                        break;
                      case "identify_code":
                        setFilters([
                          ...filters?.filter(
                            (d) => d.fieldName != "identifier",
                          ),
                        ]);
                        break;
                      case "test_date":
                        setFilters([
                          ...filters?.filter(
                            (d) =>
                              d.fieldName != "start_date" &&
                              d.fieldName != "end_date",
                          ),
                        ]);
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
        <div className="h-5" />
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
