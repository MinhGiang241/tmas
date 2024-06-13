/* eslint-disable react-hooks/exhaustive-deps */
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import { errorToast } from "@/app/components/toast/customToast";
import { TimeChart } from "@/data/overview";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { overviewActivitiesReport } from "@/services/api_services/overview_api";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
} from "recharts";

interface LineTableValue {
  name?: string;
  value?: number;
}

interface Props {}

function LineChartOverTime(props: Props) {
  const [lineData, setLineData] = useState<LineTableValue[]>([]);
  const [lineField, setLineField] = useState<TimeChart | undefined>(
    TimeChart.Day,
  );
  var now = dayjs();
  var year = now.year();
  const [startTime, setStartTime] = useState<string>(
    dayjs(`1/1/${year}`).toISOString(),
  );
  const [endTime, setEndTime] = useState<string>(dayjs()?.toISOString());
  const examTrans = useTranslation("exam");

  const getActivitiestOverTime = async () => {
    const res = await overviewActivitiesReport({
      startTime: startTime,
      endTime: endTime,
      typeTime: lineField,
    });

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
  const user = useAppSelector((state: RootState) => state.user.user);

  useEffect(() => {
    getActivitiestOverTime();
  }, [user, lineField, startTime, endTime]);

  return (
    <>
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
    </>
  );
}

export default LineChartOverTime;
