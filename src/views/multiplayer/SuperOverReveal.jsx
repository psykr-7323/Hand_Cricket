import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target } from 'lucide-react';
import { PlayerMarker } from '../../components/CricketIcons';
import { useMultiplayer } from '../../context/MultiplayerContext';

function PlayerPill({ player, accentClass }) {
  if (!player) return null;

  return (
    <div className="rounded-lg bg-arena-container-high px-3 py-2 text-center">
      <div className="flex justify-center">
        <PlayerMarker token={player.emoji} className="h-6 w-6" fallbackClassName="text-lg" />
      </div>
      <p className={`mt-1 font-display text-xs font-bold ${accentClass}`}>
        {player.name}
      </p>
    </div>
  );
}

function TeamRevealCard({ label, accentClass, borderClass, selections, players }) {
  const batterPlayers = (selections?.batters ?? []).map((id) => players[id]).filter(Boolean);
  const bowlerPlayer = players[selections?.bowler];

  return (
    <div className={`arena-panel rounded-xl border ${borderClass} p-5`}>
      <h3 className={`esports-headline text-lg tracking-esports ${accentClass}`}>
        {label}
      </h3>

      <div className="mt-4">
        <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
          <Target size={10} className="mr-1 inline" />
          Locked Batters
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {batterPlayers.map((player) => (
            <PlayerPill key={player.id} player={player} accentClass={accentClass} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
          <Shield size={10} className="mr-1 inline" />
          Locked Bowler
        </p>
        <div className="mt-2">
          <PlayerPill player={bowlerPlayer} accentClass={accentClass} />
        </div>
      </div>
    </div>
  );
}

function SuperOverReveal() {
  const { state, dispatch } = useMultiplayer();
  const { phase, superOver, players, currentPlayerId, hostId } = state;
  const isHost = currentPlayerId === hostId;

  useEffect(() => {
    if (phase !== 'MP_SUPER_OVER_REVEAL' || !isHost) return undefined;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'MP_ADVANCE_SUPER_OVER_REVEAL' });
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [dispatch, isHost, phase]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-arena-surface px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="text-center">
          <div className="super-over-banner inline-block px-6 py-3">
            <h2 className="esports-headline text-3xl tracking-[0.15em] neon-text-super sm:text-4xl">
              Super Over {superOver.sequence}
            </h2>
          </div>
          <p className="mt-3 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Locked lineups revealed. Match begins in a moment.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <TeamRevealCard
            label="Team A"
            accentClass="text-arena-primary"
            borderClass="border-arena-primary/20"
            selections={superOver.teamASelections}
            players={players}
          />
          <TeamRevealCard
            label="Team B"
            accentClass="text-blue-400"
            borderClass="border-blue-500/20"
            selections={superOver.teamBSelections}
            players={players}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default SuperOverReveal;
