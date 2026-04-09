import React, { useEffect, useState, useCallback } from 'react';

/**
 * ShotClock — Reusable radial countdown timer.
 *
 * Props:
 *   duration  — seconds (default 15)
 *   isActive  — whether the clock is ticking
 *   onExpire  — callback when time runs out
 *   size      — SVG diameter (default 64)
 *   label     — optional label above the timer
 */
function ShotClock({ duration = 15, isActive = true, onExpire, size = 64, label }) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || remaining <= 0) return undefined;

    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive, remaining]);

  const stableOnExpire = useCallback(() => {
    if (onExpire) onExpire();
  }, [onExpire]);

  useEffect(() => {
    if (remaining === 0 && isActive) {
      stableOnExpire();
    }
  }, [remaining, isActive, stableOnExpire]);

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? remaining / duration : 0;
  const dashOffset = circumference * (1 - progress);

  const getColor = () => {
    if (remaining <= 3) return '#ef4444';
    if (remaining <= 7) return '#f59e0b';
    return '#5af0b3';
  };

  const getGlow = () => {
    if (remaining <= 3) return 'rgba(239, 68, 68, 0.4)';
    if (remaining <= 7) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(90, 240, 179, 0.3)';
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
          {label}
        </span>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="shot-clock-ring"
          style={{ filter: `drop-shadow(0 0 8px ${getGlow()})` }}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={4}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-display text-lg font-bold ${remaining <= 3 ? 'animate-pulse' : ''}`}
            style={{ color }}
          >
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ShotClock;
