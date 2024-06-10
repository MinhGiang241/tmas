/* eslint-disable react-hooks/exhaustive-deps */
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UpIcon from "@/app/components/icons/up.svg";
import DownIcon from "@/app/components/icons/down.svg";
import { FormattedNumber } from "react-intl";
import { Divider } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import UpDownTrend from "../components/UpDownTrend";
import {
  overviewActivitiesReport,
  overviewGetNum,
  overviewGetTotalExamByExamGroup,
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import { OverviewNumberData, TimeChart } from "@/data/overview";
import dayjs from "dayjs";

function OverviewTab() {
  const { t } = useTranslation("overview");
  const examTrans = useTranslation("exam");
  const [overviewData, setOverviewData] = useState<
    OverviewNumberData | undefined
  >();
  const user = useAppSelector((state: RootState) => state.user.user);
  const [lineField, setLineField] = useState<TimeChart | undefined>(
    TimeChart.Day,
  );

  interface LineTableValue {
    name?: string;
    value?: number;
  }
  interface BarTableValue {
    name?: string;
    [key: string]: any;
  }
  var now = dayjs();
  var year = now.year();
  const [lineData, setLineData] = useState<LineTableValue[]>([]);
  const [barData, setBarData] = useState<BarTableValue[]>([]);
  const [startTime, setStartTime] = useState<string>(
    dayjs(`1/1/${year}`).toISOString(),
  );
  const [endTime, setEndTime] = useState<string>(dayjs()?.toISOString());

  const getActivitiestOverTime = async () => {
    const res = await overviewActivitiesReport({
      startTime: startTime,
      endTime: endTime,
      typeTime: lineField,
    });

    console.log("ress overtime", res);

    if (res?.code != 0) {
      errorToast(res?.message);
      return;
    }

    var dataLine = res?.data?.map((e: any) => ({
      name:
        lineField == TimeChart.Year
          ? `${e?.year}`
          : lineField == TimeChart.Month
            ? `${e.month}/${e.year}`
            : lineField == TimeChart.Week
              ? `${e.week}/${e.year}`
              : `${e.day}/${e?.month}/${e?.year}`,
      value: e.total,
    }));
    setLineData(dataLine);
  };

  const getNum = async () => {
    const res = await overviewGetNum();
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setOverviewData(res?.data);
  };

  const getTotalExamByExamGroup = async () => {
    var res = await overviewGetTotalExamByExamGroup();
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    console.log("bar data", res);
    setBarData(res.data);
  };

  useEffect(() => {
    getNum();
  }, [user]);
  useEffect(() => {
    getActivitiestOverTime();
    getTotalExamByExamGroup();
  }, [user, lineField]);

  const data = [
    {
      name: "Jan",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Feb",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Mar",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Apr",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "May",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Jun",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Jul",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Aug",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Sep",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Oct",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Nov",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Dec",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
  ];
  console.log("on bardata", Object.keys(barData));

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("sum_doing_test")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            <FormattedNumber
              value={overviewData?.totalDoingTest ?? 0}
              style="decimal"
              maximumFractionDigits={2}
            />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("sum_test")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={overviewData?.totalTest ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {overviewData?.totalTestToday !=
              overviewData?.totalTestTomorrow && (
              <UpDownTrend
                up={
                  (overviewData?.totalTestTomorrow ?? 0) >
                  (overviewData?.totalTestToday ?? 0)
                }
                num={
                  (overviewData?.totalTestTomorrow ?? 0) -
                  (overviewData?.totalTestToday ?? 0)
                }
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("sum_candidate")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={overviewData?.totalUserTest ?? 0}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            {overviewData?.totalUserTestToday !=
              overviewData?.totalUserTestTomorrow && (
              <UpDownTrend
                up={
                  (overviewData?.totalUserTestTomorrow ?? 0) >
                  (overviewData?.totalUserTestToday ?? 0)
                }
                num={
                  (overviewData?.totalUserTestTomorrow ?? 0) -
                  (overviewData?.totalUserTestToday ?? 0)
                }
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("remain_gold")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            <FormattedNumber
              value={user?.gold ?? 0}
              style="decimal"
              maximumFractionDigits={2}
            />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("service_package")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            {user?.licences?.enterprise?.pkg_name ??
              user?.licences?.individual?.pkg_name}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("remain_test")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">10/tháng</div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 mt-4">
        <div className="body_semibold_20">{t("examination_by_time")}</div>
        <Divider className="my-4" />
        <div className="flex my-2 justify-between items-center">
          <div className="flex ">
            <button
              onClick={() => {
                setLineField(TimeChart.Day);
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg h-9 ${
                lineField == TimeChart.Day
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => {
                setLineField(TimeChart.Week);
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == TimeChart.Week
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => {
                setLineField(TimeChart.Month);
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == TimeChart.Month
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => {
                setLineField(TimeChart.Year);
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == TimeChart.Year
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Year
            </button>
          </div>
          <div className="flex items-center">
            <div className="max-w-36">
              <MDateTimeSelect
                setValue={(name: string, val: any) => {
                  setStartTime(dayjs(val, "DD/MM/YYYY")?.toISOString());
                }}
                allowClear={false}
                isoValue={startTime}
                formatter={"DD/MM/YYYY"}
                showTime={false}
                isTextRequire={false}
                placeholder={examTrans.t("start_time")}
                h="h-9"
                id="start_time"
                name="start_time"
              />
            </div>
            <div className="mx-2 w-2 h-[1px] bg-m_neutral_500" />
            <div className="max-w-36">
              <MDateTimeSelect
                setValue={(name: string, val: any) => {
                  setEndTime(dayjs(val, "DD/MM/YYYY")?.toISOString());
                }}
                allowClear={false}
                isoValue={endTime}
                formatter={"DD/MM/YYYY"}
                showTime={false}
                isTextRequire={false}
                placeholder={examTrans.t("end_time")}
                h="h-9"
                id="end_time"
                name="end_time"
              />
            </div>
          </div>
        </div>
        <div className="h-3" />
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={lineData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              {/* <Line */}
              {/*   type="natural" */}
              {/*   strokeWidth={2} */}
              {/*   dataKey="px" */}
              {/*   stroke="#FC8800" */}
              {/*   dot={false} */}
              {/* /> */}
              <Line
                strokeWidth={2}
                type="monotone"
                dataKey="value"
                stroke="#0B8199"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 mt-4">
        <div className="body_semibold_20">{t("sum_exam_by_group")}</div>
        <Divider className="my-4" />
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              {barData?.length != 0 &&
                Object.keys(barData?.reduce((a, b) => ({ ...a, ...b }), {}))
                  .filter((l) => l != "name")
                  //barData
                  .map((e, i) => (
                    <Bar
                      key={e}
                      dataKey={e}
                      stackId={"a"}
                      fill={
                        "#" +
                        (((1 << 24) * Math.random()) | 0)
                          .toString(16)
                          .padStart(6, "0")
                      }
                    />
                  ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
