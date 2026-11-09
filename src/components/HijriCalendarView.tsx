import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  CheckCircle2,
  Clock,
  Sliders,
  Info
} from 'lucide-react';
import { FormattedHijriDate, getUpcomingEvents, getHijriDate } from '../services/hijriService';
import { HIJRI_MONTHS, ISLAMIC_EVENTS } from '../data/islamicEvents';

interface HijriCalendarViewProps {
  hijriDate: FormattedHijriDate;
  hijriAdjustment: number;
  onUpdateAdjustment: (val: number) => void;
}

export const HijriCalendarView: React.FC<HijriCalendarViewProps> = ({
  hijriDate,
  hijriAdjustment,
  onUpdateAdjustment,
}) => {
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);
  const upcomingEvents = getUpcomingEvents(hijriDate.month, hijriDate.day, 7);

  // Generate 30 days grid for the current Hijri month
  const daysInMonth = 30;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-5 pb-20">
      {/* Current Hijri Date Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
            التقويم الهجري الشريف
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
            {hijriDate.fullDateAr}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            الموافق: {hijriDate.gregorianDateAr}
          </p>

          {/* Quick Adjustment Slider for Moonsighting */}
          <div className="mt-4 pt-3 border-t border-emerald-700/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-emerald-200">
              تعديل الرؤية الشرعية: ({hijriAdjustment > 0 ? `+${hijriAdjustment}` : hijriAdjustment} يوم)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateAdjustment(hijriAdjustment - 1)}
                disabled={hijriAdjustment <= -2}
                className="px-2 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white disabled:opacity-40 cursor-pointer"
                title="إنقاص يوم"
              >
                -١ يوم
              </button>
              <button
                onClick={() => onUpdateAdjustment(0)}
                className="px-2 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white cursor-pointer"
                title="إعادة ضبط"
              >
                افتراضي
              </button>
              <button
                onClick={() => onUpdateAdjustment(hijriAdjustment + 1)}
                disabled={hijriAdjustment >= 2}
                className="px-2 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white disabled:opacity-40 cursor-pointer"
                title="زيادة يوم"
              >
                +١ يوم
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Month Days Calendar Grid with White Days & Friday Highlighting */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>شهر {hijriDate.monthName} ({hijriDate.year} هـ)</span>
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              الأيام البيض (13، 14، 15)
            </span>
          </div>
        </div>

        {/* Days grid 1 to 30 */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
          {daysArray.map((d) => {
            const isToday = d === hijriDate.day;
            const isWhiteDay = d === 13 || d === 14 || d === 15;
            const hasEvent = ISLAMIC_EVENTS.some(
              e => e.hijriMonth === hijriDate.month && e.hijriDay === d
            );

            return (
              <div
                key={d}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                  isToday
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-105'
                    : isWhiteDay
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-bold'
                    : hasEvent
                    ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-700/60 text-teal-900 dark:text-teal-200 font-bold'
                    : 'bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="font-mono text-sm sm:text-base">{d}</span>
                {isToday ? (
                  <span className="text-[9px] mt-0.5 bg-white/30 px-1 rounded-full">اليوم</span>
                ) : isWhiteDay ? (
                  <span className="text-[9px] mt-0.5 text-amber-600 dark:text-amber-400">صيام</span>
                ) : hasEvent ? (
                  <span className="text-[9px] mt-0.5 text-teal-600 dark:text-teal-400">مناسبة</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Islamic Occasions Countdown */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>المناسبات والأيام المباركة القادمة</span>
        </h3>

        <div className="space-y-2.5">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    event.isFastRecommended
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {event.isFastRecommended ? <Flame className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {event.title}
                    </h4>
                    {event.isFastRecommended && (
                      <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full">
                        يستحب صيامه
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {event.hijriDay} {event.monthName} • {event.description}
                  </p>
                </div>
              </div>

              {/* Days remaining counter */}
              <div className="text-left shrink-0 self-end sm:self-auto">
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xs font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {event.daysRemaining === 0 ? 'اليوم المبارك' : `بعد ${event.daysRemaining} يوماً`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
