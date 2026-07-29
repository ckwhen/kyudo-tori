'use client';

import { ReactNode } from 'react';

type Props = {
  isSelected: boolean,
  children: ReactNode,
  onClick: () => void,
  className?: string, 
}

export default function FilterButton({
  isSelected,
  children,
  onClick,
  className = ''
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 border rounded-xl
        transition-all cursor-pointer select-none active:scale-[0.97]
        ${
          isSelected
          ? 'bg-moss/10 border-moss text-moss font-bold shadow-2xs'
          : 'border-ink/10 text-ink/80 hover:border-ink/30 hover:bg-ink/2'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
