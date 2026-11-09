import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  Check,
  Bell,
  Sliders,
  ShieldCheck,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  Moon,
  Clock,
  Upload,
  Plus,
  Trash2,
  FileAudio
} from 'lucide-react';
import { PrayerSettings, PrayerAdhanItemConfig } from '../types';
import { ADHAN_VOICES, audioService } from '../services/audioService';
import { NotificationService } from '../services/notificationService';
import { adhanScheduler } from '../services/adhanScheduler';
import { customAudioStorage, CustomSoundMeta } from '../services/customAudioStorage';

interface AdhanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrayerSettings;
  onUpdateSettings: (newSettings: PrayerSettings) => void;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
}

export const AdhanSettingsModal: React.FC<AdhanSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isAudioPlaying,
  onStopAudio,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<string>(
    settings.globalVoice || 'makkah'
  );
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [previewProgress, setPreviewProgress] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'voices' | 'custom' | 'prayers' | 'system'>('voices');
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cachedSuccess, setCachedSuccess] = useState<boolean>(false);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(
    NotificationService.getPermission() === 'granted'
  );

  // Custom audio files from phone state
  const [customSounds, setCustomSounds] = useState<CustomSoundMeta[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load custom sounds from IndexedDB on modal open
  useEffect(() => {
    if (isOpen) {
      customAudioStorage.getAllSounds().then((sounds) => {
        setCustomSounds(sounds);
      });
    }
  }, [isOpen]);

  // Handle file select from phone
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate mime type or extension
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/webm'];
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|wma)$/i.test(file.name);

    if (!isAudio) {
      setUploadError('يرجى اختيار ملف صوتي صالح بصيغة (MP3 أو M4A أو WAV).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const newSound = await customAudioStorage.saveAudio(file);
      const updatedList = await customAudioStorage.getAllSounds();
      setCustomSounds(updatedList);

      // Automatically select the new custom sound as global adhan!
      handleSelectGlobalVoice(newSound.id);
      setActiveTab('custom');
    } catch (err) {
      console.error('Failed to save audio:', err);
      setUploadError('تعذر حفظ الملف الصوتي في ذاكرة الهاتف. يرجى تجربة ملف آخر.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteCustomSound = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل تريد بالتأكيد حذف هذا الصوت المخصص من هاتفك؟')) {
      if (previewingVoiceId === id) {
        audioService.stopAudio();
        setPreviewingVoiceId(null);
      }
      await customAudioStorage.deleteSound(id);
      const updated = await customAudioStorage.getAllSounds();
      setCustomSounds(updated);

      // If deleted sound was the selected global voice, fall back to Makkah
      if (selectedVoice === id) {
        handleSelectGlobalVoice('makkah');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} كيلوبايت`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
  };

  if (!isOpen) return null;

  // Preview Voice handler
  const handleTestAudio = async (voiceId: string) => {
    if (previewingVoiceId === voiceId) {
      audioService.stopAudio();
      setPreviewingVoiceId(null);
      setPreviewProgress(0);
      return;
    }

    setPreviewingVoiceId(voiceId);
    audioService.setVolume(settings.volume);

    await audioService.playAdhan(
      voiceId,
      () => {
        setPreviewingVoiceId(null);
        setPreviewProgress(0);
      },
      (curr, total) => {
        setPreviewProgress(curr);
        setPreviewDuration(total);
      }
    );
  };

  // Select global voice
  const handleSelectGlobalVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    const updated = { ...settings.prayerAdhanConfig };
    (Object.keys(updated) as (keyof typeof updated)[]).forEach((key) => {
      // Keep fajr specific voice if applicable
      if (key === 'fajr' && voiceId === 'makkah') {
        updated[key].sound = 'fajr_makkah';
      } else {
        updated[key].sound = voiceId;
      }
    });

    onUpdateSettings({
      ...settings,
      globalVoice: voiceId,
      prayerAdhanConfig: updated,
    });
  };

  // Toggle per-prayer enabled
  const handleTogglePrayer = (prayerKey: keyof PrayerSettings['prayerAdhanConfig']) => {
    const current = settings.prayerAdhanConfig[prayerKey];
    onUpdateSettings({
      ...settings,
      prayerAdhanConfig: {
        ...settings.prayerAdhanConfig,
        [prayerKey]: {
          ...current,
          enabled: !current.enabled,
        },
      },
    });
  };

  // Change per-prayer mode (full, short, silent)
  const handleChangePrayerMode = (
    prayerKey: keyof PrayerSettings['prayerAdhanConfig'],
    mode: 'full' | 'short' | 'silent'
  ) => {
    const current = settings.prayerAdhanConfig[prayerKey];
    onUpdateSettings({
      ...settings,
      prayerAdhanConfig: {
        ...settings.prayerAdhanConfig,
        [prayerKey]: {
          ...current,
          mode,
          enabled: mode !== 'silent',
        },
      },
    });
  };

  // Change per-prayer voice
  const handleChangePrayerVoice = (
    prayerKey: keyof PrayerSettings['prayerAdhanConfig'],
    sound: string
  ) => {
    const current = settings.prayerAdhanConfig[prayerKey];
    onUpdateSettings({
      ...settings,
      prayerAdhanConfig: {
        ...settings.prayerAdhanConfig,
        [prayerKey]: {
          ...current,
          sound,
        },
      },
    });
  };

  // Change pre-reminder minutes
  const handleChangePreReminder = (
    prayerKey: keyof PrayerSettings['prayerAdhanConfig'],
    mins: number
  ) => {
    const current = settings.prayerAdhanConfig[prayerKey];
    onUpdateSettings({
      ...settings,
      prayerAdhanConfig: {
        ...settings.prayerAdhanConfig,
        [prayerKey]: {
          ...current,
          preReminder: mins,
        },
      },
    });
  };

  // Pre-cache all adhan files for 100% offline usage
  const handleCacheOfflineAudio = async () => {
    setIsCaching(true);
    setCachedSuccess(false);

    try {
      for (const voice of ADHAN_VOICES) {
        await audioService.cacheAudio(voice.url);
      }
      setCachedSuccess(true);
      setTimeout(() => setCachedSuccess(false), 3500);
    } catch {
      console.warn('Caching incomplete');
    } finally {
      setIsCaching(false);
    }
  };

  // Test full real adhan trigger
  const handleTestLiveAdhan = () => {
    adhanScheduler.testTrigger('dhuhr', selectedVoice, settings.volume);
    onClose();
  };

  const handleRequestNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    setNotificationGranted(granted);
    if (granted) {
      NotificationService.sendNotification('تم تفعيل نظام الأذان والإشعارات بنجاح', {
        body: 'سيقوم تطبيق «أَقِمِ الصَّلَاةَ» بتذكيرك بدخول وقت كل صلاة بإذن الله تعالى.',
      });
    }
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Volume2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                استوديو المؤذن وإعدادات الأذان
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تطبيق «أَقِمِ الصَّلَاةَ» • تخصيص الأصوات والتنبيه التلقائي
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (previewingVoiceId) {
                audioService.stopAudio();
                setPreviewingVoiceId(null);
              }
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Switches & Volume Strip */}
        <div className="my-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Auto-Adhan Master Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                الأذان التلقائي عند دخول الوقت:
              </span>
              <button
                onClick={() => {
                  audioService.unlockAudioContext();
                  onUpdateSettings({
                    ...settings,
                    autoAdhanEnabled: !settings.autoAdhanEnabled,
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  settings.autoAdhanEnabled
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {settings.autoAdhanEnabled ? 'مفعّل تلقائياً ✓' : 'معطّل'}
              </button>
            </div>

            {/* Silent Mode / Do Not Disturb */}
            <button
              onClick={() => {
                onUpdateSettings({
                  ...settings,
                  silentMode: !settings.silentMode,
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto ${
                settings.silentMode
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{settings.silentMode ? 'الوضع الصامت مفعّل' : 'الوضع العادي'}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 shrink-0">
              مستوى صوت الأذان:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => {
                const vol = Number(e.target.value);
                onUpdateSettings({ ...settings, volume: vol });
                audioService.setVolume(vol);
              }}
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 w-10 text-left shrink-0">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
        </div>

        {/* Hidden File Input for phone audio selection */}
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.wma"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Studio Tabs Header */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl shrink-0 mb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('voices')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'voices'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            أصوات المؤذنين ({ADHAN_VOICES.length})
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>أصوات من هاتفي ({customSounds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'prayers'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            تخصيص الصلوات
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'system'
                ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            الخلفية والـ Offline
          </button>
        </div>

        {/* Tab 1: Adhan Voices Library */}
        {activeTab === 'voices' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* Quick Upload from Phone Banner */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/30 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-right cursor-pointer hover:border-amber-400 transition mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    هل لديك صوت أذان مفضل على هاتفك؟
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    اضغط هنا لإضافة ملف صوتي (MP3 أو M4A) من جهازك
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-xl shadow-xs shrink-0">
                + إضافة ملف
              </span>
            </button>

            {ADHAN_VOICES.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              const isVoicePlaying = previewingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => handleSelectGlobalVoice(voice.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                          {voice.name}
                        </h4>
                        {voice.isFajr && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded-full font-semibold">
                            أذان الفجر
                          </span>
                        )}
                        {voice.isShort && (
                          <span className="text-[10px] bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded-full font-semibold">
                            تنبيه سريع
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {voice.description}
                      </p>
                    </div>
                  </div>

                  {/* Preview audio button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isVoicePlaying && previewDuration > 0 && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        {formatAudioTime(previewProgress)}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestAudio(voice.id);
                      }}
                      className={`p-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                        isVoicePlaying
                          ? 'bg-amber-500 text-stone-950 shadow-md animate-pulse'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                      }`}
                      title={isVoicePlaying ? 'إيقاف المعاينة' : 'معاينة واستماع'}
                    >
                      {isVoicePlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>معاينة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Custom Sounds from Phone */}
        {activeTab === 'custom' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* Upload Action Box */}
            <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    إضافة أذان من ذاكرة هاتفك
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    يدعم ملفات MP3, M4A, WAV • يتم حفظه بأمان على هاتفك للعمل دون إنترنت
                  </p>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                <span>{isUploading ? 'جاري الحفظ في الهاتف...' : 'اختيار ملف من الهاتف'}</span>
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs text-center">
                {uploadError}
              </div>
            )}

            {/* Custom Sounds List */}
            {customSounds.length === 0 ? (
              <div className="py-10 text-center p-6 bg-stone-50 dark:bg-stone-800/40 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2">
                <FileAudio className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300">
                  لم تقم بإضافة أي أصوات أذان من هاتفك بعد
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  اضغط على زر "اختيار ملف من الهاتف" أعلاه لاختيار أي ملف صوتي مسجل أو محمل على جهازك ليصبح أذانك المعتمد.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 block px-1">
                  أصوات الأذان المحفوظة على جهازك ({customSounds.length}):
                </span>

                {customSounds.map((sound) => {
                  const isSelected = selectedVoice === sound.id;
                  const isVoicePlaying = previewingVoiceId === sound.id;

                  return (
                    <div
                      key={sound.id}
                      onClick={() => handleSelectGlobalVoice(sound.id)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-white dark:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-300 dark:border-stone-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                            {sound.name}
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-2">
                            <span>{formatFileSize(sound.sizeBytes)}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400">محفوظ على الهاتف</span>
                          </p>
                        </div>
                      </div>

                      {/* Controls: Preview & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isVoicePlaying && previewDuration > 0 && (
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                            {formatAudioTime(previewProgress)}
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestAudio(sound.id);
                          }}
                          className={`p-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                            isVoicePlaying
                              ? 'bg-amber-500 text-stone-950 shadow-md animate-pulse'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100'
                          }`}
                          title={isVoicePlaying ? 'إيقاف المعاينة' : 'معاينة واستماع'}
                        >
                          {isVoicePlaying ? (
                            <Square className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => handleDeleteCustomSound(sound.id, e)}
                          className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 text-stone-400 transition cursor-pointer"
                          title="حذف هذا الصوت المخصص"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Per-Prayer Controls */}
        {activeTab === 'prayers' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {[
              { key: 'fajr' as const, name: 'صلاة الفجر' },
              { key: 'dhuhr' as const, name: 'صلاة الظهر' },
              { key: 'asr' as const, name: 'صلاة العصر' },
              { key: 'maghrib' as const, name: 'صلاة المغرب' },
              { key: 'isha' as const, name: 'صلاة العشاء' },
            ].map(({ key, name }) => {
              const cfg = settings.prayerAdhanConfig[key];

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {name}
                    </h4>

                    {/* Mode selector pills */}
                    <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-700/80 p-0.5 rounded-xl text-[11px] font-bold">
                      <button
                        onClick={() => handleChangePrayerMode(key, 'full')}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          cfg.mode === 'full' && cfg.enabled
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        أذان كامل
                      </button>
                      <button
                        onClick={() => handleChangePrayerMode(key, 'short')}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          cfg.mode === 'short' && cfg.enabled
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        تكبيرات قصيرة
                      </button>
                      <button
                        onClick={() => handleChangePrayerMode(key, 'silent')}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          !cfg.enabled || cfg.mode === 'silent'
                            ? 'bg-stone-400 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        صامت
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Voice choice for this prayer */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-500 dark:text-stone-400">الصوت:</span>
                      <select
                        value={cfg.sound}
                        onChange={(e) => handleChangePrayerVoice(key, e.target.value)}
                        className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-2 py-1 text-xs text-stone-800 dark:text-stone-200 cursor-pointer"
                      >
                        {customSounds.length > 0 && (
                          <optgroup label="أصوات من هاتفي 📱">
                            {customSounds.map((cs) => (
                              <option key={cs.id} value={cs.id}>
                                {cs.name} (من هاتفي)
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="أصوات التطبيق 🕌">
                          {ADHAN_VOICES.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Pre-prayer reminder */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-500 dark:text-stone-400">تنبيه مسبق:</span>
                      <select
                        value={cfg.preReminder}
                        onChange={(e) => handleChangePreReminder(key, Number(e.target.value))}
                        className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-2 py-1 text-xs text-stone-800 dark:text-stone-200 cursor-pointer"
                      >
                        <option value={0}>بدون تنبيه مسبق</option>
                        <option value={5}>قبل 5 دقائق</option>
                        <option value={10}>قبل 10 دقائق</option>
                        <option value={15}>قبل 15 دقيقة</option>
                        <option value={20}>قبل 20 دقيقة</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: System Permissions, Background & Offline */}
        {activeTab === 'system' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Notification Permission Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">
                    صلاحية الإشعارات المحلية (Local Notifications)
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    {notificationGranted
                      ? 'مفعّلة بنجاح • سيصلك إشعار بالصلاة في الموعد المحدد'
                      : 'يلزم منح الإذن لتنبيهك عند دخول وقت الصلاة'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRequestNotifications}
                disabled={notificationGranted}
                className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  notificationGranted
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {notificationGranted ? 'الصلاحية ممنوحة ✓' : 'تفعيل الإشعارات'}
              </button>
            </div>

            {/* Offline Audio Caching Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">
                    تحميل الأصوات للعمل بدون إنترنت
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    حفظ ملفات الأذان في ذاكرة جهازك ليعمل الأذان حتى عند انقطاع الشبكة
                  </p>
                </div>
              </div>

              <button
                onClick={handleCacheOfflineAudio}
                disabled={isCaching}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition shadow-xs cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isCaching ? 'جاري التحميل...' : cachedSuccess ? 'تم الحفظ بنجاح ✓' : 'تحميل الأصوات الآن'}
              </button>
            </div>

            {/* Operating System Instructions (Android & iPhone) */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>لضمان دقة الأذان على هواتف Android و iPhone:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 leading-relaxed">
                <li>
                  <strong>على iPhone:</strong> اضغط على زر المشاركة ثم اختر <em>"إضافة إلى الصفحة الرئيسية"</em> ليعمل التطبيق كتطبيق هاتف ويدعم إشعارات الخلفية.
                </li>
                <li>
                  <strong>على Android:</strong> تأكد من استثناء التطبيق من <em>"تحسين توفير البطارية"</em> في إعدادات الهاتف ليعمل المنبه دون تأخير.
                </li>
                <li>
                  يحتوي التطبيق على نظام منع التكرار التلقائي، فلا يتكرر أذان نفس الصلاة مرتين أبداً في نفس اليوم.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleTestLiveAdhan}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            title="تجربة محاكاة الأذان الكامل الآن"
          >
            <Sparkles className="w-4 h-4" />
            <span>تجربة أذان فوري الآن</span>
          </button>

          <button
            onClick={() => {
              if (previewingVoiceId) {
                audioService.stopAudio();
                setPreviewingVoiceId(null);
              }
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            تم وحفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};
