import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Bell,
  BatteryCharging,
  Layers,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  Sparkles,
  ArrowRight,
  Settings
} from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import { adhanScheduler } from '../services/adhanScheduler';

interface AndroidPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidPermissionsModal: React.FC<AndroidPermissionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });
  const [testTriggered, setTestTriggered] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
    if (granted) {
      NotificationService.sendNotification('تم تفعيل إشعارات أذان الصلاة بنجاح', {
        body: '«أَقِمِ الصَّلَاةَ» سيعمل الآن على تنبيهك في أوقات الصلوات الخمس.',
        requireInteraction: true,
      });
    }
  };

  const handleTestAdhanNow = () => {
    setTestTriggered(true);
    adhanScheduler.testTrigger('dhuhr', 'makkah', 0.9);
    setTimeout(() => setTestTriggered(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                صلاحيات أندرويد والعمل في الخلفية
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                لضمان تشغيل الأذان بدقة حتى عند قفل شاشة الهاتف
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

        {/* Live Status Overview */}
        <div className="my-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  إذن الإشعارات والتنبيهات
                </h4>
                <p className="text-[11px] text-stone-500">
                  {notificationStatus === 'granted'
                    ? 'ممنوح ومفعّل بنجاح ✓'
                    : notificationStatus === 'denied'
                    ? 'تم رفض الصلاحية - يرجى تفعيلها من إعدادات المتصفح'
                    : 'بحاجة لتفعيل الصلاحية'}
                </p>
              </div>
            </div>

            {notificationStatus !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
              >
                تفعيل الإذن الآن
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full">
                مفعّل ✓
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between gap-2">
            <span className="text-xs text-stone-600 dark:text-stone-300">
              تجربة الأذان وتنبيه الصلاة التفاعلي:
            </span>
            <button
              onClick={handleTestAdhanNow}
              disabled={testTriggered}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{testTriggered ? 'جاري الاختبار...' : 'تشغيل تجربة الأذان'}</span>
            </button>
          </div>
        </div>

        {/* 3 Crucial Android Settings Explained */}
        <div className="space-y-3 text-right">
          <h4 className="text-xs font-bold text-stone-600 dark:text-stone-300 px-1">
            إعدادات هامة في نظام أندرويد ليعمل الأذان في الخلفية دائماً:
          </h4>

          {/* Setting 1: Display Over Other Apps */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. الظهور فوق التطبيقات الأخرى (Display over other apps)</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pr-6">
              يسمح للتطبيق بإظهار نافذة الأذان الكاملة عندما يدخل وقت الصلاة حتى لو كنت تستخدم تطبيقاً آخر (مثل واتساب أو يوتيوب).
            </p>
            <div className="text-[11px] text-stone-500 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800 pr-3 font-mono">
              الضبط ⚙️ ← التطبيقات ← أقم الصلاة ← الظهور في المقدمة ← تفعيل
            </div>
          </div>

          {/* Setting 2: Unrestricted Battery */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm">
              <BatteryCharging className="w-4 h-4 text-amber-500 shrink-0" />
              <span>2. إيقاف قيود البطارية (Unrestricted Battery)</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pr-6">
              نظام أندرويد قد يوقف التطبيقات الموفرة للطاقة أثناء قفل الهاتف. لإبقاء أوقات الصلاة دقيقة:
            </p>
            <div className="text-[11px] text-stone-500 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800 pr-3 font-mono">
              الضبط ⚙️ ← التطبيقات ← أقم الصلاة ← البطارية ← غير مقيد (Unrestricted)
            </div>
          </div>

          {/* Setting 3: Autostart (Xiaomi, Samsung, Huawei, Oppo) */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-xs sm:text-sm">
              <Smartphone className="w-4 h-4 text-teal-600 shrink-0" />
              <span>3. التشغيل التلقائي بعد إعادة تشغيل الهاتف (Autostart)</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pr-6">
              لهواتف شاومي، سامسونج، أوبو وهواوي؛ تأكد من تفعيل «التشغيل التلقائي» ليعيد التطبيق جدولة مواقيت الصلاة تلقائياً عند فتح الهاتف.
            </p>
          </div>
        </div>

        {/* Dedicated Android APK Packaging info */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white border border-emerald-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h5 className="text-xs sm:text-sm font-bold text-amber-200">
                جاهزية حزمة أندرويد الأصلية (APK / AAB)
              </h5>
            </div>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
              TWA Ready
            </span>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            التطبيق مجهز بملفات الـ <code>assetlinks.json</code> ومعايير Trusted Web Activity (TWA) الرسمية من Google. يمكنك تحويله إلى ملف APK مستقل أو رفعه لمتجر Google Play باستخدام أداة Google الرسمية Bubblewrap:
          </p>

          <pre className="text-[10px] bg-black/40 p-2 rounded-xl text-emerald-300 overflow-x-auto font-mono text-left" dir="ltr">
npx @bubblewrap/cli build
          </pre>
        </div>

        {/* Spiritual Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="font-amiri text-lg font-bold text-amber-500">
            «لا تنسوني من دعائكم»
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            أَقِمِ الصَّلَاةَ • إعداد وتطوير: أبو مالك
          </p>
        </div>
      </div>
    </div>
  );
};
