import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  const renderStrongText = (chunks: ReactNode) => (
    <strong className="font-semibold text-neutral-900">{chunks}</strong>
  );

  return (
    <main className="prose-readable px-6 py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        {t('page_title')}
      </h1>
      
      <div className="mt-8 space-y-12 text-neutral-600 leading-7">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 border-b pb-2">
            {t('why_title')}
          </h2>
          <p>{t('why_paragraph1')}</p>
          <p>{t('why_paragraph2')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 border-b pb-2">
            {t('tech_title')}
          </h2>
          <p>{t.rich('tech_paragraph1', { bold: renderStrongText })}</p>
          <p>{t.rich('tech_paragraph2', { bold: renderStrongText })}</p>
        </section>
      </div>
    </main>
  )
}
