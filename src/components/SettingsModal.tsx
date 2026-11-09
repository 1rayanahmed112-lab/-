import React from 'react';
import {
  X,
  Sliders,
  Check,
  Moon,
  Sun,
  Bell,
  Scale,
  Sparkles,
  Download,
  Smartphone
} from 'lucide-react';
import { PrayerSettings, CalculationMethodName, MadhabType } from '../types';
import { CALCULATION_METHOD_LABELS } from '../services/prayerService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrayerSettings;
  onUpdateSettings: (newSettings: PrayerSettings) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenInstallModal?: () => void;
  onOpenAndroidSettings?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isDark,
  onToggleTheme,
  onOpenInstallModal,
  onOpenAndroidSettings,
}) => {
  if (!isOpen) return null;

  const handleMethodChange = (method: CalculationMethodName) => {
    onUpdateSettings({ ...settings, method });
  };

  const handleMadhabChange = (madhab: MadhabType) => {
    onUpdateSettings({ ...settings, madhab });
  };

  const handleAdjustmentChange = (hijriAdjustment: number) => {
    onUpdateSettings({ ...settings, hijriAdjustment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              إعدادات الحساب والمظهر
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculation Methods */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
            طريقة حساب مواقيت الصلاة (الهيئات والمراصد)
          </label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {(Object.keys(CALCULATION_METHOD_LABELS) as CalculationMethodName[]).map((mKey) => {
              const info = CALCULATION_METHOD_LABELS[mKey];
              const isSelected = settings.method === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => handleMethodChange(mKey)}
                  className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">{info.nameAr}</h4>
                    <span className="text-[11px] text-stone-400">{info.desc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asr Juristic Method */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
            مذهب حساب وقت صلاة العصر
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleMadhabChange('shafi')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                settings.madhab === 'shafi'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <h4 className="text-xs font-bold">الجمهور (شافعي، حنبلي، مالكي)</h4>
              <span className="text-[10px] text-stone-400 mt-0.5 block">عندما يصير ظل الشيء مثله</span>
            </button>

            <button
              onClick={() => handleMadhabChange('hanafi')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                settings.madhab === 'hanafi'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <h4 className="text-xs font-bold">المذهب الحنفي</h4>
              <span className="text-[10px] text-stone-400 mt-0.5 block">عندما يصير ظل الشيء مثليه</span>
            </button>
          </div>
        </div>

        {/* Theme & Appearance */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 block">
            المظهر والألوان
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (isDark) onToggleTheme();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                !isDark
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold">الوضع النهاري</span>
            </button>

            <button
              onClick={() => {
                if (!isDark) onToggleTheme();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                isDark
                  ? 'border-emerald-500 bg-emerald-950 text-emerald-200 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-400'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold">الوضع الليلي</span>
            </button>
          </div>
        </div>

        {/* PWA Install Shortcut in Settings */}
        {onOpenInstallModal && (
          <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                <Download className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  تثبيت التطبيق على الشاشة الرئيسية
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  للوصول السريع والعمل دون اتصال بالإنترنت
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenInstallModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              تثبيت الآن
            </button>
          </div>
        )}

        {/* Android Background Execution & Overlay Settings */}
        {onOpenAndroidSettings && (
          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  صلاحيات أندرويد والعمل في الخلفية
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  الظهور فوق التطبيقات، استثناء البطارية، وحزمة APK
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAndroidSettings();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              عرض الإعدادات
            </button>
          </div>
        )}

        {/* Developer & Dedication Info */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-stone-900 text-white border border-emerald-800/40 text-center space-y-1.5">
          <h4 className="text-sm font-bold text-amber-300">
            أَقِمِ الصَّلَاةَ • تطبيق إسلامي متكامل
          </h4>
          <p className="text-xs text-stone-200">
            إعداد وتطوير: <span className="font-bold text-white">أبو مالك</span>
          </p>
          <p className="font-amiri text-lg font-bold text-amber-300 pt-1">
            «لا تنسوني من دعائكم»
          </p>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
