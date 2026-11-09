import React from 'react';
import {
  MapPin,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Menu,
  Sparkles,
  Info
} from 'lucide-react';
import { Coordinates } from '../types';
import { FormattedHijriDate } from '../services/hijriService';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentCity: Coordinates;
  hijriDate: FormattedHijriDate;
  onOpenCitySelector: () => void;
  onOpenSettings: () => void;
  onOpenAdhanModal: () => void;
  onOpenAbout: () => void;
  onOpenInstallModal: () => void;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  silentMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  hijriDate,
  onOpenCitySelector,
  onOpenSettings,
  onOpenAdhanModal,
  onOpenAbout,
  onOpenInstallModal,
  isAudioPlaying,
  onStopAudio,
  isDark,
  onToggleTheme,
  silentMode,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md transition-colors border-b shadow-sm bg-[#faf8f2]/95 dark:bg-[#021f17]/95 border-amber-300/40 dark:border-amber-400/30 text-stone-900 dark:text-stone-100">
      <div className="max-w-xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Menu Burger Button (☰ in gold) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-xl text-amber-500 hover:text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
            title="القائمة الرئيسية ومعلومات التطبيق"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Location button */}
          <button
            onClick={onOpenCitySelector}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-900/10 dark:bg-emerald-950/80 border border-emerald-600/30 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:border-amber-400 transition cursor-pointer"
            title="تحديد الموقع أو تغيير المدينة"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span className="max-w-[85px] sm:max-w-[120px] truncate">{currentCity.city}</span>
          </button>
        </div>

        {/* Center: Brand Typography */}
        <div
          onClick={onOpenAbout}
          className="flex flex-col items-center text-center cursor-pointer select-none group"
          title="أَقِمِ الصَّلَاةَ - إعداد وتطوير: أبو مالك"
        >
          <div className="flex items-center gap-1">
            <h1 className="text-base sm:text-lg font-black tracking-wide font-serif text-gold-gradient leading-tight">
              أَقِمِ الصَّلَاةَ
            </h1>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-300/90 font-medium tracking-tight">
            بواسطة أبو مالك
          </span>
        </div>

        {/* Right: Audio playing / Muezzin / Theme / Settings Gear (⚙️ in gold) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Audio Stop Button if currently playing */}
          {isAudioPlaying && (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold shadow-md animate-pulse cursor-pointer"
              title="إيقاف صوت الأذان"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إيقاف</span>
            </button>
          )}

          {/* Adhan Sound button */}
          <button
            onClick={onOpenAdhanModal}
            className={`p-2 rounded-xl transition cursor-pointer ${
              silentMode
                ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-500 border border-rose-300/40'
                : 'text-amber-500 hover:text-amber-400 hover:bg-amber-400/10'
            }`}
            title={silentMode ? 'الوضع الصامت مفعّل' : 'أصوات المؤذنين والأذان'}
          >
            {silentMode ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-amber-500 hover:text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
            title={isDark ? 'التبديل إلى الوضع النهاري المريح' : 'التبديل إلى الوضع الليلي الخاشع'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
          </button>

          {/* Settings Gear */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-amber-500 hover:text-amber-400 hover:bg-amber-400/10 transition cursor-pointer"
            title="إعدادات التطبيق والمواقيت"
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
};
