import { ReactNode } from 'react';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Toaster } from "sonner";
import { routing, locales, Locale } from '@/i18n/routing';
import { Header, Footer } from '@/shared/components';
import { type PageLocaleParams } from '@/shared/utils/types';
import { services as shinsaServices } from '@/features/shinsa';

import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: PageLocaleParams): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const tMetadata = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: tMetadata('title'),
    description: tMetadata('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "zh-tw": `${siteUrl}/zh-tw`,
        ja: `${siteUrl}/ja`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/en`
      }
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}`,
      title: tMetadata('title'),
      description: tMetadata('description'),
      siteName: 'Kyudo Tori',
    },
  };
}

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
