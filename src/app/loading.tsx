"use client";
import { Spin } from "antd";

function LoadingPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-white opacity-60 flex justify-center items-center">
        <Spin size="large" />
        {children}
      </div>
    </div>
  );
}

export default LoadingPage;
