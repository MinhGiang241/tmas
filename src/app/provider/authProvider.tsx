"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default AuthProvider;
