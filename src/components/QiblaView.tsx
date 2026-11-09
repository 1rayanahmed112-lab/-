import React, { useState, useEffect } from 'react';
import {
  Compass,
  Navigation,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Coordinates } from '../types';
import {
  calculateQiblaBearing,
  calculateDistanceToKaaba,
  getBearingArabicName,
  KAABA_COORDINATES
} from '../services/qiblaService';

interface QiblaViewProps {
  currentCity: Coordinates;
  onOpenCitySelector: () => void;
}

export const QiblaView: React.FC<QiblaViewProps> = ({ currentCity, onOpenCitySelector }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [sensorSupported, setSensorSupported] = useState<boolean>(false);
  const [sensorPermissionRequested, setSensorPermissionRequested] = useState<boolean>(false);

  // Calculate target Qibla bearing from user coordinates
  const qiblaBearing = calculateQiblaBearing(currentCity.latitude, currentCity.longitude);
  const distanceKm = calculateDistanceToKaaba(currentCity.latitude, currentCity.longitude);
  const cardinalName = getBearingArabicName(qiblaBearing);

  // Active heading is device orientation or manual dial
  const currentHeading = deviceHeading !== null ? deviceHeading : manualHeading;

  // The angle to rotate the needle so it points to the Kaaba
  // needleAngle = (qiblaBearing - currentHeading + 360) % 360
  const needleAngle = (qiblaBearing - currentHeading + 360) % 360;

  // Is aligned with Qibla? (within 6 degrees tolerance)
  const isAligned = Math.abs(needleAngle) <= 6 || Math.abs(needleAngle - 360) <= 6;

  // Listen to device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS Safari provides webkitCompassHeading directly
      if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / standard compass
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setSensorSupported(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const requestCompassPermission = async () => {
    setSensorPermissionRequested(true);
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          setSensorSupported(true);
        }
      } catch (err) {
        console.warn('Orientation permission error:', err);
      }
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header Info Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>بوصلة اتجاه القبلة المشرفة</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            تحديد الاتجاه نحو المسجد الحرام بمكة المكرمة
          </p>
        </div>

        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>موقعك: {currentCity.city}</span>
        </button>
      </div>

      {/* Main Compass Visual Container */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border text-center transition-all flex flex-col items-center justify-center relative overflow-hidden ${
          isAligned
            ? 'bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm'
        }`}
      >
        {/* Alignment Banner */}
        <div className="mb-4">
          {isAligned ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs sm:text-sm animate-pulse shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>أنت باتجاه القبلة المشرفة الآن</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>قم بتدوير الهاتف حتى تتطابق الإبرة مع الكعبة</span>
            </div>
          )}
        </div>

        {/* The Compass Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
          {/* Compass Dial Outer Ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/80 shadow-inner flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* Cardinal Directions */}
            <span className="absolute top-2 font-bold text-xs text-rose-500">شمال (N)</span>
            <span className="absolute bottom-2 font-bold text-xs text-stone-400">جنوب (S)</span>
            <span className="absolute left-2 font-bold text-xs text-stone-400">غرب (W)</span>
            <span className="absolute right-2 font-bold text-xs text-stone-400">شرق (E)</span>

            {/* Dial Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <div
                key={deg}
                className="absolute w-1 h-3 bg-stone-300 dark:bg-stone-700"
                style={{
                  top: '6px',
                  transformOrigin: '50% 122px',
                  transform: `rotate(${deg}deg)`,
                }}
              />
            ))}

            {/* Kaaba Direction Marker on the dial */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                top: '12px',
                transformOrigin: '50% 116px',
                transform: `rotate(${qiblaBearing}deg)`,
              }}
            >
              <div className="w-6 h-6 rounded-md bg-stone-900 border-2 border-amber-400 flex items-center justify-center shadow-md">
                <span className="text-[9px] font-bold text-amber-300">🕋</span>
              </div>
            </div>
          </div>

          {/* Center Indicator Needle */}
          <div
            className="absolute w-1.5 h-44 rounded-full transition-transform duration-200 pointer-events-none flex flex-col justify-between items-center"
            style={{ transform: `rotate(${needleAngle}deg)` }}
          >
            {/* Arrow Head pointing to Kaaba */}
            <div className="flex flex-col items-center">
              <div
                className={`w-0 h-0 border-x-8 border-x-transparent border-b-14 transition-colors ${
                  isAligned ? 'border-b-emerald-600' : 'border-b-amber-500'
                }`}
              />
              <div
                className={`w-3.5 h-16 rounded-full -mt-1 ${
                  isAligned ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
            </div>
            {/* Bottom Counterweight */}
            <div className="w-2.5 h-12 bg-stone-400 rounded-full" />
          </div>

          {/* Center Pivot Pin */}
          <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 border-2 border-white dark:border-stone-800 shadow-md flex items-center justify-center z-10">
            <span className="text-xs">🕋</span>
          </div>
        </div>

        {/* Degrees and Distance Data */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-center">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">زاوية القبلة</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {qiblaBearing}°
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">({cardinalName})</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-center">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">المسافة إلى مكة</span>
            <span className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200">
              {distanceKm.toLocaleString('ar-SA')}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">كيلومتر</span>
          </div>
        </div>

        {/* Mobile Sensor Request or Desktop Manual Slider */}
        <div className="mt-5 w-full max-w-sm">
          {!sensorSupported ? (
            <div className="space-y-2">
              <button
                onClick={requestCompassPermission}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                تفعيل مستشعر البوصلة في الهاتف
              </button>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 text-right">
                <span className="text-[11px] text-stone-500 block mb-1">
                  أو قم بتدوير البوصلة يدوياً: ({manualHeading}°)
                </span>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={manualHeading}
                  onChange={(e) => setManualHeading(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>مستشعر البوصلة متصل ويعمل مباشرة</span>
            </div>
          )}
        </div>
      </div>

      {/* Helpful Guidance Notice */}
      <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          <span className="font-bold text-stone-800 dark:text-stone-200">نصيحة لدقة البوصلة: </span>
          ضع الهاتف على سطح مستوٍ وموازٍ للأرض وابتعد عن الأجهزة الإلكترونية أو المعادن المغناطيسية لتحصل على أدق اتجاه للقبلة.
        </p>
      </div>
    </div>
  );
};
