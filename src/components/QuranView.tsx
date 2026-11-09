import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Bookmark as BookmarkIcon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Copy,
  Check,
  Type,
  ListFilter,
  Sparkles,
  Download
} from 'lucide-react';
import { SurahMeta, Bookmark, Reciter } from '../types';
import { SURAH_LIST, OFFLINE_SURAHS, RECITERS, getSurahAudioUrl } from '../data/quranData';

interface QuranViewProps {
  lastBookmark: Bookmark | null;
  onSaveBookmark: (bookmark: Bookmark) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({ lastBookmark, onSaveBookmark }) => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');
  const [fontSize, setFontSize] = useState<number>(24); // px
  const [surahAyahs, setSurahAyahs] = useState<{ numberInSurah: number; text: string }[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Audio recitation states
  const [selectedReciter, setSelectedReciter] = useState<string>('alafasy');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch or load Ayahs when a surah is selected
  useEffect(() => {
    if (!selectedSurah) return;

    // Check if we have offline text
    if (OFFLINE_SURAHS[selectedSurah.number]) {
      setSurahAyahs(OFFLINE_SURAHS[selectedSurah.number]);
    } else {
      // Fetch from API
      setIsLoadingAyahs(true);
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/quran-simple`)
        .then(res => res.json())
        .then(data => {
          if (data?.data?.ayahs) {
            setSurahAyahs(data.data.ayahs.map((a: { numberInSurah: number; text: string }) => ({
              numberInSurah: a.numberInSurah,
              text: a.text
            })));
          }
        })
        .catch(() => {
          // If offline and not in bundled sample, show message
          setSurahAyahs([
            {
              numberInSurah: 1,
              text: 'عفواً، يتطلب تحميل نص هذه السورة لأول مرة اتصالاً بالإنترنت ليتم حفظها تلقائياً على جهازك.'
            }
          ]);
        })
        .finally(() => {
          setIsLoadingAyahs(false);
        });
    }

    // Reset audio player on surah switch
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      setAudioProgress(0);
    }
  }, [selectedSurah]);

  // Audio playback handlers
  const togglePlayAudio = () => {
    if (!selectedSurah) return;

    if (!audioRef.current) {
      const audioUrl = getSurahAudioUrl(selectedSurah.number, selectedReciter);
      audioRef.current = new Audio(audioUrl);

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setAudioProgress(audioRef.current.currentTime);
          setAudioDuration(audioRef.current.duration || 0);
        }
      };

      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
      setAudioProgress(0);
    }
  };

  // Filter surahs
  const filteredSurahs = SURAH_LIST.filter(surah => {
    const matchesSearch =
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery;

    const matchesType = filterType === 'all' || surah.revelationType === filterType;
    const matchesJuz = selectedJuz === 'all' || surah.startJuz === selectedJuz;

    return matchesSearch && matchesType && matchesJuz;
  });

  const handleCopyAyah = (text: string, num: number) => {
    const fullText = `﴿ ${text} ﴾ [${selectedSurah?.name}: ${num}]`;
    navigator.clipboard.writeText(fullText);
    setCopiedAyah(num);
    setTimeout(() => setCopiedAyah(null), 1800);
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* If reading a specific Surah */}
      {selectedSurah ? (
        <div className="space-y-4">
          {/* Navigation Bar for Reader */}
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-14 z-20 backdrop-blur-md bg-white/95 dark:bg-stone-900/95">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                    setIsPlayingAudio(false);
                  }
                  setSelectedSurah(null);
                }}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition cursor-pointer"
                title="الرجوع لقائمة السور"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    سورة {selectedSurah.name}
                  </h2>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                    {selectedSurah.revelationTypeAr}
                  </span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  آياتها {selectedSurah.numberOfAyahs} • الجزء {selectedSurah.startJuz}
                </span>
              </div>
            </div>

            {/* Controls: Font size, Reciter audio */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Font size adjustments */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-xl text-xs">
                <Type className="w-3.5 h-3.5 text-stone-500" />
                <button
                  onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
                  className="px-1.5 py-0.5 font-bold hover:text-emerald-600 cursor-pointer"
                  title="تصغير الخط"
                >
                  -
                </button>
                <span className="font-mono text-stone-600 dark:text-stone-300">{fontSize}</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(38, prev + 2))}
                  className="px-1.5 py-0.5 font-bold hover:text-emerald-600 cursor-pointer"
                  title="تكبير الخط"
                >
                  +
                </button>
              </div>

              {/* Bookmark save button */}
              <button
                onClick={() => {
                  onSaveBookmark({
                    surahNumber: selectedSurah.number,
                    surahName: selectedSurah.name,
                    ayahNumber: 1,
                    timestamp: Date.now()
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  lastBookmark?.surahNumber === selectedSurah.number
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'
                }`}
                title="حفظ موضع القراءة"
              >
                <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                <span>{lastBookmark?.surahNumber === selectedSurah.number ? 'تم الحفظ كعلامة' : 'حفظ كعلامة'}</span>
              </button>
            </div>
          </div>

          {/* Audio Recitation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={togglePlayAudio}
                className="w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer"
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <span className="text-[11px] text-emerald-300 font-semibold block">تلاوة سورة {selectedSurah.name}</span>
                <select
                  value={selectedReciter}
                  onChange={(e) => handleReciterChange(e.target.value)}
                  className="bg-black/30 text-white text-xs rounded-lg px-2 py-1 mt-0.5 border border-white/20 focus:outline-hidden cursor-pointer"
                >
                  {RECITERS.map(rec => (
                    <option key={rec.id} value={rec.id} className="text-stone-900 bg-white">
                      {rec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audio Time & Progress */}
            {audioDuration > 0 && (
              <div className="text-xs font-mono text-emerald-200">
                {formatAudioTime(audioProgress)} / {formatAudioTime(audioDuration)}
              </div>
            )}
          </div>

          {/* Surah Header Banner */}
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-stone-900/90 border border-emerald-200 dark:border-stone-800 text-center relative overflow-hidden">
            <h2 className="text-3xl font-bold font-quran text-emerald-900 dark:text-emerald-300">
              سورة {selectedSurah.name}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {selectedSurah.revelationTypeAr} • آياتها {selectedSurah.numberOfAyahs}
            </p>

            {/* Basmalah (except for At-Tawbah 9) */}
            {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
              <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-stone-800">
                <p className="font-quran text-2xl text-emerald-800 dark:text-emerald-400">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}
          </div>

          {/* Verses Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            {isLoadingAyahs ? (
              <div className="py-12 text-center text-stone-400">
                <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
                <p className="text-sm">جاري تحميل الآيات الكريمة...</p>
              </div>
            ) : (
              <div
                className="font-quran leading-loose text-stone-900 dark:text-stone-100 text-justify"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 2.2}px` }}
              >
                {surahAyahs.map((ayah) => {
                  const isBookmarked =
                    lastBookmark?.surahNumber === selectedSurah.number &&
                    lastBookmark?.ayahNumber === ayah.numberInSurah;

                  return (
                    <span
                      key={ayah.numberInSurah}
                      className={`inline group transition rounded px-1 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 ${
                        isBookmarked ? 'bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-400' : ''
                      }`}
                      onClick={() => handleCopyAyah(ayah.text, ayah.numberInSurah)}
                      title="اضغط لنسخ الآية الكريمة"
                    >
                      <span>{ayah.text}</span>
                      <span className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 text-[0.65em] font-sans font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 align-middle">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Surah Navigation Footer */}
          <div className="flex items-center justify-between p-4 bg-stone-100 dark:bg-stone-800/60 rounded-2xl">
            {selectedSurah.number < 114 ? (
              <button
                onClick={() => {
                  const next = SURAH_LIST.find(s => s.number === selectedSurah.number + 1);
                  if (next) setSelectedSurah(next);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>السورة التالية ({SURAH_LIST[selectedSurah.number].name})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : <div />}

            {selectedSurah.number > 1 ? (
              <button
                onClick={() => {
                  const prev = SURAH_LIST.find(s => s.number === selectedSurah.number - 1);
                  if (prev) setSelectedSurah(prev);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة ({SURAH_LIST[selectedSurah.number - 2].name})</span>
              </button>
            ) : <div />}
          </div>
        </div>
      ) : (
        /* Surah List & Index */
        <div className="space-y-4">
          {/* Top Search & Filter Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  فهرس سور القرآن الكريم
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  ١١٤ سورة مباركة مع إمكانية القراءة والاستماع
                </p>
              </div>

              {lastBookmark && (
                <button
                  onClick={() => {
                    const surah = SURAH_LIST.find(s => s.number === lastBookmark.surahNumber);
                    if (surah) setSelectedSurah(surah);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xs cursor-pointer"
                >
                  <BookmarkIcon className="w-3.5 h-3.5 fill-current" />
                  <span>متابعة من سورة {lastBookmark.surahName}</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم السورة، رقمها أو اسمها بالإنجليزية..."
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Filters (All, Meccan, Medinan) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                جميع السور (114)
              </button>
              <button
                onClick={() => setFilterType('Meccan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'Meccan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                مكية
              </button>
              <button
                onClick={() => setFilterType('Medinan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'Medinan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                مدنية
              </button>
            </div>
          </div>

          {/* Surahs Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredSurahs.map((surah) => {
              const isSaved = lastBookmark?.surahNumber === surah.number;
              return (
                <div
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                    isSaved
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 flex items-center justify-center font-mono font-bold text-xs text-stone-700 dark:text-stone-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        سورة {surah.name}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {surah.revelationTypeAr} • {surah.numberOfAyahs} آية
                      </p>
                    </div>
                  </div>

                  <div className="text-left flex flex-col items-end">
                    <span className="text-xs font-semibold text-stone-400">
                      الجزء {surah.startJuz}
                    </span>
                    {isSaved && (
                      <span className="text-[10px] mt-1 bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">
                        موضع القراءة
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
