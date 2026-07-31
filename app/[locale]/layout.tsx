import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from "sonner";
import { routing, Locale } from '@/i18n/routing';
import { Header, Footer } from '@/shared/components';
import { services as shinsaServices } from '@/features/shinsa';

import "@/app/globals.css";

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

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const latestSyncAt = await shinsaServices.getLatestSyncAt();

  return (
    <html lang={locale} className={`${sansJP.variable} ${serifJP.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />

          <div className="grow">
            {children}
          </div>

          <Footer
            latestSyncAt={latestSyncAt}
          />
        </NextIntlClientProvider>
        <Toaster
          position="top-center"
          closeButton
        />
      </body>
    </html>
  );
}
