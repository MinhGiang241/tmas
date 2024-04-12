"use client";
import React, { useEffect } from "react";
import HomeLayout from "@/app/layouts/HomeLayout";
import { useSearchParams } from "next/navigation";
import { getExamTestId } from "@/services/api_services/question_api";

function DetailsPage() {
  // console.log(params, "params");
  const search = useSearchParams();
  // Id đợt
  const examTestId = search.get('examTestId')
  // console.log(examTestId, "examTestId")
  // id đề
  const examId = search.get('examId')
  // console.log(examId, "examId")

  const dataExamTest = async () => {
    const res = await getExamTestId(examTestId)
    console.log(res, "data res");
  }
  useEffect(() => {
    dataExamTest()
  }, []);
  return (
    <HomeLayout>
      <div>121312</div>
    </HomeLayout>
  );
}

export default DetailsPage;
