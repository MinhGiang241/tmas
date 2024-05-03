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
import * as XLSX from "xlsx";
import { ExaminationData, RemindEmailData } from "@/data/exam";
import { v4 as uuidv4, validate } from "uuid";
import { saveAs } from "file-saver";
import _, { parseInt } from "lodash";
//@ts-ignore
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { parse } from "path";
import { emailRegex } from "@/services/validation/regex";

interface Props extends BaseModalProps {
  examination?: ExaminationData;
  list?: RemindEmailData[];
}

function ImportReceipterList(props: Props) {
  const { t } = useTranslation("exam");
  const [errorList, setErrorList] = useState<any[]>([]);
  const common = useTranslation();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const fileRef = useRef<any>(undefined);
  const [dataList, setDataList] = useState<any[]>([]);
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
        var d = dataParse
          .slice(1)
          .filter((k: any) => k && k.length >= 2)
          .map((e: any) => {
            return { email: e[0], passcode: e[1], status: t("New") };
          });

        validateImportData(d);
      };
      reader.readAsBinaryString(file);
      reader.onloadend = () => {
        setSelectedFile(file);
      };

      //reader.readAsDataURL(file);
    }
  };

  const validateImportData = (data: any) => {
    // bắt trùng mail
    setDataList(data);
    var map: any = {};
    for (let i in data) {
      map[data[parseInt(i)].email] = map[data[parseInt(i)].email]
        ? map[data[parseInt(i)].email] + 1
        : 1;
    }
    const mailDup: any = [];
    Object.keys(map).map((e) => {
      if (map[e] >= 2) {
        mailDup.push(e);
      }
    });
    // bắt trùng code
    var codes: any = {};
    for (let i in data) {
      map[data[parseInt(i)].passcode] = map[data[parseInt(i)].passcode]
        ? map[data[parseInt(i)].passcode] + 1
        : 1;
    }
    const codeDup: any = [];
    Object.keys(codes).map((e) => {
      if (codes[e] >= 2) {
        codeDup.push(e);
      }
    });

    var dataDup: any = [];
    var dataNotDup: any = [];
    var dataMailNotExisted: any = [];
    var dataMailNotValid: any = [];
    var existedMailDup: any = [];
    var existedCodeDup: any = [];
    var codeDataDup: any = [];
    var notExamTestCode: any = [];

    for (let j in data) {
      if (!data[parseInt(j)].email?.trim()) {
        dataMailNotExisted.push(j);
      } else if (!emailRegex.test(data[parseInt(j)].email)) {
        dataMailNotValid.push(j);
      } else if (mailDup.includes(data[parseInt(j)].email?.toLowerCase())) {
        dataDup.push(j);
      } else if (
        props.list
          ?.map((e) => e.email)
          ?.includes(data[parseInt(j)].email?.toLowerCase())
      ) {
        existedMailDup.push(j);
      } else if (
        !props.examination?.accessCodeSettings
          ?.map((e) => e.code)
          .includes(data[parseInt(j)].passcode) &&
        props.examination?.accessCodeSettingType == "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      ) {
        notExamTestCode.push(j);
      } else if (
        codeDup.includes(data[parseInt(j)].passcode) &&
        props.examination?.accessCodeSettingType == "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      ) {
        codeDataDup.push(j);
      } else if (
        props.list
          ?.map((e) => e.passcode)
          ?.includes(data[parseInt(j)].passcode) &&
        props.examination?.accessCodeSettingType == "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      ) {
        existedCodeDup.push(j);
      } else {
        dataNotDup.push(data[parseInt(j)]);
      }
    }

    var notExamTestEx = notExamTestCode.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Code không tồn tại trong đợt thi",
      value: data[parseInt(d)].passcode,
    }));

    var existedCodeEx = existedCodeDup.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Code đã tồn tại",
      value: data[parseInt(d)].passcode,
    }));

    var codDupEx = codeDataDup.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Bị trùng code trong file excel",
      value: data[parseInt(d)].passcode,
    }));

    var notMailEx = dataMailNotExisted.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Trường email bị trống",
      value: data[parseInt(d)].email,
    }));
    var invalidMailEx = dataMailNotValid.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Email không đúng định dạng",
      value: data[parseInt(d)].email,
    }));

    var fileDupEx = dataDup.map((d: any) => ({
      index: parseInt(d) + 2,
      mess: "Bị trùng email trong file excel",
      value: data[parseInt(d)].email,
    }));
    var exiestDupEx = existedMailDup.map((t: any) => ({
      index: parseInt(t) + 2,
      mess: "Email đã tồn tại",
      value: data[parseInt(t)].email,
    }));
    setErrorList([
      ...notExamTestEx,
      ...existedCodeEx,
      ...codDupEx,
      ...notMailEx,
      ...invalidMailEx,
      ...fileDupEx,
      ...exiestDupEx,
    ]);
    setSelectedData(dataNotDup);
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
        <div className="w-full flex justify-start">{t("receipter_info")}</div>
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
      width: !(
        props.examination?.accessCodeSettingType === "MultiCode" &&
        props.examination?.sharingSetting == "Private"
      )
        ? "0%"
        : "33%",
      title: (
        <div
          className={`w-full break-all  ${
            !(
              props.examination?.accessCodeSettingType === "MultiCode" &&
              props.examination?.sharingSetting == "Private"
            )
              ? "hidden"
              : "flex"
          } justify-start`}
        >
          {t("access_code")}
        </div>
      ),
      dataIndex: "passcode",
      key: "passcode",
      render: (text) => (
        <p
          key={text}
          className={` ${
            !(
              props.examination?.accessCodeSettingType === "MultiCode" &&
              props.examination?.sharingSetting == "Private"
            )
              ? "hidden"
              : "flex"
          } w-full break-all min-w-11 justify-start caption_regular_14`}
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

  function getSheetData(data: any, header: any) {
    var fields =
      props.examination?.accessCodeSettingType === "MultiCode" &&
      props.examination?.sharingSetting == "Private"
        ? ["Email", "Code"]
        : ["Email"];
    var sheetData = data.map(function (row: any) {
      return fields.map(function (fieldName: any) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData.unshift(header);
    return sheetData;
  }
  function getErrorSheetData(data: any, header: any) {
    var fields = ["index", "mess", "value"];
    var sheetData = data.map(function (row: any) {
      return fields.map(function (fieldName: any) {
        return row[fieldName] ? row[fieldName] : "";
      });
    });
    sheetData.unshift(header);
    return sheetData;
  }

  async function saveAsExcel() {
    var data: any = [];
    let header =
      props.examination?.accessCodeSettingType === "MultiCode" &&
      props.examination?.sharingSetting == "Private"
        ? ["Email", "Code"]
        : ["Email"];

    XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
      const sheet1 = workbook.sheet(0);
      const sheetData = getSheetData(data, header);
      const totalColumns = sheetData[0].length;

      sheet1.cell("A1").value(sheetData);
      const range = sheet1.usedRange();
      const endColumn = String.fromCharCode(64 + totalColumns);
      sheet1.row(1).style("bold", true);
      sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
      range.style("border", true);
      return workbook.outputAsync().then((res: any) => {
        saveAs(res, "Sample.xlsx");
      });
    });
  }

  const saveErrorExcel = () => {
    let header = ["Dòng", "Lỗi", "Giá trị"];
    console.log("err", errorList);

    XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
      const sheet1 = workbook.sheet(0);
      const sheetData = getErrorSheetData(errorList, header);
      const totalColumns = sheetData[0].length;

      sheet1.cell("A1").value(sheetData);
      const range = sheet1.usedRange();
      const endColumn = String.fromCharCode(64 + totalColumns);
      sheet1.row(1).style("bold", true);
      sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
      range.style("border", true);
      return workbook.outputAsync().then((res: any) => {
        saveAs(res, "Error.xlsx");
      });
    });
  };

  return (
    <BaseModal {...props}>
      <input
        accept=".xlsx, .xls"
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
        <span className="ml-2 body_semibold_14 ">{t("down_sample_file")}</span>
      </button>

      <button
        onClick={handleFileClick}
        className="mr-auto justify-start flex items-center mt-2"
      >
        <BlackExportIcon />{" "}
        <span className="ml-2 body_semibold_14 ">{t("up_list")}</span>
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
            </div>

            <button
              className="mr-2"
              onClick={() => {
                setSelectedData([]);
                setErrorList([]);
                setDataList([]);
                setSelectedFile(null);
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
      {/* <button className=" flex flex-start mr-auto items-center mt-2"> */}
      {/*   <BlackEyeIcon /> */}
      {/*   <span className="ml-2 body_semibold_14 ">{t("preview")}</span> */}
      {/* </button> */}

      <div className="my-3 w-full flex justify-between ">
        <div className="body_semibold_14">
          {t("up_suceess_data", {
            num: `${selectedData.length}/${dataList.length}`,
          })}
        </div>
        {errorList.length > 0 && (
          <button
            onClick={() => {
              saveErrorExcel();
            }}
            className="text-m_neutral_900 italic underline underline-offset-4"
          >
            {t("download_error_list")}
          </button>
        )}
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
              passcode: e.passcode,
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
