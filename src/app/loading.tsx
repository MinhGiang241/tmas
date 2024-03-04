"use client";
import { Spin } from "antd";

function LoadingPage({
  children,
  bg,
}: {
  children?: React.ReactNode;
  bg?: string;
}) {
  return (
    <div className="">
      <div
        className={`absolute top-0 bottom-0 right-0 left-0 ${
          bg ? bg : "bg-white/25"
        } opacity-60 flex justify-center items-center`}
      >
        <Spin size="large" />
        {children}
      </div>
    </div>
  );
}

export default LoadingPage;
