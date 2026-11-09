import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Volume2,
  Calendar,
  Sparkles,
  Sliders,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Info,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { Coordinates, PrayerTimeItem, PrayerSettings, CalculationMethodName } from '../types';
import { FormattedHijriDate } from '../services/hijriService';
import { CALCULATION_METHOD_LABELS, calculatePrayerTimes, formatRemainingTime } from '../services/prayerService';

interface PrayerTimesViewProps {
  currentCity: Coordinates;
  hijriDate: FormattedHijriDate;
  prayerItems: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  timeToNextMs: number;
  settings: PrayerSettings;
  qiyamTime: Date;
  midnightTime: Date;
  onOpenCitySelector: () => void;
  onOpenAdhanModal: () => void;
  onOpenSettings: () => void;
  onPlayAdhanPreview: () => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  currentCity,
  hijriDate,
  prayerItems,
  nextPrayer,
  timeToNextMs,
  settings,
  qiyamTime,
  midnightTime,
  onOpenCitySelector,
  onOpenAdhanModal,
  onOpenSettings,
  onPlayAdhanPreview,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const remaining = formatRemainingTime(timeToNextMs);

  // Compute times for the selected day offset (today, tomorrow, or past)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + selectedDayOffset);
  const calculated = calculatePrayerTimes(currentCity, targetDate, settings);

  const formatNightTime = (d: Date) => {
    return d.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Sunrise className="w-5 h-5 text-indigo-400" />;
      case 'sunrise':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'asr':
        return <Sun className="w-5 h-5 text-orange-500" />;
      case 'maghrib':
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'isha':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* City & Date Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              جدول مواقيت الصلاة
            </h2>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
              {currentCity.city}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
            <span>{hijriDate.fullDateAr}</span>
            <span>•</span>
            <span>{hijriDate.gregorianDateAr}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCitySelector}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>تغيير المدينة</span>
          </button>
          <button
            onClick={onOpenAdhanModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>أصوات المؤذن</span>
          </button>
        </div>
      </div>

      {/* Next Prayer Countdown Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <span className="text-xs text-emerald-200 font-medium">الوقت المتبقي حتى أذان</span>
            <h3 className="text-2xl font-bold mt-0.5 text-white">
              صلاة {nextPrayer?.nameAr || 'الفجر'} ({nextPrayer?.formatted})
            </h3>
            <p className="text-xs text-emerald-200/90 mt-1">
              متبقي {remaining.text}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2.5 rounded-2xl bg-black/25 backdrop-blur-md font-mono text-2xl font-bold tracking-wider text-amber-300 border border-white/10">
              {String(remaining.hours).padStart(2, '0')}:{String(remaining.minutes).padStart(2, '0')}:{String(remaining.seconds).padStart(2, '0')}
            </div>
            <button
              onClick={onPlayAdhanPreview}
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition shadow-md cursor-pointer"
              title="سماع الأذان"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector (Today, Tomorrow, Day after) */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setSelectedDayOffset(0)}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedDayOffset === 0
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          اليوم
        </button>
        <button
          onClick={() => setSelectedDayOffset(1)}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedDayOffset === 1
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          غداً
        </button>
        <button
          onClick={() => setSelectedDayOffset(2)}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedDayOffset === 2
              ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          بعد غد
        </button>
      </div>

      {/* The 6 Prayer & Sunrise Times Cards List */}
      <div className="space-y-2.5">
        {calculated.items.map((prayer) => {
          const isNext = selectedDayOffset === 0 && prayer.isNext;
          const isCurrent = selectedDayOffset === 0 && prayer.isCurrent;
          const isPast = selectedDayOffset === 0 && prayer.isPast;

          return (
            <div
              key={prayer.id}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                isNext
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500'
                  : isCurrent
                  ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-stone-900 dark:text-stone-100'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isNext
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {getPrayerIcon(prayer.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{prayer.nameAr}</h3>
                    {isNext && (
                      <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full">
                        الصلاة القادمة
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        الوقت الحالي
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${isNext ? 'text-emerald-100' : 'text-stone-400 dark:text-stone-500'}`}>
                    {prayer.nameEn}
                  </span>
                </div>
              </div>

              <div className="text-left">
                <span className={`text-lg sm:text-xl font-bold font-mono ${isNext ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                  {prayer.formatted}
                </span>
                {prayer.id !== 'sunrise' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAdhanModal();
                    }}
                    className={`flex items-center justify-end gap-1 text-[11px] mt-0.5 transition cursor-pointer hover:underline ${
                      isNext ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <Bell className="w-3 h-3 text-amber-400" />
                    <span>
                      {settings.silentMode
                        ? 'الوضع صامت'
                        : settings.prayerAdhanConfig[prayer.id as keyof typeof settings.prayerAdhanConfig]?.enabled
                        ? settings.prayerAdhanConfig[prayer.id as keyof typeof settings.prayerAdhanConfig]?.mode === 'short'
                          ? 'تكبيرات'
                          : 'أذان كامل'
                        : 'معطّل'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Islamic Night Timers: Midnight & Qiyam al-Layl */}
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
        <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-emerald-600" />
          <span>أوقات الليل المستحبة والقيام</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 dark:text-stone-400">منتصف الليل الشرعي</span>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">نهاية وقت العشاء الاختياري</p>
            </div>
            <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
              {formatNightTime(midnightTime)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 dark:text-stone-400">الثلث الأخير (قيام الليل)</span>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">وقت النزول الإلهي واستجابة الدعاء</p>
            </div>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatNightTime(qiyamTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Calculation Method Info & Settings Button */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-stone-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">طريقة الحساب المعتمدة: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {CALCULATION_METHOD_LABELS[settings.method]?.nameAr}
            </span>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
        >
          تعديل
        </button>
      </div>
    </div>
  );
};
