'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const localeNames = {
  en: 'English',
  id: 'Bahasa Indonesia'
};

const localeFlags = {
  en: '🇺🇸',
  id: '🇮🇩'
};

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-goc-border bg-white hover:border-goc-primary/40 transition-all duration-200 shadow-goc-sm"
        aria-label={t('language')}
      >
        <span className="text-sm">{localeFlags[locale as keyof typeof localeFlags]}</span>
        <span className="text-sm text-goc-muted hidden sm:inline">
          {localeNames[locale as keyof typeof localeNames]}
        </span>
        <svg 
          className={`w-4 h-4 text-goc-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 right-0 bg-white border border-goc-border rounded-lg shadow-goc z-50 min-w-[180px]"
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-goc-surface-alt transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                locale === loc ? 'bg-blue-50 text-goc-primary' : 'text-goc-muted'
              }`}
            >
              <span className="text-lg">{localeFlags[loc as keyof typeof localeFlags]}</span>
              <span className="text-sm font-medium">
                {localeNames[loc as keyof typeof localeNames]}
              </span>
              {locale === loc && (
                <svg className="w-4 h-4 ml-auto text-goc-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
