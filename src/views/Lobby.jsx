import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock3, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const SERIES_OPTIONS = [
  { length: 1, label: '1 Match' },
  { length: 3, label: '3 Match' },
  { length: 5, label: '5 Match' },
];

function Lobby() {
  const { state, dispatch } = useGame();
  const { match_settings, timerOptions, overOptions } = state;

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-arena-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.05),transparent_50%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-xl">
          <button
            onClick={() => dispatch({ type: 'GO_TO_MAIN_MENU' })}
            className="flex items-center gap-2 text-sm text-arena-on-surface-faint transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex w-full flex-1 items-center justify-center"
        >
          <div className="arena-panel w-full max-w-xl rounded-xl p-5 sm:p-6">
            <div className="accent-bar-left mb-6">
              <h2 className="esports-headline text-2xl tracking-esports text-white">
                Match Protocols
              </h2>
            </div>

            <div className="mb-6">
              <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                Overs per Innings
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {overOptions.map((option) => (
                  <button
                    key={String(option)}
                    onClick={() => dispatch({ type: 'UPDATE_OVERS', payload: option })}
                    className={`rounded-md px-4 py-2.5 font-display text-sm font-bold transition ${
                      match_settings.overs_per_innings === option
                        ? 'border border-arena-primary/40 bg-arena-primary/15 text-arena-primary'
                        : 'border border-transparent bg-arena-container-highest text-arena-on-surface-dim hover:text-white'
                    }`}
                  >
                    {option === null ? '∞' : option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                Series Length
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {SERIES_OPTIONS.map(({ length, label }) => (
                  <button
                    key={length}
                    onClick={() => dispatch({ type: 'UPDATE_SERIES_LENGTH', payload: length })}
                    className={`rounded-lg px-3 py-4 text-center transition ${
                      match_settings.series_length === length
                        ? 'border border-arena-primary/40 bg-arena-primary/15'
                        : 'border border-transparent bg-arena-container-highest hover:border-arena-outline-variant/30'
                    }`}
                  >
                    <span
                      className={`font-display text-sm font-bold uppercase tracking-broadcast ${
                        match_settings.series_length === length ? 'text-arena-primary' : 'text-white'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                In-Play Timer
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {timerOptions.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => dispatch({ type: 'UPDATE_TIMER', payload: duration })}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-3 font-display text-sm font-bold transition ${
                      match_settings.timer_duration === duration
                        ? 'border border-arena-primary/40 bg-arena-primary/15 text-arena-primary'
                        : 'border border-transparent bg-arena-container-highest text-arena-on-surface-dim hover:text-white'
                    }`}
                  >
                    {duration === 0 ? (
                      <>
                        <Clock3 size={14} />
                        <span className="uppercase tracking-broadcast">Off</span>
                      </>
                    ) : (
                      <span className="uppercase tracking-broadcast">{duration}s</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: 'START_MATCH' })}
              className="tactile-btn flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 text-base"
            >
              <Zap size={20} />
              Start Series
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Lobby;
