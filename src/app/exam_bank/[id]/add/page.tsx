"use client";
import CreateQuestionPage from "@/app/exams/details/[id]/add/page";
import React from "react";

function AddExamBankAdd({ params }: any) {
  return (
    <>
      <CreateQuestionPage params={params} />
    </>
  );
}

export default AddExamBankAdd;
