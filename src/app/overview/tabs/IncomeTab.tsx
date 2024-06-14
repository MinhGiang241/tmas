/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
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
import {
  overviewListRevenue,
  overviewListRevenueExel,
  overviewRevenue,
  overviewRevenueStu,
} from "@/services/api_services/overview_api";
import {
  OverviewListRevenueData,
  RevenueData,
  RevenueDataTotal,
  StuRevenueData,
} from "@/data/overview";
import { errorToast } from "@/app/components/toast/customToast";
import dayjs from "dayjs";
import { APIResults } from "@/data/api_results";
import {
  fetchDataExamGroup,
  setExamGroupLoading,
} from "@/redux/exam_group/examGroupSlice";
import { getExamGroupTest } from "@/services/api_services/exam_api";
import { ExamGroupData } from "@/data/exam";
import MTreeSelect from "@/app/components/config/MTreeSelect";
import { saveAs } from "file-saver";

function IncomeTab() {
  const { t } = useTranslation("overview");
  const dispatch = useAppDispatch();
  const examTrans = useTranslation("exam");
  const user = useAppSelector((state: RootState) => state.user.user);
  const [search, setSearch] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [revenueData, setRevenueData] = useState<RevenueData | undefined>();
  const [revenueListData, setRevenueListData] = useState<TableValue[]>([]);
  const [studioRevenueData, setStudioRevenueData] = useState<
    StuRevenueData | undefined
  >();
  const [revenueTotal, setRevenueTotal] = useState<
    RevenueDataTotal | undefined
  >();
  const [groupId, setGroupId] = useState<string | undefined>();
  const examGroupList = useAppSelector(
    (state: RootState) => state.examGroup?.list,
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

  interface TableValue {
    name?: string;
    group?: string[];
    tags?: string[];
    gold_price?: number;
    income?: number;
    discount?: number;
    pure_income?: number;
    from_date?: string;
    to_date?: string;
    status?: string;
  }

  const dataRows: TableDataRow[] = [
    {
      dataIndex: "name",
      title: examTrans.t("name"),
      classNameTitle: "min-w-24",
    },
    {
      dataIndex: "group",
      title: examTrans.t("group"),
      render: (text: any, data: any) => (
        <p key={text} className={"w-full  min-w-11  caption_regular_14"}>
          {text?.join(", ")}
        </p>
      ),
    },
    {
      dataIndex: "tags",
      title: examTrans.t("tags"),
      render: (text: any, data: any) => (
        <p key={text} className={"w-full  min-w-11  caption_regular_14"}>
          {text?.join(", ")}
        </p>
      ),
    },
    { dataIndex: "gold_price", title: examTrans.t("gold_price") },
    { dataIndex: "income", title: t("income") },
    { dataIndex: "discount", title: t("discount") },
    { dataIndex: "pure_income", title: t("pure_income") },
    {
      dataIndex: "from_date",
      title: t("from_date"),
      classNameTitle: "min-w-20",
    },
    { dataIndex: "to_date", title: t("to_date") },
    { dataIndex: "status", title: t("status") },
  ];

  const getRevenue = async () => {
    const res = await overviewRevenue(user?.studio?._id);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setRevenueData(res?.data);
  };

  const getRevenueList = async () => {
    setLoading(true);
    const res = await overviewListRevenue({
      skip: recordNum * (indexPage - 1),
      limit: recordNum,
      studioId: user?.studio?._id,
      endDate,
      startDate,
      status,
      search,
      groupId,
    });
    setLoading(false);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }

    var revenueData = res?.data as OverviewListRevenueData[];
    var list = revenueData?.map<TableValue>((e) => ({
      discount: e.discountRevenue,
      group: e.groupName,
      gold_price: e.goldExamTest,
      income: e.revenue,
      name: e.examTestName,
      pure_income: e.netRevenue,
      status: e.status,
      tags: e?.tagsName,
      from_date: dayjs(e?.createdTime)?.format("DD/MM/YYYY"),
    }));
    setRevenueListData(list);
    setTotal(res?.records ?? 0);
    setRevenueTotal(res?.dataTotal);
  };

  const getRrevenueStudio = async () => {
    const res = await overviewRevenueStu(user?.studio?._id);
    if (res?.code != 0) {
      return;
    }
    setStudioRevenueData(res?.data);
  };

  useEffect(() => {
    getRevenueList();
  }, [user, indexPage, recordNum, search, groupId, status, startDate, endDate]);
  useEffect(() => {
    if (user?.studio?._id) {
      dispatch(fetchDataExamGroup(async () => loadExamGroupList(true)));
    }
    getRrevenueStudio();
    getRevenue();
  }, [user]);

  const examGroup = useAppSelector((state: RootState) => state.examGroup?.list);
  const optionSelect = (examGroup ?? []).map<any>(
    (v: ExamGroupData, i: number) => ({
      title: v?.name,
      value: v?.id,
      disabled: true,
      isLeaf: false,
      children: [
        ...(v?.childs ?? []).map((e: ExamGroupData, i: number) => ({
          title: e?.name,
          value: e?.id,
        })),
      ],
    }),
  );
  optionSelect.push({
    title: examTrans.t("all_category"),
    value: "",
  });
  const statusOption = [
    {
      label: t("valid"),
      value: "valid",
    },
    {
      label: t("invalid"),
      value: "invalid",
    },
  ];

  const downloadExell = async () => {
    var res = await overviewListRevenueExel(user?.studio?._id);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    saveAs(res?.data, "data.xlsx");
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("income_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={revenueData?.revenueData?.revenue ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {revenueData?.revenueData?.revenueYesterday !=
              revenueData?.revenueData?.revenueToday && (
              <UpDownTrend
                up={
                  (revenueData?.revenueData?.revenueYesterday ?? 0) <
                  (revenueData?.revenueData?.revenueToday ?? 0)
                }
                num={Math.abs(
                  (revenueData?.revenueData?.revenueToday ?? 0) -
                    (revenueData?.revenueData?.revenueYesterday ?? 0),
                )}
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("discount_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={revenueData?.discountData?.revenue ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {revenueData?.discountData?.revenueYesterday !=
              revenueData?.discountData?.revenueToday && (
              <UpDownTrend
                up={
                  (revenueData?.discountData?.revenueYesterday ?? 0) <
                  (revenueData?.discountData?.revenueToday ?? 0)
                }
                num={Math.abs(
                  (revenueData?.discountData?.revenueToday ?? 0) -
                    (revenueData?.discountData?.revenueYesterday ?? 0),
                )}
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("pure_income_total")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={revenueData?.netData?.revenue ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {revenueData?.netData?.revenueYesterday !=
              revenueData?.netData?.revenueToday && (
              <UpDownTrend
                up={
                  (revenueData?.netData?.revenueYesterday ?? 0) <
                  (revenueData?.netData?.revenueToday ?? 0)
                }
                num={Math.abs(
                  (revenueData?.netData?.revenueToday ?? 0) -
                    (revenueData?.netData?.revenueYesterday ?? 0),
                )}
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("register_num")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={studioRevenueData?.subStudio?.total ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {studioRevenueData?.subStudio?.totalToday !=
              studioRevenueData?.subStudio?.totalYesterDay && (
              <UpDownTrend
                up={
                  (studioRevenueData?.subStudio?.totalToday ?? 0) >
                  (studioRevenueData?.subStudio?.totalYesterDay ?? 0)
                }
                num={Math.abs(
                  (studioRevenueData?.subStudio?.totalToday ?? 0) -
                    (studioRevenueData?.subStudio?.totalYesterDay ?? 0),
                )}
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("public_examination")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            {studioRevenueData?.examTest?.examTestPublic ?? 0}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("valid_public_examination")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            {studioRevenueData?.examTest?.examTestPublicActive ?? 0}
          </div>
        </div>
      </div>
      <div className="w-full mt-4 p-4 bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <div className="body_semibold_20">{t("income_details")}</div>
          <MButton
            onClick={downloadExell}
            text={examTrans.t("download_file0")}
            className="flex items-center"
            icon={<DownloadIcon />}
            h="h-11"
          />
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
            <div className="w-3" />
            <MDropdown
              value={status}
              options={statusOption}
              setValue={(name: string, val: string) => {
                setStatus(val);
              }}
              id="valid"
              name="valid"
              className="w-52"
              isTextRequire={false}
            />
          </div>
          <div className="flex items-center">
            <div className="max-w-36">
              <MDateTimeSelect
                setValue={(name: string, val: any) => {
                  setStartDate(dayjs(val, "DD/MM/YYYY")?.toISOString());
                }}
                isoValue={startDate}
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
                setValue={(name: string, val: any) => {
                  setEndDate(dayjs(val, "DD/MM/YYYY")?.toISOString());
                }}
                isoValue={endDate}
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
              setSearch(searchValue);
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
        </div>
        <div className="h-3" />
        <MTable
          loading={loading}
          dataSource={revenueListData}
          indexPage={indexPage}
          setIndexPage={setIndexPage}
          recordNum={recordNum}
          setRecordNum={setRecordNum}
          total={total}
          dataRows={dataRows}
          sumData={{
            name: `${examTrans.t("sum")} :`,
            income: revenueTotal?.revenue ?? 0,
            pure_income: revenueTotal?.netRevenue ?? 0,
            discount: revenueTotal?.discountRevenue ?? 0,
          }}
        />
      </div>
    </>
  );
}

export default IncomeTab;
