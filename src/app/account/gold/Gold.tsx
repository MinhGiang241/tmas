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

function Gold() {
  const { t } = useTranslation("account");
  const common = useTranslation();
  const [index, setIndex] = useState<any>("0");
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const user = useAppSelector((state: RootState) => state.user.user);
  const [goldHis, setGoldHis] = useState<GoldHistoryData[]>([]);

  useEffect(() => {
    loadGolds();
    loadHistoryGoldList();
  }, []);
  const [goldList, setGoldList] = useState<GoldData[]>([]);
  const loadGolds = async () => {
    var res = await loadGoldList({ skip: 0, limit: 100 });
    if (res.code != 0) {
      return;
    }
    setGoldList(res.data);

    console.log("res", res);
  };

  const loadHistoryGoldList = async () => {
    var res = await loadHistoryGold({
      skip: (indexPage - 1) * recordNum,
      limit: recordNum,
      changed: "up",
      fromDate: "",
      toDate: "",
      text: "",
      status: "",
    });
    if (res.code != 0) {
      return;
    }
    setGoldHis(res.data ?? []);
    setTotal(res.records ?? 0);

    console.log("res his", res);
  };

  const infos = [
    {
      act: "Nạp gold",
      content: "Nội dung",
      processing_time: "Thời gian thực hiện",
      gold_num_change: "+300",
    },
  ];
  const columns: ColumnsType<GoldHistoryData[]> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: <div className="w-full flex justify-start">{t("act")}</div>,
      dataIndex: "schema",
      key: "schema",
      render: (text, data) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text == "GoldTransaction" ? "Nạp Gold" : ""}
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
          {dayjs(text).format("HH:MM DD/MM/YYYY")}
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

  const [selected, setSelected] = useState<number | undefined>();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
        <div className="w-full grid grid-cols-3 gap-4 mt-4">
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
                <FormattedNumber
                  value={e?.gold ?? 0}
                  style="decimal"
                  maximumFractionDigits={2}
                />
              </div>
              <div className="body_bold_16 mt-1">{e.name}</div>
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
                }),
              );

              router.push(
                `/payment?type=Gold&goldId=${
                  goldList[selected as number]._id ?? ""
                }&price=${goldList[selected as number].cost ?? 0}`,
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
          <div className="caption_regular_14">
            <span>
              {t("current_gold")}: {user?.gold ?? 0}
            </span>
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
      <div className="w-full items-center flex p-5 bg-m_neutral_100 mb-3 rounded-lg">
        <MDateTimeSelect
          placeholder={t("from_date")}
          isTextRequire={false}
          h="h-[42px]"
          id="from_date"
          name="from_date"
          formatter="DD/MM/YYYY"
        />
        <div className="w-8" />
        <MDateTimeSelect
          placeholder={t("to_date")}
          isTextRequire={false}
          h="h-[42px]"
          id="to_date"
          name="to_date"
          formatter="DD/MM/YYYY"
        />
        <div className="w-8" />
        <MDropdown
          isTextRequire={false}
          h="h-[42px]"
          id="type"
          name="type"
          options={[
            { label: common.t("all"), value: "0" },
            { label: t("add_gold"), value: "1" },
            { label: t("minus_gold"), value: "2" },
          ]}
        />
        <div className="w-8" />
        <MButton h="h-9" className="mb-1" text={t("search")} />
      </div>
      <div className="body_semibold_16 mb-2">{t("transaction_history")}</div>
      <div className="w-full flex border-b-m_neutral_200 h-11 border-b ">
        <button
          onClick={() => {
            setIndex("0");
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
