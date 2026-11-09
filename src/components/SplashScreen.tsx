import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeState, setFadeState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3);

  useEffect(() => {
    // Pre-cache all authentic Adhan audios in background while splash is active
    audioService.cacheAllDefaultAdhans().catch(() => {});

    // Initial entrance animation
    const enterTimer = setTimeout(() => setFadeState('visible'), 40);

    // Countdown interval for 3 seconds
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Exact 3-second display timing:
    // Begins beautiful exit transition at exactly 3000ms
    const exitTimer = setTimeout(() => {
      setFadeState('exiting');
    }, 3000);

    // Complete transition and unmount after smooth 600ms fade-out (3600ms total)
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3600);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden bg-radial from-[#042d20] via-[#021f16] to-[#01140e] text-white cursor-pointer select-none transition-all duration-700 ease-out ${
        fadeState === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

      {/* Top Bismillah Pill Badge */}
      <div className="relative z-10 pt-2 text-center animate-fade-in">
        <span className="text-xs sm:text-sm tracking-wider text-amber-200/90 font-amiri font-bold px-4 py-1 rounded-full border border-amber-400/40 bg-emerald-950/80 backdrop-blur-md shadow-lg">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
      </div>

      {/* Scaled-down Framed Artwork (تصغير شكل الخلفية بشكل أنيق ومريح للعين) */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] h-[68vh] sm:h-[72vh] rounded-[32px] sm:rounded-[36px] overflow-hidden border-2 border-amber-400/80 shadow-[0_12px_45px_rgba(0,0,0,0.85)] bg-[#021b13] flex flex-col items-center justify-center p-0.5">
        <div className="relative w-full h-full rounded-[30px] sm:rounded-[34px] overflow-hidden">
          <img
            src="/assets/splash_bg.png"
            alt="أقم الصلاة - الحرم المكي الشريف"
            className="w-full h-full object-contain sm:object-cover object-center transform transition-transform duration-1000 scale-[0.98] hover:scale-100"
          />
          {/* Gentle vignette around borders */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-black/30 pointer-events-none" />
        </div>
      </div>

      {/* Bottom 3-Second Counter & Skip Cue (تفتح بشكل جميل بعد 3 ثواني) */}
      <div className="relative z-10 pb-3 sm:pb-5 text-center flex flex-col items-center gap-2">
        {/* Animated 3-second circular progress indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-xs text-amber-200 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>
            {secondsRemaining > 0 ? (
              <>جارٍ الفتح خلال <strong className="text-white font-mono text-sm">{secondsRemaining}</strong> ثوانٍ...</>
            ) : (
              <span className="text-emerald-300 font-bold">أهلاً بك في أَقِمِ الصَّلَاةَ 🕌</span>
            )}
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-[11px] text-amber-300/80 underline underline-offset-2">انقر للدخول مباشرة</span>
        </div>

        {/* 3-Second Visual Progress Line */}
        <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all ease-linear"
            style={{
              width: `${((3 - secondsRemaining) / 3) * 100}%`,
              transitionDuration: '1000ms',
            }}
          />
        </div>
      </div>
    </div>
  );
};
