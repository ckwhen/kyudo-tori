import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('LandingPage');

  return (
    <header className="bg-moss text-canvas h-22.5 px-6 md:px-12 flex items-center shadow-xs sticky top-0 z-50">
      <div className="max-w-6xl w-full mx-auto flex flex-col justify-center text-left gap-1.5">
        <h1 className="font-serif font-bold text-xl md:text-2xl tracking-widest leading-none">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            Kyudo Tori
          </Link>
        </h1>
        <p className="opacity-70 text-[11px] md:text-xs tracking-wider font-sans font-medium leading-none">
          {t('subtitle')}
        </p>
      </div>
      <div className="shrink-0">
        <LocaleSwitcher />
      </div>
    </header>
  );
}