import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function MoveTimer({ duration = 10, isActive, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive || duration === 0) return undefined;
    if (timeLeft <= 0) {
      onExpire?.();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [duration, isActive, onExpire, timeLeft]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = duration === 0 ? 0 : clamp(timeLeft / duration, 0, 1);
  const dashOffset = circumference * (1 - progress);

  const tone =
    timeLeft <= 3 ? 'text-arena-secondary' : timeLeft <= 5 ? 'text-amber-300' : 'text-arena-primary';

  return (
    <div
      className={`arena-panel flex items-center gap-4 rounded-xl px-4 py-3 ${
        timeLeft <= 3 ? 'danger-shake' : ''
      }`}
    >
      <div className="relative h-16 w-16 flex-shrink-0">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="rgba(46, 52, 71, 0.8)"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="url(#timerGradientEsports)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="timerGradientEsports" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#5af0b3" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ffb3ad" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-xl font-bold ${tone}`}>{timeLeft}</span>
          <span className="font-display text-[8px] uppercase tracking-broadcast text-arena-on-surface-faint">
            sec
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
          Shot Clock
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          {duration === 0
            ? 'Timer disabled'
            : timeLeft <= 3
              ? 'Make your move now'
              : 'Decision window active'}
        </p>
        <p className="mt-0.5 text-[11px] text-arena-on-surface-faint">
          {duration === 0 ? 'Manual play only' : `Auto-picks after ${duration}s`}
        </p>
      </div>
    </div>
  );
}

export default MoveTimer;
