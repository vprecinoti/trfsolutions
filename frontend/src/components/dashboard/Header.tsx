"use client";

import { memo } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = memo(function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-4 sm:py-6">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/50 text-xs sm:text-sm mt-1 line-clamp-1">{subtitle}</p>
        )}
      </div>
    </header>
  );
});
