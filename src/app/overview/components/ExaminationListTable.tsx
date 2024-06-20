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
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import saveAs from "file-saver";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import dayjs from "dayjs";
import { ExamTestCounterData, FilterData } from "@/data/overview";
import { Condition } from "@/data/exam";
import Link from "next/link";

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

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: t("name"),
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
    { dataIndex: "group", title: t("group"), classNameTitle: "min-w-20" },
    { dataIndex: "tags", title: t("tags"), classNameTitle: "min-w-20" },
    { dataIndex: "join_num", title: t("join_num"), classNameTitle: "min-w-20" },
    {
      dataIndex: "today_join_num",
      title: t("today_join_num"),
      classNameTitle: "min-w-20",
    },
    { dataIndex: "dtb", title: t("dtb"), classNameTitle: "min-w-20" },
    { dataIndex: "dtv", title: t("dtv"), classNameTitle: "min-w-20" },
    {
      dataIndex: "percent_pass",
      title: t("percent_pass"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "avg_test_time",
      title: t("avg_test_time"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "min_test_time",
      title: t("min_test_time"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "max_test_time",
      title: t("max_test_time"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "question_num",
      title: t("question_num"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "gold_price",
      title: t("gold_price"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "pure_income",
      title: t("pure_income"),
      classNameTitle: "min-w-20",
    },
    {
      dataIndex: "from_date",
      title: t("from_date"),
      classNameTitle: "min-w-20",
    },
    { dataIndex: "to_date", title: t("to_date"), classNameTitle: "min-w-20" },
    { dataIndex: "status", title: t("status"), classNameTitle: "min-w-20" },
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

    var res = await overviewExamTestCounter({
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
    var examData: ExamTestCounterData[] = res?.data?.records ?? [];
    var examTableData = examData?.map<TableValue>((t) => ({
      id: t?.info?.examTest?.id,
      created_date: dayjs(t?.info?.examTest?.createdTime).format(
        "DD:MM:YYYY HH:mm:ss",
      ),
      question_num: t?.couter?.numberOfQuestions ?? 0,
      group: t?.info?.groupExam?.name,
      name: t?.info?.examTest?.name,
      tags: t?.info?.examTest?.examVersion?.exam?.tags,
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
      from_date: t?.info?.examTest?.validAccessSetting?.validFrom
        ? dayjs(t?.info?.examTest?.validAccessSetting?.validFrom)?.toISOString()
        : undefined,
      to_date: t?.info?.examTest?.validAccessSetting?.validTo
        ? dayjs(t?.info?.examTest?.validAccessSetting?.validTo)?.toISOString()
        : undefined,
      gold_price: t?.info?.examTest?.goldSetting?.goldPrice,
      pure_income: t?.couter?.goldCouter?.netRevenue,
      status: `${t?.info?.examTest?.stateInfo ?? ""}`,

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

    var res = await overviewExamTestCounterExcel({
      paging: {
        startIndex: indexPage,
        recordPerPage: recordNum,
      },
      filters,
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

  useEffect(() => {
    getListData();
  }, [user, startDate, endDate, search, groupId]);

  return (
    <>
      <div className="w-full body_semibold_20 mb-4 min-w-">
        {t("examination_list")}
      </div>
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
        sumData={{ name: `${t("sum")}:` }}
      />
    </>
  );
}

export default ExaminationListTable;
