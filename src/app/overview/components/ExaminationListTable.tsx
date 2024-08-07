/* eslint-disable react-hooks/exhaustive-deps */
import MTable, { TableDataRow } from "@/app/components/config/MTable";
import React, { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@/app/components/icons/white-import.svg";
import MButton from "@/app/components/config/MButton";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import { SearchOutlined } from "@ant-design/icons";
import MInput from "@/app/components/config/MInput";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  overviewExamTestCounter,
  overviewExamTestCounterExcel,
  overviewExamTestGetPaging,
  overviewExamTestStatiticExcel,
  overviewListExamTestReport,
  overviewListExamTestReportExel,
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import saveAs from "file-saver";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import dayjs from "dayjs";
import {
  DGroupFilter,
  DSort,
  ExamTestCounterData,
  ExamTestPagingData,
  ExamTestReportData,
  FilterData,
  ListExamReportData,
  ListExamTestReportData,
} from "@/data/overview";
import { Condition, ExaminationData, StudioSorter } from "@/data/exam";
import Link from "next/link";
import { Tooltip } from "antd";
import RenderSortterIcon from "./IconSorter";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import MDropdown from "@/app/components/config/MDropdown";
dayjs.extend(duration);
dayjs.extend(customParseFormat);

interface TableValue {
  id?: string;
  name?: string;
  group?: string;
  tags?: string[];
  join_num?: number;
  dtb?: number;
  dtv?: number;
  percent_pass?: number;
  avg_test_time?: string;
  min_test_time?: string;
  max_test_time?: string;
  question_num?: number;
  gold_price?: number;
  pure_income?: number;
  from_date?: string;
  to_date?: string;
  status?: string;
}

function ExaminationListTable({ optionSelect }: { optionSelect: any }) {
  const { t } = useTranslation("exam");
  const [search, setSearch] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const user = useAppSelector((state: RootState) => state.user.user);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [groupId, setGroupId] = useState<string | undefined>();
  const [dataTable, setDataTable] = useState<TableValue[]>([]);
  const [sorter, setSorter] = useState<DSort>({
    desc: true,
    id: "CreatedTime",
  });
  const [dataList, setDataList] = useState<ExamTestReportData | undefined>();

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
          <Tooltip title={t("examination_name")}>{t("name")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="Name" />
        </button>
      ),
      classNameTitle: "min-w-20",
      render: (text: any, data: any) => {
        var ref = createRef<any>();

        return (
          <>
            <Link
              className="hidden"
              target="_blank"
              ref={ref}
              href={`/examination/results/${data.id}`}
            />

            <div className="w-full flex justify-start ">
              <button
                className="text-start  text-m_primary_500 underline underline-offset-4"
                onClick={() => {
                  (ref?.current as any).click();
                }}
              >
                {text}
              </button>
            </div>
          </>
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
          <RenderSortterIcon
            sorter={sorter}
            name="TestResultReport.MedianScore"
          />
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
      dataIndex: "gold_price",
      title: (
        <button onClick={() => addSorter("GoldSetting.GoldPrice")}>
          <Tooltip title={t("gold_price")}>{t("gold_price")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="GoldSetting.GoldPrice" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "pure_income",
      title: (
        <button onClick={() => addSorter("NetRevenue")}>
          <Tooltip title={t("pure_income_tooltip")}>{t("pure_income")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="NetRevenue" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "from_date",
      title: (
        <button onClick={() => addSorter("ValidAccessSetting.ValidFrom")}>
          <Tooltip title={t("from_date_tooltip")}>{t("from_date")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="ValidAccessSetting.ValidFrom"
          />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "to_date",
      title: (
        <button onClick={() => addSorter("ValidAccessSetting.ValidTo")}>
          <Tooltip title={t("to_date_tooltip")}>{t("to_date")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="ValidAccessSetting.ValidTo"
          />
        </button>
      ),

      classNameTitle: "min-w-24",
    },

    {
      dataIndex: "status",
      title: (
        <button onClick={() => addSorter("VisibleState")}>
          <Tooltip title={t("examination_status")}>{t("status")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="VisibleState" />
        </button>
      ),

      classNameTitle: "min-w-24",
    },
  ];

  const getListData = async () => {
    var filters: DGroupFilter[] = [];
    if (status) {
      filters.push({
        id: "VisibleState",
        value: status == "valid" ? "Active" : "Inactive",
        operation: "==",
      });
    }
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
        value: dayjs(endDate).add(1, "day")?.toISOString(),
        operation: "<",
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

    var res = await overviewListExamTestReport({
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

    var examTestData: ExamTestReportData[] = res?.data ?? [];
    setDataList(res?.data);
    setTotal(res?.data?.records);
    var listExamTestData: ListExamTestReportData[] = res?.data?.data;
    var examTestTableData = listExamTestData?.map<TableValue>((ex) => ({
      id: ex?._id,
      created_date: dayjs(ex?.validAccessSetting?.validFrom).format(
        "DD:MM:YYYY HH:mm:ss",
      ),
      question_num: ex?.numberOfQuestions,
      group: ex?.groupName,
      name: ex?.name,
      tags: ex?.tags?.map((k: any) => (typeof k == "string" ? k : k?.name)),
      dtv: ex?.testResultReport?.medianScore,
      dtb: ex?.testResultReport?.avgScore,
      join_num: ex?.testResultReport?.totalExamTestResult,
      percent_pass: ex?.testResultReport?.totalPassPercent,
      avg_test_time:
        //ex?.testResultReport?.avgTimeDoTestSeconds,
        dayjs
          .duration((ex?.testResultReport?.avgTimeDoTestSeconds ?? 0) * 1000)
          .format("HH:mm:ss"),
      max_test_time: dayjs
        .duration((ex?.testResultReport?.maxTimeDoTestSeconds ?? 0) * 1000)
        .format("HH:mm:ss"),
      min_test_time: dayjs
        .duration((ex?.testResultReport?.minTimeDoTestSeconds ?? 0) * 1000)
        .format("HH:mm:ss"),
      today_join_num: ex?.testResultReport?.totalExamTestResultToday,
      from_date: ex?.validAccessSetting?.validFrom
        ? dayjs(ex?.validAccessSetting?.validFrom)?.format(
            "DD/MM/YYYY HH:mm:ss",
          )
        : undefined,
      to_date: ex?.validAccessSetting?.validTo
        ? dayjs(ex?.validAccessSetting?.validTo)?.format("DD/MM/YYYY HH:mm:ss")
        : undefined,
      gold_price: ex?.goldSetting?.goldPrice,
      pure_income: ex?.netRevenue,
      status: `${ex?.visibleState == "Active" ? t("valid") : t("invalid")}`,

      // avg_test_time: t?.couter?.
    }));
    console.log("examTestTableData", examTestTableData, listExamTestData);
    console.log("dayjs duration", dayjs.duration(57 * 1000).format("HH:mm:ss"));

    setDataTable(examTestTableData);
  };

  const downloadExell = async () => {
    var filters: DGroupFilter[] = [];
    if (status) {
      filters.push({
        id: "VisibleState",
        value: status == "valid" ? "Active" : "Inactive",
        operation: "==",
      });
    }

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
        value: dayjs(endDate).add(1, "day")?.toISOString(),
        operation: "<",
      });
    }
    if (groupId) {
      filters.push({
        id: "GroupId",
        value: groupId,
        operation: "==",
      });
    }

    var res = await //overviewExamTestCounterExcel
    overviewListExamTestReportExel({
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
  const [status, setStatus] = useState<string | undefined>("");
  const examTrans = useTranslation("exam");
  const statusOption = [
    {
      label: examTrans.t("all"),
      value: "",
    },
    {
      label: t("valid"),
      value: "valid",
    },
    {
      label: t("invalid"),
      value: "invalid",
    },
  ];

  useEffect(() => {
    getListData();
  }, [
    user,
    startDate,
    endDate,
    search,
    groupId,
    sorter,
    indexPage,
    recordNum,
    status,
  ]);

  return (
    <>
      <div className="w-full body_semibold_20 mb-4 min-w-">
        {t("examination_list")}
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex  lg:items-center max-lg:flex-col">
          <div className="lg:w-40 lg:mr-4">
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
              className="lg:w40"
              isTextRequire={false}
              h="h-11"
              options={optionSelect}
            />
          </div>
          <div className="lg:w-40 lg:mr-4">
            <MDropdown
              allowClear={false}
              value={status}
              options={statusOption}
              setValue={(name: string, val: string) => {
                setStatus(val);
                setIndexPage(1);
              }}
              id="valid"
              name="valid"
              //className="w-24"
              isTextRequire={false}
            />
          </div>

          <form
            className="w-full max-w-[250px]"
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
          className="flex items-center lg:ml-4"
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
          join_num_today: dataList?.summary?.totalExamTestResultToday,
          question_num: dataList?.summary?.numberOfQuestions,
          pure_income: dataList?.summary?.netRevenue,
        }}
      />
    </>
  );
}

export default ExaminationListTable;
