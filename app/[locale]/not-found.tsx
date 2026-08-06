import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('not_found');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight text-neutral-800 md:text-8xl">
        404
      </h1>
      <div className="prose-readable mt-6 space-y-2">
        <p className="text-xl font-medium text-neutral-600 md:text-2xl">
          {t('stray_arrow')}
        </p>
        <p className="text-sm text-neutral-400">
          {t('adjust_breath')}
        </p>
      </div>
    </div>
  );
}
