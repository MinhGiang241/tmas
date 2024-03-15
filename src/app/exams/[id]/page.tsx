"use client";

import HomeLayout from "@/app/layouts/HomeLayout";
import React, { useEffect, useState } from "react";
import CreatePage from "../create/page";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ExamData } from "@/data/exam";
import { getExamById } from "@/services/api_services/examination_api";
import { APIResults } from "@/data/api_results";

function ExamDetail({ params }: { params: { id: string } }) {
  const user = useAppSelector((state: RootState) => state?.user?.user);
  const [exam, setExam] = useState<ExamData | undefined>(undefined);
  const [count, setCount] = useState(1);
  useEffect(() => {
    setCount(count + 1);
    console.log("count", count);

    loadExamDetails();
    // if (count == 3) {
    //   loadExamDetails();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadExamDetails = async () => {
    const results: APIResults = await getExamById(params.id);

    if (results?.code != 0) {
      setExam(undefined);
      return;
    }
    if (results?.data?.records && results?.data?.records?.length != 0) {
      setExam(results?.data?.records[0]);
    }
    console.log("ress", results);
  };
  return (
    <>
      <CreatePage exam={exam} isEdit />
    </>
  );
}

export default ExamDetail;
