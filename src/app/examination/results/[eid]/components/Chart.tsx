import { ExaminationData } from "@/data/exam";
import React from "react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  examination?: ExaminationData;
  data?: any[];
}

function Chart({ data, examination }: Props) {
  const { t } = useTranslation("exam");

  const COLORS = ["#6DB3C2", "#FC8800", "#775DA6"];
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
    <div className=" w-full lg:w-[calc(33%-1rem)] bg-white rounded-lg">
      <div className="h-[220px] pt-4 ">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="flex" width={200} height={200}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={95}
              labelLine={false}
              label={renderCustomizedLabel}
              fill="#8884d8"
              isAnimationActive={false}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full mb-3 px-4">
        {data?.map((a: any, i: number) => (
          <div
            key={i}
            className="flex justify-between mx-2 border-b border-b-m_neutral_100"
          >
            <div className="flex items-center">
              <div
                style={{ backgroundColor: `${COLORS[i]}` }}
                className={`rounded w-3 h-2 bg-[${COLORS[i]}] mr-2`}
              />
              <span className="body_regular_14">{a?.name}</span>
            </div>
            <div className="body_semibold_14">{a.value ?? 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;
