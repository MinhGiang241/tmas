"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useRef, useState } from "react";
import { Divider, Popover, Steps } from "antd";
import { useTranslation } from "react-i18next";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import { ExamData } from "@/data/exam";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { getExamById } from "@/services/api_services/examination_api";
import { errorToast } from "@/app/components/toast/customToast";
import DragDropUpload from "@/app/exams/components/DragDropUpload";
import { QuestionType } from "@/data/question";
import BlueDownloadIcon from "@/app/components/icons/blue-download.svg";
import MButton from "@/app/components/config/MButton";
import FileIcon from "@/app/components/icons/file.svg";
import DeleteIcon from "@/app/components/icons/trash.svg";
import { CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ImportQuestion({ params }: any) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [exam, setExam] = useState<ExamData | undefined>();
  const [openPop, setOpenPop] = useState<boolean>(false);
  const router = useRouter();

  useOnMountUnsafe(() => {
    loadExamById();
  });

  const loadExamById = async () => {
    var res = await getExamById(params?.id);
    if (res?.code != 0) {
      return;
    }

    if (res.code != 0) {
      errorToast(res, res?.message ?? "");
      return;
    }

    setExam(res?.data?.records[0]);
  };

  const [file, setFile] = useState<any>();
  const { t } = useTranslation("exam");
  const common = useTranslation("common");
  const questTrans = useTranslation("question");
  const description = "This is a description.";
  const items = [
    {
      title: t("upload_question"),
    },
    {
      title: t("preview_question"),
    },
    {
      title: t("confirm"),
    },
  ];

  const fileRef = useRef(null);
  const handleFileChange = async (fileList: any) => {
    console.log("fileList", fileList);
    if (fileList) {
      var uploaded = [];
      for (let f of fileList) {
        console.log("file", f);
        setFile(f);
        //setCurrentStep(1);
        var formData = new FormData();
        formData.append("files", f);
        formData.append("name", f?.name);

        // var idData = await uploadStudioDocument(idSession, formData);
        // console.log("id upload", idData);
        // console.log("idSession", idSession);
        //
        // uploaded.push({
        //   error: idData.code != 0,
        //   errorMessage: idData.code != 0 ? idData?.message : undefined,
        //   id: idData.code != 0 ? Date.now().toString() : idData?.data[0],
        //   name: file?.name,
        //   type: file?.type,
        //   size: file?.size,
        // });
        // console.log(files);
      }

      // setFiles([...(files ?? []), ...uploaded]);
    }
  };

  const handleFileClick = (e: any) => {
    setOpenPop(false);
    setIsDrag(false);
    e.stopPropagation();
    if (tempFile) {
      setFile(tempFile);
      setTempFile(undefined);
      return;
    }

    if (fileRef) {
      (fileRef!.current! as any).click();
    }
    setOpenPop(false);
  };
  const [tempFile, setTempFile] = useState();
  const handleFileDrop = (file: any) => {
    setOpenPop(true);
    setTempFile(file);
  };

  const dropFile = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    handleFileDrop(droppedFiles);
    setOpenPop(true);
  };
  const [isDrag, setIsDrag] = useState<boolean>(false);

  var questionTypes = [
    QuestionType.MutilAnswer,
    QuestionType.YesNoQuestion,
    QuestionType.Coding,
    QuestionType.SQL,
    QuestionType.Essay,
    QuestionType.Evaluation,
    QuestionType.Pairing,
    QuestionType.FillBlank,
    QuestionType.Random,
  ];

  return (
    <HomeLayout>
      <input
        multiple
        accept=".xlsx, .xls"
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
        onChange={(e) => {
          console.log("e", e);
          handleFileChange(e.target.files);
        }}
      />

      <div className="h-3" />
      <MBreadcrumb
        items={[
          { text: t("exam_list"), href: "/exams" },
          {
            href: `/exams/details/${exam?.id}`,
            text: exam?.name,
          },
          { text: t("import_quest"), href: "#", active: true },
        ]}
      />
      <div className="py-5 w-full bg-white min-h-screen ">
        <div className=" body_semibold_14  lg:px-56 px-5">
          <Steps
            className="custom-steps"
            onChange={(e) => {
              setCurrentStep(e);
            }}
            current={currentStep}
            labelPlacement="vertical"
            items={items}
          />
        </div>
        <Divider className="my-4" />

        <div className="h-11" />
        {currentStep === 0 && (
          <div className="lg:px-56 px-5">
            <div className="body_semibold_14">{t("doc_file")}</div>
            {currentStep === 0 && !file && (
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
                //onClick={handleFileClick}
                className={`border-dashed w-full p-5 rounded-lg h-32 ${
                  isDrag ? "border-m_primary_500 border-2" : "border"
                }`}
              >
                <Popover
                  trigger={["click"]}
                  onOpenChange={(v) => {
                    setOpenPop(v);
                  }}
                  open={openPop}
                  placement="bottom"
                  content={
                    <div className="flex flex-col items-start">
                      {questionTypes?.map((o) => (
                        <button onClick={handleFileClick} key={o}>
                          {questTrans.t(o)}
                        </button>
                      ))}
                    </div>
                  }
                >
                  <div className="body_regular_14 text-m_neutral_500">
                    {t("drag_file")}{" "}
                  </div>
                  <button className="text-[#4D7EFF] body_regular_14">
                    {t("pick_file").toLowerCase()}
                    <span>
                      <CaretDownOutlined className="text-[#4D7EFF]" />
                    </span>
                  </button>
                </Popover>
              </button>
            )}

            {file && currentStep === 0 && (
              <>
                <div className="p-5 rounded-lg bg-m_neutral_100 flex items-center">
                  <FileIcon />
                  <div className="flex-grow flex justify-start ml-3 body_regular_14">
                    {file?.name}
                  </div>
                  <button
                    onClick={() => {
                      setFile(undefined);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    setTimeout(() => handleFileClick(e), 10);
                  }}
                  className="flex mt-4 text-[#4D7EFF] underline underline-offset-4 items-center"
                >
                  {t("pick_file")}
                  <span>
                    <CaretDownOutlined className="" />
                  </span>
                </button>
              </>
            )}
            <div className="body_semibold_14 mt-5">
              {t("download_sample_file")}
            </div>
            <div className="caption_regular_12">{t("excel_intro")}</div>
            <div className="p-5 mt-5  bg-m_neutral_100 rounded-lg">
              {questionTypes?.map((k) => (
                <button className="w-full flex items-center" key={k}>
                  <BlueDownloadIcon />{" "}
                  <div className="ml-2 text-m_primary_500">
                    {questTrans.t(`${k}_quest`)}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 body_regular_14">{t("excel_intro_1")}</div>
            <div className="w-full flex justify-center mt-10">
              <MButton
                text={t("preview_question")}
                onClick={() => {
                  setCurrentStep(1);
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <>
            <div className="w-full flex justify-center">
              <MButton
                text={common.t("complete")}
                onClick={() => {
                  setCurrentStep(2);
                }}
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="relative w-[318px] h-[297px]">
              <Image
                loading="lazy"
                className="absolute top-0 bottom-0 right-0 left-0"
                objectFit="cover"
                fill
                alt="Preview"
                src={"/images/pana.png"}
              />
            </div>
            <div className="body_semibold_14 mt-4">{t("complete_upload")}</div>
            <div className="flex mt-7">
              <MButton
                onClick={() => {
                  router.push(`/exams/details/${params.id}`);
                }}
                text={t("back_exam_page")}
                type="secondary"
              />
              <div className="w-4" />
              <MButton
                text={t("upload_other_file")}
                onClick={() => {
                  setFile(undefined);
                  setCurrentStep(0);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default ImportQuestion;
