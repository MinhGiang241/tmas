import { QuestionGroupData } from "@/data/exam";
import { BaseQuestionFormData } from "@/data/form_interface";
import React from "react";

interface Props {
  questionGroups?: QuestionGroupData[];
  submitRef?: any;
  idExam?: string;
  question?: BaseQuestionFormData;
}

function EvaluationQuestion({
  questionGroups,
  submitRef,
  idExam,
  question,
}: Props) {
  return <div>EvaluationQuestion</div>;
}

export default EvaluationQuestion;
