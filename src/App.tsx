/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Coordinates, TabType, PrayerSettings, Bookmark, ActiveAdhanEvent } from './types';
import { DEFAULT_COORDINATES } from './data/cities';
import {
  DEFAULT_SETTINGS,
  calculatePrayerTimes
} from './services/prayerService';
import { getHijriDate } from './services/hijriService';
import { audioService } from './services/audioService';
import { NotificationService } from './services/notificationService';
import { adhanScheduler } from './services/adhanScheduler';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QuranView } from './components/QuranView';
import { AthkarView } from './components/AthkarView';
import { TasbihView } from './components/TasbihView';
import { QiblaView } from './components/QiblaView';
import { DuasView } from './components/DuasView';
import { HijriCalendarView } from './components/HijriCalendarView';
import { CitySelectorModal } from './components/CitySelectorModal';
import { AdhanSettingsModal } from './components/AdhanSettingsModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { SplashScreen } from './components/SplashScreen';
import { ActiveAdhanOverlay } from './components/ActiveAdhanOverlay';
import { InstallModal } from './components/InstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AndroidPermissionsModal } from './components/AndroidPermissionsModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const { isInstalled } = usePWAInstall();
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // User Preferences
  const [currentCity, setCurrentCity] = useState<Coordinates>(() => {
    const saved = localStorage.getItem('muslim_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_COORDINATES;
  });

  const [settings, setSettings] = useState<PrayerSettings>(() => {
    const saved = localStorage.getItem('muslim_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    const saved = localStorage.getItem('muslim_hijri_adj');
    return saved ? Number(saved) : 0;
  });

  const [favoriteAthkarIds, setFavoriteAthkarIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('muslim_fav_athkar');
    return saved ? JSON.parse(saved) : ['m2', 'e2', 'p9'];
  });

  const [favoriteDuaIds, setFavoriteDuaIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('muslim_fav_duas');
    return saved ? JSON.parse(saved) : ['d1', 'd5', 'd16'];
  });

  const [lastBookmark, setLastBookmark] = useState<Bookmark | null>(() => {
    const saved = localStorage.getItem('muslim_quran_bookmark');
    return saved ? JSON.parse(saved) : { surahNumber: 1, surahName: 'الفاتحة', ayahNumber: 1, timestamp: Date.now() };
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('muslim_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isAdhanModalOpen, setIsAdhanModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeAdhanEvent, setActiveAdhanEvent] = useState<ActiveAdhanEvent | null>(null);

  // Automatic Background Adhan Scheduler
  useEffect(() => {
    adhanScheduler.setOnTrigger((event) => {
      setActiveAdhanEvent(event);
    });
    adhanScheduler.start(currentCity, settings);
    return () => adhanScheduler.stop();
  }, [currentCity, settings]);

  // Time & Live Calculation
  const [now, setNow] = useState(new Date());

  // Clock tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setIsAudioPlaying(audioService.getIsPlaying());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('muslim_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('muslim_theme', 'light');
    }
  }, [isDark]);

  // Persist settings
  const handleUpdateSettings = (newSettings: PrayerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('muslim_settings', JSON.stringify(newSettings));
  };

  const handleSelectCity = (newCity: Coordinates) => {
    setCurrentCity(newCity);
    localStorage.setItem('muslim_city', JSON.stringify(newCity));
  };

  const handleUpdateAdjustment = (val: number) => {
    setHijriAdjustment(val);
    localStorage.setItem('muslim_hijri_adj', String(val));
  };

  const handleToggleFavoriteAthkar = (id: string) => {
    const updated = favoriteAthkarIds.includes(id)
      ? favoriteAthkarIds.filter(item => item !== id)
      : [...favoriteAthkarIds, id];
    setFavoriteAthkarIds(updated);
    localStorage.setItem('muslim_fav_athkar', JSON.stringify(updated));
  };

  const handleToggleFavoriteDua = (id: string) => {
    const updated = favoriteDuaIds.includes(id)
      ? favoriteDuaIds.filter(item => item !== id)
      : [...favoriteDuaIds, id];
    setFavoriteDuaIds(updated);
    localStorage.setItem('muslim_fav_duas', JSON.stringify(updated));
  };

  const handleSaveBookmark = (bookmark: Bookmark) => {
    setLastBookmark(bookmark);
    localStorage.setItem('muslim_quran_bookmark', JSON.stringify(bookmark));
  };

  const handlePlayAdhanPreview = () => {
    adhanScheduler.testTrigger('dhuhr', settings.globalVoice || 'makkah', settings.volume);
    setIsAudioPlaying(true);
  };

  const handleStopAudio = () => {
    audioService.stopAudio();
    setIsAudioPlaying(false);
    setActiveAdhanEvent(null);
  };

  // Perform Calculations
  const hijriDate = getHijriDate(now, hijriAdjustment);
  const prayerCalc = calculatePrayerTimes(currentCity, now, settings);

  return (
    <div className="min-h-screen islamic-pattern text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentCity={currentCity}
        hijriDate={hijriDate}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAdhanModal={() => setIsAdhanModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onStopAudio={handleStopAudio}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        silentMode={settings.silentMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6">
        {currentTab === 'home' && (
          <HomeDashboard
            currentCity={currentCity}
            hijriDate={hijriDate}
            prayerItems={prayerCalc.items}
            nextPrayer={prayerCalc.nextPrayer}
            timeToNextMs={prayerCalc.timeToNextMs}
            lastBookmark={lastBookmark}
            onNavigate={(tab) => setCurrentTab(tab)}
            onPlayAdhanPreview={handlePlayAdhanPreview}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
            onOpenAbout={() => setIsAboutModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenAdhanModal={() => setIsAdhanModalOpen(true)}
            settings={settings}
          />
        )}

        {currentTab === 'prayers' && (
          <PrayerTimesView
            currentCity={currentCity}
            hijriDate={hijriDate}
            prayerItems={prayerCalc.items}
            nextPrayer={prayerCalc.nextPrayer}
            timeToNextMs={prayerCalc.timeToNextMs}
            settings={settings}
            qiyamTime={prayerCalc.qiyamTime}
            midnightTime={prayerCalc.midnightTime}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
            onOpenAdhanModal={() => setIsAdhanModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onPlayAdhanPreview={handlePlayAdhanPreview}
          />
        )}

        {currentTab === 'quran' && (
          <QuranView
            lastBookmark={lastBookmark}
            onSaveBookmark={handleSaveBookmark}
          />
        )}

        {currentTab === 'athkar' && (
          <AthkarView
            favoriteIds={favoriteAthkarIds}
            onToggleFavorite={handleToggleFavoriteAthkar}
          />
        )}

        {currentTab === 'tasbih' && (
          <TasbihView />
        )}

        {currentTab === 'qibla' && (
          <QiblaView
            currentCity={currentCity}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
          />
        )}

        {currentTab === 'duas' && (
          <DuasView
            favoriteDuaIds={favoriteDuaIds}
            onToggleFavoriteDua={handleToggleFavoriteDua}
          />
        )}

        {currentTab === 'calendar' && (
          <HijriCalendarView
            hijriDate={hijriDate}
            hijriAdjustment={hijriAdjustment}
            onUpdateAdjustment={handleUpdateAdjustment}
          />
        )}
      </main>

      {/* Bottom Dedication Ribbon */}
      <footer
        onClick={() => setIsAboutModalOpen(true)}
        className="w-full max-w-4xl mx-auto px-4 pb-20 pt-2 text-center cursor-pointer group"
      >
        <div className="py-2.5 px-4 rounded-2xl bg-stone-100/90 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-1.5 transition hover:border-amber-400/50">
          <p className="font-amiri text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
            «لا تنسوني من دعائكم»
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-800 dark:text-stone-200">أَقِمِ الصَّلَاةَ</span>
            <span>•</span>
            <span>إعداد وتطوير: <strong className="text-emerald-700 dark:text-emerald-400">أبو مالك</strong></span>
          </div>
        </div>
      </footer>

      {/* Bottom Sticky Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Modals */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
      />

      <AdhanSettingsModal
        isOpen={isAdhanModalOpen}
        onClose={() => setIsAdhanModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isAudioPlaying={isAudioPlaying}
        onStopAudio={handleStopAudio}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAndroidSettings={() => setIsAndroidModalOpen(true)}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <AndroidPermissionsModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      <OfflineIndicator />

      {/* Active Adhan Overlay Screen with Dua and Sound Visualizer */}
      <ActiveAdhanOverlay
        event={activeAdhanEvent}
        onDismiss={() => {
          setActiveAdhanEvent(null);
          setIsAudioPlaying(false);
        }}
        volume={settings.volume}
        onVolumeChange={(vol) => {
          handleUpdateSettings({ ...settings, volume: vol });
        }}
      />

      {/* Splash Screen on initial load */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </div>
  );
}
