"use client";
import BaseModal, { BaseModalProps } from "@/app/components/config/BaseModal";
import React, { HTMLAttributes, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import BlackExportIcon from "@/app/components/icons/black-export.svg";
import BlackEyeIcon from "@/app/components/icons/black-eye.svg";
import BlackImportIcon from "@/app/components/icons/black-import.svg";
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
import * as XLSX from "xlsx/xlsx.mjs";
import { RemindEmailData } from "@/data/exam";
import { v4 as uuidv4 } from "uuid";
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

interface Props extends BaseModalProps {}

function ImportReceipterList(props: Props) {
  const { t } = useTranslation("exam");
  const common = useTranslation();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const fileRef = useRef<any>(undefined);
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        var data = e?.target?.result;
        let readedData = XLSX.read(data, { type: "binary" });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log("dataParse", dataParse);
        var d = dataParse
          .slice(1)
          .filter((k: any) => k && k.length >= 2)
          .map((e: any) => {
            return { email: e[0], code: e[1], status: t("New") };
          });
        setSelectedData(d);
      };
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        setSelectedFile(file);
      };

      //reader.readAsDataURL(file);
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
      dataIndex: "email",
      key: "email",
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
      dataIndex: "code",
      key: "code",
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

  function getSheetData(data, header) {
    var fields = Object.keys(data[0]);
    var sheetData = data.map(function (row) {
      return fields.map(function (fieldName) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData.unshift(header);
    return sheetData;
  }

  async function saveAsExcel() {
    var data = [{ email: "", code: "" }];
    let header = ["Email", "Code"];

    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
      const sheet1 = workbook.sheet(0);
      const sheetData = getSheetData(data, header);
      const totalColumns = sheetData[0].length;

      sheet1.cell("A1").value(sheetData);
      const range = sheet1.usedRange();
      const endColumn = String.fromCharCode(64 + totalColumns);
      sheet1.row(1).style("bold", true);
      sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
      range.style("border", true);
      return workbook.outputAsync().then((res) => {
        saveAs(res, "file.xlsx");
      });
    });
  }

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

      <button
        onClick={saveAsExcel}
        className="mr-auto justify-start flex items-center"
      >
        <BlackImportIcon />
        <span className="ml-2 body_semibold_14 underline underline-offset-4">
          {t("down_sample_file")}
        </span>
      </button>

      <button
        onClick={handleFileClick}
        className="mr-auto justify-start flex items-center mt-2"
      >
        <BlackExportIcon />{" "}
        <span className="ml-2 body_semibold_14 underline underline-offset-4">
          {t("up_list")}
        </span>
      </button>

      <button className=" flex flex-start mr-auto items-center mt-2">
        <BlackEyeIcon />
        <span className="ml-2 body_semibold_14 underline underline-offset-4">
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
                setSelectedData([]);
                setSelectedFile(null);
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
      <div className="my-3 w-full flex flex-start body_semibold_14">
        {t("up_suceess_data", {
          num: `${selectedData.length}/${selectedData.length}`,
        })}
      </div>

      <Table
        className="w-full"
        bordered={false}
        columns={columns}
        dataSource={selectedData}
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
          var importedData: RemindEmailData[] =
            selectedData.map<RemindEmailData>((e) => ({
              _id: uuidv4(),
              email: e.email,
              code: e.code,
              status: "New",
            }));
          props.onOk!(importedData);
        }}
        h="h-9"
        className="mt-4 w-[114px]"
        text={t("save")}
      />
    </BaseModal>
  );
}

export default ImportReceipterList;
