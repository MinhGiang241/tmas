import React, { ReactNode } from "react";
import Image from "next/image";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className=" w-full h-screen flex">
        <div className="w-1/2 h-full bg-[url('/images/background.png')] bg-cover"></div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center">
          <div className="flex  flex-col w-1/2">
            <div className="w-full flex justify-center">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={325}
                height={98}
              />
            </div>
            <div className="h-9" />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
