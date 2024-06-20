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
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import { saveAs } from "file-saver";
import { ExamCounterData, FilterData } from "@/data/overview";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import { Condition } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import Link from "next/link";
dayjs.extend(duration);
dayjs.extend(customParseFormat);

interface TableValue {
  id?: string;
  name?: string;
  group?: string;
  tags?: string[];
  join_num?: number;
  today_join_num?: string;
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

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: (
        <button>
          <Tooltip title={t("exam_name")}>{t("name")}</Tooltip>
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
        <button>
          <Tooltip title={t("exam_group")}>{t("group")}</Tooltip>
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "tags",
      title: (
        <button>
          <Tooltip title={t("tags")}>{t("tags")}</Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "join_num",
      title: (
        <button>
          <Tooltip title={t("amount_join")}>{t("join_num")}</Tooltip>
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "today_join_num",
      title: (
        <button>
          <Tooltip title={t("amount_join_today")}>
            {t("today_join_num")}
          </Tooltip>
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtb",
      title: (
        <button>
          <Tooltip title={t("ĐTB")}>{t("dtb")}</Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "dtv",
      title: (
        <button>
          <Tooltip title={t("ĐTV")}>{t("dtv")}</Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "percent_pass",
      title: (
        <button>
          <Tooltip title={t("pass_rate")}>{t("percent_pass")}</Tooltip>
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "avg_test_time",
      title: (
        <button>
          <Tooltip title={t("avg_test_time_tooltip")}>
            {t("avg_test_time")}
          </Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "min_test_time",
      title: (
        <button>
          <Tooltip title={t("min_test_time_tooltip")}>
            {t("min_test_time")}
          </Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "max_test_time",
      title: (
        <button>
          <Tooltip title={t("max_test_time_tooltip")}>
            {t("max_test_time")}
          </Tooltip>
        </button>
      ),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "question_num",
      title: (
        <button>
          <Tooltip title={t("question_num_tooltip")}>
            {t("question_num")}
          </Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "created_date",
      title: (
        <button>
          <Tooltip title={t("exam_created_date")}>{t("created_date")}</Tooltip>
        </button>
      ),

      classNameTitle: "min-w-20",
    },
  ];

  const getListData = async () => {
    var filters: FilterData[] = [];
    if (search) {
      filters.push({
        fieldName: "info.exam.unsignedName",
        value: `/${search?.trim()}/i`,
        condition: Condition.regex,
        convertTextToUnsigned: true,
      });
    }
    if (startDate) {
      filters.push({
        fieldName: "info.exam.createdTime",
        value: `${startDate}`,
        condition: Condition.gte,
      });
    }
    if (endDate) {
      filters.push({
        fieldName: "info.exam.createdTime",
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

    var res = await overviewExamCounter({
      paging: { startIndex: indexPage, recordPerPage: recordNum },
      filters,
      studioSorters: [
        {
          name: "createdTime",
          isAsc: false,
        },
      ],
    });
    if (res?.code != 0) {
      return;
    }
    setTotal(res?.data?.totalOfRecords ?? 0);
    var examData: ExamCounterData[] = res?.data?.records ?? [];
    var examTableData = examData?.map<TableValue>((t) => ({
      id: t?.info?.exam?.id,
      created_date: dayjs(t?.info?.exam?.createdTime).format(
        "DD:MM:YYYY HH:mm:ss",
      ),
      question_num: t?.couter?.numberOfQuestions ?? 0,
      group: t?.info?.groupExam?.name,
      name: t?.info?.exam?.name,
      tags: t?.info?.exam?.tags,
      dtv: t?.couter?.medianScoreAsInt,
      dtb: !t?.couter?.numberOfTest
        ? 0
        : (t?.couter?.totalScoreAsInt ?? 0) / (t?.couter?.numberOfTest ?? 0),
      join_num: t?.couter?.numberOfTest,
      percent_pass: !t?.couter?.numberOfTest
        ? 0
        : ((t?.couter?.totalScoreAsInt ?? 0) / (t?.couter?.numberOfTest ?? 0)) *
          100,
      avg_test_time: !t?.couter?.numberOfTest
        ? "00:00:00"
        : dayjs
            .duration(
              (t?.couter?.totalTimeSeconds ?? 0) /
                (t?.couter?.numberOfTest ?? 0),
            )
            .format("HH:mm:ss"),
      max_test_time: dayjs
        .duration(t?.couter?.maximumTimeSeconds ?? 0)
        .format("HH:mm:ss"),
      min_test_time: dayjs
        .duration(t?.couter?.minimumTimeSeconds ?? 0)
        .format("HH:mm:ss"),
      today_join_num: `${t?.key?.couterByDate}`,

      // avg_test_time: t?.couter?.
    }));
    setDataTable(examTableData);
  };

  useEffect(() => {
    getListData();
  }, [user, startDate, endDate, search, groupId]);

  const downloadExell = async () => {
    var filters: FilterData[] = [];
    if (search) {
      filters.push({
        fieldName: "info.exam.unsignedName",
        value: `/${search?.trim()}/i`,
        condition: Condition.regex,
        convertTextToUnsigned: true,
      });
    }
    if (startDate) {
      filters.push({
        fieldName: "info.exam.createdTime",
        value: `${startDate}`,
        condition: Condition.gte,
      });
    }
    if (endDate) {
      filters.push({
        fieldName: "info.exam.createdTime",
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
    var res = await overviewExamCounterExcel({
      filters,
      paging: {
        startIndex: indexPage,
        recordPerPage: recordNum,
      },
      studioSorters: [
        {
          name: "createdTime",
          isAsc: false,
        },
      ],
    });

    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }

    saveAs(res?.data);
  };

  return (
    <>
      <div className="w-full body_semibold_20 mb-4">{t("exam_list")}</div>
      <div className="flex justify-between w-full items-center">
        <div className="flex  items-center">
          <div className="w-52 mr-4">
            <MTreeSelect
              value={groupId}
              setValue={(name: any, e: any) => {
                setGroupId(e);
              }}
              allowClear={false}
              defaultValue=""
              id="question_group"
              name="question_group"
              className="w-52"
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
        dataSource={dataTable}
        indexPage={indexPage}
        setIndexPage={setIndexPage}
        recordNum={recordNum}
        setRecordNum={setRecordNum}
        total={total}
        dataRows={dataRows}
        sumData={{ name: `${t("sum")}:` }}
      />
    </>
  );
}

export default ExamListTable;
