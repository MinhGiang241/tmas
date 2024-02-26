"use client";
import useWindowSize from "@/services/ui/useWindowSize";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();
  return (
    <SWRConfig>
      {children}
      <Toaster
        containerStyle={{ top: size.height / 7 }}
        toastOptions={{ custom: { duration: 3000 } }}
      />
    </SWRConfig>
  );
}

export default AuthProvider;
