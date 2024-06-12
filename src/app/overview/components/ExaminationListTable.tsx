import MTable, { TableDataRow } from "@/app/components/config/MTable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@/app/components/icons/white-import.svg";
import MButton from "@/app/components/config/MButton";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import { SearchOutlined } from "@ant-design/icons";
import MInput from "@/app/components/config/MInput";

function ExaminationListTable() {
  const { t } = useTranslation("exam");
  const [search, setSearch] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: t("name"),
      classNameTitle: "min-w-20",
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

  return (
    <>
      <div className="w-full body_semibold_20 mb-4 min-w-">
        {t("examination_list")}
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex  items-center">
          <form
            className="w-full max-w-[309px]"
            onSubmit={(e) => {
              e.preventDefault();
              setIndexPage(1);
            }}
          >
            <MInput
              isTextRequire={false}
              value={search}
              onChange={(e: React.ChangeEvent<any>) => {
                setSearch(e.target.value);
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
          text={t("download_file0")}
          className="flex items-center"
          icon={<DownloadIcon />}
          h="h-11"
        />
      </div>
      <div className="h-5" />
      <MTable
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