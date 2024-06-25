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
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import saveAs from "file-saver";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import dayjs from "dayjs";
import {
  ExamTestCounterData,
  ExamTestPagingData,
  FilterData,
} from "@/data/overview";
import { Condition, ExaminationData, StudioSorter } from "@/data/exam";
import Link from "next/link";
import { Tooltip } from "antd";
import RenderSortterIcon from "./IconSorter";

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
  const [sorter, setSorter] = useState<StudioSorter>({
    name: "createdTime",
    isAsc: false,
  });
  const [dataList, setDataList] = useState<ExamTestPagingData | undefined>();

  const addSorter = (name: string) => {
    if (!sorter?.name || name != sorter.name) {
      setSorter({ name, isAsc: true });
      return;
    }
    setSorter({ name, isAsc: !sorter?.isAsc });
    setIndexPage(1);
  };

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: (
        <button onClick={() => addSorter("info.examTest.unsignedName")}>
          <Tooltip title={t("examination_name")}>{t("name")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="info.examTest.unsignedName"
          />
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
        <button onClick={() => addSorter("info.groupExam.name")}>
          <Tooltip title={t("exam_group")}>{t("group")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="info.groupExam.name" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "tags",
      title: (
        <button onClick={() => addSorter("info.exam.tags")}>
          <Tooltip title={t("tags_tooltip")}>{t("tags")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="info.exam.tags" />
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
        <button onClick={() => addSorter("info.couter.numberOfTest")}>
          <Tooltip title={t("amount_join")}>{t("join_num")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="info.couter.numberOfTest" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "today_join_num",
      title: (
        <button onClick={() => addSorter("key.couterByDate")}>
          <Tooltip title={t("amount_join_today")}>
            {t("today_join_num")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="key.couterByDate" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtb",
      title: (
        <button onClick={() => addSorter("couter.totalScoreAsInt")}>
          <Tooltip title={t("ĐTV")}>{t("dtv")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.totalScoreAsInt" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtv",
      title: (
        <button onClick={() => addSorter("couter.medianScoreAsInt")}>
          <Tooltip title={t("ĐTV")}>{t("dtv")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.medianScoreAsInt" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "percent_pass",
      title: (
        <button onClick={() => addSorter("couter.totalPass")}>
          <Tooltip title={t("pass_rate")}>{t("percent_pass")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.totalPass" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "avg_test_time",
      title: (
        <button onClick={() => addSorter("couter.totalTimeSeconds")}>
          <Tooltip title={t("avg_test_time_tooltip")}>
            {t("avg_test_time")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.totalTimeSeconds" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "min_test_time",
      title: (
        <button onClick={() => addSorter("couter.minimumTimeSeconds")}>
          <Tooltip title={t("min_test_time_tooltip")}>
            {t("min_test_time")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.minimumTimeSeconds" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "max_test_time",
      title: (
        <button onClick={() => addSorter("couter.maximumTimeSeconds")}>
          <Tooltip title={t("max_test_time_tooltip")}>
            {t("max_test_time")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.maximumTimeSeconds" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "question_num",
      title: (
        <button onClick={() => addSorter("couter.numberOfQuestions")}>
          <Tooltip title={t("question_num_tooltip")}>
            {t("question_num")}
          </Tooltip>
          <RenderSortterIcon sorter={sorter} name="couter.numberOfQuestions" />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "gold_price",
      title: (
        <button
          onClick={() => addSorter("info.examTest.goldSetting.goldPrice")}
        >
          <Tooltip title={t("gold_price")}>{t("gold_price")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="info.examTest.goldSetting.goldPrice"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "pure_income",
      title: (
        <button onClick={() => addSorter("couter.goldCouter.netRevenue")}>
          <Tooltip title={t("pure_income_tooltip")}>{t("pure_income")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="couter.goldCouter.netRevenue"
          />
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "from_date",
      title: (
        <button
          onClick={() =>
            addSorter("info.examTest.validAccessSetting.validFrom")
          }
        >
          <Tooltip title={t("from_date_tooltip")}>{t("from_date")}</Tooltip>
          <RenderSortterIcon
            sorter={sorter}
            name="info.examTest.validAccessSetting.validFrom"
          />
        </button>
      ),

      classNameTitle: "min-w-20",
    },

    {
      dataIndex: "status",
      title: (
        <button onClick={() => addSorter("info.examTest.stateInfo")}>
          <Tooltip title={t("examination_status")}>{t("status")}</Tooltip>
          <RenderSortterIcon sorter={sorter} name="info.examTest.stateInfo" />
        </button>
      ),

      classNameTitle: "min-w-20",
    },
  ];

  const getListData = async () => {
    var filters: FilterData[] = [];
    if (search) {
      filters.push({
        fieldName: "info.examTest.unsignedName",
        value: `/${search?.trim()}/i`,
        condition: Condition.regex,
        convertTextToUnsigned: true,
      });
    }
    if (startDate) {
      filters.push({
        fieldName: "info.examTest.createdTime",
        value: `${startDate}`,
        condition: Condition.gte,
      });
    }
    if (endDate) {
      filters.push({
        fieldName: "info.examTest.createdTime",
        value: `${endDate}`,
        condition: Condition.lte,
      });
    }
    if (groupId) {
      filters.push({
        fieldName: "info.groupExam.id",
        value: groupId,
        condition: Condition.eq,
      });
    }

    var res = await //   overviewExamTestCounter({
    //   paging: { startIndex: indexPage, recordPerPage: recordNum },
    //   filters,
    //   studioSorters: [sorter],
    // });
    overviewExamTestGetPaging({
      paging: { startIndex: indexPage, recordPerPage: recordNum },
      isReportTotal: true,
      filterByNameOrTag: search?.trim()
        ? {
            name: "unsignedName",
            inValues: [search?.trim()!],
          }
        : undefined,
      filterByExamGroupId: groupId
        ? {
            name: "ExamGroup",
            inValues: [groupId],
          }
        : undefined,
      fromTime: startDate,
      toTime: endDate,
      isIncludeExamVersion: true,
    });
    if (res?.code != 0) {
      return;
    }
    var result: ExamTestPagingData = res?.data;
    setDataList(result);
    var examData: ExaminationData[] = res?.data?.records ?? [];
    var examTableData = examData?.map<TableValue>((ex) => ({
      id: ex?.id,
      created_date: dayjs(ex?.createdTime).format("DD:MM:YYYY HH:mm:ss"),
      question_num: ex?.statisticExamTest?.couter?.numberOfQuestions ?? 0,
      group:
        ex?.examVersion?.groupExams &&
        (ex?.examVersion?.groupExams as any).length != 0
          ? (ex?.examVersion?.groupExams as any[])[0].name
          : "",
      name: ex?.name,
      tags: ex?.examVersion?.tags?.map((y) => y?.name ?? ""),
      // ex?.examVersion?.exam?.tags?.map((k: any) =>
      //   typeof k == "string" ? k : k?.name,
      // ),

      dtv: ex?.statisticExamTest?.couter?.medianScoreAsInt,
      dtb: !ex?.statisticExamTest?.couter?.numberOfTest
        ? 0
        : (ex?.statisticExamTest?.couter?.totalScoreAsInt ?? 0) /
          (ex?.statisticExamTest?.couter?.numberOfTest ?? 0),
      join_num: ex?.statisticExamTest?.couter?.numberOfTest,
      percent_pass: !ex?.statisticExamTest?.couter?.numberOfTest
        ? 0
        : ((ex?.statisticExamTest?.couter?.totalScoreAsInt ?? 0) /
            (ex?.statisticExamTest?.couter?.numberOfTest ?? 0)) *
          100,
      avg_test_time: !ex?.statisticExamTest?.couter?.numberOfTest
        ? "00:00:00"
        : dayjs
            .duration(
              (ex?.statisticExamTest?.couter?.totalTimeSeconds ?? 0) /
                (ex?.statisticExamTest?.couter?.numberOfTest ?? 0),
            )
            .format("HH:mm:ss"),
      max_test_time: dayjs
        .duration(ex?.statisticExamTest?.couter?.maximumTimeSeconds ?? 0)
        .format("HH:mm:ss"),
      min_test_time: dayjs
        .duration(ex?.statisticExamTest?.couter?.minimumTimeSeconds ?? 0)
        .format("HH:mm:ss"),
      today_join_num: ``,
      from_date: ex?.validAccessSetting?.validFrom
        ? dayjs(ex?.validAccessSetting?.validFrom)?.format(
            "DD/MM/YYYY HH:mm:ss",
          )
        : undefined,
      to_date: ex?.validAccessSetting?.validTo
        ? dayjs(ex?.validAccessSetting?.validTo)?.format("DD/MM/YYYY HH:mm:ss")
        : undefined,
      gold_price: ex?.goldSetting?.goldPrice,
      pure_income: ex?.statisticExamTest?.couter?.goldCouter?.netRevenue,
      status: `${
        ex?.stateInfo?.approvedState ? t(ex?.stateInfo?.approvedState) : ""
      }`,

      // avg_test_time: t?.couter?.
    }));
    setDataTable(examTableData);

    setTotal(res?.data?.totalOfRecords ?? 0);
  };

  const downloadExell = async () => {
    var filters: FilterData[] = [];
    if (search) {
      filters.push({
        fieldName: "info.examTest.unsignedName",
        value: `/${search?.trim()}/i`,
        condition: Condition.regex,
        convertTextToUnsigned: true,
      });
    }
    if (startDate) {
      filters.push({
        fieldName: "info.examTest.createdTime",
        value: `${startDate}`,
        condition: Condition.gte,
      });
    }
    if (endDate) {
      filters.push({
        fieldName: "info.examTest.createdTime",
        value: `${endDate}`,
        condition: Condition.lte,
      });
    }
    if (groupId) {
      filters.push({
        fieldName: "info.groupExam.id",
        value: groupId,
        condition: Condition.eq,
      });
    }

    var res = await //overviewExamTestCounterExcel
    overviewExamTestStatiticExcel({
      paging: {
        startIndex: indexPage,
        recordPerPage: recordNum,
      },
      filters,
      studioSorters: [sorter],
    });

    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }

    saveAs(res?.data);
  };

  useEffect(() => {
    getListData();
  }, [user, startDate, endDate, search, groupId, sorter, indexPage, recordNum]);

  return (
    <>
      <div className="w-full body_semibold_20 mb-4 min-w-">
        {t("examination_list")}
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex  lg:items-center max-lg:flex-col">
          <div className="lg:w-52 lg:mr-4">
            <MTreeSelect
              value={groupId}
              setValue={(name: any, e: any) => {
                setGroupId(e);
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
              value={search}
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
              isoValue={endDate}
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
        dataSource={dataTable}
        indexPage={indexPage}
        setIndexPage={setIndexPage}
        recordNum={recordNum}
        setRecordNum={setRecordNum}
        total={total}
        dataRows={dataRows}
        sumData={{
          name: `${t("sum")}:`,
          join_num: dataList?.additionData?.numberOfTest,
        }}
      />
    </>
  );
}

export default ExaminationListTable;
