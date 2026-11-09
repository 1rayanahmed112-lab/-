import { customAudioStorage } from './customAudioStorage';

export interface AdhanVoice {
  id: string;
  name: string;
  muadhin: string;
  description: string;
  url: string;
  durationApprox: string;
  isFajr?: boolean;
  isShort?: boolean;
  isCustom?: boolean;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'makkah',
    name: 'أذان الحرم المكي الشريف',
    muadhin: 'الشيخ علي أحمد ملا',
    description: 'الأذان المكي الخاشع والشهير بصوت شيخ مؤذني الحرم المكي الشريف',
    url: '/audio/makkah_adhan.mp3',
    durationApprox: '3:20'
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي الشريف',
    muadhin: 'مؤذنو الحرم النبوي الشريف',
    description: 'أذان ندي وهادئ يعبق بسكينة مدينة رسول الله ﷺ',
    url: '/audio/madinah_adhan.mp3',
    durationApprox: '3:15'
  },
  {
    id: 'alaqsa',
    name: 'أذان المسجد الأقصى المبارك',
    muadhin: 'مؤذنو المسجد الأقصى (القدس)',
    description: 'أذان مهيب خاشع من أولى القبلتين وثالث الحرمين الشريفين',
    url: '/audio/alaqsa_adhan.mp3',
    durationApprox: '3:30'
  },
  {
    id: 'alafasy',
    name: 'أذان الشيخ مشاري راشد العفاسي',
    muadhin: 'الشيخ مشاري راشد العفاسي',
    description: 'صوت رخيم مؤثر ومحبوب في كافة أرجاء العالم الإسلامي',
    url: '/audio/alafasy_adhan.mp3',
    durationApprox: '3:45'
  },
  {
    id: 'abdulbasit',
    name: 'أذان الشيخ عبد الباسط عبد الصمد',
    muadhin: 'الشيخ عبد الباسط عبد الصمد (رحمه الله)',
    description: 'الأذان التراثي الخالد بمقام الصبا الشجي الخاشع',
    url: '/audio/abdulbasit_adhan.mp3',
    durationApprox: '3:50'
  },
  {
    id: 'fajr_makkah',
    name: 'أذان الفجر (الحرم المكي)',
    muadhin: 'مؤذنو الحرم المكي الشريف',
    description: 'أذان الفجر المخصوص مع التثويب "الصلاة خير من النوم"',
    url: '/audio/fajr_makkah.mp3',
    durationApprox: '4:10',
    isFajr: true
  },
  {
    id: 'takbeer_short',
    name: 'تكبيرات الأذان القصيرة (تنبيه سريع)',
    muadhin: 'تكبيرات الحرم المكي الشريف',
    description: 'تكبيرات الأذان بصوت بشري حقيقي (الله أكبر الله أكبر)',
    url: '/audio/makkah_adhan.mp3',
    durationApprox: '0:25',
    isShort: true
  }
];

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentVoiceId: string | null = null;
  private volume: number = 0.9;
  private audioContext: AudioContext | null = null;
  private progressInterval: number | null = null;

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Preloads and caches audio into CacheStorage for offline playback
  public async cacheAudio(voiceUrl: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;
    try {
      const cache = await caches.open('adhan-audio-v1');
      await cache.add(voiceUrl);
      return true;
    } catch {
      return false;
    }
  }

  // Pre-caches all local authentic adhans so offline playback is guaranteed
  public async cacheAllDefaultAdhans(): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    try {
      const cache = await caches.open('adhan-audio-v1');
      const urls = ADHAN_VOICES.map(v => v.url);
      const uniqueUrls = Array.from(new Set(urls));
      await Promise.allSettled(uniqueUrls.map(url => cache.add(url)));
    } catch {
      // offline or silent fail
    }
  }

  // Unlock audio context on mobile touch/interaction
  public unlockAudioContext(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioContext && AudioCtx) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch {
      // ignore
    }
  }

  public async playAdhan(
    voiceId: string = 'makkah',
    onEnd?: () => void,
    onProgress?: (current: number, total: number) => void
  ): Promise<boolean> {
    this.stopAudio();
    this.unlockAudioContext();

    this.currentVoiceId = voiceId;
    let audioUrl: string = '';
    let isShort: boolean = false;

    // Check if custom uploaded voice from phone
    if (voiceId.startsWith('custom_')) {
      const customUrl = await customAudioStorage.getSoundUrl(voiceId);
      if (customUrl) {
        audioUrl = customUrl;
      } else {
        audioUrl = ADHAN_VOICES[0].url;
      }
    } else {
      const voice = ADHAN_VOICES.find(v => v.id === voiceId) || ADHAN_VOICES[0];
      audioUrl = voice.url;
      isShort = Boolean(voice.isShort);
    }

    try {
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.preload = 'auto';
      this.currentAudio.volume = this.volume;

      // Handle short takbeer mode (stop after 25s)
      if (isShort) {
        setTimeout(() => {
          if (this.currentVoiceId === 'takbeer_short' && this.isPlaying) {
            this.stopAudio();
            if (onEnd) onEnd();
          }
        }, 25000);
      }

      this.currentAudio.onended = () => {
        this.isPlaying = false;
        this.clearProgress();
        if (onEnd) onEnd();
      };

      this.currentAudio.onerror = () => {
        console.warn('Adhan audio file could not load. Retrying fallback authentic voice.');
        this.isPlaying = false;
        this.clearProgress();
        if (onEnd) onEnd();
      };

      if (onProgress) {
        this.progressInterval = window.setInterval(() => {
          if (this.currentAudio) {
            onProgress(this.currentAudio.currentTime, this.currentAudio.duration || 0);
          }
        }, 500);
      }

      await this.currentAudio.play();
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn('Direct audio playback policy restriction:', err);
      this.isPlaying = false;
      this.clearProgress();
      if (onEnd) onEnd();
      return false;
    }
  }

  private clearProgress(): void {
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  public stopAudio(): void {
    this.clearProgress();
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentVoiceId = null;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentVoiceId(): string | null {
    return this.currentVoiceId;
  }

  // Pure Voice Takbeer Pre-Reminder (Zero Musical Instruments)
  public playPreReminderVoice(): void {
    try {
      this.unlockAudioContext();
      // Play authentic voice takbeer
      const takbeerVoice = ADHAN_VOICES.find(v => v.id === 'takbeer_short') || ADHAN_VOICES[0];
      const audio = new Audio(takbeerVoice.url);
      audio.volume = this.volume;
      audio.play().then(() => {
        // Automatically stop after 10 seconds for pre-reminder
        setTimeout(() => {
          try {
            audio.pause();
          } catch {
            // ignore
          }
        }, 10000);
      }).catch(() => {
        // browser autoplay restriction
      });
    } catch {
      // ignore
    }
  }

  // Tasbih click sound
  public playTasbihTick(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioContext && AudioCtx) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (!this.audioContext) return;

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12 * this.volume, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // Haptic feedback
  public triggerHaptic(duration: number = 35): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // ignore
      }
    }
  }
}

export const audioService = new AudioService();
