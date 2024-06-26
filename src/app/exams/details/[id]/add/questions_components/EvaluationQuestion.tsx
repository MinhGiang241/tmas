import { QuestionGroupData } from "@/data/exam";
import { BaseQuestionFormData } from "@/data/form_interface";
import { t } from "i18next";
import dynamic from "next/dynamic";
import React from "react";

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
  questionGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  return (
    <div>
      <div>
        <EditorHook
          //   formik={formik}
          //   placeholder={t("Câu hỏi")}
          isCount={false}
          required
          id="question"
          name="question"
          title={t("Câu hỏi")}
        />
      </div>
    </div>
  );
}

export default EvaluationQuestion;
