import EditQuestionPage from "@/app/exams/details/[id]/edit/page";
import React from "react";

function ExamBankQuestionEdit(params: any) {
  return (
    <>
      <EditQuestionPage params={params} />
    </>
  );
}

export default ExamBankQuestionEdit;
