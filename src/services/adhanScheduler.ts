import { Coordinates, PrayerSettings, ActiveAdhanEvent, PrayerTimeItem } from '../types';
import { calculatePrayerTimes } from './prayerService';
import { audioService, ADHAN_VOICES } from './audioService';
import { NotificationService } from './notificationService';

export class AdhanScheduler {
  private static instance: AdhanScheduler;
  private intervalId: number | null = null;
  private onTriggerCallback: ((event: ActiveAdhanEvent) => void) | null = null;

  public static getInstance(): AdhanScheduler {
    if (!AdhanScheduler.instance) {
      AdhanScheduler.instance = new AdhanScheduler();
    }
    return AdhanScheduler.instance;
  }

  public setOnTrigger(cb: (event: ActiveAdhanEvent) => void): void {
    this.onTriggerCallback = cb;
  }

  // Gets date key for de-duplication: YYYY-MM-DD
  private getDateKey(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private hasPrayerBeenPlayed(prayerId: string, dateKey: string): boolean {
    const key = `adhan_played_${prayerId}_${dateKey}`;
    return localStorage.getItem(key) === 'true';
  }

  private markPrayerAsPlayed(prayerId: string, dateKey: string): void {
    const key = `adhan_played_${prayerId}_${dateKey}`;
    localStorage.setItem(key, 'true');
  }

  private hasPreReminderBeenSent(prayerId: string, dateKey: string): boolean {
    const key = `adhan_pre_${prayerId}_${dateKey}`;
    return localStorage.getItem(key) === 'true';
  }

  private markPreReminderAsSent(prayerId: string, dateKey: string): void {
    const key = `adhan_pre_${prayerId}_${dateKey}`;
    localStorage.setItem(key, 'true');
  }

  public start(coords: Coordinates, settings: PrayerSettings): void {
    this.stop();

    // Check prayer schedule every 1 second
    this.intervalId = window.setInterval(() => {
      this.checkSchedule(coords, settings);
    }, 1000);
  }

  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public checkSchedule(coords: Coordinates, settings: PrayerSettings): void {
    const now = new Date();
    const dateKey = this.getDateKey(now);
    const { items } = calculatePrayerTimes(coords, now, settings);

    // List of standard five prayers
    const adhanPrayers: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
      'fajr',
      'dhuhr',
      'asr',
      'maghrib',
      'isha',
    ];

    adhanPrayers.forEach((pId) => {
      const prayerItem = items.find((item) => item.id === pId);
      if (!prayerItem) return;

      const prayerConfig = settings.prayerAdhanConfig[pId];
      if (!prayerConfig || !prayerConfig.enabled) return;

      const prayerTimeMs = prayerItem.time.getTime();
      const nowMs = now.getTime();
      const diffMs = nowMs - prayerTimeMs;

      // 1. Check Exact Prayer Time (window: from 0 to 45 seconds after prayer start)
      // This ensures if the user unlocks phone slightly after the minute, the Adhan still triggers!
      if (diffMs >= 0 && diffMs <= 45000) {
        if (!this.hasPrayerBeenPlayed(pId, dateKey)) {
          this.markPrayerAsPlayed(pId, dateKey);
          this.triggerAdhanForPrayer(pId, prayerItem.nameAr, prayerConfig.sound || settings.globalVoice, prayerConfig.mode, settings);
        }
      }

      // 2. Check Pre-Prayer Reminder (e.g. 10 or 15 minutes before)
      if (prayerConfig.preReminder > 0) {
        const preMsTarget = prayerConfig.preReminder * 60 * 1000;
        const timeUntilPrayer = prayerTimeMs - nowMs;

        // Window: around the pre-reminder target (0 to 10 seconds)
        if (timeUntilPrayer > 0 && Math.abs(timeUntilPrayer - preMsTarget) <= 8000) {
          if (!this.hasPreReminderBeenSent(pId, dateKey)) {
            this.markPreReminderAsSent(pId, dateKey);
            this.triggerPreReminder(pId, prayerItem.nameAr, prayerConfig.preReminder, settings);
          }
        }
      }
    });
  }

  private triggerAdhanForPrayer(
    prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
    prayerNameAr: string,
    soundId: string,
    mode: 'full' | 'short' | 'silent',
    settings: PrayerSettings
  ): void {
    const isFajr = prayerId === 'fajr';
    const voiceId = isFajr && soundId === 'makkah' ? 'fajr_makkah' : soundId;
    let voiceDisplayName = 'أذان مخصص من هاتفك';

    if (!voiceId.startsWith('custom_')) {
      const voiceObj = ADHAN_VOICES.find((v) => v.id === voiceId) || ADHAN_VOICES[0];
      voiceDisplayName = voiceObj.name;
    }

    // Local / Web Notification
    NotificationService.sendNotification(`حان الآن موعد أذان صلاة ${prayerNameAr}`, {
      body: `حي على الصلاة • حي على الفلاح\nتطبيق «أَقِمِ الصَّلَاةَ» يذكّرك بلقاء الله تعالى.`,
      tag: `adhan-${prayerId}`,
      requireInteraction: true,
    });

    const adhanEvent: ActiveAdhanEvent = {
      prayerId,
      prayerNameAr,
      voiceName: voiceDisplayName,
      isFajr,
      timestamp: Date.now(),
    };

    // UI Callback (renders active Adhan overlay screen)
    if (this.onTriggerCallback) {
      this.onTriggerCallback(adhanEvent);
    }

    // Play Sound if not in Silent Mode and mode is not silent
    if (!settings.silentMode && mode !== 'silent' && settings.autoAdhanEnabled) {
      audioService.setVolume(settings.volume);
      const effectiveVoiceId = mode === 'short' ? 'takbeer_short' : voiceId;
      audioService.playAdhan(effectiveVoiceId);
    }
  }

  private triggerPreReminder(
    prayerId: string,
    prayerNameAr: string,
    mins: number,
    settings: PrayerSettings
  ): void {
    NotificationService.sendNotification(`اقترب موعد صلاة ${prayerNameAr}`, {
      body: `متبقي ${mins} دقيقة على دخول وقت الصلاة. استعد للوضوء وإجابة النداء.`,
      tag: `pre-adhan-${prayerId}`,
    });

    if (!settings.silentMode) {
      audioService.playPreReminderVoice();
    }
  }

  // Manual trigger for testing
  public testTrigger(
    prayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' = 'dhuhr',
    soundId: string = 'makkah',
    volume: number = 0.9
  ): void {
    const voiceObj = ADHAN_VOICES.find((v) => v.id === soundId) || ADHAN_VOICES[0];
    const adhanEvent: ActiveAdhanEvent = {
      prayerId,
      prayerNameAr: prayerId === 'fajr' ? 'الفجر' : 'الظهر',
      voiceName: voiceObj.name,
      isFajr: prayerId === 'fajr',
      timestamp: Date.now(),
    };

    if (this.onTriggerCallback) {
      this.onTriggerCallback(adhanEvent);
    }

    audioService.setVolume(volume);
    audioService.playAdhan(soundId);
  }
}

export const adhanScheduler = AdhanScheduler.getInstance();
