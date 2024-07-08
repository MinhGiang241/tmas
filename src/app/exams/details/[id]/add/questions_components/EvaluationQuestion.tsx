import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { FieldSurveyAnswer, QuestionGroupData } from "@/data/exam";
import { BaseQuestionFormData } from "@/data/form_interface";
import {
  Input,
  Upload,
  Image,
  UploadProps,
  UploadFile,
  GetProp,
  Table,
} from "antd";
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
import {
  uploadFile,
  uploadImageStudio,
} from "@/services/api_services/account_services";
import { getToken } from "@/utils/cookies";
import _ from "lodash";
import { APIResults } from "@/data/api_results";

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
  const [fields, setFields] = useState<FieldSurveyAnswer[]>(
    question?.content?.answers
      ? question?.content?.answers?.map((e: any, i: number) => ({
          id: i,
          label: e?.label,
          text: e?.text,
          point: e?.point,
          idIcon: e?.idIcon,
          file: !e?.idIcon
            ? undefined
            : {
                url: `${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/download/${e?.idIcon}`,
              },
        }))
      : [
          {
            label: "A",
            id: 1,
            text: "",
            point: 0,
            idIcon: "",
          },
        ]
  );

  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newLabel = String.fromCharCode(65 + fields.length);
    const newField: FieldSurveyAnswer = {
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

  const handlePreview = async (file: UploadFile, index: number) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    var cloneFields = _.cloneDeep(fields);
    cloneFields[index].previewImage = file.preview;
    cloneFields[index].previewOpen = true;
    setFields(cloneFields);
    //setPreviewImage(file.url || (file.preview as string));
    // setPreviewOpen(true);
  };

  const handleChange = (newFileList: UploadFile[], index: number) => {
    console.log("newFileList onChange", newFileList);

    var cloneFields = _.cloneDeep(fields);
    cloneFields[index].file =
      newFileList?.length != 0 ? newFileList[0] : undefined;
    cloneFields[index].idIcon =
      newFileList?.length != 0
        ? newFileList[0].response?.idDocuments[0]
        : undefined;
    setFields(cloneFields);
    // return setFileList(newFileList);
  };

  const upload = async (formData: any) => {
    return await uploadImageStudio(formData);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      {/* <div style={{ marginTop: 8 }}>Tải ảnh lên</div> */}
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
          <div></div>
          <div className="w-full">
            {fields.map((field: FieldSurveyAnswer, index: number) => (
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
                  headers={{
                    Authorization: `Bearer ${
                      sessionStorage.getItem("access_token") ?? getToken()
                    }`,
                  }}
                  accept="image/png, image/jpeg, image/jpg"
                  action={`${process.env.NEXT_PUBLIC_API_STU}/api/studio/Document/uploadImage`}
                  listType="picture-card"
                  fileList={field?.file ? [field?.file] : []}
                  onPreview={(file) => handlePreview(file, index)}
                  onChange={({ fileList: q, file }: any) =>
                    handleChange(q, index)
                  }
                  customRequest={async ({ file, onSuccess, onError }: any) => {
                    const formData = new FormData();
                    formData.append("files", file);
                    var res = await uploadImageStudio(formData);
                    if (res?.code != 0) {
                      onError(res?.message);
                    } else {
                      onSuccess(res?.data);
                    }
                    return res;
                  }}
                  // beforeUpload={}
                >
                  {field?.file ? null : uploadButton}
                </Upload>
                {field?.previewImage && (
                  <Image
                    alt="upload"
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: field?.previewOpen,
                      onVisibleChange: (visible, prev) => {
                        let cloneFields = _.cloneDeep(fields);
                        cloneFields[index].previewOpen = visible;
                        setFields(cloneFields);
                      },
                      afterOpenChange: (visible) => {
                        let cloneFields = _.cloneDeep(fields);
                        cloneFields[index].previewImage = visible;
                        return !visible && setFields(cloneFields); //setPreviewImage("");
                      },
                    }}
                    src={field?.previewImage}
                  />
                )}
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
