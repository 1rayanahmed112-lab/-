import { SurahMeta, Reciter } from '../types';

export const RECITERS: Reciter[] = [
  { id: 'alafasy', name: 'الشيخ مشاري راشد العفاسي', subfolder: 'ar.alafasy' },
  { id: 'abdulbasit', name: 'الشيخ عبد الباسط عبد الصمد (مرتل)', subfolder: 'ar.abdulbasitmurattal' },
  { id: 'minshawi', name: 'الشيخ محمد صديق المنشاوي (مرتل)', subfolder: 'ar.minshawi' },
  { id: 'hussary', name: 'الشيخ محمود خليل الحصري', subfolder: 'ar.husary' },
  { id: 'ghamadi', name: 'الشيخ سعد الغامدي', subfolder: 'ar.saoodshuraym' },
];

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 1 },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', englishNameTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 3 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 4 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 6 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 7 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 8 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 9 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 10 },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 11 },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 11 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 12 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 13 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 13 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 14 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 14 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 15 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 15 },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 16 },
  { number: 20, name: 'طه', englishName: 'Taha', englishNameTranslation: 'Ta-Ha', numberOfAyahs: 135, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 16 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 17 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 17 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 18 },
  { number: 24, name: 'النور', englishName: 'An-Nur', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 18 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 18 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 19 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 19 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 20 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-\'Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 20 },
  { number: 30, name: 'الروم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 21 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 21 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 21 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', englishNameTranslation: 'The Combined Forces', numberOfAyahs: 73, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 21 },
  { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 22 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', englishNameTranslation: 'Originator', numberOfAyahs: 45, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 22 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', englishNameTranslation: 'Ya Sin', numberOfAyahs: 83, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 22 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', englishNameTranslation: 'Those who set the Ranks', numberOfAyahs: 182, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 23 },
  { number: 38, name: 'ص', englishName: 'Sad', englishNameTranslation: 'The Letter "Saad"', numberOfAyahs: 88, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 23 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Troops', numberOfAyahs: 75, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 23 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 24 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', numberOfAyahs: 54, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 24 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', numberOfAyahs: 53, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 25 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold', numberOfAyahs: 89, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 25 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 25 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', englishNameTranslation: 'The Crouching', numberOfAyahs: 37, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 25 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Wind-Curved Sandhills', numberOfAyahs: 35, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 26 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 26 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 26 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', englishNameTranslation: 'The Rooms', numberOfAyahs: 18, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 26 },
  { number: 50, name: 'ق', englishName: 'Qaf', englishNameTranslation: 'The Letter "Qaf"', numberOfAyahs: 45, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 26 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 26 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 27 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 27 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 27 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 27 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 27 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 27 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', englishNameTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 61, name: 'الصف', englishName: 'As-Saf', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', englishNameTranslation: 'The Congregation, Friday', numberOfAyahs: 11, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', englishNameTranslation: 'The Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', englishNameTranslation: 'The Divorce', numberOfAyahs: 12, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 28 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 71, name: 'نوح', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', englishNameTranslation: 'The Man', numberOfAyahs: 31, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 29 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 29 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', englishNameTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 80, name: 'عبس', englishName: '\'Abasa', englishNameTranslation: 'He Frowned', numberOfAyahs: 42, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'The Defrauding', numberOfAyahs: 36, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', englishNameTranslation: 'The Splitting Asunder', numberOfAyahs: 25, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 85, name: 'البروج', englishName: 'Al-Burooj', englishNameTranslation: 'The Mansions of the Stars', numberOfAyahs: 22, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', englishNameTranslation: 'The Nightcommer', numberOfAyahs: 17, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 96, name: 'العلق', englishName: 'Al-\'Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 30 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 30 },
  { number: 100, name: 'العاديات', englishName: 'Al-\'Adiyat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', englishNameTranslation: 'The Rivalry in world increase', numberOfAyahs: 8, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 103, name: 'العصر', englishName: 'Al-\'Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 105, name: 'الفيل', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 107, name: 'الماعون', englishName: 'Al-Ma\'oon', englishNameTranslation: 'The Small Kindness', numberOfAyahs: 7, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', numberOfAyahs: 3, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'Medinan', revelationTypeAr: 'مدنية', startJuz: 30 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishNameTranslation: 'The Sincerity', numberOfAyahs: 4, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', revelationTypeAr: 'مكية', startJuz: 30 },
];

// Offline pre-cached text for prominent surahs & Juz Amma
export const OFFLINE_SURAHS: Record<number, { text: string; numberInSurah: number }[]> = {
  1: [
    { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
    { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' },
    { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ' },
    { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
    { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
    { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' }
  ],
  67: [
    { numberInSurah: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ' },
    { numberInSurah: 2, text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ' },
    { numberInSurah: 3, text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ' },
    { numberInSurah: 4, text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ' },
    { numberInSurah: 5, text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ' }
  ],
  112: [
    { numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
    { numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ' },
    { numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ' },
    { numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ' }
  ],
  113: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ' },
    { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ' },
    { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ' },
    { numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ' },
    { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ' }
  ],
  114: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ' },
    { numberInSurah: 2, text: 'مَلِكِ النَّاسِ' },
    { numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ' },
    { numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ' },
    { numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ' },
    { numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ' }
  ],
  108: [
    { numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ' },
    { numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ' },
    { numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ' }
  ],
  110: [
    { numberInSurah: 1, text: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ' },
    { numberInSurah: 2, text: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا' },
    { numberInSurah: 3, text: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا' }
  ]
};

// Audio stream helper
export function getSurahAudioUrl(surahNumber: number, reciterId: string = 'alafasy'): string {
  const padded = surahNumber.toString().padStart(3, '0');
  
  if (reciterId === 'abdulbasit') {
    return `https://server7.mp3quran.net/basit/${padded}.mp3`;
  }
  if (reciterId === 'minshawi') {
    return `https://server10.mp3quran.net/minsh/${padded}.mp3`;
  }
  if (reciterId === 'hussary') {
    return `https://server13.mp3quran.net/husr/${padded}.mp3`;
  }
  if (reciterId === 'ghamadi') {
    return `https://server7.mp3quran.net/s_gmd/${padded}.mp3`;
  }
  // Default Alafasy
  return `https://server8.mp3quran.net/afs/${padded}.mp3`;
}
