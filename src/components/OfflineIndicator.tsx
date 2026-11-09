import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:right-auto sm:max-w-md z-40 flex items-center gap-2.5 rounded-2xl bg-amber-600/95 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="h-2 w-2 rounded-full bg-white animate-ping shrink-0" />
      <WifiOff className="w-4 h-4 shrink-0" />
      <span className="flex-1">
        أنت الآن في وضع عدم الاتصال (Offline) — التطبيق ومواقيت الصلاة والأذكار والقرآن تعمل بكفاءة من الذاكرة المحفوظة.
      </span>
    </div>
  );
};
