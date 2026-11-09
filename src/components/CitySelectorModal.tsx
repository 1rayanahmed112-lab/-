import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Navigation,
  Check,
  Compass,
  Sparkles
} from 'lucide-react';
import { Coordinates } from '../types';
import { POPULAR_CITIES } from '../data/cities';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: Coordinates;
  onSelectCity: (coords: Coordinates) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(c =>
    c.city.includes(searchQuery) ||
    c.country.includes(searchQuery)
  );

  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const userCoords: Coordinates = {
          city: 'موقعي الحالي',
          country: 'تحديد دقيق عبر GPS',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onSelectCity(userCoords);
        onClose();
      },
      (error) => {
        setIsDetectingLocation(false);
        console.warn('Geolocation error:', error);
        setLocationError('تعذر تحديد موقعك تلقائياً. يرجى التأكد من منح صلاحية الموقع أو اختيار مدينتك من القائمة.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              تحديد المدينة والموقع
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="mt-4">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isDetectingLocation}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingLocation ? 'جاري تحديد موقعك الجغرافي بدقة...' : 'تحديد موقعي تلقائياً (GPS)'}
            </span>
          </button>

          {locationError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 text-center">
              {locationError}
            </p>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مدينتك (مكة، القاهرة، الرياض، دبي)..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Cities List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredCities.map((c) => {
            const isSelected =
              Math.abs(c.latitude - currentCity.latitude) < 0.01 &&
              Math.abs(c.longitude - currentCity.longitude) < 0.01;

            return (
              <button
                key={`${c.city}-${c.country}`}
                onClick={() => {
                  onSelectCity(c);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold">{c.city}</h4>
                  <span className="text-xs text-stone-400">{c.country}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
