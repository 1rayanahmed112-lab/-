import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  Clock,
  Compass,
  Star
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copiedDua, setCopiedDua] = useState(false);

  if (!isOpen) return null;

  const handleCopyDua = () => {
    const text = 'اللهم اغفر لأخينا أبي مالك ووالديه وأهله، وبارك في جهده وعمله واجعل تطبيق «أقم الصلاة» صدقة جارية له ونافعة لعموم المسلمين.';
    navigator.clipboard.writeText(text);
    setCopiedDua(true);
    setTimeout(() => setCopiedDua(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                عن تطبيق «أقم الصلاة»
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                صفحة التعريف والتطوير
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Brand Box */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white text-center relative overflow-hidden shadow-lg border border-emerald-700/40">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-800/80 border border-amber-400/50 flex items-center justify-center mb-3 shadow-inner">
            <span className="text-3xl">🕋</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white font-serif drop-shadow-sm">
            أَقِمِ الصَّلَاةَ
          </h2>

          <p className="text-sm font-medium text-emerald-200 mt-1">
            تطبيق إسلامي متكامل
          </p>

          {/* Author Badge */}
          <div className="my-4 py-2 px-4 inline-block rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <p className="text-sm font-semibold text-amber-300">
              إعداد وتطوير: <span className="text-white font-bold text-base">أبو مالك</span>
            </p>
          </div>

          {/* Golden Supplication Ribbon */}
          <div className="mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <p className="font-amiri text-xl font-bold text-amber-300 drop-shadow-xs">
              «لا تنسوني من دعائكم»
            </p>
          </div>
        </div>

        {/* Supplication Box for Abu Malik */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              <span>دعاء لأخينا أبي مالك</span>
            </div>
            <button
              onClick={handleCopyDua}
              className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
            >
              {copiedDua ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDua ? 'تم النسخ' : 'نسخ الدعاء'}</span>
            </button>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
            «اللهم اغفر لأخينا أبي مالك ووالديه وأهله، وبارك في جهده ووقته وعمله، واجعل هذا العمل خالصاً لوجهك الكريم وصدقة جارية له، وانفع به المسلمين في مشارق الأرض ومغاربها».
          </p>
        </div>

        {/* Features list */}
        <div className="mt-6 space-y-2 text-xs text-stone-600 dark:text-stone-300">
          <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-3">
            محتويات تطبيق «أقم الصلاة»:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>مواقيت الصلاة الدقيقة والأذان الكامل</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>القرآن الكريم كاملاً وتلاوات كبار القراء</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>الأذكار النبوية والسبحة الإلكترونية الذكية</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500 shrink-0" />
              <span>بوصلة القبلة والتقويم الهجري الشريف</span>
            </div>
          </div>
        </div>

        {/* Offline & Trust note */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>يعمل بدون إنترنت • جميع الحقوق محفوظة لكل مسلم</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
