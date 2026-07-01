'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { constants } from '@/shared/utils';

const { MAX_VISIBLE_PAGES } = constants;

type Props = {
  offset: number;
  limit: number;
  count: number;
  onChange: (nextOffset: number) => void;
  isDisabled?: boolean;
};

export default function Pagination({
  offset,
  limit,
  count,
  onChange,
  isDisabled,
}: Props) {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const isPaginationDisabled = isDisabled || totalPages === 0;
  const baseBtnClass = `
    h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium
    transition-all duration-200 cursor-pointer select-none active:scale-95
    disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
  `;

  const getVisiblePages = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = startPage + MAX_VISIBLE_PAGES - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }
    return pages;
  };

  const handleChange = (page: number) => {
    onChange((page - 1) * limit);
  };

  return (
    <div className="flex justify-center gap-2 my-8 [content-visibility:auto]">
      <button
        type="button"
        disabled={isPaginationDisabled || currentPage === 1}
        onClick={() => handleChange(currentPage - 1)}
        className={`${baseBtnClass} bg-white border border-ink/10 text-ink/70 hover:border-moss/40 hover:text-moss`}
        aria-label="上一頁"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getVisiblePages().map((page) => {
        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            disabled={isPaginationDisabled}
            onClick={() => handleChange(page)}
            className={`
              ${baseBtnClass} font-mono
              ${isCurrent 
                ? 'bg-moss text-canvas border border-moss shadow-xs' 
                : 'bg-white border border-ink/10 text-ink/70 hover:border-moss/40 hover:text-moss'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={isPaginationDisabled || currentPage === totalPages}
        onClick={() => handleChange(currentPage + 1)}
        className={`${baseBtnClass} bg-white border border-ink/10 text-ink/70 hover:border-moss/40 hover:text-moss`}
        aria-label="下一頁"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}