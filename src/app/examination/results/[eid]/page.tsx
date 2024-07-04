/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Divider, Pagination, Select, Table, TableColumnsType } from "antd";
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
  getAbilityDataChart,
  getAbilityReport,
  getCandidateRankReport,
  getExpectationReport,
  getOverViewExamination,
  getQuestionPartDetails,
  updateOverallConclusion,
} from "@/services/api_services/examination_api";
import {
  Condition,
  ExamCompletionState,
  ExamGroupData,
  ExamTestResulstData,
  ExaminationData,
  ExpectedReportData,
  QuestionPartDetailsData,
  QuestionPartTableValue,
  TableStatisticalReportData,
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
import MTable, { TableDataRow } from "@/app/components/config/MTable";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import MTextArea from "@/app/components/config/MTextArea";
import { FormattedDate, FormattedNumber } from "react-intl";
import MInput from "@/app/components/config/MInput";

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function ResultPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const dateFormat = "HH:mm DD/MM/YYYY";
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(1);
  const [isEditJudge, setIsEditJudge] = useState<boolean>(false);
  const [abilityData, setAbilityData] = useState<TableStatisticalReportData[]>(
    [],
  );
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
    rank?: string;
  }
  interface FilterObject {
    fieldName?: string;
    value?: any;
    condition?: Condition;
  }

  const [infos, setInfos] = useState<TableValue[]>([]);
  const [filters, setFilters] = useState<FilterObject[]>([]);
  const [overall, setOverAll] = useState<string | undefined>();

  const [examination, setExamination] = useState<ExaminationData | undefined>();

  const getExaminationDetail = async () => {
    var res = await getOverViewExamination(params.eid, false);
    if (res.code != 0) {
      return;
    }

    setExamination(res?.data?.records[0]);
    getListResults(res?.data?.records[0]);

    setOverAll(res?.data?.records[0]?.overallConclusion);
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
      rank: e?.result?.rankLabel,
    }));

    setTotal(res?.data?.totalOfRecords);
    setInfos(s);
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

  const listRow: TableDataRow[] = [];

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
      title: (
        <div className="min-w-32 w-full flex justify-start">{t("rank")}</div>
      ),
      dataIndex: "rank",
      key: "rank",
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
  const [partDataChart, setPartDataChart] = useState([]);
  const [rankData, setRankData] = useState([]);
  const [expectedData, setExpectedData] = useState<
    ExpectedReportData | undefined
  >();
  const [questionPartDetail, setQuestionPartDetails] = useState<
    QuestionPartDetailsData[]
  >([]);

  const getQuestionPartDetail = async () => {
    const res = await getQuestionPartDetails(params.eid);
    if (res?.code != 0) {
      return;
    }
    setQuestionPartDetails(res?.data);
  };

  const getAbilityReportTable = async () => {
    const res = await getAbilityReport(params.eid);
    if (res?.code != 0) {
      return;
    }
    setAbilityData(res?.data);
  };

  const getPartDataChart = async () => {
    const res = await getAbilityDataChart(params.eid);
    if (res?.code != 0) {
      return;
    }
    setPartDataChart(res?.data);
  };

  const getExpectationReportData = async () => {
    const res = await getExpectationReport(params.eid);
    if (res?.code != 0) {
      return;
    }
    setExpectedData(res?.data);
  };

  const getCandidateRankReportData = async () => {
    const res = await getCandidateRankReport(params.eid);
    console.log("res ability", res);
    if (res?.code != 0) {
      return;
    }
    setRankData(res?.data);
  };

  useEffect(() => {
    getQuestionPartDetail();
    getAbilityReportTable();
    getPartDataChart();
    getCandidateRankReportData();
    getExpectationReportData();
  }, [user]);

  useEffect(() => {
    getExaminationDetail();
    if (user?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
    }
  }, [user, filters, testDate, recordNum, indexPage]);

  const [colors, setColors] = useState(["#6DB3C2", "#FC8800", "#775DA6"]);
  useEffect(() => {
    for (let i in rankData) {
      if (parseInt(i) > 2) {
        setColors([
          ...colors,
          "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0"),
        ]);
      }
    }
  }, [rankData]);

  const questDataRows: ColumnsType<QuestionPartTableValue> = [
    {
      title: t("question"),
      dataIndex: "questionName",
      width: "40%",
      render: (text: any, data: any) => (
        <div dangerouslySetInnerHTML={{ __html: text }}></div>
      ),
    },
    { title: t("max_score"), dataIndex: "numberPoint", width: "15%" },
    {
      title: t("has_result"),
      dataIndex: "numberOfQuestionsAnswered",
      width: "15%",
    },
    {
      title: t("average_answered"),
      dataIndex: "averageScorePerAnswered",
      width: "15%",
    },
    {
      title: t("average_total_exaxm"),
      dataIndex: "averageScorePerTotalTest",
      width: "15%",
    },
  ];
  const partDataRows: TableDataRow[] = [
    {
      title: t("ability"),
      dataIndex: "name",
    },
    {
      title: t("weight"),
      dataIndex: "trongso",
      render: (text: any, data: any) => (
        <>
          <FormattedNumber
            value={text ?? 0}
            style="decimal"
            maximumFractionDigits={2}
          />
          {" %"}
        </>
      ),
    },
    {
      title: t("level"),
      classNameTitle: "flex justify-center",
      children: [
        {
          title: t("require"),
          dataIndex: "diemyeucau",
        },
        {
          title: t("sobaidat"),
          dataIndex: "sobaidat",
        },
        {
          title: t("titrongdat"),
          dataIndex: "titrongdat",
          render: (text: any, data: any) => (
            <>
              <FormattedNumber
                value={text ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
              {" %"}
            </>
          ),
        },
      ],
    },
  ];

  const expandedRowRender = (e: { questions: QuestionPartTableValue[] }) => {
    console.log("e render", e);

    return (
      <Table
        // rowStartStyle={{}}
        // rowEndStyle={{}}
        // rowStyle={{}}
        showHeader={false}
        //@ts-ignore
        columns={questDataRows}
        dataSource={[...e?.questions]}
        pagination={false}
      />
      // <MTable
      //   columns={questColumns}
      //   dataSource={[{ key: "1", questionName: "Giang" }]}
      //   isHidePagination
      // />
    );
  };

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
      <div className="body_bold_16 mb-5 max-lg:ml-5">
        {t("result_examnination_evaluation")?.toUpperCase()}
      </div>
      <div className="grid grid-cols-3 gap-5 w-full  mb-5 ">
        <div className="col-span-3 lg:col-span-1 rounded-lg max-lg:mx-5 bg-white mr-[7px]">
          <div className=" w-full flex p-5 items-center">
            <div className="w-1/3 text-5xl">
              {expectedData?.status == "pass" ? "😊" : "😭"}
            </div>
            <div className="w-2/3 flex flex-col items-start">
              <div>{t("examination_expect")}</div>
              <div className={`text-m_warning_500 title_semibold_24 `}>
                {expectedData?.status == "pass"
                  ? t("expected")
                  : t("not_expected")}
              </div>
            </div>
          </div>
          <div className="h-8 body_semibold_14 w-full bg-neutral-300 flex justify-start pl-5 items-center">
            {t("result")}
          </div>
          <div className="mt-5 my-5 grid grid-cols-3 gap-3 w-full ">
            <div className="ml-3 p-3 border rounded-lg h-20 flex flex-col justify-center items-center col-span-1">
              <div>{t("require")}</div>
              <div className="title_semibold_20 text-m_primary_500">
                {expectedData?.expectPassedNumb}
              </div>
            </div>
            <div className="mr-3 p-3 border rounded-lg h-20 col-span-2 flex flex-col">
              <div className="w-full text-center">{t("actual")}</div>
              <div className="flex justify-between mx-3">
                <div className="flex items-center">
                  <span>{t("pass")}</span>
                  <span className="ml-1 body_semibold_14 text-m_primary_500">
                    {expectedData?.realityPassedNumb}
                  </span>
                </div>
                <div className="flex items-center">
                  <span>{t("account_for")}</span>
                  <span className="ml-1 body_semibold_14 text-m_primary_500">
                    <FormattedNumber
                      value={expectedData?.realityPassedPercent ?? 0}
                      style="decimal"
                      maximumFractionDigits={2}
                    />{" "}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 lg:col-span-2 rounded-lg  bg-white max-lg:mx-5">
          <div className="px-5 pt-5 flex w-full justify-between items-center">
            <div>{t("overview_judgement")}</div>
            <div className="flex">
              {isEditJudge && (
                <button
                  onClick={async () => {
                    setIsEditJudge(!isEditJudge);
                    await updateOverallConclusion({
                      id: params.eid,
                      overallConclusion: overall,
                    });
                    // getExaminationDetail(false);
                  }}
                  className="text-m_primary_500 mr-3"
                >
                  {t("save")}
                </button>
              )}
              <button
                onClick={async () => {
                  setIsEditJudge(!isEditJudge);
                  // getExaminationDetail();
                }}
              >
                <EditIcon />
              </button>
            </div>
          </div>
          {overall}
          <Divider className="my-2" />
          {!isEditJudge && (
            <div className=" mx-5 h-44 overflow-y-scroll scroll-smooth break-all ">
              {overall}
            </div>
          )}
          {
            <div className={`mx-5 ${!isEditJudge ? "hidden" : ""}`}>
              <MTextArea
                // defaultValue={examination?.overallConclusion}
                value={overall}
                onChange={(e) => {
                  setOverAll(e.target.value);
                }}
                id="judge"
                name="judge"
                line={7}
              />
            </div>
          }
        </div>
      </div>

      <div className="body_bold_16 mb-5 max-lg:ml-5">
        {t("exam_part_records")?.toUpperCase()}
      </div>

      <div className="flex max-lg:flex-col w-full items-stretch mb-5">
        <div className="lg:w-1/2 max-lg:mx-5">
          <MTable
            sumData={{
              name: t("total_ability_score"),
              diemyeucau: abilityData?.reduce(
                (a: number, b: TableStatisticalReportData) =>
                  a + (b.diemyeucau ?? 0),
                0,
              ),
            }}
            dataRows={partDataRows}
            dataSource={abilityData}
            isHidePagination
          />
        </div>
        <div className="lg:w-5 h-5" />
        <div
          key={params.eid}
          className="lg:w-1/2 bg-white rounded-lg max-lg:h-72 max-lg:mx-5"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={partDataChart}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                key={"expectedPoint"}
                name={t("expectedPoint")}
                dataKey={"expectedPoint"}
                stroke={"#775DA6"}
                fill={"#775DA6"}
                fillOpacity={0.6}
              />
              <Radar
                key={"actualAverageScore"}
                name={t("actualAverageScore")}
                dataKey={"actualAverageScore"}
                stroke={"#FC8800"}
                fill={"#FC8800"}
                fillOpacity={0.6}
              />

              {/* {partDataChart?.length != 0 && */}
              {/*   Object.keys(partDataChart[0])?.map((e) => { */}
              {/*     var c = */}
              {/*       "#" + */}
              {/*       (((1 << 24) * Math.random()) | 0) */}
              {/*         .toString(16) */}
              {/*         .padStart(6, "0"); */}
              {/**/}
              {/*     return e != "subject" && e != "fullMark" ? ( */}
              {/*       <Radar */}
              {/*         key={e} */}
              {/*         name={e} */}
              {/*         dataKey={e} */}
              {/*         stroke={c} */}
              {/*         fill={c} */}
              {/*         fillOpacity={0.6} */}
              {/*       /> */}
              {/*     ) : null; */}
              {/*   })} */}
              <Legend
                formatter={(value: string, entry: any, index: number) => {
                  const customNames = {
                    expectedPoint: t("expectedPoint"),
                    actualAverageScore: t("actualAverageScore"),
                  };
                  //@ts-ignore
                  return (customNames[value] || value) as string;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="body_bold_16 mb-5 max-lg:ml-5">
        {t("candidadte_rank_record")?.toUpperCase()}
      </div>
      <div className="flex  items-center justify-between w-full mb-5">
        <Chart
          colors={colors}
          key={params.eid}
          h={500}
          w={500}
          className="w-full bg-white rounded-lg flex flex-row-reverse items-center max-lg:mx-5"
          data={rankData}
        />
      </div>

      <div className="flex justify-between max-lg:flex-col max-lg:gap-3 max-lg:items-center max-lg:mx-5">
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
        <div className=" ">
          <MTable
            columns={columns}
            dataSource={infos}
            recordNum={recordNum}
            indexPage={indexPage}
            total={total}
          />
        </div>
      </div>
      <div className="mt-5 p-5 bg-white rounded-lg">
        <div className="body_semibold_20 mb-5">
          {t("question_details_records")}
        </div>
        <MTable
          // rowStartStyle={{}}
          // rowEndStyle={{}}
          // rowStyle={{}}
          rowKey={"key"}
          // @ts-ignore
          columns={questDataRows}
          //@ts-ignore
          dataSource={[
            ...questionPartDetail?.map((s, i) => ({
              key: i,
              questionName: s?.nameQuestionPart ?? "",
              questions: s?.questions,
              averageScorePerAnswered: s?.averageScorePerAnsweredQuestionPart,
              averageScorePerTotalTest: s?.averageScorePerTotalTestQuestionPart,
              numberPoint: s?.numberPointQuestionPart,
              numberOfQuestionsAnswered:
                s?.numberOfQuestionsAnsweredQuestionPart,
            })),
          ]}
          expandable={{ expandedRowRender }}
          isHidePagination
          //pagination={false}
        />
      </div>
      <div className="h-44" />
    </HomeLayout>
  );
}

export default ResultPage;
