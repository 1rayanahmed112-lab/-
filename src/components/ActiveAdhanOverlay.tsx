import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Heart,
  Copy,
  Check,
  Share2,
  Sliders
} from 'lucide-react';
import { ActiveAdhanEvent } from '../types';
import { audioService } from '../services/audioService';

interface ActiveAdhanOverlayProps {
  event: ActiveAdhanEvent | null;
  onDismiss: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const ActiveAdhanOverlay: React.FC<ActiveAdhanOverlayProps> = ({
  event,
  onDismiss,
  volume,
  onVolumeChange,
}) => {
  const [copiedDua, setCopiedDua] = useState(false);

  // Keep phone screen awake during active Adhan presentation
  React.useEffect(() => {
    let wakeLockSentinel: any = null;
    if (event && typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        (navigator as any).wakeLock.request('screen').then((lock: any) => {
          wakeLockSentinel = lock;
        }).catch(() => {
          // ignore wake lock failure
        });
      } catch {
        // ignore
      }
    }
    return () => {
      if (wakeLockSentinel) {
        try {
          wakeLockSentinel.release();
        } catch {
          // ignore
        }
      }
    };
  }, [event]);

  if (!event) return null;

  const handleStop = () => {
    audioService.stopAudio();
    onDismiss();
  };

  const handleCopyDua = () => {
    const duaText = 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ [رواه البخاري]';
    navigator.clipboard.writeText(duaText);
    setCopiedDua(true);
    setTimeout(() => setCopiedDua(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-950 text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-600/50 max-h-[92vh] overflow-y-auto text-center relative">
        {/* Subtle decorative background lights */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Dismiss Button */}
        <button
          onClick={handleStop}
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition cursor-pointer"
          title="إغلاق وإسكات الأذان"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsing Kaaba / Audio Visualizer Ring */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-800/80 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative">
            <span className="text-4xl animate-pulse">🕋</span>

            {/* Glowing animated wave rings */}
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-40 pointer-events-none" />
            <span className="absolute -inset-3 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
          </div>
        </div>

        {/* Main Prayer Announcement */}
        <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30">
          أَقِمِ الصَّلَاةَ • نداء الحق
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-white drop-shadow-md">
          حان الآن موعد صلاة {event.prayerNameAr}
        </h2>

        <p className="text-amber-300 font-amiri text-xl font-bold mt-1">
          «حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ»
        </p>

        <p className="text-xs text-stone-300 mt-1">
          بصوت: <span className="font-semibold text-emerald-200">{event.voiceName}</span>
        </p>

        {/* Animated Sound Wave Bars */}
        <div className="flex items-center justify-center gap-1.5 my-5 h-8">
          {[40, 75, 100, 60, 90, 45, 80, 100, 65, 35].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-emerald-500 to-amber-300 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                animationDelay: `${i * 70}ms`,
              }}
            />
          ))}
        </div>

        {/* Volume Slider & Stop Button Controls */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] shrink-0">مستوى الصوت:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                onVolumeChange(newVol);
                audioService.setVolume(newVol);
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-amber-300 shrink-0">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button
            onClick={handleStop}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <VolumeX className="w-4 h-4" />
            <span>إسكات وإيقاف صوت الأذان</span>
          </button>
        </div>

        {/* Supplication after Adhan */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-600/40 text-right space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دعاء ما بعد الأذان (مستحب)</span>
            </span>
            <button
              onClick={handleCopyDua}
              className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white cursor-pointer"
            >
              {copiedDua ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedDua ? 'تم النسخ' : 'نسخ الدعاء'}</span>
            </button>
          </div>

          <p className="font-amiri text-base sm:text-lg text-stone-100 leading-loose">
            «اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ».
          </p>
          <span className="text-[10px] text-emerald-400/80 block">
            رواه البخاري • قال رسول الله ﷺ: «حلت له شفاعتي يوم القيامة».
          </span>
        </div>

        {/* Dedication footer */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="font-amiri text-sm font-bold text-amber-300">
            «لا تنسوني من دعائكم»
          </p>
          <span className="text-[11px] text-stone-400">
            تطبيق أَقِمِ الصَّلَاةَ • إعداد وتطوير: أبو مالك
          </span>
        </div>
      </div>
    </div>
  );
};
