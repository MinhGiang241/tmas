import ResultPage from "@/app/examination/results/[eid]/page";
import React from "react";

function ExaminationResult(params: any) {
  return (
    <>
      <ResultPage {...params} />
    </>
  );
}

export default ExaminationResult;
