import { Button, Divider, Table } from "antd";
import React, { useState, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "../../components/icons/add.svg";
import { ColumnsType } from "antd/es/table";
import TrashIcon from "../../components/icons/trash.svg";
import EditIcon from "../../components/icons/edit.svg";
import RotateIcon from "../../components/icons/rotate.svg";
import { Tooltip } from "antd";
import ConfirmModal from "@/app/components/modals/ConfirmModal";

interface DataType {
  id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  action?: string;
}

function AccountInfo() {
  const { t } = useTranslation("account");
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  var rowStartStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "10px 0 0 0",
    },
  };

  var rowStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
    },
  };
  var rowEndStyle = {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      color: "#003953",
      background: "#F4F5F5",
      borderRadius: "0 10px 0 0 ",
    },
  };

  var data: DataType[] = [
    {
      full_name: "Egan",
      email: "Eganabc.com",
      phone_number: "0989893999",
      role: "admin",
      action: true,
    },
    {
      full_name: "Egan",
      email: "Eganabc.com",
      phone_number: "0989893999",
      role: "admin",
      action: true,
    },
    {
      full_name: "Egan",
      email: "Eganabc.com",
      phone_number: "0989893999",
      role: "admin",
      action: false,
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      title: t("full_name"),
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("email"),
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("phone_number"),
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      title: t("role"),
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <p key={text} className="caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      title: t("action"),
      dataIndex: "action",
      key: "action",
      render: (action) => (
        <div>
          {action ? (
            <button>
              <EditIcon />
            </button>
          ) : (
            <Tooltip placement="bottom" title={t("resend_invite_email")}>
              <button>
                <RotateIcon />
              </button>
            </Tooltip>
          )}
          <button
            className="ml-2"
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <ConfirmModal
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onOk={() => {}}
      />

      <div className="w-full p-5 flex justify-between">
        <div>
          <div className="caption_semibold_20">{t("account_management")}</div>
          <div className="caption_regular_14">
            <span>{t("max_account")}</span>
            {": "}
            <span className="caption_semibold_14">{100}</span>
          </div>
        </div>
        <div>
          <Button
            className="border-m_primary_500 border-1 h-11 px-4 rounded-lg text-m_primary_500 caption_semibold_14 flex items-center"
            type="default"
            icon={<AddIcon />}
          >
            {t("add_account")}
          </Button>
        </div>
      </div>
      {/* <Divider className="p-0 my-0 mx-5" /> */}
      <div className="mx-5">
        <Divider className="mt-0" />
        <Table
          bordered={false}
          columns={columns}
          dataSource={data.map<DataType>((v) => ({
            ...v,
          }))}
          pagination={false}
          rowKey={"id"}
          onRow={(data, index: any) =>
            ({
              style: {
                background: data.action ? "#FFFFFF" : "#FFF9E6",
              },
            }) as HTMLAttributes<any>
          }
        />
      </div>
    </>
  );
}

export default AccountInfo;
