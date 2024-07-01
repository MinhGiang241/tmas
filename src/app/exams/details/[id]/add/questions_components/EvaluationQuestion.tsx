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
  updateEssayQuestion,
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
  const optionSelect = (examGroups ?? []).map<any>(
    (v: QuestionGroupData, i: number) => ({
      label: v?.name,
      value: v?.id,
    })
  );
  // const [point, setPoint] = useState<any>(0);
  const [fields, setFields] = useState([
    { id: 1, name: "", points: 0, idIcon: "" },
  ]);
  // console.log(fields, "fields");

  const dispatch = useAppDispatch();

  interface EvaluationQuestion {
    point?: string;
    question_group?: string;
    question?: string;
    explain?: string;
    [key: string]: any;
  }
  const existedQuest =
    question && question?.questionType === "Evaluation"
      ? (question as EvaluationQuestion)
      : undefined;

  const initialValues: EvaluationQuestion = {
    point: question?.numberPoint?.toString() ?? undefined,
    question_group: question?.idGroupQuestion ?? undefined,
    question: question?.question ?? undefined,
    explain: existedQuest?.content?.explainAnswer ?? undefined,
  };

  const search = useSearchParams();
  const idExamQuestionPart =
    search.get("partId") != null ? search.get("partId") : undefined;
  // console.log("idExamQuestionPart", search.get("partId"));

  const formik = useFormik({
    initialValues,
    onSubmit: async (values: EvaluationQuestion) => {
      console.log("values", values);
      dispatch(setQuestionLoading(true));
      const answers = fields.map((field) => ({
        // label: "Chưa rõ label ở đâu",
        text: field.name,
        point: field.points,
        idIcon: field.idIcon,
      }));
      var submitData: QuestionEvaluation = {
        question: values.question,
        numberPoint: 0,
        idGroupQuestion: values?.question_group,
        questionType: "Evaluation",
        idExamQuestionPart:
          question?.idExamQuestionPart ??
          (!!idExamQuestionPart ? idExamQuestionPart : undefined) ??
          undefined,
        isQuestionBank: idExam ? false : true,
        content: {
          explainAnswer: values?.explain,
          isChangePosition,
          answers: answers.map((x: any) => ({
            // label: "Chưa rõ label ở đâu",
            text: x?.text,
            point: x?.point,
            idIcon: x?.idIcon,
          })),
        },
      };
      console.log(submitData, "submitData");
      var res = question
        ? await updateEvaluationQuestion(submitData)
        : await createEvaluationQuestion(submitData);
      dispatch(setQuestionLoading(false));
      if (res.code != 0) {
        errorToast(res.message ?? "");
        return;
      }
      dispatch(resetMultiAnswer(1));
      question
        ? successToast(t("Cập nhật thành công"))
        : successToast(t("Thêm mới thành công"));
    },
  });

  const handleFieldsChange = (newFields: any) => {
    setFields(newFields);
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 max-lg:px-5"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <button
        className="hidden"
        onClick={() => {
          formik.handleSubmit();
          Object.keys(formik.errors).forEach(async (v) => {
            await formik.setFieldTouched(v, true);
          });
        }}
        ref={submitRef}
      />
      <div className="bg-white rounded-lg lg:col-span-4 col-span-12 p-5 h-fit">
        <MInput
          namespace="exam"
          h="h-9"
          name="point"
          id="point"
          title={t("point")}
          value={fields.reduce((sum: any, field) => sum + field.points, 0)}
          // disable
          formik={formik}
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
        <Switch
          value={isChangePosition}
          onChange={(p) => {
            setIsChangePosition(p);
          }}
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
          <EvaluationUploadQuestion
            fields={fields}
            onFieldsChange={handleFieldsChange}
          />
        </div>
      </div>
    </form>
  );
}

export default EvaluationQuestion;
