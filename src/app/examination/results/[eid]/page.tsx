"use client";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import HomeLayout from "@/app/layouts/HomeLayout";
import { Divider, Pagination, Select, Table } from "antd";
import React, { HTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import _, { keys } from "lodash";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import MButton from "@/app/components/config/MButton";
import DownloadIcon from "@/app/components/icons/download.svg";
import FilterIcon from "@/app/components/icons/filter.svg";
import EyeIcon from "@/app/components/icons/eye.svg";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import FilterModal from "./components/FilterModal";
import { FormikErrors, useFormik } from "formik";
import { CloseOutlined } from "@ant-design/icons";

function ResultPage({ params }: any) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const dateFormat = "HH:mm DD/MM/YYYY";
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(1);

  const data = [
    { label: "pass", name: t("pass"), value: 100 },
    { label: "not_pass", name: t("not_pass"), value: 300 },
  ];

  const COLORS = ["#FC8800", "#6DB3C2", "#775DA6"];
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
  const infos = [
    {
      full_name: "Trương Minh Giang",
      percent_complete: "10%",
      point: 100,
      complete_time: "30 phút",
      test_date: "2024-04-19T02:11:24.096+0000",
      status: "Chưa hoàn thành",
      email: "minhgiang241@gmail.com",
      phone: "0367333592",
      group: "Chim",
      identify_code: "5045",
    },
  ];

  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,

      title: <div className="w-full flex justify-start">{t("STT")}</div>,
      dataIndex: "stt",
      key: "stt",
      render: (text, data, index) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {index + 1}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,

      title: (
        <div className="w-full break-all  flex justify-start">
          {t("full_name")}
        </div>
      ),
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <p
          key={text}
          className="w-full break-all flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,

      title: (
        <div className="w-full flex justify-start">{t("percent_complete")}</div>
      ),
      dataIndex: "percent_complete",
      key: "complete_percent",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="w-full flex justify-start">{t("point")}</div>,
      dataIndex: "point",
      key: "point",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,

      title: (
        <div className="w-full flex justify-start">{t("complete_time")}</div>
      ),
      dataIndex: "complete_time",
      key: "complete_time",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="w-full flex justify-start">{t("test_date")}</div>,
      dataIndex: "test_date",
      key: "test_date",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {`${dayjs(text).format(dateFormat)}`}
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="w-full flex justify-start">{t("email")}</div>,
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: <div className="w-full flex justify-start">{t("phone")}</div>,
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: <div className="w-full flex justify-start">{t("group")}</div>,
      dataIndex: "group",
      key: "group",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="w-full flex justify-start">{t("identify_code")}</div>
      ),
      dataIndex: "identify_code",
      key: "identify-code",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: <div className="w-full flex justify-start">{t("detail")}</div>,
      dataIndex: "detail",
      key: "detail",
      render: (text) => (
        <div className="w-full flex justify-center">
          <button>
            <EyeIcon />
          </button>
        </div>
      ),
    },
  ];
  const [openFilter, setOpenFilter] = useState(false);

  interface FormFilterValue {
    email?: string;
    identify_code?: string;
    full_name?: string;
    group?: string;
    phone_number?: string;
    test_date?: string;
  }
  const validate = (values: FormFilterValue) => {
    const errors: FormikErrors<FormFilterValue> = {};
    return errors;
  };
  const formik = useFormik({
    initialValues: {},
    validate,
    onSubmit: (values: FormFilterValue) => {
      console.log({ values });

      setFilterValues(values);
    },
  });

  const [filterValues, setFilterValues] = useState<FormFilterValue>({});

  return (
    <HomeLayout>
      <FilterModal
        clearFieldValue={async (fields: any) => {
          await formik.setFieldValue(fields, undefined);
          var cloneFilter = _.cloneDeep(filterValues);
          cloneFilter[fields] = undefined;
          setFilterValues(cloneFilter);
        }}
        formik={formik}
        open={openFilter}
        onOk={() => {
          formik.handleSubmit();
          setOpenFilter(false);
        }}
        onCancel={() => {
          setOpenFilter(false);
        }}
      />
      <div className="h-3" />
      <MBreadcrumb
        items={[
          { text: t("exam_list"), href: "/examination" },
          {
            href: `/examination/result/${params?.eid}`,
            text: t("examination_result"),
            active: true,
          },
        ]}
      />
      <div className="flex justify-between">
        {[1, 2, 3].map((e) => {
          var cloneData = _.cloneDeep(data);
          if (e === 3) {
            cloneData.push({
              label: "pass",
              name: t("not_answer_quest"),
              value: 100,
            });
          }
          return (
            <div key={e} className="w-[calc(33%-1rem)] bg-white rounded-lg">
              <div className="h-[220px] pt-4 ">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart className="flex" width={200} height={200}>
                    <Pie
                      data={cloneData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      fill="#8884d8"
                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mb-3 px-4">
                <div className="flex justify-between mx-2 border-b border-b-m_neutral_100">
                  <div className="flex items-center">
                    <div className={`rounded w-3 h-2 bg-[#6DB3C2] mr-2`} />
                    <span className="body_regular_14">{t("pass")}</span>
                  </div>
                  <div className="body_semibold_14">40%</div>
                </div>

                <div className="flex mt-2 justify-between mx-2 border-b border-b-m_neutral_100">
                  <div className="flex items-center">
                    <div className={`rounded w-3 h-2 bg-[#FC8800] mr-2`} />
                    <span className="body_regular_14">{t("not_pass")}</span>
                  </div>
                  <div className="body_semibold_14">60%</div>
                </div>

                {e === 3 && (
                  <div className="flex mt-2 justify-between mx-2 border-b border-b-m_neutral_100">
                    <div className="flex items-center">
                      <div className={`rounded w-3 h-2 bg-[#775DA6] mr-2`} />
                      <span className="body_regular_14">
                        {t("not_answer_quest")}
                      </span>
                    </div>
                    <div className="body_semibold_14">20%</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-3 bg-white rounded-lg mt-5">
        <div className="flex items-center w-full justify-between">
          <div className="body_semibold_20">{t("list")}</div>
          <div className="flex">
            <MButton
              onClick={() => {
                setOpenFilter(true);
              }}
              className="flex items-center"
              icon={<FilterIcon />}
              h="h-11"
              type="secondary"
              text={t("advance_filter")}
            />
            <div className="w-3" />
            <MButton
              className="flex items-center"
              icon={<DownloadIcon />}
              h="h-11"
              type="secondary"
              text={t("download_file")}
            />
          </div>
        </div>
        <div className="h-5" />
        <div className="flex flex-wrap">
          {Object.keys(filterValues).map((e) => {
            if (!filterValues[e]) {
              return null;
            }
            return (
              <div
                key={e}
                className="flex py-2 px-3 border border-m_neutral_200 ml-2 mb-2 rounded-lg items-center bg-m_primary_100"
              >
                <span className="body_semibold_14 mr-1">{`${t(e)}: `}</span>
                <span className="body_regular_14"> {`${filterValues[e]}`}</span>
                <button
                  className="ml-2"
                  onClick={async () => {
                    const formikValue = _.cloneDeep(formik.values);
                    await formik.setFieldValue(e, undefined);
                    formikValue[e] = undefined;
                    await setFilterValues(formikValue);
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
            );
          })}
        </div>
        <div className="h-5" />
        <Table
          className="w-full"
          bordered={false}
          columns={columns}
          dataSource={infos}
          pagination={false}
          rowKey={"id"}
          onRow={(data: any, index: any) =>
            ({
              style: {
                background: "#FFFFFF",
                borderRadius: "20px",
              },
            }) as HTMLAttributes<any>
          }
        />
        <div className="w-full flex items-center justify-center mt-5">
          <span className="body_regular_14 mr-2">{`${total} ${t(
            "result",
          )}`}</span>

          <Pagination
            pageSize={recordNum}
            onChange={(v) => {
              setIndexPage(v);
            }}
            current={indexPage}
            total={total}
            showSizeChanger={false}
          />
          <div className="hidden ml-2 lg:flex items-center">
            <Select
              optionRender={(oriOption) => (
                <div className="flex justify-center">{oriOption?.label}</div>
              )}
              value={recordNum}
              onChange={(v) => {
                setRecordNum(v);
              }}
              options={[
                ...[15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className="pl-3 body_regular_14">{`${i}/${common.t(
                      "page",
                    )}`}</span>
                  ),
                })),
              ]}
              className="select-page min-w-[124px]"
            />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default ResultPage;
