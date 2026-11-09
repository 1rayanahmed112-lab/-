export type TabType = 'home' | 'prayers' | 'quran' | 'athkar' | 'tasbih' | 'qibla' | 'duas' | 'calendar';

export interface Coordinates {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export type CalculationMethodName =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'MoonsightingCommittee'
  | 'NorthAmerica';

export type MadhabType = 'shafi' | 'hanafi';

export interface PrayerAdhanItemConfig {
  enabled: boolean;
  mode: 'full' | 'short' | 'silent';
  sound: string;
  preReminder: number;
}

export interface PrayerSettings {
  method: CalculationMethodName;
  madhab: MadhabType;
  hijriAdjustment: number;
  fajrAngle?: number;
  ishaAngle?: number;
  volume: number; // 0 to 1
  silentMode: boolean; // Do Not Disturb / Silent
  autoAdhanEnabled: boolean; // Automatic playback on prayer time
  globalVoice: string;
  prayerAdhanConfig: {
    fajr: PrayerAdhanItemConfig;
    dhuhr: PrayerAdhanItemConfig;
    asr: PrayerAdhanItemConfig;
    maghrib: PrayerAdhanItemConfig;
    isha: PrayerAdhanItemConfig;
  };
  notificationsEnabled: boolean;
}

export interface ActiveAdhanEvent {
  prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayerNameAr: string;
  voiceName: string;
  isFajr?: boolean;
  isPreReminder?: boolean;
  timestamp: number;
}

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  nameEn: string;
  time: Date;
  formatted: string;
  isNext: boolean;
  isPast: boolean;
  isCurrent: boolean;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeAr: 'مكية' | 'مدنية';
  startJuz: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page?: number;
}

export interface ThikrItem {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'sleep' | 'waking' | 'mosque';
  text: string;
  count: number;
  currentCount?: number;
  reward?: string;
  reference?: string;
  favorited?: boolean;
}

export interface DuaItem {
  id: string;
  category: 'quran' | 'prophetic' | 'rizq' | 'relief' | 'healing' | 'repentance' | 'istikhara' | 'parents';
  title: string;
  arabic: string;
  source?: string;
  benefit?: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  hijriDay: number;
  hijriMonth: number;
  monthName: string;
  description: string;
  isFastRecommended?: boolean;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export interface Reciter {
  id: string;
  name: string;
  subfolder: string;
}
