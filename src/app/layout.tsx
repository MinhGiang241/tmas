import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LangProvider from "./provider/intl";
import StyledComponentsRegistry from "./provider/antdRegistry";
import { Toaster } from "react-hot-toast";
import React, { ReactNode, Suspense } from "react";
import LoadingPage from "./loading";
import AuthProvider from "./provider/authProvider";
import useWindowSize from "@/services/ui/useWindowSize";
import { StoreProviders } from "@/redux/provider";

// const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// const font = localFont({ src: "../fonts/Montserrat-Regular.ttf" });
export const metadata: Metadata = {
  icons: {
    icon: "/images/icon.png",
  },
  title: "Tmas",
  description: "Nền tảng đánh giá năng lực miễn phí",
  // viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  // viewport: "width=device-width, initial-scale=1.0",
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
        <StoreProviders>
          <AuthProvider>
            <StyledComponentsRegistry>
              <LangProvider>
                <Suspense fallback={<LoadingPage />}>{children}</Suspense>
              </LangProvider>
            </StyledComponentsRegistry>
          </AuthProvider>
        </StoreProviders>
      </body>
    </html>
  );
}
