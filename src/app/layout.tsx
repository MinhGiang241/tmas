import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LangProvider from "./provider/intl";
import StyledComponentsRegistry from "./provider/antdRegistry";
import { Toaster } from "react-hot-toast";
import React, { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// const font = localFont({ src: "../fonts/Montserrat-Regular.ttf" });
export const metadata: Metadata = {
  title: "Tmas",
  description: "Nền tảng đánh giá năng lực miễn phí",
};
export type LayoutProps = {
  children: ReactNode;
  types: ReactNode;
  params?: any;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body className={`text-black ${montserrat.className}`}>
        <StyledComponentsRegistry>
          <LangProvider>{children}</LangProvider>
        </StyledComponentsRegistry>
        <Toaster toastOptions={{ custom: { duration: 3000 } }} />
      </body>
    </html>
  );
}
