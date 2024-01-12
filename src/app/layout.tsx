import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import type { Metadata } from "next";
import ChakraProvider from "@/components/chakra-provider";

export const preferredRegion = "icn1";

export const metadata: Metadata = {
  title: "치즈 리모컨",
  description: "치지직 후원 알림 목록, 일시정지, 스킵, 볼륨 조절",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-gray-900 dark:text-gray-50">
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
