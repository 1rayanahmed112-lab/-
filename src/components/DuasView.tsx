import React, { useState } from 'react';
import {
  HeartHandshake,
  Search,
  Copy,
  Check,
  Share2,
  Heart,
  Sparkles,
  Info
} from 'lucide-react';
import { ALL_DUAS, DUA_CATEGORIES } from '../data/duas';
import { DuaItem } from '../types';

interface DuasViewProps {
  favoriteDuaIds: string[];
  onToggleFavoriteDua: (id: string) => void;
}

export const DuasView: React.FC<DuasViewProps> = ({ favoriteDuaIds, onToggleFavoriteDua }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = ALL_DUAS.filter(dua => {
    const matchesCat = selectedCategory === 'all'
      ? true
      : selectedCategory === 'favorites'
      ? favoriteDuaIds.includes(dua.id)
      : dua.category === selectedCategory;

    const matchesSearch =
      dua.title.includes(searchQuery) ||
      dua.arabic.includes(searchQuery) ||
      (dua.benefit && dua.benefit.includes(searchQuery));

    return matchesCat && matchesSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `«${dua.arabic}»\n\n[${dua.title} - ${dua.source || 'مأثور'}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleShare = async (dua: DuaItem) => {
    const text = `«${dua.arabic}»\n\n[${dua.title} - ${dua.source || 'مأثور'}]`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.title,
          text: text,
        });
      } catch {
        handleCopy(dua);
      }
    } else {
      handleCopy(dua);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Search */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <span>مكتبة الأدعية النبوية والقرآنية</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            أدعية مأثورة للرزق، الفرج، الشفاء، الاستغفار، وتفريج الكروب
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأدعية (مثال: الرزق، الهم، الشفاء، الاستخارة)..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {DUA_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
          {/* Favorite filter */}
          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'favorites'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Heart className="w-3 h-3 fill-current text-rose-500" />
            <span>المفضلة ({favoriteDuaIds.length})</span>
          </button>
        </div>
      </div>

      {/* Duas List */}
      <div className="space-y-3">
        {filteredDuas.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <HeartHandshake className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً
            </p>
          </div>
        ) : (
          filteredDuas.map((dua) => {
            const isFavorited = favoriteDuaIds.includes(dua.id);
            return (
              <div
                key={dua.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
              >
                {/* Title & Source */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    {dua.title}
                  </h3>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    {dua.source}
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="font-amiri text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-loose text-justify">
                  {dua.arabic}
                </p>

                {/* Benefit / Story if present */}
                {dua.benefit && (
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">الفضل والمناسبة: </span>
                      {dua.benefit}
                    </p>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    {/* Favorite */}
                    <button
                      onClick={() => onToggleFavoriteDua(dua.id)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isFavorited
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700'
                      }`}
                      title={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition cursor-pointer"
                      title="نسخ نص الدعاء"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(dua)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition cursor-pointer"
                      title="مشاركة الدعاء"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] text-stone-400 font-medium">
                    أَقِمِ الصَّلَاةَ • إعداد: أبو مالك
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
