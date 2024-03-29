"use client";
import React, { useEffect, useState } from "react";
import CreateExaminationPage from "../create/page";
import { getExaminationById } from "@/services/api_services/examination_api";
import { ExaminationData } from "@/data/exam";

function UpdateExamination({ params }: any) {
  const [examination, setExamination] = useState<ExaminationData | undefined>();
  const loadExaminationById = async () => {
    var res = await getExaminationById(params.id);
    if (res.code == 0) {
      setExamination(res?.data?.records[0]);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadExaminationById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>{examination && <CreateExaminationPage examination={examination} />}</>
  );
}

export default UpdateExamination;
