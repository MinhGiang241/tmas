"use client";
import { uploadFile } from "@/services/api_services/account_services";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import FileIcon from "../../components/icons/file.svg";
import CloseIcon from "../../components/icons/close.svg";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import {
  deleteDocumentById,
  downloadStudioDocument,
  uploadStudioDocument,
} from "@/services/api_services/examination_api";
import { Tooltip } from "antd";

import { error } from "console";
import UploadedDocument from "./UploadedDocument";

export interface UploadedFile {
  id?: string;
  name?: string;
  type?: string;
  error?: boolean;
  size?: number;
  errorMessage?: string;
}

interface Props {
  uploaded: string[];
  setUploaded: any;
  files: UploadedFile[];
  idSession?: string;
  setFiles: any;
}

function DragDropUpload({
  idSession,
  uploaded,
  setUploaded,
  files,
  setFiles,
}: Props) {
  const { t } = useTranslation("exam");
  const fileRef = useRef(null);

  const handleFileChange = async (fileList: any) => {
    if (fileList) {
      var uploaded = [];
      for (let file of fileList) {
        var formData = new FormData();
        formData.append("files", file);
        formData.append("name", file?.name);

        var idData = await uploadStudioDocument(idSession, formData);
        console.log("id upload", idData);

        uploaded.push({
          error: idData.code != 0,
          errorMessage: idData.code != 0 ? idData?.message : undefined,
          id: idData.code != 0 ? Date.now().toString() : idData?.data[0],
          name: file?.name,
          type: file?.type,
          size: file?.size,
        });
        console.log(files);
      }

      setFiles([...files, ...uploaded]);
    }
  };

  const handleFileClick = (e: any) => {
    e.stopPropagation();
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
        accept=".xlsx, .pdf, .docx, ppt, pptx"
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <div className="mt-4 body_semibold_14">{t("pick_file")}</div>
      {files.length == 0 && uploaded.length == 0 && (
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
              <span className="text-[#4D7EFF]">
                {t("pick_file").toLowerCase()}
              </span>{" "}
              {t("upload_intro")}
            </p>
          </div>
        </button>
      )}
      {(files?.length != 0 || uploaded?.length != 0) && <div className="h-4" />}
      {uploaded?.map((u: any, i: number) => (
        <UploadedDocument
          isExist={true}
          key={u}
          id={u}
          deleteDoc={async (e: any) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            await deleteDocumentById(u);
            setUploaded(uploaded.filter((c) => c != u));
          }}
        />
      ))}

      {files?.map((v: UploadedFile, i: number) => (
        <UploadedDocument
          file={v}
          isExist={false}
          key={v.id}
          deleteDoc={async (e: any) => {
            console.log(e);
            console.log(files);
            await deleteDocumentById(v?.id ?? "");
            // e.stopPropagation();
            // e.nativeEvent.stopImmediatePropagation();
            setFiles(files.filter((c) => c?.id != v?.id));
          }}
        />
      ))}
      {(files.length != 0 || uploaded.length) != 0 && (
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
