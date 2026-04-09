import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useMultiplayer } from '../../context/MultiplayerContext';

function TeamRosterCard({ teamKey, title, roster, isTossWinner }) {
  const accentClass = teamKey === 'teamA' ? 'text-arena-primary' : 'text-blue-400';
  const badgeClass =
    teamKey === 'teamA'
      ? 'border-arena-primary/30 bg-arena-primary/10'
      : 'border-blue-500/30 bg-blue-500/10';

  return (
    <div className="arena-panel rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-display text-sm font-bold uppercase tracking-broadcast ${accentClass}`}>
            {title}
          </span>
          {isTossWinner && (
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-broadcast text-amber-400 ${badgeClass}`}>
              <Coins size={12} />
              Toss Won
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {roster.map((player) => (
          <div key={player.id} className="flex items-center gap-3 rounded-lg bg-arena-container-high px-3 py-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-arena-container-highest text-lg">
              {player.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-white">
                {player.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MPPreMatchSummary() {
  const { state, dispatch } = useMultiplayer();
  const {
    phase,
    teams,
    players,
    matchTossWinner,
    tossChoice,
    currentPlayerId,
    hostId,
  } = state;

  const isHost = currentPlayerId === hostId;
  const teamAPlayers = teams.teamA?.roster?.map((id) => players[id]).filter(Boolean) || [];
  const teamBPlayers = teams.teamB?.roster?.map((id) => players[id]).filter(Boolean) || [];
  const choiceText = tossChoice === 'bat' ? 'bat first' : 'bowl first';
  const winnerLabel = matchTossWinner === 'teamA' ? 'Team A' : 'Team B';

  useEffect(() => {
    if (phase !== 'MP_PRE_MATCH' || !isHost) return undefined;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'MP_ADVANCE_PRE_MATCH' });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [dispatch, isHost, phase]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-arena-surface px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.06),transparent_52%)]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="text-center">
          <div className="super-over-banner inline-block px-5 py-2">
            <h2 className="esports-headline text-3xl tracking-[0.15em] text-white sm:text-4xl">
              Match Ready
            </h2>
          </div>
          <p className="mt-3 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Final toss summary before the first ball
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TeamRosterCard
            teamKey="teamA"
            title="Team A"
            roster={teamAPlayers}
            isTossWinner={matchTossWinner === 'teamA'}
          />
          <TeamRosterCard
            teamKey="teamB"
            title="Team B"
            roster={teamBPlayers}
            isTossWinner={matchTossWinner === 'teamB'}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="arena-panel mt-5 rounded-xl p-5 text-center"
        >
          <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
            Toss Decision
          </p>
          <p className="mt-2 esports-headline text-2xl tracking-esports text-amber-400">
            {winnerLabel} chose to {choiceText}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default MPPreMatchSummary;
