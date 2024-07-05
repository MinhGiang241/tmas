import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { QuestionGroupData } from "@/data/exam";
import { BaseQuestionFormData } from "@/data/form_interface";
import { Input, Upload, Image, UploadProps, UploadFile, GetProp } from "antd";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import {
  resetMultiAnswer,
  setQuestionLoading,
} from "@/redux/questions/questionSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  createEvaluationQuestion,
  updateEvaluationQuestion,
} from "@/services/api_services/question_api";
import { useRouter, useSearchParams } from "next/navigation";
import { errorToast, successToast } from "@/app/components/toast/customToast";
import { uploadImageStudio } from "@/services/api_services/account_services";

// const getBase64 = (file: any) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export interface QuestionEvaluation {
  question?: string;
  numberPoint?: number;
  idGroupQuestion?: string;
  questionType?: string;
  idExamQuestionPart?: string;
  idExamQuestionBank?: string;
  isQuestionBank?: boolean;
  content?: {
    explainAnswer?: string;
    isChangePosition?: boolean;
    answers?: {
      label?: string;
      text?: string;
      point?: number;
      idIcon?: string;
    }[];
  };
}

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
  question?: BaseQuestionFormData;
}

const EditorHook = dynamic(
  () => import("@/app/exams/components/react_quill/EditorWithUseQuill"),
  {
    ssr: false,
  }
);

function EvaluationQuestion({
  questionGroups: examGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  const { t } = useTranslation("exam");
  const dispatch = useAppDispatch();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId") ?? undefined;
  const optionSelect = (examGroups ?? []).map((v: QuestionGroupData) => ({
    label: v.name,
    value: v.id,
  }));

  const [fields, setFields] = useState(
    question?.content?.answers ?? [
      {
        label: "A",
        id: 1,
        name: "",
        point: 0,
        idIcon: "",
      },
    ]
  );

  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newLabel = String.fromCharCode(65 + fields.length);
    const newField = {
      id: fields.length + 1,
      label: newLabel,
      text: "",
      point: 0,
      idIcon: "",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field: any) => field.id !== id));
  };

  interface QuestionEvaluation {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    [key: string]: any;
  }

  const initialValues: QuestionEvaluation = {
    point: question?.numberPoint?.toString() ?? "",
    question_group: question?.idGroupQuestion ?? "",
    question: question?.question ?? "",
    explain: question?.content?.explainAnswer ?? "",
  };

  const router = useRouter();
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      dispatch(setQuestionLoading(true));
      const answers = fields.map((field: any) => ({
        label: field.label,
        text: field.text,
        point: field.point,
        idIcon: field.idIcon,
      }));
      console.log("Answers:", answers);
      const submitData: QuestionEvaluation = {
        id: question?.id,
        question: values.question,
        idExam: question?.idExam ?? idExam,
        numberPoint: fields.reduce(
          (sum: any, field: any) => sum + field.point,
          0
        ),
        idGroupQuestion: values.question_group,
        questionType: "Evaluation",
        idExamQuestionPart:
          question?.idExamQuestionPart ??
          (!!idExamQuestionPart ? idExamQuestionPart : undefined) ??
          undefined,
        isQuestionBank: !idExam,
        content: {
          explainAnswer: values.explain,
          answers,
        },
      };

      const res = question
        ? await updateEvaluationQuestion(submitData)
        : await createEvaluationQuestion(submitData);
      dispatch(setQuestionLoading(false));

      if (res.code !== 0) {
        errorToast(res.message ?? "");
        return;
      }
      dispatch(resetMultiAnswer(1));
      successToast(
        question ? t("Cập nhật thành công") : t("Thêm mới thành công")
      );
      router.push(!idExam ? `/exam_bank` : `/exams/details/${idExam}`);
    },
  });

  // const handlePreview = async (file: any) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   try {
  //     const res = await uploadImageStudio(file);
  //     console.log(res);

  //     // const imageUrl = res?.imageUrl;
  //     // const newWindow = window.open();
  //     // newWindow?.document.write(
  //     //   `<img src="${imageUrl || file.preview}" style="width: 100%;" />`
  //     // );
  //   } catch (error) {
  //     console.error("Lỗi khi tải lên hình ảnh:", error);
  //   }
  // };

  // const handleChange: UploadProps["onChange"] = async ({
  //   fileList: newFileList,
  // }) => {
  //   console.log(newFileList, "newFileList");
  //   // const formData = new FormData();
  //   // formData.append("files", newFileList[0]);
  //   // const res = await uploadImageStudio(formData);
  //   // console.log("res", res);
  //   const updatedFields = fields.map((field: any) => {
  //     // if (field.id === fieldId) {
  //     // return {
  //     //   ...field,
  //     //   idIcon: newFileList.thumbUrl || "",
  //     // };
  //     // }
  //     // return field;
  //   });
  //   setFields(updatedFields);
  // };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: "-1",
    //   name: "image.png",
    //   status: "done",
    //   url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    // },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <form
      className="grid grid-cols-12 gap-4 max-lg:px-5"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
        Object.keys(formik.errors).forEach(async (key) => {
          await formik.setFieldTouched(key, true);
        });
      }}
    >
      <button className="hidden" type="submit" ref={submitRef} />
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          namespace="exam"
          h="h-9"
          name="point"
          id="point"
          title={t("point")}
          value={fields.reduce((sum: any, field: any) => sum + field?.point, 0)}
          disable
        />
        <MDropdown
          formik={formik}
          required
          options={optionSelect}
          h="h-9"
          title={t("question_group")}
          placeholder={t("select_question_group")}
          id="question_group"
          name="question_group"
        />
      </div>
      <div className="bg-white rounded-lg lg:col-span-8 col-span-12 p-5 h-fit">
        <EditorHook
          formik={formik}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("question")}
        />
        <div className="border rounded-lg p-4">
          <div className="text-sm font-semibold">{t("specific_7")}</div>
          <div className="w-full">
            {fields.map((field: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between pt-2"
              >
                <div
                  className="font-semibold"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    setFields(
                      fields.map((f: any) =>
                        f.id === field.id
                          ? { ...f, label: e.target.textContent }
                          : f
                      )
                    )
                  }
                >
                  {field?.label}.
                </div>
                <Input
                  className="rounded-md h-9 w-[50%]"
                  placeholder={t("Tên nhãn lựa chọn")}
                  value={field?.text}
                  onChange={(e) =>
                    setFields(
                      fields.map((f: any) =>
                        f.id === field.id ? { ...f, text: e.target.value } : f
                      )
                    )
                  }
                />
                <Input
                  className="rounded-md h-9 w-[15%]"
                  type="number"
                  placeholder={t("Điểm lựa chọn")}
                  value={field?.point}
                  onChange={(e) =>
                    setFields(
                      fields.map((f: any) =>
                        f.id === field.id
                          ? { ...f, point: parseFloat(e.target.value) || 0 }
                          : f
                      )
                    )
                  }
                />
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
                {/* <Upload
                  name="idIcon"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleChange}
                  onPreview={handlePreview}
                >
                  {field?.idIcon ? (
                    <Image
                      src={field.idIcon}
                      alt="icon"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload> */}
                <div className="w-10">
                  {index > 0 && (
                    <CloseCircleOutlined
                      className="ml-2 text-red-500 cursor-pointer"
                      onClick={() => removeField(field.id)}
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="mt-2 text-blue-500 flex justify-end"
                onClick={addField}
                type="button"
              >
                {t("Thêm lựa chọn")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EvaluationQuestion;
