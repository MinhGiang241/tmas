import { Spin } from "antd";
import React from "react";

function LoadingExam() {
  return (
    <div className="flex justify-center items-center w-screen h-screen ">
      <Spin size="large" />
    </div>
  );
}

export default LoadingExam;
