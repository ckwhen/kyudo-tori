import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  const renderStrongText = (chunks: ReactNode) => (
    <strong className="font-semibold text-neutral-900">{chunks}</strong>
  );

  return (
    <main className="prose-readable px-6 py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        {t('pageTitle')}
      </h1>
      
      <div className="mt-8 space-y-12 text-neutral-600 leading-7">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 border-b pb-2">
            {t('whyTitle')}
          </h2>
          <p>{t('whyParagraph1')}</p>
          <p>{t('whyParagraph2')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 border-b pb-2">
            {t('techTitle')}
          </h2>
          <p>{t.rich('techParagraph1', { bold: renderStrongText })}</p>
          <p>{t.rich('techParagraph2', { bold: renderStrongText })}</p>
        </section>
      </div>
    </main>
  )
}
