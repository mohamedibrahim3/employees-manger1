// components/PrintButton.tsx
'use client';

import * as React from 'react';
import { PrinterIcon } from 'lucide-react';

export default function PrintButton({
  className = '',
  children = 'طباعة الصفحة',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      className={`print:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-colors ${className}`}
      aria-label="طباعة الصفحة"
    >
      <PrinterIcon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );
}