import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
  className?: string;
  variant?: 'header' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  className = '',
  variant = 'header',
}) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();

  // If already installed, hide or show minimal installed badge
  if (isInstalled) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        className={`px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${className}`}
        title="تثبيت التطبيق على هاتفك"
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>تثبيت التطبيق على هاتفك</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${className}`}
        title="تحميل وتثبيت التطبيق"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">تثبيت التطبيق</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer ${className}`}
      title="تحميل وتثبيت التطبيق على الشاشة الرئيسية"
    >
      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>تثبيت</span>
    </button>
  );
};
