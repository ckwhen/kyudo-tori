import { ReactNode } from 'react';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Toaster } from "sonner";
import { routing, locales, Locale } from '@/i18n/routing';
import { Header, Footer } from '@/shared/components';
import { type PageLocaleParams } from '@/shared/utils/types';
import { services as shinsaServices } from '@/features/shinsa';

import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Kyudo Tori",
  description: "專為弓道學習者設計的結構化審查情報平台",
};

type LayoutProps = PageLocaleParams & {
  children: ReactNode,
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<LayoutProps>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const latestSyncAtRes = await shinsaServices.getLatestSyncAt();

  return (
    <html lang={locale}>
      <body className="antialiased flex flex-col min-h-screen">
        <Toaster
          position="top-center"
          closeButton
        />
        <NextIntlClientProvider messages={messages}>
          <Header />

          <div className="grow">
            {children}
          </div>

          <Footer
            latestSyncAt={latestSyncAtRes?.data || null}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
