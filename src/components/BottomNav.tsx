import React from 'react';
import {
  Home,
  Clock,
  BookOpen,
  Sparkles,
  CircleDot,
  Compass,
  HeartHandshake,
  CalendarDays
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'prayers', label: 'المواقيت', icon: Clock },
  { id: 'quran', label: 'القرآن', icon: BookOpen },
  { id: 'athkar', label: 'الأذكار', icon: Sparkles },
  { id: 'tasbih', label: 'السبحة', icon: CircleDot },
  { id: 'qibla', label: 'القبلة', icon: Compass },
  { id: 'duas', label: 'الأدعية', icon: HeartHandshake },
  { id: 'calendar', label: 'التقويم', icon: CalendarDays },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t shadow-2xl pb-safe transition-colors bg-[#faf8f2]/95 dark:bg-[#021b14]/95 border-amber-300/40 dark:border-amber-400/30 text-stone-700 dark:text-stone-300">
      <div className="max-w-xl mx-auto px-2">
        <div className="flex items-center justify-around py-1.5 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-amber-500 font-extrabold scale-105'
                    : 'text-stone-500 dark:text-emerald-200/60 hover:text-amber-500'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-500 ring-1 ring-amber-400/60 shadow-sm shadow-amber-500/20'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
