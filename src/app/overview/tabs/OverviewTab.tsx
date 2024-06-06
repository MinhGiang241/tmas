import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
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

function OverviewTab() {
  const { t } = useTranslation("overview");
  const examTrans = useTranslation("exam");

  const user = useAppSelector((state: RootState) => state.user.user);

  const data = [
    {
      name: "Tháng 1",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 2",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 3",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 4",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 5",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 6",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 7",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 8",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 9",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 10",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 11",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
    {
      name: "Tháng 12",
      num: Math.floor(Math.random() * 1000),
      px: Math.floor(Math.random() * 1000),
    },
  ];

  const [lineField, setLineField] = useState<string | undefined>("0");

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4">
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("sum_doing_test")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            <FormattedNumber
              value={30}
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
                value={30}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend up num={30} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("sum_candidate")}</div>
          <div className="h-2" />
          <div className="flex items-center">
            <div className="heading_semibold_32">
              <FormattedNumber
                value={30}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
            <UpDownTrend num={30} />
          </div>
        </div>
        <div className="grid-cols-1 bg-white p-3 rounded-lg h-28 flex justify-center flex-col px-8">
          <div className="body_regular_14">{t("remain_gold")}</div>
          <div className="h-2" />
          <div className="heading_semibold_32">
            <FormattedNumber
              value={30}
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
                setLineField("0");
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg h-9 ${
                lineField == "0"
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => {
                setLineField("1");
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == "1"
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => {
                setLineField("2");
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == "2"
                  ? "border border-m_primary_500 bg-m_primary_100  text-m_primary_500 body_semibold_14"
                  : "border border-m_neutral_200 body_regular_14"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => {
                setLineField("3");
              }}
              className={`flex justify-center items-center px-4 ml-3 rounded-lg body_semibold_14 h-9 ${
                lineField == "3"
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
              data={data}
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
              <Line
                type="bump"
                strokeWidth={2}
                dataKey="px"
                stroke="#FC8800"
                dot={false}
              />
              <Line
                strokeWidth={2}
                type="monotone"
                dataKey="num"
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
              data={data}
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
              <Legend />

              <Bar
                dataKey="num"
                fill="#6FADE0"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
