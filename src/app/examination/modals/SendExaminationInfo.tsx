import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import MInput from "@/app/components/config/MInput";
import { Pagination, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
import React, { HTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import TrashIcon from "@/app/components/icons/trash.svg";
import EyeIcon from "@/app/components/icons/eye.svg";
import PushIcon from "@/app/components/icons/push.svg";
import AddCircleIcon from "@/app/components/icons/add-circle.svg";
import { FormattedDate } from "react-intl";
import dayjs from "dayjs";
import MButton from "@/app/components/config/MButton";
import ContentDetailsModal from "./ContentDetailsModal";
import AddReceiptInfo from "./AddReceiptInfo";
import ImportReceipterList from "./ImportReceipterList";

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  },
);

interface Props extends BaseModalProps {}
const dateFormat = "DD/MM/YYYY HH:mm";

function SendExaminationInfo(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [indexPage, setIndexPage] = useState<number>(1);
  const [recordNum, setRecordNum] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>();
  const [active, setActive] = useState<any>();
  const [openDetal, setOpenDetail] = useState<boolean>(false);
  const [openAddInfo, setOpenAddInfo] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);

  const [infos, setInfos] = useState<any>([
    {
      info: "dung23@gmail.com",
      approve_code: "123456",
      status: "Lỗi",
      send_time: "2024-04-02T09:31:13.300+0000",
    },
    {
      info: "dung23@gmail.com",
      approve_code: "123456",
      status: "Lỗi",
      send_time: "2024-04-02T09:31:13.300+0000",
    },
    {
      info: "dung23@gmail.com",
      approve_code: "123456",
      status: "Lỗi",
      send_time: "2024-04-02T09:31:13.300+0000",
    },
    {
      info: "dung23@gmail.com",
      approve_code: "123456",
      status: "Lỗi",
      send_time: "2024-04-02T09:31:13.300+0000",
    },
  ]);

  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      width: "30%",
      title: (
        <div className="w-full flex justify-start">{t("personal_info")}</div>
      ),
      dataIndex: "info",
      key: "info",
      render: (text, data) => (
        <p key={text} className="w-full  min-w-11 break-all caption_regular_14">
          {text}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowStyle,
      width: "20%",
      title: (
        <div className="w-full break-all  flex justify-start">
          {t("approve_code")}
        </div>
      ),
      dataIndex: "approve_code",
      key: "approve_code",
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
      width: "20%",
      title: <div className="w-full flex justify-start">{t("status")}</div>,
      dataIndex: "status",
      key: "status",
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
      width: "20%",
      title: <div className="w-full flex justify-start">{t("send_time")}</div>,
      dataIndex: "send_time",
      key: "send_time",
      render: (text) => (
        <p
          key={text}
          className="w-full  break-all  flex  min-w-11 justify-start caption_regular_14"
        >
          {dayjs(text).format(dateFormat)}
        </p>
      ),
    },
    {
      onHeaderCell: (_) => rowEndStyle,
      width: "10%",
      title: (
        <div className="w-full  flex justify-center">{common.t("action")}</div>
      ),
      dataIndex: "schema",
      key: "schema",
      render: (action, data) => (
        <div className="w-full flex justify-center ">
          <button
            className="ml-2"
            onClick={() => {
              setOpenDetail(true);
            }}
          >
            <EyeIcon />
          </button>

          <button className="ml-2" onClick={() => {}}>
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <BaseModal {...props} width={1027}>
      <ImportReceipterList
        title={t("import_receipter_list")}
        onCancel={() => {
          setOpenImport(false);
        }}
        onOk={() => {
          setOpenImport(false);
        }}
        open={openImport}
        width={705}
      />
      <AddReceiptInfo
        width={564}
        title={t("add_info_receipter")}
        open={openAddInfo}
        onCancel={() => {
          setOpenAddInfo(false);
        }}
        onOk={() => {
          setOpenAddInfo(false);
        }}
      />
      <ContentDetailsModal
        open={openDetal}
        width={564}
        title={t("detail")}
        onCancel={() => setOpenDetail(false)}
        onOk={() => {
          setOpenDetail(false);
        }}
      />
      <div className="w-full">
        <div className="title_bold_24">{t("send_exam_info")}</div>
        <MInput
          id="media"
          name="media"
          title={t("media")}
          placeholder={t("media")}
        />
        <EditorHook
          isCount={false}
          id="send_content"
          name="send_content"
          title={t("send_content")}
        />
        <div className="mt-2 body_semibold_14 flex items-center justify-between">
          <div>{t("receipt_info_list")}</div>
          <div className="flex items-center">
            <form>
              <MInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                isTextRequire={false}
                h="h-9"
                placeholder={t("enter_to_search")}
                id="info"
                name="info"
              />
            </form>
            <div className="w-2" />
            <button
              onClick={() => {
                setOpenImport(true);
              }}
            >
              <PushIcon />
            </button>
            <div className="w-2" />
            <button
              onClick={() => {
                setOpenAddInfo(true);
              }}
            >
              <AddCircleIcon />
            </button>
          </div>
        </div>
        <div className="flex">
          <p className="body_regular-14 mr-3">
            {t("sending")}:
            <span className="body_semibold_14 ml-1">{"35/15"}</span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("sent")}: <span className="body_semibold_14 ">{"35/15"}</span>
          </p>
          <p className="body_regular-14 mr-3">
            {t("sending")}:
            <span className="body_semibold_14 ml-1">{"35/15"}</span>
          </p>
        </div>
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
        <div className="w-full flex h-12 items-center  justify-center">
          <span className="body_regular_14 mr-2">{`${total} ${t(
            "result",
          )}`}</span>
          <Pagination
            i18nIsDynamicList
            pageSize={recordNum}
            onChange={(v) => {
              setIndexPage(v);
            }}
            current={indexPage}
            total={total}
            showSizeChanger={false}
          />
          <div className="hidden ml-2 h-12 lg:flex items-center">
            <Select
              optionRender={(oriOption) => (
                <div className="flex justify-center">{oriOption?.label}</div>
              )}
              rootClassName="m-0 p-0"
              onChange={(v) => {
                setRecordNum(v);
              }}
              defaultValue={15}
              options={[
                ...[15, 25, 30, 50, 100].map((i: number) => ({
                  value: i,
                  label: (
                    <span className=" body_regular_14">{`${i}/${common.t(
                      "page",
                    )}`}</span>
                  ),
                })),
              ]}
              className="select-page min-w-[124px]"
            />
          </div>
        </div>
        <MButton h="h-9" className="w-[114px]" text={t("send")} />
      </div>
    </BaseModal>
  );
}

export default SendExaminationInfo;
