"use client";
import Image from "next/image";
import Link from "next/link";
import { auth, googleProvider, facebookProvider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button, Popover, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { LOCALES } from "./i18n/locales/locales";
import { redirect, useRouter } from "next/navigation";
import LoadingPage from "./loading";

export default function Home() {
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

  // useEffect()
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1 className="text-7xl mb-44">Home Page</h1>
          {isLogin ? (
            <Button
              className="mb-20 w-24 h-12 bg-red-500 text-white"
              onClick={(_) => {
                localStorage.removeItem("access_token");
                router.push("/signin");
              }}
            >
              Logout
            </Button>
          ) : (
            <Link
              className="mb-20 w-24 h-12 bg-m_primary_700  text-white text-center rounded-lg"
              href={"/signin"}
            >
              Login
            </Link>
          )}
        </>
      )}
    </main>
  );
}
