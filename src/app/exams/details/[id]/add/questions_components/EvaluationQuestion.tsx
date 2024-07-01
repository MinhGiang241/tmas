import MDropdown from "@/app/components/config/MDropdown";
import MInput from "@/app/components/config/MInput";
import { QuestionGroupData } from "@/data/exam";
import { BaseQuestionFormData } from "@/data/form_interface";
import { Input, Radio, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import EvaluationUploadQuestion from "./evaluationUpload/evaluationUploadQuestion";
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
  const [isChangePosition, setIsChangePosition] = useState<boolean>(false);
  const { t } = useTranslation("exam");
  const dispatch = useAppDispatch();
  const search = useSearchParams();
  const idExamQuestionPart = search.get("partId") ?? undefined;
  const optionSelect = (examGroups ?? []).map((v: QuestionGroupData) => ({
    label: v.name,
    value: v.id,
  }));

  const [fields, setFields] = useState([
    { id: 1, name: "", points: 0, idIcon: "" },
  ]);

  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFields([
      ...fields,
      { id: fields.length + 1, name: "", points: 0, idIcon: "" },
    ]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
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
      const answers = fields.map((field) => ({
        text: field.name,
        point: field.points,
        idIcon: field.idIcon,
      }));
      const submitData: QuestionEvaluation = {
        id: question?.id,
        question: values.question,
        idExam: question?.idExam ?? idExam,
        numberPoint: fields.reduce((sum, field) => sum + field.points, 0),
        idGroupQuestion: values.question_group,
        questionType: "Evaluation",
        idExamQuestionPart: question?.idExamQuestionPart ?? idExamQuestionPart,
        isQuestionBank: !idExam,
        content: {
          explainAnswer: values.explain,
          isChangePosition,
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
      <button className="hidden" ref={submitRef} />
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          namespace="exam"
          h="h-9"
          name="point"
          id="point"
          title={t("point")}
          value={fields.reduce((sum: any, field: any) => sum + field.points, 0)}
          // formik={formik}
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
        <div className="body_semibold_14 mb-2">{t("relocate_result")}</div>
        <Switch checked={isChangePosition} onChange={setIsChangePosition} />
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
          <Radio.Group className="w-full">
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between pt-2"
              >
                <Radio className="font-semibold" value={field.id}>
                  {index + 1}.
                </Radio>
                <Input
                  className="rounded-md h-9 w-[50%]"
                  placeholder={t("Tên nhãn lựa chọn")}
                  value={field.name}
                  onChange={(e) =>
                    setFields(
                      fields.map((f) =>
                        f.id === field.id ? { ...f, name: e.target.value } : f
                      )
                    )
                  }
                />
                <Input
                  className="rounded-md h-9 w-[15%]"
                  type="number"
                  placeholder={t("Điểm lựa chọn")}
                  value={field.points}
                  onChange={(e) =>
                    setFields(
                      fields.map((f) =>
                        f.id === field.id
                          ? { ...f, points: parseFloat(e.target.value) || 0 }
                          : f
                      )
                    )
                  }
                />
                <input
                  value={field.idIcon}
                  type="file"
                  accept=".svg,.jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff|image/*"
                  className="w-28 h-14"
                  placeholder={t("Hình ảnh")}
                />
                <button
                  onClick={() => removeField(field.id)}
                  className="text-neutral-500 text-2xl mt-[6px] ml-2"
                >
                  <CloseCircleOutlined />
                </button>
              </div>
            ))}
          </Radio.Group>
          <div className="w-full flex justify-end pt-2">
            <button
              onClick={addField}
              className="underline body_regular_14 underline-offset-4"
            >
              <PlusOutlined /> {t("add_result")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EvaluationQuestion;
