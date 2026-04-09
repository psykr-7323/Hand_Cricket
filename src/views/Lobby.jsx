import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock3,
  Home,
  Trophy,
  BarChart3,
  Film,
  ShoppingBag,
  Zap,
  HelpCircle,
  LogOut,
  Diamond,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

const getBotLevel = (stats) => {
  const matches = stats.matches ?? 0;
  const winRate = matches > 0 ? ((stats.wins ?? 0) / matches) * 100 : 0;
  if (matches >= 30 && winRate >= 62) return 'Legend';
  if (matches >= 18 && winRate >= 56) return 'Pro';
  if (matches >= 8 && winRate >= 48) return 'Amateur';
  return 'Novice';
};

const getRankLabel = (level) => {
  const ranks = { Legend: 'ELITE I', Pro: 'ELITE III', Amateur: 'GOLD II', Novice: 'SILVER IV' };
  return ranks[level] || 'SILVER IV';
};

function Lobby() {
  const { state, dispatch } = useGame();
  const { bot_profile_stats, match_settings, timerOptions, overOptions } = state;

  const wins = bot_profile_stats.wins ?? 0;
  const botLevel = getBotLevel(bot_profile_stats);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside className="hidden w-[210px] flex-col border-r border-arena-outline-variant/15 bg-arena-surface lg:flex">
        {/* Player Card */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-arena-primary/15 text-arena-primary">
            <Diamond size={18} />
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-arena-primary">
              Player_One
            </p>
            <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
              Rank: {getRankLabel(botLevel)}
            </p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-0.5 px-2">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: Trophy, label: 'Tournament' },
            { icon: BarChart3, label: 'Rankings' },
            { icon: Film, label: 'Replays' },
            { icon: ShoppingBag, label: 'Store' },
          ].map((item) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  item.active
                    ? 'border-l-[3px] border-arena-primary bg-arena-primary/10 text-arena-primary'
                    : 'border-l-[3px] border-transparent text-arena-on-surface-faint hover:text-arena-on-surface-dim'
                }`}
              >
                <IconComponent size={16} />
                <span className="font-display text-xs uppercase tracking-broadcast">{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pb-4">
          <button className="tactile-btn w-full rounded-md px-4 py-2.5 text-xs">
            Go Pro
          </button>
          <div className="mt-3 flex flex-col gap-2 px-1">
            <button className="flex items-center gap-2 text-xs text-arena-on-surface-faint hover:text-arena-on-surface-dim">
              <HelpCircle size={14} /> <span className="font-display uppercase tracking-broadcast">Support</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'GO_TO_MAIN_MENU' })}
              className="flex items-center gap-2 text-xs text-arena-on-surface-faint hover:text-arena-on-surface-dim"
            >
              <LogOut size={14} /> <span className="font-display uppercase tracking-broadcast">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-arena-surface">
        {/* Mobile back button */}
        <div className="flex items-center gap-3 px-4 pt-4 lg:hidden">
          <button
            onClick={() => dispatch({ type: 'GO_TO_MAIN_MENU' })}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-arena-container-highest text-arena-on-surface-dim transition hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left: Background hint (visible on desktop) */}
          <div className="hidden flex-1 flex-col items-start justify-center px-8 lg:flex">
            <div className="opacity-20">
              <h2 className="esports-headline text-6xl tracking-esports text-arena-primary">
                Hand<br />Cricket
              </h2>
              <p className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
                Global Circuit
              </p>
            </div>

            {/* Game Mode Cards */}
            <div className="mt-8 w-full max-w-sm space-y-3">
              <div className="arena-panel-high rounded-lg p-4">
                <h3 className="esports-headline text-base tracking-esports text-white">VS Bot</h3>
                <p className="mt-1 text-xs text-arena-on-surface-faint">AI-Powered AI Opponent</p>
              </div>
              <div className="arena-panel rounded-lg p-4 opacity-50">
                <h3 className="esports-headline text-base tracking-esports text-white">Friends Mode</h3>
                <p className="mt-1 text-xs text-arena-on-surface-faint">Online (Coming Soon)</p>
              </div>
              <div className="arena-panel rounded-lg p-4 opacity-30">
                <div className="flex items-center gap-2">
                  <Diamond size={14} className="text-arena-primary" />
                  <h3 className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-primary">
                    Player_One
                  </h3>
                </div>
                <p className="mt-1 text-xs text-arena-on-surface-faint">
                  Current Streak: {wins} Wins
                </p>
              </div>
            </div>
          </div>

          {/* Right: Match Protocols Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-1 flex-col px-4 py-5 sm:px-6 lg:max-w-[500px] lg:px-8"
          >
            <div className="arena-panel rounded-xl p-5 sm:p-6">
              {/* Header */}
              <div className="accent-bar-left mb-6">
                <h2 className="esports-headline text-2xl tracking-esports text-white">
                  Match Protocols
                </h2>
              </div>

              {/* ─── Overs per Innings ─── */}
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
                          ? 'bg-arena-primary/15 text-arena-primary border border-arena-primary/40'
                          : 'bg-arena-container-highest text-arena-on-surface-dim border border-transparent hover:text-white'
                      }`}
                    >
                      {option === null ? '∞' : option}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Series Length ─── */}
              <div className="mb-6">
                <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                  Series Length
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { length: 1, label: 'BO1', sub: 'One Shot' },
                    { length: 3, label: 'BO3', sub: 'Trilogy' },
                    { length: 5, label: 'BO5', sub: 'Marathon' },
                  ].map(({ length, label, sub }) => (
                    <button
                      key={length}
                      onClick={() => dispatch({ type: 'UPDATE_SERIES_LENGTH', payload: length })}
                      className={`rounded-lg px-3 py-4 text-center transition ${
                        match_settings.series_length === length
                          ? 'bg-arena-primary/15 border border-arena-primary/40'
                          : 'bg-arena-container-highest border border-transparent hover:border-arena-outline-variant/30'
                      }`}
                    >
                      <span
                        className={`esports-headline text-xl tracking-esports ${
                          match_settings.series_length === length
                            ? 'text-arena-primary'
                            : 'text-white'
                        }`}
                      >
                        {label}
                      </span>
                      <p className="mt-1 font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                        {sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── In-Play Timer ─── */}
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
                          ? 'bg-arena-primary/15 text-arena-primary border border-arena-primary/40'
                          : 'bg-arena-container-highest text-arena-on-surface-dim border border-transparent hover:text-white'
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

              {/* ─── Start Button ─── */}
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
    </div>
  );
}

export default Lobby;
