'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Earth, ChevronDown, Check } from 'lucide-react';

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [ isPending, startTransition ] = useTransition();
  const [ isOpen, setIsOpen ] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tSwitcher = useTranslations('locale_switcher');
  const langOptions = [
    { code: 'zh-tw', label: tSwitcher('zh-tw') },
    { code: 'ja', label: tSwitcher('ja') },
    { code: 'en', label: tSwitcher('en') }
  ];

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === currentLocale) return;
    
    startTransition(() => {
      router.replace({pathname}, {locale: nextLocale});
      setIsOpen(false);
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLabel = langOptions
    .find(opt => opt.code === currentLocale)?.label || 'Language';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center min-w-38 gap-2 pl-3 pr-2 py-1.5 border border-canvas/20 rounded-md
          text-sm font-medium
          transition-all duration-200 cursor-pointer disabled:opacity-50
          text-canvas/90 hover:text-canvas bg-white/10 hover:bg-white/20
        `}
      >
        <span className="shrink-0"><Earth /></span>
        <span>{currentLabel}</span>
        <span className={`
          ml-auto
          text-xs transition-transform duration-200
          ${isOpen ? '-rotate-180' : ''}
        `}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 min-w-50 right-0 py-1 mt-2 origin-top-right rounded-md
          bg-white shadow-lg ring-1 ring-black/5
          focus:outline-none animate-in fade-in duration-100
        `}>
          {langOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => handleLocaleChange(option.code)}
              className={`
                flex justify-between items-center w-full px-4 py-2
                text-left text-sm transition-color duration-150 cursor-pointer 
                ${currentLocale === option.code
                  ? 'bg-moss/10 text-moss font-semibold'
                  : 'text-gray-700 hover:bg-gray-100' }
              `}
            >
              <span>{option.label}</span>
              {currentLocale === option.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
