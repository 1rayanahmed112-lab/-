import React, { useState } from 'react';
import {
  Clock,
  Compass,
  BookOpen,
  Sparkles,
  Volume2,
  Calendar,
  Copy,
  Check,
  ChevronLeft,
  Moon,
  Sun,
  Flame,
  Download,
  MapPin,
  CheckCircle2,
  Bell,
  Heart,
  Share2
} from 'lucide-react';
import { Coordinates, PrayerTimeItem, TabType, Bookmark, PrayerSettings } from '../types';
import { FormattedHijriDate } from '../services/hijriService';
import { formatRemainingTime } from '../services/prayerService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { NotificationService } from '../services/notificationService';

interface HomeDashboardProps {
  currentCity: Coordinates;
  hijriDate: FormattedHijriDate;
  prayerItems: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  timeToNextMs: number;
  lastBookmark: Bookmark | null;
  onNavigate: (tab: TabType) => void;
  onPlayAdhanPreview: () => void;
  onOpenCitySelector: () => void;
  onOpenAbout?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAdhanModal?: () => void;
  settings?: PrayerSettings;
}

/* Custom 4 Circular Action Icons matching the user reference mockup */
const DuasCircularIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 text-amber-300 drop-shadow-md" fill="none" stroke="currentColor">
    {/* Praying Hands */}
    <path
      d="M20 40c-2.5-4-4-10-4-17 0-3 1.5-6 3.5-7.5C21 14 22 17 23 21l2 8c1 3.5 3 6 5 8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44 40c2.5-4 4-10 4-17 0-3-1.5-6-3.5-7.5C43 14 42 17 41 21l-2 8c-1 3.5-3 6-5 8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M26 14c1.5-2 3.5-4 6-4s4.5 2 6 4" strokeWidth="2" strokeLinecap="round" />
    <path d="M25 46c4 3 10 3 14 0" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

const TasbihCircularIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 text-amber-300 drop-shadow-md" fill="none" stroke="currentColor">
    {/* Rosary beads circle */}
    <circle cx="32" cy="27" r="17" strokeWidth="2" strokeDasharray="3 4" />
    <circle cx="32" cy="10" r="2.5" fill="currentColor" />
    <circle cx="39" cy="12" r="2.5" fill="currentColor" />
    <circle cx="45" cy="17" r="2.5" fill="currentColor" />
    <circle cx="48" cy="24" r="2.5" fill="currentColor" />
    <circle cx="48" cy="31" r="2.5" fill="currentColor" />
    <circle cx="44" cy="38" r="2.5" fill="currentColor" />
    <circle cx="38" cy="42" r="2.5" fill="currentColor" />
    <circle cx="32" cy="44" r="3" fill="currentColor" />
    <circle cx="26" cy="42" r="2.5" fill="currentColor" />
    <circle cx="20" cy="38" r="2.5" fill="currentColor" />
    <circle cx="16" cy="31" r="2.5" fill="currentColor" />
    <circle cx="16" cy="24" r="2.5" fill="currentColor" />
    <circle cx="19" cy="17" r="2.5" fill="currentColor" />
    <circle cx="25" cy="12" r="2.5" fill="currentColor" />
    {/* Tassel */}
    <path d="M32 46v7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M29 53h6l-1 7h-4l-1-7z" fill="currentColor" />
  </svg>
);

const QuranCircularIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 text-amber-300 drop-shadow-md" fill="none" stroke="currentColor">
    {/* Wooden Rehal / Book Stand */}
    <path d="M16 46l16-8 16 8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 48l-6 8M44 48l6 8" strokeWidth="2.5" strokeLinecap="round" />
    {/* Open Holy Quran Book */}
    <path d="M32 20c-5-4-11-4-17-2v17c6-2 12-2 17 2 5-4 11-4 17-2V18c-6-2-12-2-17 2z" fill="#D4AF37" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 20v17" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 24h6M20 28h5M38 24h6M39 28h5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AthkarCircularIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 text-amber-300 drop-shadow-md" fill="none" stroke="currentColor">
    {/* Mosque Dome and Minarets */}
    <path d="M32 14c-6 6-9 11-9 18h18c0-7-3-12-9-18z" fill="#D4AF37" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Crescent on top */}
    <path d="M32 8a3 3 0 102 3 2.5 2.5 0 01-2-3z" fill="currentColor" />
    {/* Left Minaret */}
    <path d="M15 24v20h4V24" strokeWidth="2" />
    <path d="M13 24l4-8 4 8" strokeWidth="2" strokeLinejoin="round" />
    {/* Right Minaret */}
    <path d="M45 24v20h4V24" strokeWidth="2" />
    <path d="M43 24l4-8 4 8" strokeWidth="2" strokeLinejoin="round" />
    {/* Base arches */}
    <path d="M12 44h40" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M28 44v-6a4 4 0 018 0v6" strokeWidth="2" />
  </svg>
);

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentCity,
  hijriDate,
  prayerItems,
  nextPrayer,
  timeToNextMs,
  lastBookmark,
  onNavigate,
  onPlayAdhanPreview,
  onOpenCitySelector,
  onOpenAbout,
  onOpenInstallModal,
  onOpenAdhanModal,
  settings,
}) => {
  const { isInstalled } = usePWAInstall();
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    return NotificationService.getPermission();
  });
  const [isTestingNotif, setIsTestingNotif] = useState(false);
  const remaining = formatRemainingTime(timeToNextMs);

  // Active or next prayer calculation
  const activePrayer = prayerItems.find(p => p.isCurrent) || nextPrayer || prayerItems[0];

  const handleRequestNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifPermission(NotificationService.getPermission());
    if (granted) {
      setIsTestingNotif(true);
      setTimeout(() => setIsTestingNotif(false), 3000);
    }
  };

  const handleTestPhoneNotification = async () => {
    setIsTestingNotif(true);
    await NotificationService.sendNotification(`🕌 حان الآن موعد أذان صلاة ${activePrayer.nameAr}`, {
      body: `حي على الصلاة • حي على الفلاح\nالأذان يصدح الآن على شاشة هاتفك بصوت المؤذن.`,
      tag: 'test-adhan-phone',
      requireInteraction: true,
    });
    setTimeout(() => setIsTestingNotif(false), 2500);
  };

  // Daily reflection text
  const dailyAyah = {
    text: 'وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ ۚ إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ',
    surah: 'سورة هود',
    ayah: 'الآية ١١٤',
    tafseer: 'أدّ الصلاة على أكمل وجه في أول النهار وآخره وفي ساعات الليل، فإن الأعمال الصالحة تمحو صغائر الذنوب وتبارك في العمر والرزق.'
  };

  const dailyHadith = {
    text: 'مَن حَافَظَ علَى الصَّلَوَاتِ الخَمْسِ، رُكُوعِهِنَّ، وسُجُودِهِنَّ، ومَوَاقِيتِهِنَّ، وعَلِمَ أنَّهُنَّ حَقٌّ مِن عِندِ اللَّهِ، دَخَلَ الجَنَّةَ.',
    narrator: 'رواه الإمام أحمد وحسّنه الألباني'
  };

  const handleCopyQuote = () => {
    const textToCopy = `«${dailyAyah.text}» [${dailyAyah.surah}: ${dailyAyah.ayah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  // Determine prayer icon for table rows
  const getPrayerRowIcon = (id: string, isActive: boolean) => {
    switch (id) {
      case 'fajr':
        return <Sun className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-400'}`} />;
      case 'dhuhr':
        return <Sun className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-yellow-400'}`} />;
      case 'asr':
        return <Sun className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-500'}`} />;
      case 'maghrib':
        return <Moon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-rose-400'}`} />;
      case 'isha':
        return <Moon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-indigo-400'}`} />;
      default:
        return <Clock className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Filter 5 core prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) matching the reference mockup
  const fiveCorePrayers = prayerItems.filter(p => p.id !== 'sunrise');

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 max-w-xl mx-auto">
      {/* =========================================================================
          1. TOP ARCHED BANNER: MAKKAH HARAM PANORAMA & GOLDEN IDENTITY (COMPACT & CLEAN)
          ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 shadow-xl bg-gradient-to-b from-[#021f17] to-[#01140e] text-white">
        {/* Makkah Header Background (Scaled down to fit viewport comfortably) */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden">
          <img
            src="/assets/makkah_header.png"
            alt="المسجد الحرام والكعبة المشرفة بمكة المكرمة"
            className="w-full h-full object-cover object-center brightness-90 contrast-105"
          />
          {/* Islamic Arch & Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#021f17] via-emerald-950/40 to-black/30 pointer-events-none" />
          
          {/* Top Quick Status Pill */}
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <button
              onClick={onOpenCitySelector}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-lg hover:bg-black/80 transition cursor-pointer"
              title="تغيير المدينة"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentCity.city}</span>
            </button>

            {onOpenAdhanModal && (
              <button
                onClick={onOpenAdhanModal}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-lg hover:bg-emerald-800 transition cursor-pointer"
                title="ضبط صوت الأذان والمؤذن"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>المؤذن</span>
              </button>
            )}
          </div>

          {/* Golden 3D Typography: أَقِمِ الصَّلَاةَ */}
          <div className="absolute bottom-2 inset-x-0 flex flex-col items-center text-center px-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide font-serif text-gold-gradient drop-shadow-lg">
              أَقِمِ الصَّلَاةَ
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-300/90 font-medium tracking-wide mt-0.5">
              بواسطة أبو مالك
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. NOTIFICATION & PHONE HOME SCREEN BANNER (عرض الأذان على شاشة الهاتف دون فتح التطبيق)
          ========================================================================= */}
      {notifPermission !== 'granted' ? (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-600/20 to-amber-500/20 border-2 border-amber-400/80 shadow-lg text-stone-900 dark:text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Bell className="w-5 h-5 animate-bounce stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-amber-200">
                تفعيل الأذان والتنبيهات على شاشة الهاتف الرئيسية
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                تصلك مواقيت الصلاة والأذان مباشرة على شاشة هاتفك وشاشة القفل دون الحاجة لفتح التطبيق.
              </p>
            </div>
          </div>
          <button
            onClick={handleRequestNotifications}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md shadow-amber-500/25 transition cursor-pointer shrink-0"
          >
            السماح بالتنبيهات الآن 🔔
          </button>
        </div>
      ) : (
        <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs">
              الأذان والتنبيهات مفعّلة على شاشة هاتفك الرئيسية (شاشة القفل وسطح المكتب)
            </span>
          </div>
          <button
            onClick={handleTestPhoneNotification}
            disabled={isTestingNotif}
            className="text-[11px] text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
            title="تجربة إرسال تنبيه تجريبي إلى شاشة هاتفك للتأكد من وصوله"
          >
            <span>{isTestingNotif ? 'تم إرسال التنبيه ✓' : 'تجربة تنبيه على هاتفك 🔔'}</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          3. PRAYER ALERT HERO CARD: CURVED IVORY PARCHMENT WITH GLOWING LANTERN
          ========================================================================= */}
      <div className="relative rounded-3xl p-5 sm:p-6 overflow-hidden border-2 border-amber-400/70 shadow-2xl transition-all duration-300 bg-gradient-to-b from-[#fdfbf3] via-[#faf5e5] to-[#f4ede0] dark:from-[#0d2a21] dark:via-[#09221a] dark:to-[#041711] text-stone-900 dark:text-stone-100">
        {/* Subtle Islamic Arch Crest Background */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          {/* Left: Glowing Traditional Ramadan Lantern (فانوس) */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Radiant golden light aura */}
            <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-xl animate-pulse pointer-events-none" />
            
            {/* Lantern Image / Asset */}
            <div className="relative w-16 sm:w-20 h-28 sm:h-32 flex items-center justify-center">
              <img
                src="/assets/lantern.png"
                alt="فانوس رمضان المتوهج"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.55)] scale-105"
                onError={(e) => {
                  // Fallback if image fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right: Active Prayer Name, Time, and Dates */}
          <div className="flex-1 flex flex-col items-center text-center">
            {/* Top Prompt Badge */}
            <span className="text-xs sm:text-sm font-bold text-stone-700 dark:text-emerald-200/90 tracking-wide font-amiri">
              {activePrayer.isCurrent ? 'حان الآن موعد صلاة' : 'الصلاة القادمة'}
            </span>

            {/* Huge Prayer Name Calligraphy */}
            <h2 className="text-4xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-300 font-serif my-1 drop-shadow-sm tracking-wide">
              {activePrayer.nameAr}
            </h2>

            {/* Exact Prayer Time */}
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-amber-300 font-mono tracking-tight">
              {activePrayer.formatted}
            </div>

            {/* Remaining countdown pill */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 dark:bg-emerald-950/60 border border-emerald-600/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>متبقي: {remaining.text}</span>
            </div>

            {/* Dates: Gregorian & Hijri */}
            <div className="mt-3 pt-3 border-t border-amber-300/40 dark:border-emerald-800/60 w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{hijriDate.gregorianDateAr}</span>
              </div>
              <span className="hidden sm:inline text-amber-500">•</span>
              <div className="flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">{hijriDate.fullDateAr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. PRAYER TIMES SCHEDULE CARD: "مواقيت الصلاة ⏰"
          ========================================================================= */}
      <div className="relative rounded-3xl p-4 sm:p-5 overflow-hidden border border-amber-400/50 shadow-xl bg-gradient-to-b from-[#032619] via-[#021f15] to-[#01160e] text-white">
        {/* Golden Arch Title Banner */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">⏰</span>
            <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-serif">
              مواقيت الصلاة
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('prayers')}
              className="text-amber-300 hover:text-amber-200 font-semibold hover:underline cursor-pointer transition flex items-center gap-0.5"
            >
              <span>تفاصيل أكثر</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Deep Emerald Prayer Time Rows matching the reference image */}
        <div className="space-y-2">
          {fiveCorePrayers.map((prayer) => {
            const isCurrent = prayer.isCurrent;
            const isPast = prayer.isPast;
            const isNext = prayer.isNext;

            return (
              <div
                key={prayer.id}
                onClick={() => onNavigate('prayers')}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isCurrent || isNext
                    ? 'bg-gradient-to-r from-amber-500/30 via-amber-400/35 to-amber-500/25 border-2 border-amber-400/90 shadow-lg shadow-amber-500/20 text-white'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/40 text-stone-200'
                }`}
              >
                {/* Left side: Status badge (checkmark / speaker / empty) */}
                <div className="w-7 flex items-center justify-center">
                  {isCurrent || isNext ? (
                    <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  ) : isPast ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-emerald-700/60" />
                  )}
                </div>

                {/* Center: Exact Time formatted */}
                <div className="flex-1 text-center font-mono text-base sm:text-lg font-bold tracking-tight">
                  <span className={isCurrent || isNext ? 'text-amber-300 font-black' : 'text-stone-100'}>
                    {prayer.formatted}
                  </span>
                </div>

                {/* Right side: Prayer Name & Celestial Icon */}
                <div className="flex items-center gap-2.5 min-w-[85px] justify-end">
                  <span className={`text-sm sm:text-base font-bold ${isCurrent || isNext ? 'text-amber-200 font-extrabold' : 'text-stone-100'}`}>
                    {prayer.nameAr}
                  </span>
                  <div className="shrink-0">
                    {getPrayerRowIcon(prayer.id, isCurrent || isNext)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Listen to Live Adhan Button inside the schedule card */}
        <div className="mt-3.5 pt-3 border-t border-emerald-800/50 flex items-center justify-between">
          <button
            onClick={onPlayAdhanPreview}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md shadow-amber-400/20 transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
            <span>تشغيل صوت الأذان بصوت المؤذن الآن</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. FOUR CIRCULAR LUXURY ACTION BUTTONS: DUA, TASBIH, QURAN, ATHKAR
          ========================================================================= */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 py-2">
        {/* 1. الأدعية (Duas) */}
        <button
          onClick={() => onNavigate('duas')}
          className="group flex flex-col items-center justify-center cursor-pointer transition transform active:scale-95"
          title="الأدعية النبوية والمأثورة"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-gradient-to-b from-[#032d1f] via-[#022418] to-[#01140e] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:border-amber-300 group-hover:scale-105 transition-all">
            <DuasCircularIcon />
          </div>
          <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-amber-200 mt-2 tracking-tight group-hover:text-amber-500 transition-colors">
            الأدعية
          </span>
        </button>

        {/* 2. التسبيح (Tasbih) */}
        <button
          onClick={() => onNavigate('tasbih')}
          className="group flex flex-col items-center justify-center cursor-pointer transition transform active:scale-95"
          title="السبحة الإلكترونية الذكية"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-gradient-to-b from-[#032d1f] via-[#022418] to-[#01140e] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:border-amber-300 group-hover:scale-105 transition-all">
            <TasbihCircularIcon />
          </div>
          <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-amber-200 mt-2 tracking-tight group-hover:text-amber-500 transition-colors">
            التسبيح
          </span>
        </button>

        {/* 3. القرآن الكريم (Quran) */}
        <button
          onClick={() => onNavigate('quran')}
          className="group flex flex-col items-center justify-center cursor-pointer transition transform active:scale-95"
          title="القرآن الكريم كاملاً"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-gradient-to-b from-[#032d1f] via-[#022418] to-[#01140e] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:border-amber-300 group-hover:scale-105 transition-all">
            <QuranCircularIcon />
          </div>
          <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-amber-200 mt-2 tracking-tight group-hover:text-amber-500 transition-colors">
            القرآن الكريم
          </span>
        </button>

        {/* 4. الأذكار (Athkar) */}
        <button
          onClick={() => onNavigate('athkar')}
          className="group flex flex-col items-center justify-center cursor-pointer transition transform active:scale-95"
          title="أذكار الصباح والمساء واليوم والليلة"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-gradient-to-b from-[#032d1f] via-[#022418] to-[#01140e] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:border-amber-300 group-hover:scale-105 transition-all">
            <AthkarCircularIcon />
          </div>
          <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-amber-200 mt-2 tracking-tight group-hover:text-amber-500 transition-colors">
            الأذكار
          </span>
        </button>
      </div>

      {/* =========================================================================
          5. SPIRITUAL DEDICATION FOOTER BANNER: "اللهم اجعلنا من المحافظين على الصلاة"
          ========================================================================= */}
      <div
        onClick={onOpenAbout}
        className="relative rounded-2xl p-3 sm:p-4 border border-amber-400/50 bg-gradient-to-r from-[#021f17] via-[#043326] to-[#021f17] text-white text-center shadow-lg cursor-pointer group hover:border-amber-300 transition-all"
        title="معلومات التطبيق والمطور - أبو مالك"
      >
        <p className="font-amiri text-lg sm:text-xl font-bold text-gold-gradient tracking-wide">
          اللهم اجعلنا من المحافظين على الصلاة
        </p>
        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-amber-200/90 font-medium">
          <span>بواسطة <strong className="text-white">أبو مالك</strong></span>
          <span>•</span>
          <span className="text-amber-300">«لا تنسوني من دعائكم»</span>
        </div>
      </div>

      {/* =========================================================================
          6. INSTALL APP PROMOTION CARD (IF NOT YET INSTALLED)
          ========================================================================= */}
      {!isInstalled && onOpenInstallModal && (
        <div
          onClick={onOpenInstallModal}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-400/40 flex items-center justify-between gap-3 cursor-pointer group hover:border-amber-400 transition shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                تثبيت التطبيق على هاتفك المحمول
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                يعمل أوفلاين بدون إنترنت • أذان وتنبيهات في موعدها
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenInstallModal();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shrink-0 shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <span>تثبيت</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          7. QURAN BOOKMARK RESUME BANNER (IF EXISTS)
          ========================================================================= */}
      {lastBookmark && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">متابعة تلاوة القرآن</span>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                سورة {lastBookmark.surahName} • الآية ({lastBookmark.ayahNumber})
              </h4>
            </div>
          </div>
          <button
            onClick={() => onNavigate('quran')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shrink-0"
          >
            <span>استئناف</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          8. DAILY AYAH & REFLECTION
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              آية اليوم وتدبر
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span>{dailyAyah.surah}</span>
            <span>•</span>
            <span>{dailyAyah.ayah}</span>
            <button
              onClick={handleCopyQuote}
              className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
              title="نسخ الآية"
            >
              {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <p className="font-quran text-lg sm:text-xl text-stone-800 dark:text-stone-100 leading-loose text-center py-2 px-3 bg-stone-50/80 dark:bg-stone-800/40 rounded-xl border border-stone-100 dark:border-stone-800/60">
          ﴿ {dailyAyah.text} ﴾
        </p>

        <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 leading-relaxed">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">التدبر: </span>
          {dailyAyah.tafseer}
        </p>
      </div>

      {/* =========================================================================
          9. PROPHETIC HADITH
          ========================================================================= */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-100/90 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-0.5">
            حديث نبوي شريف
          </h4>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
            «{dailyHadith.text}»
          </p>
          <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-1 font-medium">
            {dailyHadith.narrator}
          </span>
        </div>
      </div>
    </div>
  );
};
