import React, { ReactNode } from "react";
import Image from "next/image";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className=" w-full lg:h-screen max-h-screen flex max-lg:justify-center">
        <div className="lg:flex hidden lg:w-1/2 h-full bg-[url('/images/background.png')] bg-cover"></div>
        <div className="overflow-auto lg:w-1/2  w-full  h-full flex flex-col items-center justify-center">
          <div className="flex  flex-col lg:w-1/2 w-4/5">
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