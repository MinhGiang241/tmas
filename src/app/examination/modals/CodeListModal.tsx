import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import React, { HTMLAttributes, useState } from "react";
import { ExaminationCode } from "../components/ExaminationCode";
import { useTranslation } from "react-i18next";
import { Pagination, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import TrashIcon from "../../components/icons/trash.svg";
import { FormattedDate } from "react-intl";

interface Props extends BaseModalProps {
  list?: ExaminationCode[];
  setCodes: any;
}

function CodeListModal(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);

  const columns: ColumnsType<ExaminationCode> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: <div className="w-full flex justify-start">{t("code")}</div>,
      dataIndex: "code",
      key: "code",
      render: (text, data) => (
        <p key={text} className="min-w-24 caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,

      title: (
        <div className="w-full flex justify-center">
          {common.t("created_date")}
        </div>
      ),
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <p key={text} className="flex justify-center caption_regular_14">
          <FormattedDate
            value={text}
            day="2-digit"
            month="2-digit"
            year="numeric"
          />
        </p>
      ),
    },

    {
      onHeaderCell: (_) => rowEndStyle,
      title: (
        <div className="w-full flex justify-end">{common.t("action")}</div>
      ),
      dataIndex: "schema",
      key: "schema",
      render: (action, data) => (
        <div className="flex justify-end min-w-16">
          <button
            className="ml-2"
            onClick={() => {
              props.setCodes([
                ...(props.list ?? []).filter((c: any) => c.id != data?.id),
              ]);
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <BaseModal title={t("code_list")} width={1145} {...props}>
      <Table
        className="w-full"
        bordered={false}
        columns={columns}
        dataSource={props.list?.slice(
          (indexPage - 1) * recordNum,
          (indexPage - 1) * recordNum + recordNum,
        )}
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
      <div className="h-8" />
      <div className="w-full flex lg:justify-between justify-center">
        <div className="hidden lg:flex items-center">
          <span className="body_regular_14 mr-2">{`${props.list?.length} ${t(
            "result",
          )}`}</span>
          <Select
            value={recordNum}
            onChange={(v) => {
              setRecordNum(v);
              setIndexPage(1);
            }}
            options={[
              ...[15, 25, 30, 50, 100].map((i: number) => ({
                value: i,
                label: (
                  <span className="body_regular_14">{`${i}/${common.t(
                    "page",
                  )}`}</span>
                ),
              })),
            ]}
            className="min-w-[124px]"
          />
        </div>
        <Pagination
          pageSize={recordNum}
          onChange={(v) => {
            setIndexPage(v);
          }}
          current={indexPage}
          total={props.list?.length}
          showSizeChanger={false}
        />
      </div>
    </BaseModal>
  );
}

export default CodeListModal;
