"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function ResultPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  console.log({ params });

  const data02 = [
    { label: "pass", name: t("pass"), value: 100 },
    { label: "not_pass", name: t("not_pass"), value: 300 },
  ];

  const COLORS = ["#FC8800", "#6DB3C2"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <HomeLayout>
      <div className="h-3" />
      <MBreadcrumb
        items={[
          { text: t("exam_list"), href: "/exams" },
          {
            href: `/exams/details`,
            text: "sdkaksadjkl",
            active: true,
          },
        ]}
      />

      <div className="w-1/2 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="flex" width={200} height={200}>
            <Pie
              data={data02}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={95}
              labelLine={false}
              label={renderCustomizedLabel}
              fill="#8884d8"
              isAnimationActive={false}
            >
              {data02.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="w-full">
          <div className="flex justify-between">
            <div>
              <div className={`w-2 h-2 bg-[#6DB3C2]`} />
              <span>{t("pass")}</span>
            </div>
          </div>
          <div className="flex mt-2 justify-between">
            <div>
              <div className={`w-2 h-2 bg-[#FC8800]`} />
              <div className="body_semibold_14">45%</div>
            </div>
            <div>Fail</div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default ResultPage;
