import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  Monitor,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  WifiOff,
  Bell,
  QrCode,
  ArrowRight,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'qr' | 'android' | 'ios' | 'desktop'>('android');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Primary mobile link that installs cleanly without dev iframe restrictions
  const mobileAppUrl = 'https://ais-pre-hmzg3d6qbvrkx5tbugpoh4-830641390773.europe-west2.run.app';

  // Determine if running inside an iframe (like AI Studio preview)
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  useEffect(() => {
    // Generate high-resolution offline QR Code
    QRCode.toDataURL(mobileAppUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [mobileAppUrl]);

  useEffect(() => {
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    } else if (isInsideIframe) {
      // If on PC / inside AI Studio preview, QR code is the most convenient way to put it on phone
      setActiveTab('qr');
    } else {
      setActiveTab('android');
    }
  }, [isIOS, isAndroid, isInsideIframe, isOpen]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setIsInstalling(true);
    const success = await install();
    setIsInstalling(false);
    if (success) {
      onClose();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(mobileAppUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'أقم الصلاة | تطبيق إسلامي متكامل',
          text: 'تطبيق أقم الصلاة - مواقيت الصلاة والأذان والقرآن والأذكار. إعداد وتطوير: أبو مالك.',
          url: mobileAppUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                تحميل وتثبيت التطبيق على هاتفك
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                «أقم الصلاة» • يعمل بدون إنترنت كتطبيق أصلي
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

        {/* Iframe Notice & Helpful Tip */}
        {isInsideIframe && (
          <div className="my-3.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">لتثبيت التطبيق مباشرة على هاتفك:</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                امسح رمز الاستجابة السريعة (QR) بكاميرا هاتفك لفتح الرابط في متصفح الهاتف (Chrome أو Safari) والتثبيت في ثوانٍ معدودة.
              </p>
            </div>
          </div>
        )}

        {/* Native Browser Install Button (if browser event available) */}
        {!isInstalled && isInstallable && (
          <div className="my-3.5 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h4 className="text-sm font-bold">المتصفح جاهز للتثبيت المباشر!</h4>
                <p className="text-xs text-emerald-100">
                  اضغط الزر أدناه لتثبيت التطبيق على شاشتك بضغطة واحدة.
                </p>
              </div>
            </div>

            <button
              onClick={handleNativeInstall}
              disabled={isInstalling}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isInstalling ? 'جاري فتح نافذة التثبيت...' : 'تثبيت التطبيق على هاتفي الآن'}</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="my-3.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                التطبيق مثبت بالفعل على جهازك!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                أنت تستمتع الآن بالتطبيق بكامل الشاشة وبدون متصفح.
              </p>
            </div>
          </div>
        )}

        {/* Tabs for Guides */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl my-3">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>أندرويد (Chrome)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>آيفون (Safari)</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>مسح الرمز (QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>الكمبيوتر</span>
          </button>
        </div>

        {/* Tab 1: Android Chrome Step-by-Step with Visual Cards */}
        {activeTab === 'android' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                1
              </span>
              <div className="flex-1">
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  افتح الرابط في متصفح Google Chrome على هاتفك
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  تأكد أنك تستخدم تطبيق Chrome على جهاز Android.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                2
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    اضغط على زر القائمة في Chrome (الثلاث نقاط الرأسية ⋮)
                  </h5>
                  <span className="font-mono text-xs font-bold bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-md">
                    ⋮
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  تجدها في أعلى الزاوية اليمنى أو اليسرى لشاشة المتصفح.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                3
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    اختر «تثبيت التطبيق» (Install App)
                  </h5>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    أو إضافة إلى الشاشة الرئيسية
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  ستظهر لك نافذة تأكيد، اضغط <strong>«تثبيت»</strong> وسينزل التطبيق فوراً على شاشة هاتفك مثل برامج Play Store تماماً، بدون متصفح ويعمل بدون إنترنت!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: iPhone iOS Safari Step-by-Step with Visual Cards */}
        {activeTab === 'ios' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                1
              </span>
              <div className="flex-1">
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  افتح الرابط في متصفح سفاري (Safari) على الآيفون
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  نظام Apple يدعم تثبيت التطبيقات عبر Safari الرسمي.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                2
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>اضغط على زر المشاركة</span>
                    <Share2 className="w-4 h-4 text-blue-500 inline" />
                  </h5>
                  <span className="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md">
                    المربع ذو السهم لأعلى ⎋
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  موجود في الشريط السفلي لمتصفح سفاري.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                3
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                    <PlusSquare className="w-4 h-4 text-emerald-600 inline" />
                    <span>اختر «إضافة إلى الشاشة الرئيسية»</span>
                  </h5>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  مرر القائمة لأسفل، واضغط <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong> ثم اضغط <strong>«إضافة»</strong> بالأعلى. وسيصبح التطبيق موجوداً على شاشة هاتفك الرئيسية.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: QR Code for Instant Phone Scan */}
        {activeTab === 'qr' && (
          <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-center space-y-3">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              امسح الكود بكاميرا هاتفك للفتح والتثبيت فوراً:
            </h4>

            {qrDataUrl ? (
              <div className="inline-block p-3 rounded-2xl bg-white shadow-md border border-stone-200">
                <img
                  src={qrDataUrl}
                  alt="QR Code لتحميل تطبيق أقم الصلاة"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-stone-200 animate-pulse rounded-xl mx-auto flex items-center justify-center">
                <span>جاري إنشاء الرمز...</span>
              </div>
            )}

            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
              وجّه كاميرا هاتفك الآيفون أو الأندرويد نحو الرمز أعلاه، وسيظهر لك إشعار لفتح التطبيق في المتصفح مباشرة لتثبيته.
            </p>
          </div>
        )}

        {/* Tab 4: Desktop PC / Mac */}
        {activeTab === 'desktop' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                1
              </span>
              <div className="flex-1">
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  شريط عنوان المتصفح (Chrome أو Edge)
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  ستشاهد أيقونة شاشة كمبيوتر صغيرة أو سهم تحميل على يمين رابط الموقع.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                2
              </span>
              <div className="flex-1">
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  اضغط عليها ثم اختر «تثبيت أقم الصلاة»
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  سيفتح التطبيق في نافذة مستقلة مع إمكانية تثبيته بشريط مهام ويندوز أو شريط Mac Dock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons: Copy link, Open direct, Share */}
        <div className="mt-4 p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-center sm:text-right w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              رابط التطبيق المباشر للهاتف:
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate max-w-[260px] block">
              {mobileAppUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-50 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-xs transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم النسخ ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>

            <a
              href={mobileAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح الآن</span>
            </a>
          </div>
        </div>

        {/* Spiritual Dedication Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="font-amiri text-xl font-bold text-amber-500 drop-shadow-xs">
            «لا تنسوني من دعائكم»
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            أَقِمِ الصَّلَاةَ • إعداد وتطوير: أبو مالك
          </p>
        </div>
      </div>
    </div>
  );
};
