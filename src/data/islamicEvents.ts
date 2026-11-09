import { IslamicEvent } from '../types';

export const HIJRI_MONTHS = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة'
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'new_year',
    title: 'رأس السنة الهجرية',
    hijriMonth: 1,
    hijriDay: 1,
    monthName: 'محرم',
    description: 'بداية العام الهجري الجديد واستذكار هجرة النبي المصطفى ﷺ من مكة إلى المدينة.'
  },
  {
    id: 'ashura',
    title: 'يوم عاشوراء',
    hijriMonth: 1,
    hijriDay: 10,
    monthName: 'محرم',
    description: 'اليوم الذي نجّى الله فيه موسى عليه السلام وقومه من فرعون. وصيامه يكفر ذنوب سنة ماضية.',
    isFastRecommended: true
  },
  {
    id: 'mawlid',
    title: 'المولد النبوي الشريف',
    hijriMonth: 3,
    hijriDay: 12,
    monthName: 'ربيع الأول',
    description: 'ذكرى مولد خير البرية نبينا وسيدنا محمد ﷺ رحمة للعالمين.'
  },
  {
    id: 'isra_miraj',
    title: 'الإسراء والمعراج',
    hijriMonth: 7,
    hijriDay: 27,
    monthName: 'رجب',
    description: 'معجزة الإسراء بالنبي ﷺ من المسجد الحرام إلى المسجد الأقصى وعروجه إلى السماوات العلا وفرض الصلاة.'
  },
  {
    id: 'nisf_shaban',
    title: 'ليلة النصف من شعبان',
    hijriMonth: 8,
    hijriDay: 15,
    monthName: 'شعبان',
    description: 'ليلة مباركة تحول فيها اتجاه القبلة إلى الكعبة المشرفة، ويستحب فيها الدعاء والاستغفار.'
  },
  {
    id: 'ramadan_start',
    title: 'بداية شهر رمضان المبارك',
    hijriMonth: 9,
    hijriDay: 1,
    monthName: 'رمضان',
    description: 'شهر الصيام والقرآن وليلة القدر التي هي خير من ألف شهر.',
    isFastRecommended: true
  },
  {
    id: 'laylat_qadr',
    title: 'ليالي القدر العظيمة',
    hijriMonth: 9,
    hijriDay: 21,
    monthName: 'رمضان',
    description: 'تحري ليلة القدر في الأوتار من العشر الأواخر من رمضان المبارك.'
  },
  {
    id: 'eid_fitr',
    title: 'عيد الفطر المبارك',
    hijriMonth: 10,
    hijriDay: 1,
    monthName: 'شوال',
    description: 'يوم الفرح والجائزة للصائمين بعد إتمام فريضة صيام شهر رمضان وزكاة الفطر.'
  },
  {
    id: 'six_shawwal',
    title: 'ست من شوال',
    hijriMonth: 10,
    hijriDay: 2,
    monthName: 'شوال',
    description: 'من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر كله.',
    isFastRecommended: true
  },
  {
    id: 'dhul_hijjah_10',
    title: 'العشر الأوائل من ذي الحجة',
    hijriMonth: 12,
    hijriDay: 1,
    monthName: 'ذو الحجة',
    description: 'أفضل أيام الدنيا، العمل الصالح فيها أحب إلى الله من غيرها.',
    isFastRecommended: true
  },
  {
    id: 'arafah',
    title: 'يوم عرفة المبارك',
    hijriMonth: 12,
    hijriDay: 9,
    monthName: 'ذو الحجة',
    description: 'أعظم أيام السنة وركن الحج الأكبر، وصيامه لغير الحاج يكفر سنتين (سنة قبله وسنة بعده).',
    isFastRecommended: true
  },
  {
    id: 'eid_adha',
    title: 'عيد الأضحى المبارك',
    hijriMonth: 12,
    hijriDay: 10,
    monthName: 'ذو الحجة',
    description: 'يوم النحر وأعظم أيام العيد وإحياء سنة الخليل إبراهيم عليه السلام بذبح الأضاحي.'
  },
  {
    id: 'tashreeq',
    title: 'أيام التشريق',
    hijriMonth: 12,
    hijriDay: 11,
    monthName: 'ذو الحجة',
    description: 'أيام أكل وشرب وذكر لله تعالى وتكبير.'
  }
];
