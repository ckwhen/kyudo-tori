import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getDateByTimezone, UTC_TIMEZONE, DEFAULT_DATE_TEXT } from '@/shared/utils/date';

type Props = {
  latestSyncAt: string | null,
}

export default function Footer({ latestSyncAt }: Props) {
  const format = useFormatter();
  const t = useTranslations('LandingPage.footer');
    const latestSyncAtObj = latestSyncAt
      ? getDateByTimezone(latestSyncAt, UTC_TIMEZONE)
      : null;

  let formatLatestSyncAt = DEFAULT_DATE_TEXT;
  if (latestSyncAtObj && latestSyncAtObj.isValid()) {
    formatLatestSyncAt = format.dateTime(latestSyncAtObj.toDate(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: UTC_TIMEZONE,
        timeZoneName: 'short',
      });
  }

  return (
    <footer className="bg-ink text-canvas/70 border-t border-canvas/10 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-2">
          <h4 className="font-bold text-canvas tracking-widest">
            全日本弓道審查情報檢索
          </h4>
          <p className="opacity-75 leading-relaxed text-sm">
            解決日本傳統連盟 HTML 舊網站檢索不易的痛點。本站致力於將公開數據結構化，提供全球弓道學習者最優雅、直覺的工具體驗。
          </p>
        </div>

        <div className="space-y-2 md:pl-16">
          <h4 className="font-bold text-canvas uppercase tracking-widest">
            {t('sitemap')}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">{t('shinsa')}</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold transition-colors">{t('about')}</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-canvas uppercase tracking-widest">
            {t('changelog')}
          </h4>
          <div className="font-mono text-sm">
            <div className="text-gold">
              {t('lastProofread', { date: formatLatestSyncAt })}
            </div>
          </div>
        </div>

      </div>
      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-canvas/5 text-center text-xs opacity-40 font-mono tracking-wide">
        &copy; 2026 Wen Chih-Kai (Kyudo Tori). All rights reserved.
      </div>
    </footer>
  );
}
