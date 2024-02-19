import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { redirect, useRouter } from "next/navigation";
import LoadingPage from "../loading";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLogin(false);
      redirect("/signin");
    } else {
      setIsLogin(true);
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <main className="bg-neutral-100">
          <Header />
          <div className="h-[68px]" />
          <div className="max-w-[1140px] mx-auto">{children}</div>
        </main>
      )}
    </>
  );
}

export default HomeLayout;
