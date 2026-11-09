import { HIJRI_MONTHS, ISLAMIC_EVENTS } from '../data/islamicEvents';
import { IslamicEvent } from '../types';

export interface FormattedHijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  dayName: string;
  fullDateAr: string;
  gregorianDateAr: string;
  eventsToday: IslamicEvent[];
  isWhiteDay: boolean;
  isFastingDay: boolean;
  fastingReason?: string;
}

export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): FormattedHijriDate {
  // Apply adjustment if user modified moonsighting offset
  const adjustedDate = new Date(date);
  if (adjustmentDays !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + adjustmentDays);
  }

  // Use Intl with Islamic Umm Al Qura calendar
  const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long',
  });

  const parts = hijriFormatter.formatToParts(adjustedDate);
  let day = 1;
  let month = 1;
  let year = 1448;
  let dayName = '';

  for (const p of parts) {
    if (p.type === 'day') day = parseInt(p.value, 10);
    if (p.type === 'month') month = parseInt(p.value, 10);
    if (p.type === 'year') year = parseInt(p.value, 10);
    if (p.type === 'weekday') dayName = p.value;
  }

  const monthName = HIJRI_MONTHS[month - 1] || 'شهر هجري';

  // Gregorian formatted
  const gregorianFormatter = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const gregorianDateAr = gregorianFormatter.format(date);

  // Full Arabic string
  const fullDateAr = `${dayName}، ${day} ${monthName} ${year} هـ`;

  // Check today's events from our database
  const eventsToday = ISLAMIC_EVENTS.filter(
    e => e.hijriMonth === month && e.hijriDay === day
  );

  // Check White Days (13, 14, 15)
  const isWhiteDay = day === 13 || day === 14 || day === 15;

  // Check Sunnah fasting (Monday = 1, Thursday = 4, White Days, Day of Arafah, Ashura, Ramadan)
  const jsDay = date.getDay(); // 0 is Sunday, 1 is Monday, 4 is Thursday
  const isMondayOrThursday = jsDay === 1 || jsDay === 4;
  const isRamadan = month === 9;

  let isFastingDay = false;
  let fastingReason: string | undefined;

  if (isRamadan) {
    isFastingDay = true;
    fastingReason = 'صيام فرض شهر رمضان المبارك';
  } else if (eventsToday.some(e => e.isFastRecommended)) {
    isFastingDay = true;
    fastingReason = eventsToday.find(e => e.isFastRecommended)?.title;
  } else if (isWhiteDay) {
    isFastingDay = true;
    fastingReason = `صيام الأيام البيض (${day} ${monthName})`;
  } else if (isMondayOrThursday) {
    isFastingDay = true;
    fastingReason = jsDay === 1 ? 'صيام سنة يوم الاثنين' : 'صيام سنة يوم الخميس';
  }

  return {
    day,
    month,
    monthName,
    year,
    dayName,
    fullDateAr,
    gregorianDateAr,
    eventsToday,
    isWhiteDay,
    isFastingDay,
    fastingReason
  };
}

export function getUpcomingEvents(
  currentMonth: number,
  currentDay: number,
  limit: number = 5
): (IslamicEvent & { daysRemaining: number })[] {
  const currentTotalDays = (currentMonth - 1) * 30 + currentDay;

  return ISLAMIC_EVENTS.map(event => {
    const eventTotalDays = (event.hijriMonth - 1) * 30 + event.hijriDay;
    let diff = eventTotalDays - currentTotalDays;
    if (diff < 0) {
      diff += 354; // Next Hijri year
    }
    return {
      ...event,
      daysRemaining: diff
    };
  })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, limit);
}
