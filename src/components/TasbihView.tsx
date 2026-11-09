import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Check,
  Plus,
  Trophy,
  History
} from 'lucide-react';
import { audioService } from '../services/audioService';

const TASBIH_PRESETS = [
  { text: 'سُبْحَانَ اللَّهِ', defaultTarget: 33 },
  { text: 'الْحَمْدُ لِلَّهِ', defaultTarget: 33 },
  { text: 'اللَّهُ أَكْبَرُ', defaultTarget: 33 },
  { text: 'لَا إِلَهَ إِلَّا اللَّهُ', defaultTarget: 100 },
  { text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', defaultTarget: 100 },
  { text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', defaultTarget: 100 },
  { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', defaultTarget: 100 },
  { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', defaultTarget: 100 },
];

export const TasbihView: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33); // 33, 100, 1000, 0 = unlimited
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [totalTasbih, setTotalTasbih] = useState<number>(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(true);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // Load from storage
  useEffect(() => {
    const savedTotal = localStorage.getItem('muslim_tasbih_total');
    if (savedTotal) {
      setTotalTasbih(Number(savedTotal) || 0);
    }
  }, []);

  const currentThikrText = isCustomMode
    ? (customText || 'اذكر الله يذكرك')
    : TASBIH_PRESETS[selectedPresetIndex].text;

  const handleIncrement = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);

    const nextCount = count + 1;
    const nextTotal = totalTasbih + 1;
    setTotalTasbih(nextTotal);
    localStorage.setItem('muslim_tasbih_total', String(nextTotal));

    if (isSoundEnabled) {
      audioService.playTasbihTick();
    }
    if (isHapticEnabled) {
      audioService.triggerHaptic(target > 0 && nextCount % target === 0 ? 100 : 35);
    }

    if (target > 0 && nextCount >= target) {
      setCount(0);
      setRoundsCompleted(prev => prev + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleResetCurrent = () => {
    setCount(0);
    setRoundsCompleted(0);
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setIsCustomMode(false);
    setTarget(TASBIH_PRESETS[idx].defaultTarget);
    setCount(0);
    setRoundsCompleted(0);
  };

  const progressPct = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header & Stat Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>السبحة الإلكترونية الذكية</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            أوراد التسبيح والاستغفار مع تفاعل لمسي وصوتي
          </p>
        </div>

        {/* Total Tasbih counter badge */}
        <div className="text-left bg-stone-100 dark:bg-stone-800 px-3.5 py-1.5 rounded-2xl">
          <span className="text-[10px] text-stone-400 block font-semibold">إجمالي التسبيح اليوم</span>
          <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalTasbih.toLocaleString('ar-SA')}
          </span>
        </div>
      </div>

      {/* Main Tasbih Circle Dial */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-stone-50 dark:from-stone-900 dark:to-stone-950 border border-stone-200 dark:border-stone-800 shadow-md text-center flex flex-col items-center">
        {/* Current Thikr Label */}
        <div className="min-h-[50px] flex items-center justify-center max-w-md mx-auto mb-6">
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-300 px-4 leading-relaxed">
            {currentThikrText}
          </h3>
        </div>

        {/* Large Tactile Click Button */}
        <div className="relative flex items-center justify-center my-3">
          {/* Circular SVG Progress Ring */}
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="text-stone-200 dark:text-stone-800 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {target > 0 && (
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="text-emerald-500 stroke-current transition-all duration-150"
                strokeWidth="10"
                strokeDasharray="800"
                strokeDashoffset={800 - (800 * progressPct) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </svg>

          {/* Interactive Core Center Button */}
          <button
            onClick={handleIncrement}
            className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-700/30 ring-8 ring-emerald-100 dark:ring-emerald-950/60 transition-transform cursor-pointer select-none ${
              isPressed ? 'scale-95 shadow-inner' : 'hover:scale-102 active:scale-95'
            }`}
          >
            <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {count}
            </span>
            <span className="text-xs font-semibold text-emerald-100 mt-2 bg-emerald-800/40 px-3 py-0.5 rounded-full">
              {target > 0 ? `الهدف: ${target}` : 'مفتوح'}
            </span>
          </button>
        </div>

        {/* Rounds and stats */}
        <div className="flex items-center gap-4 mt-6 text-xs text-stone-600 dark:text-stone-300 font-semibold">
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>الدورات المكتملة: </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {roundsCompleted}
            </span>
          </div>

          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-3 py-1.5 rounded-xl text-stone-500 transition cursor-pointer"
            title="إعادة تعيين العداد الحالي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير</span>
          </button>
        </div>

        {/* Sound & Haptic Toggles */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isSoundEnabled
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>الصوت</span>
          </button>

          <button
            onClick={() => setIsHapticEnabled(!isHapticEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isHapticEnabled
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>الاهتزاز</span>
          </button>
        </div>
      </div>

      {/* Target Selector Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
          تحديد الهدف (العدد لكل دورة)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[33, 100, 1000, 0].map(val => (
            <button
              key={val}
              onClick={() => {
                setTarget(val);
                setCount(0);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                target === val
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {val === 0 ? 'مفتوح ∞' : val}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Athkar List */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
          اختر ذكراً للتسبيح
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TASBIH_PRESETS.map((preset, idx) => {
            const isSelected = !isCustomMode && selectedPresetIndex === idx;
            return (
              <button
                key={preset.text}
                onClick={() => handleSelectPreset(idx)}
                className={`p-3 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="font-amiri text-base">{preset.text}</span>
                <span className="text-[11px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg">
                  {preset.defaultTarget}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom text input */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <label className="text-[11px] font-bold text-stone-500 mb-1 block">
            أو اكتب ذكراً أو دعاء مخصصاً:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setIsCustomMode(true);
              }}
              placeholder="اكتب وردك أو دعاءك هنا..."
              className="flex-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border-none text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            {customText && (
              <button
                onClick={() => {
                  setIsCustomMode(true);
                  setCount(0);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                اعتماد
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
