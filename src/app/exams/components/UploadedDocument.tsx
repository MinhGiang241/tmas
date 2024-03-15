import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import FileIcon from "../../components/icons/file.svg";
import CloseIcon from "../../components/icons/close.svg";
import { getInfoAStudioDocument } from "@/services/api_services/examination_api";
import { UploadedFile } from "./DragDropUpload";
import { FormattedNumber } from "react-intl";
import { Tooltip } from "antd";

interface Props {
  deleteDoc: any;
  id?: string;
  isExist: boolean;
  file?: UploadedFile;
}

function UploadedDocument({ isExist, id, deleteDoc, file }: Props) {
  const [info, setInfo] = useState<UploadedFile>();
  useEffect(() => {
    if (isExist && id && !info) {
      getInfoFile();
    } else {
      setInfo(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const linkRef = useRef<any>(undefined);

  const getInfoFile = async () => {
    var infoFile = await getInfoAStudioDocument(id);
    if (infoFile.code == 0) {
      var f = infoFile?.data?.records[0];
      setInfo({
        id: f?.id,
        name: f?.fileName,
        size: f?.fileSize,
      });
    }
    console.log("infoFile", infoFile);
  };
  return (
    <>
      <Link
        ref={linkRef}
        href={`${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/download/${info?.id}`}
        target="_top"
        key={info?.id}
        className="hidden "
      ></Link>
      <div
        className={`z-40 relative cursor-pointer p-4 rounded-lg mb-2 w-full justify-between items-center flex ${
          file?.error ? "bg-m_error_100" : "bg-neutral-100"
        }`}
      >
        <div
          onClick={() => {
            if (linkRef && !file?.error) {
              (linkRef!.current! as any).click();
            }
          }}
          className="absolute top-0 bottom-0 left-0 right-12"
        />
        <div className="flex items-center">
          <div className="min-w-6">
            <FileIcon />
          </div>
          <div className="ml-2 flex flex-col items-start">
            <p className="body_semibold_14 text-wrap overflow-clip max-w-[230px]">
              {info?.name}
            </p>
            <p className="caption_regular_14">
              {
                <FormattedNumber
                  value={(info?.size ?? 0) / (1024 * 1024)}
                  style="decimal"
                  maximumFractionDigits={2}
                />
              }{" "}
              MB
            </p>
          </div>
        </div>

        <button onClick={deleteDoc}>
          <CloseIcon />
        </button>
        {file?.error && (
          <Tooltip
            className="absolute top-0 bottom-0 left-0 right-10"
            title={file?.errorMessage}
            color={"#EA3434"}
            key={file?.id}
          ></Tooltip>
        )}
      </div>
    </>
  );
}

export default UploadedDocument;
