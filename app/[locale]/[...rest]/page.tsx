import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { type PageLocaleParams } from '@/shared/utils/types';
 
export function generateStaticParams() {
  return [{ rest: ['_not-found'] }];
}

export default async function CatchAllPage({
  params
}: PageLocaleParams) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  setRequestLocale(locale);

  notFound();
}
