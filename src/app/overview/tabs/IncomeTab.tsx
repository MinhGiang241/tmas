import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormattedNumber } from "react-intl";
import UpIcon from "@/app/components/icons/up.svg";
import DownIcon from "@/app/components/icons/down.svg";
import DownloadIcon from "@/app/components/icons/white-import.svg";
import { Divider } from "antd";
import MButton from "@/app/components/config/MButton";
import MInput from "@/app/components/config/MInput";
import { SearchOutlined } from "@ant-design/icons";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import MDropdown from "@/app/components/config/MDropdown";
import MTable, { TableDataRow } from "@/app/components/config/MTable";
import UpDownTrend from "../components/UpDownTrend";

function IncomeTab() {
  const { t } = useTranslation("overview");
  const examTrans = useTranslation("exam");
  const user = useAppSelector((state: RootState) => state.user.user);
  const [search, setSearch] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);

  const dataRows: TableDataRow[] = [
    { dataIndex: "name", title: examTrans.t("name") },
    { dataIndex: "group", title: examTrans.t("group") },
    { dataIndex: "tags", title: examTrans.t("tags") },
    { dataIndex: "gold_price", title: examTrans.t("gold_price") },
    { dataIndex: "income", title: t("income") },
    { dataIndex: "discount", title: t("discount") },
    { dataIndex: "pure_income", title: t("pure_income") },
    { dataIndex: "from_date", title: t("from_date") },
    { dataIndex: "to_date", title: t("to_date") },
    { dataIndex: "status", title: t("status") },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("income_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={30000}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend up num={50} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("discount_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={4234}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend up num={5} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("pure_income_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={2434}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend up num={45} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("register_num")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={30}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend num={2} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("public_examination")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">10</div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("valid_public_examination")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">10</div>
        </div>
      </div>
      <div className="w-full mt-4 p-4 bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <div className="body_semibold_20">{t("income_details")}</div>
          <MButton
            text={examTrans.t("download_file0")}
            className="flex items-center"
            icon={<DownloadIcon />}
            h="h-11"
          />
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MDropdown
              id="question_group"
              name="question_group"
              className="w-52"
              isTextRequire={false}
            />
            <div className="w-3" />
            <MDropdown
              id="valid"
              name="valid"
              className="w-52"
              isTextRequire={false}
            />
          </div>
          <div className="flex items-center">
            <div className="max-w-36">
              <MDateTimeSelect
                formatter={"DD/MM/YYYY"}
                showTime={false}
                isTextRequire={false}
                placeholder={examTrans.t("start_time")}
                h="h-11"
                id="start_time"
                name="start_time"
              />
            </div>
            <div className="mx-2 w-2 h-[1px] bg-m_neutral_500" />
            <div className="max-w-36">
              <MDateTimeSelect
                formatter={"DD/MM/YYYY"}
                showTime={false}
                isTextRequire={false}
                placeholder={examTrans.t("end_time")}
                h="h-11"
                id="end_time"
                name="end_time"
              />
            </div>
          </div>

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
        </div>
        <div className="h-3" />
        <MTable
          indexPage={indexPage}
          setIndexPage={setIndexPage}
          recordNum={recordNum}
          setRecordNum={setRecordNum}
          total={total}
          dataRows={dataRows}
        />
      </div>
    </>
  );
}

export default IncomeTab;
