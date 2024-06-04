import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React from "react";
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
} from "recharts";

function OverviewTab() {
  const { t } = useTranslation("overview");
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
            <div className="bg-m_success_50 rounded-full w-7 h-7 flex justify-center items-center mx-4">
              <UpIcon />
            </div>
            <div className="text-m_success_500 body_semibold_14">
              <FormattedNumber
                value={30}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
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
            <div className="bg-m_error_100 rounded-full w-7 h-7 flex justify-center items-center mx-4">
              <DownIcon />
            </div>
            <div className="text-m_error_500 body_semibold_14">
              <FormattedNumber
                value={30}
                style="decimal"
                maximumFractionDigits={2}
              />
            </div>
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
              <Legend />
              <Line
                type="bump"
                strokeWidth={2}
                dataKey="num"
                stroke="#FC8800"
                dot={false}
              />
              <Line
                strokeWidth={2}
                type="monotone"
                dataKey="px"
                stroke="#0B8199"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
