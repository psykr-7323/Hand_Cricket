import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';

function SeriesResult() {
  const { state, dispatch } = useGame();
  const { series_scores, match_results, series_winner, match_settings } = state;
  const playerWon = series_winner === 'player';

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-y-auto bg-arena-surface px-4 pb-8 pt-6 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.08),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Series State Badge */}
        <div className="text-center">
          <span className="inline-block rounded-md border border-arena-outline-variant/30 bg-arena-container px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
            Series {series_scores.player}-{series_scores.bot}
          </span>
        </div>

        {/* Title */}
        <h2 className="esports-headline mt-5 text-center text-3xl tracking-esports text-white sm:text-4xl">
          {playerWon ? 'You Won The Series' : 'Bot Wins The Series'}
        </h2>
        <p className="mt-3 text-center font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
          Best of {match_settings.series_length} completed.
        </p>

        {/* Main Scores */}
        <div className="mt-6 arena-panel rounded-xl overflow-hidden">
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {/* You */}
              <div className="text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-primary">
                  You
                </p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded bg-arena-primary" />
                <p className="mt-4 font-display text-5xl font-bold text-white">
                  {series_scores.player}
                </p>
                <p className="mt-1 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
                  Matches Won
                </p>
              </div>

              {/* Bot */}
              <div className="text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-dim">
                  Bot
                </p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded bg-arena-on-surface-faint" />
                <p className="mt-4 font-display text-5xl font-bold text-arena-on-surface-dim">
                  {series_scores.bot}
                </p>
                <p className="mt-1 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
                  Matches Won
                </p>
              </div>
            </div>
          </div>

          {/* Match Breakdown */}
          <div className="border-t border-arena-outline-variant/15 px-5 py-4">
            <h4 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim">
              Match Breakdown
            </h4>
            <div className="mt-3 space-y-2.5">
              {match_results.map((match) => (
                <div
                  key={match.matchNumber}
                  className="flex items-center justify-between rounded-lg bg-arena-container-highest px-4 py-3"
                >
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                      Match {match.matchNumber}
                    </p>
                    <p className={`mt-1 font-display text-sm font-bold ${
                      match.winner === 'player' ? 'text-arena-primary' : 'text-arena-secondary'
                    }`}>
                      {match.winner === 'player' ? 'You won' : 'BOT won'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-arena-on-surface-dim">{match.playerScore}</p>
                    <p className="text-xs text-arena-on-surface-faint">{match.botScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="tactile-btn flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 text-base"
          >
            <RotateCcw size={18} />
            New Series
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint hover:text-arena-on-surface-dim transition"
          >
            Back to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SeriesResult;
