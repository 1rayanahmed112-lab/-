export class NotificationService {
  public static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Web notifications are not supported in this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Send immediate test confirmation to phone lockscreen & notification bar
        this.sendNotification('🕌 تم تفعيل تنبيهات الصلاة بنجاح', {
          body: 'ستصلك مواقيت الصلاة والأذان مباشرة على شاشة هاتفك الرئيسية حتى بعد إغلاق التطبيق.',
          tag: 'welcome-notification',
          requireInteraction: false,
        });
      }
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Displays notification on Android/iOS/Desktop lockscreen and home screen
   * Uses ServiceWorker registration.showNotification which works even when the app is in background or closed
   */
  public static async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const notificationPayload: Record<string, unknown> = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      dir: 'rtl',
      lang: 'ar',
      vibrate: [500, 250, 500, 250, 500, 250, 500],
      requireInteraction: true,
      tag: options?.tag || 'adhan-notification',
      renotify: true,
      ...options,
    };

    // Primary: Try via Service Worker (Works on Android Home Screen / Lockscreen even when closed)
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && typeof registration.showNotification === 'function') {
          await registration.showNotification(title, {
            ...notificationPayload,
            actions: [
              { action: 'open_app', title: '🕌 فتح التطبيق' },
              { action: 'dismiss', title: 'إغلاق' },
            ],
          } as NotificationOptions);
          return;
        }
      } catch (swErr) {
        console.warn('Service worker showNotification fallback:', swErr);
      }
    }

    // Fallback: Standard Web Notification
    try {
      new Notification(title, notificationPayload as NotificationOptions);
    } catch (e) {
      console.warn('Could not display direct notification:', e);
    }
  }
}
