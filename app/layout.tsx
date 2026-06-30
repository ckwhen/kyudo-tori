import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全日本弓道審查情報檢索",
  description: "專為弓道人設計的結構化審查情報平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}