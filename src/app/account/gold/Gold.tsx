/* eslint-disable react-hooks/exhaustive-deps */
import MButton from "@/app/components/config/MButton";
import { Divider, Pagination, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "../account-info/AccountInfo";
import MDateTimeSelect from "@/app/components/config/MDateTimeSelect";
import MDropdown from "@/app/components/config/MDropdown";
import RighIcon from "@/app/components/icons/chevron-right.svg";
import { useRouter } from "next/navigation";
import {
  loadGoldList,
  loadHistoryGold,
} from "@/services/api_services/account_services";
import { GoldData, GoldHistoryData } from "@/data/user";
import { FormattedNumber } from "react-intl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setPayment } from "@/redux/payment/paymentSlice";
import dayjs from "dayjs";
import { log } from "console";
import { errorToast } from "@/app/components/toast/customToast";
import Image from "next/image";

function Gold() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const [index, setIndex] = useState<any>("0");
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const [change, setChange] = useState<string>("");
  const [status, setStatus] = useState<string>("Completed");
  const user = useAppSelector((state: RootState) => state.user.user);
  const [goldHis, setGoldHis] = useState<GoldHistoryData[]>([]);
  const [goldHisloading, setGoldHisLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | undefined>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [fromDate, setFromDate] = useState<string | undefined>();
  const [toDate, setToDate] = useState<string | undefined>();

  useEffect(() => {
    loadGolds();
  }, []);
  useEffect(() => {
    loadHistoryGoldList();
  }, [indexPage, change, status, recordNum, fromDate, toDate]);
  const [goldList, setGoldList] = useState<GoldData[]>([]);
  const loadGolds = async () => {
    var res = await loadGoldList({ skip: 0, limit: 100 });
    if (res.code != 0) {
      return;
    }
    setGoldList(res.data);
  };

  const loadHistoryGoldList = async () => {
    setGoldHisLoading(true);
    var res = await loadHistoryGold({
      skip: (indexPage - 1) * recordNum,
      limit: recordNum,
      changed: change,
      fromDate: fromDate,
      toDate: toDate,
      text: undefined,
      payment_status: status,
    });
    setGoldHisLoading(false);
    if (res.code != 0) {
      errorToast(res.message ?? "");
      setGoldHis([]);
      return;
    }
    setGoldHis(res.data ?? []);
    setTotal(res.records ?? 0);
  };

  const columns: ColumnsType<GoldHistoryData> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: <div className="w-full flex justify-start">{t("act")}</div>,
      dataIndex: "product_type",
      key: "product_type",
      render: (text, data) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text == "Gold" && (data?.gold_changed ?? 0) > 0
            ? t("in_gold")
            : t("out_gold")}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: (
        <div className="w-full break-all  flex justify-start">
          {t("content")}
        </div>
      ),
      dataIndex: "message",
      key: "message",
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
        <div className="w-full flex justify-start">{t("processing_time")}</div>
      ),
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {dayjs(text).format("HH:mm DD/MM/YYYY")}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="w-full  flex justify-center">
          {t("gold_num_change")}
        </div>
      ),
      dataIndex: "gold_changed",
      key: "gold_changed",
      render: (text, data) => (
        <div className="w-full flex justify-center ">
          {text > 0 ? `+${text}` : `-${text}`}
        </div>
      ),
    },
  ];

  if (page === 1) {
    return (
      <div className="w-full p-5 flex flex-col">
        <div className="flex">
          <button
            className="mr-2"
            onClick={() => {
              setPage(0);
            }}
          >
            <RighIcon />
          </button>
          <div className="body_semibold_20">{t("gold_list")} </div>
        </div>
        <Divider className="my-3" />
        <div className="w-full grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4">
          {goldList.map((e: GoldData, i: number) => (
            <button
              onClick={() => {
                setSelected(i);
              }}
              key={i}
              className={`flex flex-col items-center border rounded-lg px-2 ${
                selected == i ? "bg-m_primary_100 border-m_primary_300" : ""
              }`}
            >
              <div className="bg-[#F4D58D] px-3 py-1 mt-3 rounded-lg body_semibold_14">
                {e.name}
              </div>
              <div className="body_bold_16 mt-1">
                <FormattedNumber
                  value={e?.gold ?? 0}
                  style="decimal"
                  maximumFractionDigits={2}
                />{" "}
                Gold
              </div>
              <Divider className="my-2" />
              <div className="title_bold_20 text-m_primary_500 mb-2">
                <FormattedNumber
                  value={e?.cost ?? 0}
                  style="decimal"
                  maximumFractionDigits={2}
                />
                {` VNĐ`}
              </div>
            </button>
          ))}
        </div>
        <div className="flex mt-5 justify-center">
          <MButton
            disabled={selected === undefined || selected === null}
            text={t("pay")}
            onClick={() => {
              dispatch(
                setPayment({
                  type: "Gold",
                  price: goldList[selected as number].cost,
                  goldId: goldList[selected as number]._id,
                  name: goldList[selected as number].name,
                }),
              );

              router.push(
                `/payment?type=Gold&goldId=${
                  goldList[selected as number]._id ?? ""
                }&price=${goldList[selected as number].cost ?? 0}&name=${
                  goldList[selected as number].name ?? ""
                }`,
              );
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-5 flex flex-col">
      <div className="w-full flex justify-between items-center">
        <div>
          <div className="w-full title_semibold_20">{t("gold_manage")}</div>
          <div className="caption_regular_14 flex items-center">
            <span>
              {t("current_gold")}: {user?.gold ?? 0}
            </span>
            <div className="w-1" />
            <Image alt="coin" src="/images/coin.png" width={25} height={25} />
          </div>
        </div>

        <div className="flex">
          <MButton h="h-11" text={t("withdraw_gold")} />
          <div className="w-3" />
          <MButton
            onClick={() => {
              setPage(1);
            }}
            h="h-11"
            text={t("buy_gold")}
          />
        </div>
      </div>
      <Divider className="my-5" />
      <div className="w-full items-center flex max-lg:flex-col p-5 bg-m_neutral_100 mb-3 rounded-lg">
        <MDateTimeSelect
          setValue={(name: string, value: string) => {
            if (value) {
              var date = dayjs(value, "DD/MM/YYYY");
              setFromDate(date.toISOString());
            } else {
              setFromDate(undefined);
            }
            setIndexPage(1);
          }}
          placeholder={t("from_date")}
          isTextRequire={false}
          h="h-[42px]"
          id="from_date"
          name="from_date"
          formatter="DD/MM/YYYY"
        />
        <div className="w-8" />
        <MDateTimeSelect
          setValue={(name: string, value: string) => {
            if (value) {
              var date = dayjs(value, "DD/MM/YYYY");
              setToDate(date.toISOString());
            } else {
              setToDate(undefined);
            }
            setIndexPage(1);
          }}
          placeholder={t("to_date")}
          isTextRequire={false}
          h="h-[42px]"
          id="to_date"
          name="to_date"
          formatter="DD/MM/YYYY"
        />
        <div className="w-8" />
        <MDropdown
          allowClear={false}
          value={change}
          setValue={(name: string, value: string) => {
            setIndexPage(1);
            setChange(value);
          }}
          isTextRequire={false}
          h="h-[42px]"
          id="type"
          name="type"
          options={[
            { label: common.t("all"), value: "" },
            { label: t("add_gold"), value: "up" },
            { label: t("minus_gold"), value: "down" },
          ]}
        />
        {/* <div className="w-8" /> */}
        {/* <MButton h="h-9 max-lg:mr-auto" className="mb-1" text={t("search")} /> */}
      </div>
      <div className="body_semibold_16 mb-2">{t("transaction_history")}</div>
      <div className="w-full flex border-b-m_neutral_200 h-11 border-b ">
        <button
          onClick={() => {
            setIndex("0");
            setStatus("Completed");
          }}
          className={`${
            index === "0"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 px-2 body_semibold_14 lg:px-4 max-lg:w-1/2`}
        >
          {t("success")}
        </button>
        <button
          onClick={() => {
            setIndex("1");
            setStatus("Pending");
          }}
          className={`${
            index === "1"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 body_semibold_14 lg:px-4 max-lg:w-1/2 `}
        >
          {t("processing")}
        </button>
        <button
          onClick={() => {
            setIndex("2");
            setStatus("Terminated");
          }}
          className={`${
            index === "2"
              ? "text-m_primary_500 border-b-m_primary_500 border-b-[3px]"
              : "text-m_neutral_500"
          } h-11 text-center lg:min-w-40 body_semibold_14 lg:px-4 max-lg:w-1/2 `}
        >
          {t("fail")}
        </button>
      </div>
      <div className="h-3" />
      <Table
        loading={goldHisloading}
        className="w-full"
        bordered={false}
        columns={columns}
        dataSource={goldHis}
        pagination={false}
        rowKey={"_id"}
        onRow={(data: any, index: any) =>
          ({
            style: {
              background: "#FFFFFF",
              borderRadius: "20px",
            },
          }) as HTMLAttributes<any>
        }
      />
      <div className="h-4" />
      <div className="w-full flex items-center justify-center">
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
              setIndexPage(1);
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
  );
}

export default Gold;
