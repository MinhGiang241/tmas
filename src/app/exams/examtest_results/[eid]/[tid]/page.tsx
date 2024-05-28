import Result from "@/app/examination/results/[eid]/[tid]/page";
import React from "react";

function ExaminationResult(params: any) {
  return (
    <>
      <Result {...params} />
    </>
  );
}

export default ExaminationResult;
