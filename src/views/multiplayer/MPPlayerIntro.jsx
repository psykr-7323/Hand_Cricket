import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target } from 'lucide-react';
import { PlayerMarker } from '../../components/CricketIcons';
import { useMultiplayer } from '../../context/MultiplayerContext';

function IntroCard({ label, player, accentClass, bgClass, icon }) {
  const Icon = icon;

  return (
    <div className="arena-panel rounded-xl p-5 text-center">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${bgClass} ${accentClass}`}>
        <Icon size={24} />
      </div>
      <p className="mt-3 font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
        {label}
      </p>
      <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-xl bg-arena-container-highest text-2xl">
        <PlayerMarker token={player?.emoji} className="h-9 w-9" fallbackClassName="text-2xl" />
      </div>
      <p className={`mt-3 font-display text-lg font-bold ${accentClass}`}>
        {player?.name ?? 'Pending'}
      </p>
    </div>
  );
}

function MPPlayerIntro() {
  const { state, dispatch } = useMultiplayer();
  const {
    phase,
    activeBatterId,
    activeBowlerId,
    players,
    battingTeam,
    bowlingTeam,
    currentPlayerId,
    hostId,
  } = state;

  const batter = players[activeBatterId];
  const bowler = players[activeBowlerId];
  const isHost = currentPlayerId === hostId;

  useEffect(() => {
    if (phase !== 'MP_PLAYER_INTRO' || !isHost || !activeBatterId || !activeBowlerId) return undefined;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'MP_ADVANCE_PLAYER_INTRO' });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeBatterId, activeBowlerId, dispatch, isHost, phase]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-arena-surface px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(90,240,179,0.06),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center">
          <h2 className="esports-headline text-3xl tracking-[0.15em] text-white sm:text-4xl">
            Next Battle
          </h2>
          <p className="mt-3 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            {battingTeam === 'teamA' ? 'Team A' : 'Team B'} batting vs {bowlingTeam === 'teamA' ? 'Team A' : 'Team B'} bowling
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr]"
        >
          <IntroCard
            label="Now Batting"
            player={batter}
            accentClass="text-arena-primary"
            bgClass="bg-arena-primary/15"
            icon={Target}
          />
          <div className="hidden items-center justify-center sm:flex">
            <span className="esports-headline text-2xl tracking-esports text-arena-on-surface-faint">
              VS
            </span>
          </div>
          <IntroCard
            label="Coming To Bowl"
            player={bowler}
            accentClass="text-blue-400"
            bgClass="bg-blue-500/15"
            icon={Shield}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default MPPlayerIntro;
