import {
  Coordinates as AdhanCoordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab,
  HighLatitudeRule
} from 'adhan';
import {
  Coordinates,
  CalculationMethodName,
  PrayerSettings,
  PrayerTimeItem,
  MadhabType
} from '../types';

export const DEFAULT_SETTINGS: PrayerSettings = {
  method: 'UmmAlQura',
  madhab: 'shafi',
  hijriAdjustment: 0,
  volume: 0.9,
  silentMode: false,
  autoAdhanEnabled: true,
  globalVoice: 'makkah',
  notificationsEnabled: true,
  prayerAdhanConfig: {
    fajr: { enabled: true, mode: 'full', sound: 'fajr_makkah', preReminder: 15 },
    dhuhr: { enabled: true, mode: 'full', sound: 'makkah', preReminder: 10 },
    asr: { enabled: true, mode: 'full', sound: 'makkah', preReminder: 10 },
    maghrib: { enabled: true, mode: 'full', sound: 'alafasy', preReminder: 10 },
    isha: { enabled: true, mode: 'full', sound: 'madinah', preReminder: 10 },
  }
};

export const CALCULATION_METHOD_LABELS: Record<CalculationMethodName, { nameAr: string; desc: string }> = {
  UmmAlQura: { nameAr: 'أم القرى (مكة المكرمة)', desc: 'المملكة العربية السعودية والخليج' },
  MuslimWorldLeague: { nameAr: 'رابطة العالم الإسلامي', desc: 'أوروبا وأجزاء من آسيا والعالم الإسلامي' },
  Egyptian: { nameAr: 'الهيئة المصرية العامة للمساحة', desc: 'مصر وبلاد الشام وشمال إفريقيا' },
  Karachi: { nameAr: 'جامعة العلوم الإسلامية بكراتشي', desc: 'باكستان، بنغلاديش، الهند' },
  Dubai: { nameAr: 'دائرة الشؤون الإسلامية بدبي', desc: 'دولة الإمارات العربية المتحدة' },
  Qatar: { nameAr: 'وزارة الأوقاف والشؤون الإسلامية بقطر', desc: 'دولة قطر' },
  Kuwait: { nameAr: 'وزارة الأوقاف الكويتية', desc: 'دولة الكويت' },
  MoonsightingCommittee: { nameAr: 'لجنة رؤية الهلال', desc: 'أمريكا الشمالية والمملكة المتحدة' },
  NorthAmerica: { nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', desc: 'الولايات المتحدة وكندا' }
};

function getAdhanMethodParams(methodName: CalculationMethodName) {
  switch (methodName) {
    case 'MuslimWorldLeague':
      return CalculationMethod.MuslimWorldLeague();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'MoonsightingCommittee':
      return CalculationMethod.MoonsightingCommittee();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    case 'UmmAlQura':
    default:
      return CalculationMethod.UmmAlQura();
  }
}

export function calculatePrayerTimes(
  coords: Coordinates,
  date: Date = new Date(),
  settings: PrayerSettings = DEFAULT_SETTINGS
): {
  items: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  timeToNextMs: number;
  prayerTimesInstance: PrayerTimes;
  qiyamTime: Date;
  midnightTime: Date;
} {
  const adhanCoords = new AdhanCoordinates(coords.latitude, coords.longitude);
  const params = getAdhanMethodParams(settings.method);
  params.madhab = settings.madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

  const prayerTimes = new PrayerTimes(adhanCoords, date, params);
  const now = new Date();

  const rawList: { id: PrayerTimeItem['id']; nameAr: string; nameEn: string; time: Date }[] = [
    { id: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', time: prayerTimes.fajr },
    { id: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', time: prayerTimes.sunrise },
    { id: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', time: prayerTimes.dhuhr },
    { id: 'asr', nameAr: 'العصر', nameEn: 'Asr', time: prayerTimes.asr },
    { id: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', time: prayerTimes.maghrib },
    { id: 'isha', nameAr: 'العشاء', nameEn: 'Isha', time: prayerTimes.isha },
  ];

  // Format helper (12-hour or 24-hour with Arabic AM/PM)
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Determine current and next prayer
  let currentPrayer: PrayerTimeItem | null = null;
  let nextPrayer: PrayerTimeItem | null = null;
  let timeToNextMs = 0;

  // Next prayer finding:
  const futurePrayers = rawList.filter(p => p.time.getTime() > now.getTime());

  if (futurePrayers.length > 0) {
    const nextRaw = futurePrayers[0];
    timeToNextMs = nextRaw.time.getTime() - now.getTime();
    nextPrayer = {
      ...nextRaw,
      formatted: formatTime(nextRaw.time),
      isNext: true,
      isPast: false,
      isCurrent: false,
    };
  } else {
    // Tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = new PrayerTimes(adhanCoords, tomorrow, params);
    timeToNextMs = tomorrowPrayers.fajr.getTime() - now.getTime();
    nextPrayer = {
      id: 'fajr',
      nameAr: 'الفجر (غداً)',
      nameEn: 'Fajr (Tomorrow)',
      time: tomorrowPrayers.fajr,
      formatted: formatTime(tomorrowPrayers.fajr),
      isNext: true,
      isPast: false,
      isCurrent: false,
    };
  }

  // Current prayer finding (most recent past prayer)
  const pastPrayers = rawList.filter(p => p.time.getTime() <= now.getTime());
  if (pastPrayers.length > 0) {
    const currRaw = pastPrayers[pastPrayers.length - 1];
    currentPrayer = {
      ...currRaw,
      formatted: formatTime(currRaw.time),
      isNext: false,
      isPast: false,
      isCurrent: true
    };
  }

  const items: PrayerTimeItem[] = rawList.map(item => {
    const isNext = nextPrayer?.id === item.id && nextPrayer.nameAr.includes(item.nameAr);
    const isCurrent = currentPrayer?.id === item.id;
    const isPast = item.time.getTime() < now.getTime();
    return {
      ...item,
      formatted: formatTime(item.time),
      isNext,
      isCurrent,
      isPast,
    };
  });

  // Calculate Islamic Midnight & Last Third (Qiyam al-Layl)
  // Midnight is midpoint between sunset (Maghrib) and next sunrise/fajr
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowPrayers = new PrayerTimes(adhanCoords, tomorrow, params);
  const nightDurationMs = tomorrowPrayers.fajr.getTime() - prayerTimes.maghrib.getTime();
  const midnightTime = new Date(prayerTimes.maghrib.getTime() + nightDurationMs / 2);
  const qiyamTime = new Date(prayerTimes.maghrib.getTime() + (nightDurationMs * 2) / 3);

  return {
    items,
    nextPrayer,
    currentPrayer,
    timeToNextMs: Math.max(0, timeToNextMs),
    prayerTimesInstance: prayerTimes,
    qiyamTime,
    midnightTime
  };
}

export function formatRemainingTime(ms: number): { hours: number; minutes: number; seconds: number; text: string } {
  if (ms <= 0) return { hours: 0, minutes: 0, seconds: 0, text: 'حان الآن موعد الأذان' };

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = hours > 0 ? `${hours} ساعة ` : '';
  const mStr = `${minutes} دقيقة `;
  const sStr = `${seconds} ثانية`;

  return {
    hours,
    minutes,
    seconds,
    text: `${hStr}${mStr}${sStr}`.trim()
  };
}
