import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  HeartHandshake,
  BedDouble,
  Sunrise,
  Landmark,
  Check,
  RotateCcw,
  Heart,
  Copy,
  Info,
  Share2
} from 'lucide-react';
import { ThikrItem } from '../types';
import { ATHKAR_CATEGORIES, ALL_ATHKAR } from '../data/athkar';
import { audioService } from '../services/audioService';

interface AthkarViewProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export const AthkarView: React.FC<AthkarViewProps> = ({ favoriteIds, onToggleFavorite }) => {
  const [activeCategory, setActiveCategory] = useState<string>('morning');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load counts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('muslim_athkar_counts');
    if (saved) {
      try {
        setCounts(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveCounts = (newCounts: Record<string, number>) => {
    setCounts(newCounts);
    localStorage.setItem('muslim_athkar_counts', JSON.stringify(newCounts));
  };

  const handleIncrement = (item: ThikrItem) => {
    const current = counts[item.id] || 0;
    if (current < item.count) {
      const next = current + 1;
      const updated = { ...counts, [item.id]: next };
      saveCounts(updated);
      audioService.playTasbihTick();
      audioService.triggerHaptic(25);
    }
  };

  const handleResetCategory = () => {
    const updated = { ...counts };
    currentItems.forEach(item => {
      updated[item.id] = 0;
    });
    saveCounts(updated);
  };

  const handleCopyThikr = (item: ThikrItem) => {
    const textToCopy = `${item.text}\n\n[المصدر: ${item.reference || 'سنة نبوية'}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Get items for current tab
  const currentItems = activeCategory === 'favorites'
    ? ALL_ATHKAR.filter(item => favoriteIds.includes(item.id))
    : ALL_ATHKAR.filter(item => item.category === activeCategory);

  // Compute category completion
  const totalCategoryClicks = currentItems.reduce((acc, curr) => acc + curr.count, 0);
  const currentCategoryClicks = currentItems.reduce((acc, curr) => acc + (counts[curr.id] || 0), 0);
  const progressPct = totalCategoryClicks > 0 ? Math.round((currentCategoryClicks / totalCategoryClicks) * 100) : 0;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'evening':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'after_prayer':
        return <HeartHandshake className="w-4 h-4 text-emerald-500" />;
      case 'sleep':
        return <BedDouble className="w-4 h-4 text-blue-400" />;
      case 'waking':
        return <Sunrise className="w-4 h-4 text-orange-400" />;
      case 'mosque':
        return <Landmark className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>الأذكار النبوية اليومية</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              أذكار صحيحة ومأثورة مع عداد تفاعلي لحفظ الأوراد
            </p>
          </div>

          <button
            onClick={handleResetCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
            title="تصفير عدادات هذا القسم"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير العداد</span>
          </button>
        </div>

        {/* Category Completion Progress Bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-stone-600 dark:text-stone-400">
              نسبة إنجاز القسم: {progressPct}%
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {currentCategoryClicks} / {totalCategoryClicks}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-emerald-600 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {ATHKAR_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            );
          })}
          {/* Favorites tab */}
          <button
            onClick={() => setActiveCategory('favorites')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === 'favorites'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>المفضلة ({favoriteIds.length})</span>
          </button>
        </div>
      </div>

      {/* Athkar Items List */}
      <div className="space-y-3">
        {currentItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
              لا توجد أذكار في المفضلة حالياً
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              يمكنك إضافة أي ذكر إلى المفضلة بالضغط على أيقونة القلب بجانب الذكر
            </p>
          </div>
        ) : (
          currentItems.map((item) => {
            const currentCount = counts[item.id] || 0;
            const isCompleted = currentCount >= item.count;
            const isFavorited = favoriteIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs'
                }`}
              >
                {/* Text of Thikr */}
                <p className="font-amiri text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-loose text-justify">
                  {item.text}
                </p>

                {/* Reward / Virtue box */}
                {item.reward && (
                  <div className="mt-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">الفضل: </span>
                      {item.reward}
                    </p>
                  </div>
                )}

                {/* Footer: Counter, Reference & Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Favorite button */}
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isFavorited
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700'
                      }`}
                      title={isFavorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy button */}
                    <button
                      onClick={() => handleCopyThikr(item)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
                      title="نسخ نص الذكر"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Reference tag */}
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 hidden sm:inline">
                      {item.reference}
                    </span>
                  </div>

                  {/* Interactive Tap-to-Count Button */}
                  <button
                    onClick={() => handleIncrement(item)}
                    disabled={isCompleted}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all transform active:scale-95 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/40'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>اكتمل ({item.count})</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-base">{currentCount}</span>
                        <span className="text-xs text-stone-400 font-normal">من</span>
                        <span className="font-mono text-base">{item.count}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
