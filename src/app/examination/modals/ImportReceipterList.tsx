import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import React, { HTMLAttributes, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlueExportIcon from "@/app/components/icons/blue-export.svg";
import BlueEyeIcon from "@/app/components/icons/blue-eye.svg";
import TrashIcon from "@/app/components/icons/trash.svg";
import EyeIcon from "@/app/components/icons/eye.svg";
import Table, { ColumnsType } from "antd/es/table";
import CloseIcon from "@/app/components/icons/close.svg";
import {
  rowEndStyle,
  rowStartStyle,
  rowStyle,
} from "@/app/account/account-info/AccountInfo";
import MButton from "@/app/components/config/MButton";
import { FormattedNumber } from "react-intl";
import FileIcon from "@/app/components/icons/file.svg";

interface Props extends BaseModalProps {}

function ImportReceipterList(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [infos, setinfos] = useState<any[]>([
    { info: "dung23@gmail.com", approve_code: "123456", status: "Lỗi" },
    { info: "dung23@gmail.com", approve_code: "123456", status: "Lỗi" },
    { info: "dung23@gmail.com", approve_code: "123456", status: "Lỗi" },
  ]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const fileRef = useRef<any>(undefined);
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileClick = (e: any) => {
    e.stopPropagation();
    if (fileRef) {
      (fileRef!.current! as any).click();
    }
  };
  const columns: ColumnsType<any> = [
    {
      onHeaderCell: (_) => rowStartStyle,
      width: "34%",
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
      width: "33%",
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
      width: "33%",
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
  ];

  return (
    <BaseModal {...props}>
      <input
        accept=".xlsx, .pdf, .docx, ppt, pptx"
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
        onChange={(e) => {
          console.log("e", e);
          handleFileChange(e);
        }}
      />

      <div className="w-full flex flex-col items-start">
        <div className="body_semibold_14">{t("down_sample_file")}</div>
        <button onClick={handleFileClick} className="flex items-center">
          <BlueExportIcon />{" "}
          <span className="ml-2 text-[#4D7EFF] underline underline-offset-4">
            {t("up_list")}
          </span>
        </button>
      </div>
      <button className="flex flex-start w-full mt-2">
        <BlueEyeIcon />
        <span className="ml-2 text-[#4D7EFF] underline underline-offset-4">
          {t("preview")}
        </span>
      </button>
      {selectedFile && (
        <div className="w-full flex flex-start my-2">
          <div className="flex items-center bg-m_neutral_100 rounded-md">
            <div className="min-w-6 pl-2">
              <FileIcon />
            </div>
            <div className="ml-2 flex flex-col items-start">
              <p className="body_semibold_14 text-wrap overflow-clip max-w-[230px]">
                {selectedFile?.name}
              </p>
              {/* <p className="caption_regular_14"> */}
              {/*   { */}
              {/*     <FormattedNumber */}
              {/*       value={(selectedFile?.size ?? 0) / (1024 * 1024)} */}
              {/*       style="decimal" */}
              {/*       maximumFractionDigits={2} */}
              {/*     /> */}
              {/*   }{" "} */}
              {/*   MB */}
              {/* </p> */}
            </div>

            <button
              className="mr-2"
              onClick={() => {
                setSelectedFile(null);
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
      <div className="my-3 w-full flex flex-start body_semibold_14">
        {t("up_suceess_data", { num: "25/38" })}
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
      <MButton
        onClick={() => {
          props.onCancel();
        }}
        h="h-9"
        className="mt-4 w-[114px]"
        text={t("save")}
      />
    </BaseModal>
  );
}

export default ImportReceipterList;
