"use client";
import { uploadFile } from "@/services/api_services/account_services";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import FileIcon from "../../components/icons/file.svg";
import CloseIcon from "../../components/icons/close.svg";
import { FormattedNumber } from "react-intl";

interface UploadedFile {
  id?: string;
  name?: string;
  type?: string;
  size?: number;
}

interface Props {
  files: UploadedFile[];
  setFiles: any;
}

function DragDropUpload({ files, setFiles }: Props) {
  const { t } = useTranslation("exam");
  const fileRef = useRef(null);

  const handleFileChange = async (fileList: any) => {
    if (fileList) {
      var uploaded = [];
      for (let file of fileList) {
        var formData = new FormData();
        formData.append("file", file);
        formData.append("name", file?.name);

        var id = await uploadFile(formData);
        uploaded.push({
          id,
          name: file?.name,
          type: file?.type,
          size: file?.size,
        });
        console.log(files);
      }

      setFiles([...files, ...uploaded]);
    }
  };

  const handleFileClick = () => {
    if (fileRef) {
      (fileRef!.current! as any).click();
    }
  };

  const dropFile = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    handleFileChange(droppedFiles);
  };
  const [isDrag, setIsDrag] = useState<boolean>(false);
  return (
    <>
      <input
        multiple
        accept=".mp4,.jpg, .png, .jpeg, .xlsx, .pdf, .docx"
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {files.length == 0 && (
        <button
          onDragOverCapture={(e) => {
            setIsDrag(true);
          }}
          onDragEndCapture={(e) => {
            setIsDrag(false);
          }}
          onDragExitCapture={(e) => {
            setIsDrag(false);
          }}
          onDragLeaveCapture={(e) => {
            setIsDrag(false);
          }}
          onDrop={dropFile}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onClick={handleFileClick}
          className="w-full my-4 "
        >
          <div
            className={`w-full ${
              isDrag ? "border-m_primary_500 border-2" : "border"
            } flex justify-center items-center text-center h-[134px]  border-dashed rounded-lg px-4`}
          >
            <p className="body_regular_14 text-m_neutral_500">
              {t("drag_file")}{" "}
              <span className="text-[#4D7EFF]">{t("pick_file")}</span>{" "}
              {t("upload_intro")}
            </p>
          </div>
        </button>
      )}
      {files?.length != 0 && <div className="h-4" />}
      {files?.map((v: UploadedFile, i: number) => (
        <div
          key={v.id}
          className="p-4 rounded-lg mb-2 w-full justify-between items-center flex bg-neutral-100"
        >
          <div className="flex items-center">
            <div className="min-w-6">
              <FileIcon />
            </div>
            <div className="ml-2 flex flex-col items-start">
              <p className="body_semibold_14">{v.name}</p>
              <p className="caption_regular_14">
                {
                  <FormattedNumber
                    value={(v?.size ?? 0) / (1024 * 1024)}
                    style="decimal"
                    maximumFractionDigits={2}
                  />
                }{" "}
                MB
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFiles(files.filter((c) => c?.id != v?.id));
            }}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
      {files.length != 0 && (
        <button
          onClick={handleFileClick}
          className="text-[#4D7EFF] body_regular_12 underline underline-offset-4"
        >
          {t("pick_file")}
        </button>
      )}
    </>
  );
}

export default DragDropUpload;
