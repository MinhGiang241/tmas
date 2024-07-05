/* eslint-disable react-hooks/exhaustive-deps */
import MButton from "@/app/components/config/MButton";
import React, { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@/app/components/icons/white-import.svg";
import MInput from "@/app/components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import { Table, Tooltip } from "antd";
import MTable, { TableDataRow } from "@/app/components/config/MTable";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  overviewExamCounter,
  overviewExamCounterExcel,
  overviewExamGetPaging,
  overviewExamStatiticExcel,
  overviewListExamReport,
  overviewListExamReportExel,
  overviewListExamTestReport,
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import { saveAs } from "file-saver";
import {
  DGroupFilter,
  DSort,
  ExamCounterData,
  ExamPagingData,
  ExamReportData,
  FilterData,
  ListExamReportData,
  ListExamTestReportData,
} from "@/data/overview";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import { Condition, ExamData, StudioSorter } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import Link from "next/link";

import RenderSortterIcon from "./IconSorter";
dayjs.extend(duration);
dayjs.extend(customParseFormat);

interface TableValue {
  id?: string;
  name?: string;
  group?: string;
  tags?: string[];
  join_num?: number;
  today_join_num?: number;
  dtb?: number;
  dtv?: number;
  percent_pass?: number;
  avg_test_time?: string;
  min_test_time?: string;
  max_test_time?: string;
  question_num?: number;
  created_date?: string;
}

function ExamListTable({ optionSelect }: { optionSelect: any }) {
  const { t } = useTranslation("exam");

  const [search, setSearch] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const user = useAppSelector((state: RootState) => state.user.user);
  const [dataTable, setDataTable] = useState<TableValue[]>([]);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [groupId, setGroupId] = useState<string | undefined>();
  const [dataList, setDataList] = useState<ExamReportData | undefined>();
  const [sorter, setSorter] = useState<DSort>({
    desc: true,
    id: "CreatedTime",
  });

  const addSorter = (name: string) => {
    if (!sorter?.id || name != sorter.id) {
      setSorter({ id: name, desc: true });
      return;
    }
    setSorter({ id: name, desc: !sorter?.desc });
    setIndexPage(1);
  };

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: (
        <button onClick={() => addSorter("Name")}>
          <Tooltip title={t("exam_name")}>{t("name")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="Name" />
        </button>
      ),
      classNameTitle: "min-w-20",
      render: (text: any, data: any) => {
        var ref = createRef<any>();
        return (
          <div className="w-full flex justify-start ">
            <Link
              className="hidden"
              target="_blank"
              ref={ref}
              href={`/exams/details/${data.id}`}
            />

            <button
              className="text-start text-m_primary_500 underline underline-offset-4"
              onClick={() => {
                (ref?.current as any).click();
              }}
            >
              {text}
            </button>
          </div>
        );
      },
    },
    {
      dataIndex: "group",
      title: (
        <button onClick={() => addSorter("GroupName")}>
          <Tooltip title={t("exam_group")}>{t("group")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="GroupName" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "tags",
      title: (
        <button onClick={() => addSorter("Tags")}>
          <Tooltip title={t("tags_tooltip")}>{t("tags")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="Tags" />
        </button>
      ),
      classNameTitle: "min-w-20",
      render: (text: any, data: any) => {
        return (
          <div className="w-full flex justify-start ">{text?.join(", ")}</div>
        );
      },
    },
    {
      dataIndex: "join_num",
      title: (
        <button
          onClick={() => addSorter("TestResultReport.TotalExamTestResult")}
        >
          <Tooltip title={t("amount_join")}>{t("join_num")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.TotalExamTestResult"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "today_join_num",
      title: (
        <button
          onClick={() => addSorter("TestResultReport.TotalExamTestResultToday")}
        >
          <Tooltip title={t("amount_join_today")}>
            {t("today_join_num")}
          </Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.TotalExamTestResultToday"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtb",
      title: (
        <button onClick={() => addSorter("TestResultReport.AvgScore")}>
          <Tooltip title={t("ĐTB")}>{t("dtb")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="TestResultReport.AvgScore" />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtv",
      title: (
        <button onClick={() => addSorter("TestResultReport.MedianScore")}>
          <Tooltip title={t("ĐTV")}>{t("dtv")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.medianScoreAsInt" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "percent_pass",
      title: (
        <button onClick={() => addSorter("TestResultReport.TotalPassPercent")}>
          <Tooltip title={t("pass_rate")}>{t("percent_pass")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.TotalPassPercent"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "avg_test_time",
      title: (
        <button
          onClick={() => addSorter("TestResultReport.AvgTimeDoTestSeconds")}
        >
          <Tooltip title={t("avg_test_time_tooltip")}>
            {t("avg_test_time")}
          </Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.AvgTimeDoTestSeconds"
          />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "min_test_time",
      title: (
        <button
          onClick={() => addSorter("TestResultReport.MinTimeDoTestSeconds")}
        >
          <Tooltip title={t("min_test_time_tooltip")}>
            {t("min_test_time")}
          </Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.MinTimeDoTestSeconds"
          />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "max_test_time",
      title: (
        <button
          onClick={() => addSorter("TestResultReport.MaxTimeDoTestSeconds")}
        >
          <Tooltip title={t("max_test_time_tooltip")}>
            {t("max_test_time")}
          </Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.MaxTimeDoTestSeconds"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "question_num",
      title: (
        <button onClick={() => addSorter("NumberOfQuestions")}>
          <Tooltip title={t("question_num_tooltip")}>
            {t("question_num")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="NumberOfQuestions" />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "created_date",
      title: (
        <button onClick={() => addSorter("CreatedTime")}>
          <Tooltip title={t("exam_created_date")}>{t("created_date")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="CreatedTime" />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
  ];

  const getListData = async () => {
    var filters: DGroupFilter[] = [];
    if (search) {
      filters.push({
        op: "OR",
        children: [
          { id: "Name", value: search, operation: "~i" },
          {
            id: "Tags",
            value: search,
            operation: "~i",
          },
        ],
      });
    }
    if (startDate) {
      filters.push({
        id: "ValidAccessSetting.ValidFrom",
        value: startDate,
        operation: ">=",
      });
    }
    if (endDate) {
      filters.push({
        id: "ValidAccessSetting.ValidFrom",
        value: endDate,
        operation: "<=",
      });
    }
    if (groupId) {
      filters.push({
        id: "GroupId",
        value: groupId,
        operation: "==",
      });
    }
    setLoading(true);
    var res = await overviewListExamReport({
      skip: (indexPage - 1) * recordNum,
      limit: recordNum,
      group: {
        children: [...filters],
      },
      sorted: [sorter],
    });
    setLoading(false);
    if (res?.code != 0) {
      return;
    }
    setTotal(res?.data?.records ?? 0);
    var result: ExamReportData = res?.data;
    setDataList(result);
    var examData: ListExamReportData[] = res?.data?.data ?? [];
    var examTableData = examData?.map<TableValue>((t) => ({
      id: t?._id,
      created_date: dayjs(t?.createdTime).format("DD:MM:YYYY HH:mm:ss"),
      question_num: t?.numberOfQuestions,
      group: t?.groupName,
      name: t?.name,
      tags: t?.tags?.map((k: any) => (typeof k == "string" ? k : k?.name)),
      dtv: t?.testResultReport?.medianScore,
      dtb: t?.testResultReport?.avgScore,
      join_num: t?.testResultReport?.totalExamTestResult,
      percent_pass: t?.testResultReport?.totalPassPercent,
      avg_test_time: dayjs
        .duration((t?.testResultReport?.avgTimeDoTestSeconds ?? 0) * 1000)
        .format("HH:mm:ss"),
      max_test_time: dayjs
        .duration((t?.testResultReport?.maxTimeDoTestSeconds ?? 0) * 1000)
        .format("HH:mm:ss"),
      min_test_time: dayjs
        .duration((t?.testResultReport?.minTimeDoTestSeconds ?? 0) * 1000)
        .format("HH:mm:ss"),
      today_join_num: t?.testResultReport?.totalExamTestResultToday,
    }));
    setDataTable(examTableData);
  };

  useEffect(() => {
    getListData();
  }, [user, startDate, endDate, search, groupId, sorter, indexPage, recordNum]);

  const downloadExell = async () => {
    var filters: DGroupFilter[] = [];
    if (search) {
      filters.push({
        op: "OR",
        children: [
          { id: "Name", value: search, operation: "~i" },
          {
            id: "Tags",
            value: search,
            operation: "~i",
          },
        ],
      });
    }
    if (startDate) {
      filters.push({
        id: "CreatedTime",
        value: startDate,
        operation: ">=",
      });
    }
    if (endDate) {
      filters.push({
        id: "CreatedTime",
        value: endDate,
        operation: "<=",
      });
    }
    if (groupId) {
      filters.push({
        id: "GroupId",
        value: groupId,
        operation: "==",
      });
    }
    var res = await //overviewExamCounterExcel
      overviewListExamReportExel({
        skip: (indexPage - 1) * recordNum,
        limit: recordNum,
        group: {
          children: [...filters],
        },
        sorted: [sorter],
      });

    if (res?.code != 0) {
      errorToast(res, res?.message ?? "");
      return;
    }

    saveAs(res?.data);
  };

  return (
    <>
      <div className="w-full body_semibold_20 mb-4">{t("exam_list")}</div>
      <div className="flex justify-between w-full items-center">
        <div className="flex  lg:items-center max-lg:flex-col">
          <div className="lg:w-52 lg:mr-4">
            <MTreeSelect
              value={groupId}
              setValue={(name: any, e: any) => {
                setGroupId(e);
                setIndexPage(1);
              }}
              allowClear={false}
              defaultValue=""
              id="question_group"
              name="question_group"
              className="lg:w-52"
              isTextRequire={false}
              h="h-11"
              options={optionSelect}
            />
          </div>

          <form
            className="w-full max-w-[309px]"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchValue);
              setIndexPage(1);
            }}
          >
            <MInput
              isTextRequire={false}
              value={searchValue}
              onChange={(e: React.ChangeEvent<any>) => {
                setSearchValue(e.target.value);
              }}
              className=""
              placeholder={t("search_by_name_tag")}
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
          <div className=" mx-2" />
          <div className="max-w-64">
            <MDateTimeSelect
              setValue={(name: string, val: any) => {
                if (val) {
                  setStartDate(dayjs(val, "DD/MM/YYYY")?.toISOString());
                } else {
                  setStartDate(undefined);
                }
              }}
              isoValue={startDate}
              formatter={"DD/MM/YYYY"}
              showTime={false}
              isTextRequire={false}
              placeholder={t("start_time")}
              h="h-11"
              id="start_time"
              name="start_time"
            />
          </div>
          <div className="mx-2 w-2 h-[1px] bg-m_neutral_500" />
          <div className="max-w-64">
            <MDateTimeSelect
              setValue={(name: string, val: any) => {
                if (val) {
                  setEndDate(dayjs(val, "DD/MM/YYYY")?.toISOString());
                } else {
                  setEndDate(undefined);
                }
              }}
              isoValue={endDate}
              formatter={"DD/MM/YYYY"}
              showTime={false}
              isTextRequire={false}
              placeholder={t("end_time")}
              h="h-11"
              id="end_time"
              name="end_time"
            />
          </div>
        </div>
        <MButton
          onClick={downloadExell}
          text={t("download_file0")}
          className="flex items-center"
          icon={<DownloadIcon />}
          h="h-11"
        />
      </div>
      <div className="h-5" />
      <MTable
        loading={loading}
        dataSource={dataTable}
        indexPage={indexPage}
        setIndexPage={setIndexPage}
        recordNum={recordNum}
        setRecordNum={setRecordNum}
        total={total}
        dataRows={dataRows}
        sumData={{
          name: `${t("sum")}:`,
          join_num: dataList?.summary?.totalExamTestResult,
          question_num: dataList?.summary?.numberOfQuestions,
        }}
      />
    </>
  );
}

export default ExamListTable;
