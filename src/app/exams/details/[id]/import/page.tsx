"use client";
import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useRef, useState } from "react";
import { Divider, Popover, Steps } from "antd";
import { useTranslation } from "react-i18next";
import MBreadcrumb from "@/app/components/config/MBreadcrumb";
import {
  DataQuestionsExelImport,
  DataQuestionsExelRead,
  ExamData,
  ReadQuestionExcelData,
} from "@/data/exam";
import { useOnMountUnsafe } from "@/services/ui/useOnMountUnsafe";
import { getExamById } from "@/services/api_services/examination_api";
import { errorToast } from "@/app/components/toast/customToast";
import DragDropUpload from "@/app/exams/components/DragDropUpload";
import { BaseQuestionData, QuestionType } from "@/data/question";
import BlueDownloadIcon from "@/app/components/icons/blue-download.svg";
import MButton from "@/app/components/config/MButton";
import FileIcon from "@/app/components/icons/file.svg";
import DeleteIcon from "@/app/components/icons/trash.svg";
import { CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  downloadQuestionTemplateExcel,
  importDataQuestionFromExcel,
  readQuestionTemplateExcel,
} from "@/services/api_services/exam_api";
import { saveAs } from "file-saver";
import Coding from "../question/Coding";
import Connect from "../question/Connect";
import Explain from "../question/Explain";
import FillBlank from "../question/FillBlank";
import ManyResult from "../question/ManyResult";
import Sql from "../question/Sql";
import TrueFalse from "../question/TrueFalse";
import Evaluation from "../question/Evaluation";
import Random from "../question/Random";

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
  const [errorString, setErrorString] = useState<DataQuestionsExelRead[]>([]);
  const [importErrorString, setImportErrorString] = useState<
    DataQuestionsExelImport[]
  >([]);

  const [questions, setQuestions] = useState<BaseQuestionData[]>([]);
  const [loadingImport, setLoadingImport] = useState<boolean>(false);

  var search = useSearchParams();
  var partId = search.get("partId");

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
        console.log("files", f);
        setFile(f);
        //setCurrentStep(1);
        var formData = new FormData();
        formData.append("files", f);
        formData.append("name", f?.name);
        setErrorString([]);
        setImportErrorString([]);

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

  const onDeleteQuestionRead = (index: number) => {
    var cloneQuests = [...questions];
    cloneQuests?.splice(index, 1);
    setQuestions(cloneQuests);
  };

  const onImportExel = async () => {
    setLoadingImport(true);
    var res = await importDataQuestionFromExcel({
      idExamQuestionPart: partId ?? undefined,
      examQuestionSuccess: questions,
    });
    setLoadingImport(false);
    if (res?.code != 0) {
      errorToast(res, res?.message ?? "");
      return;
    }
    var listError: DataQuestionsExelImport[] = res?.data?.filter(
      (r: DataQuestionsExelImport) => !r.isSuccess,
    );

    console.log("listError", listError);

    if (listError && listError?.length >= 0) {
      setImportErrorString(listError);
      return;
    }
    setImportErrorString([]);
    setCurrentStep(2);
  };

  const genQuestionRead = (e: BaseQuestionData, key: number) => {
    // var questionGroup = questionGroups?.find(
    //                         (v: any) => v.id === e.idGroupQuestion,
    //                       );
    if (e.questionType == "Coding") {
      return (
        <Coding
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}
          //getData={getData}
          //questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "Pairing") {
      return (
        <Connect
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          //getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "Essay") {
      return (
        <Explain
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "FillBlank") {
      return (
        <FillBlank
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "MutilAnswer") {
      return (
        <ManyResult
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "SQL") {
      return (
        <Sql
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "YesNoQuestion") {
      return (
        <TrueFalse
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    if (e.questionType == "Evaluation") {
      return (
        <Evaluation
          isBank={false}
          index={key + 1}
          key={e.id}
          examId={params.id}
          question={e}
          onlyDelete
          onDelete={() => onDeleteQuestionRead(key)}

          // getData={getData}
          // questionGroup={questionGroup}
        />
      );
    }
    return (
      <Random
        isBank={false}
        index={key + 1}
        key={e.id}
        examId={params.id}
        question={e}
        onlyDelete
        onDelete={() => onDeleteQuestionRead(key)}

        // getData={getData}
        // questionGroup={questionGroup}
      />
    );
  };

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
              if (e <= currentStep) {
                setCurrentStep(e);
              }
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
                      setErrorString([]);
                      setImportErrorString([]);
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
                <button
                  onClick={async () => {
                    var res = await downloadQuestionTemplateExcel(k);
                    if (res?.code != 0) {
                      errorToast(res, res?.message ?? "");
                      return;
                    }
                    saveAs(res?.data, `${k}-template.xlsx`);
                  }}
                  className="w-full flex items-center"
                  key={k}
                >
                  <BlueDownloadIcon />{" "}
                  <div className="ml-2 text-m_primary_500 body_regular_14">
                    {questTrans.t(`${k}_quest`)}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 body_regular_14">{t("excel_intro_1")}</div>
            <div className="w-full flex justify-center mt-10">
              <MButton
                text={t("preview_question")}
                onClick={async () => {
                  var formData = new FormData();
                  formData.append("files", file);
                  formData.append("name", file?.name);

                  var res = await readQuestionTemplateExcel(formData);
                  setImportErrorString([]);
                  if (res?.code != 0) {
                    errorToast(res, res?.message ?? "");
                    return;
                  }
                  var dataRead: ReadQuestionExcelData = res?.data[0];

                  if (dataRead?.errorMessage) {
                    setErrorString([
                      {
                        errorMessage: [dataRead?.errorMessage ?? ""],
                      },
                    ]);
                  } else {
                    var s = dataRead?.dataQuestions?.filter(
                      (d) => !d.isSuccess,
                    );
                    if (s && s?.length != 0) {
                      setErrorString(s ?? []);
                      return;
                    }
                  }

                  setCurrentStep(1);
                  console.log("res upload", res);
                  setQuestions(
                    dataRead?.dataQuestions?.map((e) => e.question) ?? [],
                  );
                }}
              />
            </div>
            {(errorString?.length != 0 || importErrorString?.length != 0) && (
              <div className="mt-5 px-5">
                <div className="body_semibold_14 mb-3">
                  {t("test_excel_file")}
                </div>
                <div className="w-full border-dashed p-5 border rounded-lg text-m_error_500">
                  {errorString?.map((u, i) => (
                    <div key={i} className="body_regular_14">
                      <div>
                        {t("row")}: {(u?.indexOfRow ?? 0) + 1}
                      </div>
                      {u?.errorMessage?.map((e, j) => (
                        <div key={j}>
                          <span>•</span>
                          {e}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <>
            <div className="px-5">
              {questions?.map((g, i: number) => genQuestionRead(g, i))}
            </div>
            <div className="w-full flex justify-center">
              <MButton
                loading={loadingImport}
                text={common.t("complete")}
                onClick={onImportExel}
              />
            </div>

            {importErrorString?.length != 0 && (
              <div className="mt-5 px-5">
                <div className="body_semibold_14 mb-3">
                  {t("test_excel_file")}
                </div>
                <div className="w-full border-dashed p-5 border rounded-lg text-m_error_500">
                  {importErrorString?.map((u, i) => (
                    <div key={i} className="body_regular_14">
                      <div>
                        {t("row")}: {u?.idQuestion ?? ""}
                      </div>
                      <div>
                        <span>•</span>
                        {u?.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
