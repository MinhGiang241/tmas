import MButton from "@/app/components/config/MButton";
import React, { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Divider, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "../account-info/AccountInfo";

function HistoryUpgrade() {
  const dateFormat = "DD/MM/YYYY";
  const { t } = useTranslation("account");
  const router = useRouter();
  const data: any[] = [];
  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: <div className="flex justify-start">{t("upgrade_package")}</div>,
      dataIndex: "code",
      key: "code",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className=" flex justify-start">{t("upgrade_time")}</div>,
      dataIndex: "code",
      key: "code",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: <div className="flex justify-start">{t("deadline")}</div>,
      dataIndex: "code",
      key: "code",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: <div className=" flex justify-start">{t("total_pay")}</div>,
      dataIndex: "code",
      key: "code",
      render: (text, data) => (
        <p key={text} className="w-full caption_regular_14">
          {text}
        </p>
      ),
    },
  ];
  return (
    <div className="w-full p-5 flex flex-col">
      <div className="w-full flex justify-between items-start">
        <div>
          <div className="w-full title_semibold_20">{t("history_pay")}</div>
          <div className="flex caption_regular_14">
            <span className="text-m_neutral_500 mr-1">
              {t("current_package")}:
            </span>
            <span>{"200"}</span>
          </div>
          <div className="flex caption_regular_14">
            <span className="text-m_neutral_500 mr-1">{t("deadline")}:</span>
            <span>
              {dayjs("2024-04-17T09:22:09.570+0000").format(dateFormat)} -
              {dayjs("2024-04-20T09:22:09.570+0000").format(dateFormat)}
            </span>
          </div>
        </div>

        <MButton
          onClick={() => {
            router.push("/upgrade");
          }}
          h="h-11"
          text={t("upgrade")}
        />
      </div>
      <Divider className="my-2" />
      <div className="body_semibold_16 my-2">{t("list")}</div>
      <Table
        className="w-full"
        bordered={false}
        columns={columns}
        dataSource={data}
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
    </div>
  );
}

export default HistoryUpgrade;
