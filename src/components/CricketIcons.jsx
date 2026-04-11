import React from 'react';

export function CricketBatIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g transform="rotate(-22 32 32)">
        <rect x="27" y="6" width="10" height="16" rx="4" fill="#6c4a2c" />
        <rect x="29" y="9" width="6" height="10" rx="3" fill="#f4d19a" opacity="0.9" />
        <path
          d="M20 21.5C20 18.5 22.5 16 25.5 16H38.5C41.5 16 44 18.5 44 21.5V50C44 55 40 59 35 59H29C24 59 20 55 20 50V21.5Z"
          fill="#e1b56a"
        />
        <path
          d="M24 22.5C24 20.6 25.6 19 27.5 19H36.5C38.4 19 40 20.6 40 22.5V49C40 52.3 37.3 55 34 55H30C26.7 55 24 52.3 24 49V22.5Z"
          fill="#f7d787"
        />
        <path
          d="M26 24H38"
          stroke="#fff2c2"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}

export function CricketBallIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="24" fill="#d94a46" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#ff8f8a" strokeWidth="2.5" opacity="0.45" />
      <path
        d="M25 13C18.5 18.5 15 25 15 32C15 39 18.5 45.5 25 51"
        fill="none"
        stroke="#fff5d9"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M39 13C45.5 18.5 49 25 49 32C49 39 45.5 45.5 39 51"
        fill="none"
        stroke="#fff5d9"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M24 18L29 23" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 26L28 31" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36 23L41 18" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36 31L41 26" stroke="#fff5d9" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const BAT_TOKENS = new Set(['bat', '🏏']);
const BALL_TOKENS = new Set(['ball', '⚡']);

export function PlayerMarker({ token, className = '', fallbackClassName = 'text-xl' }) {
  if (BAT_TOKENS.has(token)) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`.trim()}>
        <CricketBatIcon className="h-full w-full" />
      </span>
    );
  }

  if (BALL_TOKENS.has(token)) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`.trim()}>
        <CricketBallIcon className="h-full w-full" />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center ${className} ${fallbackClassName}`.trim()}>
      {token ?? '❔'}
    </span>
  );
}
