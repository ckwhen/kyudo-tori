import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const sansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serifJP = Noto_Serif_JP({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyudo Tori",
  description: "專為弓道學習者設計的結構化審查情報平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${sansJP.variable} ${serifJP.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}