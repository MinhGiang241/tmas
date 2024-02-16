"use client";
import useWindowSize from "@/services/ui/useWindowSize";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();
  return (
    <>
      {children}
      <Toaster
        containerStyle={{ top: size.height / 7 }}
        toastOptions={{ custom: { duration: 3000 } }}
      />
    </>
  );
}

export default AuthProvider;
