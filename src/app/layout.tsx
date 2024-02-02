import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LangProvider from "./provider/intl";
import StyledComponentsRegistry from "./provider/antdRegistry";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const font = localFont({ src: "../fonts/Montserrat-Regular.ttf" });

export const metadata: Metadata = {
  title: "Tmas",
  description: "Nền tảng đánh giá năng lực miễn phí",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`text-black ${font.className}`}>
        <LangProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </LangProvider>
        <Toaster toastOptions={{ custom: { duration: 1000000 } }} />
      </body>
    </html>
  );
}
