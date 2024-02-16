import React, { ReactNode, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import useWindowSize from "@/services/ui/useWindowSize";
import LoadingPage from "../loading";
import { redirect } from "next/navigation";

function AuthLayout({ children }: { children: ReactNode }) {
  const size = useWindowSize();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      redirect("/");
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className=" w-full lg:h-screen max-h-screen flex max-lg:justify-center">
          <div className="lg:flex hidden lg:w-1/2 h-full bg-[url('/images/background.png')] bg-cover"></div>
          <div className="overflow-auto lg:w-1/2  w-full  h-full min-h-screen flex flex-col items-center ">
            <div className="flex  flex-col xl:w-3/5 w-4/5 my-6">
              <div className="w-full flex justify-center ">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={size.width <= 1024 ? 250 : 325}
                  height={size.width <= 1024 ? 70 : 98}
                />
              </div>
              <div className="h-9" />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthLayout;
