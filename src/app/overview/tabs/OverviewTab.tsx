/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import UpDownTrend from "../components/UpDownTrend";
import {
  overviewGetNum,
  overviewGetRemaining,
  overviewGetTotalExamByExamGroup,
} from "@/services/api_services/overview_api";
import { errorToast } from "@/app/components/toast/customToast";
import { OverviewNumberData, TimeChart } from "@/data/overview";
import dayjs from "dayjs";
import LineChartOverTime from "../components/LineChartOverTime";

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

  const [remain, setRemain] = useState<{
    number_of_test?: string;
    pkg_name?: string;
  }>({
    number_of_test: "",
    pkg_name: "",
  });
  const [barData, setBarData] = useState<BarTableValue[]>([]);

  const getNum = async () => {
    const res = await overviewGetNum(user?.studio?._id);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }
    setOverviewData(res?.data);
  };

  const getTotalExamByExamGroup = async () => {
    var res = await overviewGetTotalExamByExamGroup(user?.studio?._id);
    if (res?.code != 0) {
      errorToast(res?.message ?? "");
      return;
    }

    setBarData(() => {
      var s = res?.data?.sort(
        (a: BarTableValue, b: BarTableValue) =>
          a?.name?.localeCompare(b?.name ?? ""),
      );
      return s;
    });
  };

  const getRemaining = async () => {
    var res = await overviewGetRemaining();
    if (res?.code != 0) {
      return;
    }
    setRemain({
      number_of_test: `${res?.data?.number_of_test}`,
      pkg_name: res?.data?.pkg_name,
    });
  };

  useEffect(() => {
    getNum();
    getRemaining();
    getTotalExamByExamGroup();
  }, [user]);

  const tickFormatter = (value: string) => {
    const limit = 10; // put your maximum character

    if (value.length < limit) return value;
    return `${value.split(" ").join("\n")}...`;
  };
  var bars =
    barData?.length != 0
      ? Object.keys(barData?.reduce((a, b) => ({ ...a, ...b }), {}))
          .filter((l) => l != "name")
          ?.sort((a, b) => a.localeCompare(b))
      : [];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
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
            {overviewData?.totalTestToday != 0 && (
              <UpDownTrend
                upText={t("day_test_increase", {
                  num: Math.abs(overviewData?.totalTestToday ?? 0),
                })}
                up={(overviewData?.totalTestToday ?? 0) > 0}
                num={Math.abs(overviewData?.totalTestToday ?? 0)}
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
            {overviewData?.totalUserTestToday != 0 && (
              <UpDownTrend
                upText={t("user_test_today", {
                  num: overviewData?.totalUserTestToday ?? 0,
                })}
                up={(overviewData?.totalUserTestToday ?? 0) > 0}
                num={Math.abs(overviewData?.totalUserTestToday ?? 0)}
              />
            )}
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("remain_gold")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            <FormattedNumber
              value={user?.studio?.gold ?? 0}
              style="decimal"
              maximumFractionDigits={2}
            />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("service_package")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">{remain?.pkg_name}</div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("remain_test")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">{remain?.number_of_test}</div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 mt-4">
        <div className="body_semibold_20">{t("examination_by_time")}</div>
        <Divider className="my-4" />
        <LineChartOverTime />
      </div>

      <div className="rounded-lg bg-white p-4 mt-4">
        <div className="body_semibold_20">{t("sum_exam_by_group")}</div>
        <Divider className="my-4" />
        <div className="w-full h-[450px] overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: bars?.length > 5 ? 100 : 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={bars?.length > 5 ? 0 : "preserveStartEnd"}
                angle={bars?.length > 5 ? -35 : 0}
                tickFormatter={bars?.length > 5 ? tickFormatter : undefined}
                textAnchor={"end"}
                axisLine={false}
                offset={5}
                tickMargin={10}
                style={{
                  // fill: colorMode === "dark" ? "#FFFFFF" : "#1A202C",
                  textAlign: "center",
                }}
              />
              <YAxis />
              <Tooltip
                cursor={{ fill: "transparent" }}
                reverseDirection={{ y: true }}
              />
              {/* <Legend /> */}
              {bars?.map((e, i) => (
                <Bar
                  barSize={100}
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
