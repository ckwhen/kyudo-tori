import { setRequestLocale } from 'next-intl/server';
import { type PageLocaleParams } from '@/shared/utils/types';
import ContactFormContainer from './ContactFormContainer';

export default async function ContactPage({
  params
}: PageLocaleParams) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  setRequestLocale(locale);

  return <ContactFormContainer />;
}
