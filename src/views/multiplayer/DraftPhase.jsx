import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayer, DRAFT_TIMER } from '../../context/MultiplayerContext';
import ShotClock from '../../components/ShotClock';

function DraftPhase() {
  const { state, dispatch } = useMultiplayer();
  const { teams, draftPool, draftTurn, players, captains, currentPlayerId } = state;

  const activeCaptainId = draftTurn === 'teamA' ? captains.teamA : captains.teamB;
  const activeCaptain = players[activeCaptainId];
  const canPick = currentPlayerId === activeCaptainId && !activeCaptain?.isBot;
  const teamAPlayers = teams.teamA?.roster.map((id) => players[id]).filter(Boolean) || [];
  const teamBPlayers = teams.teamB?.roster.map((id) => players[id]).filter(Boolean) || [];
  const poolPlayers = draftPool.map((id) => players[id]).filter(Boolean);

  const handlePick = (playerId) => {
    dispatch({ type: 'MP_DRAFT_PICK', payload: { playerId } });
  };

  const handleAutoExpire = useCallback(() => {
    dispatch({ type: 'MP_DRAFT_AUTO_PICK' });
  }, [dispatch]);

  // Auto-pick for bot captains
  useEffect(() => {
    if (!activeCaptain?.isBot || draftPool.length === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'MP_DRAFT_AUTO_PICK' });
    }, 1200 + Math.random() * 800);
    return () => clearTimeout(timer);
  }, [activeCaptain, draftPool.length, dispatch]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-arena-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.05),transparent_50%)]" />

      <div className="relative z-10 flex flex-1 flex-col px-4 py-5 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="esports-headline text-3xl tracking-esports text-white sm:text-4xl">
            The Draft
          </h2>
          <p className="mt-2 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            {draftPool.length} players remaining
          </p>
        </div>

        {/* Active Captain Turn */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div
            className={`rounded-lg px-5 py-3 text-center ${
              draftTurn === 'teamA'
                ? 'bg-arena-primary/15 border border-arena-primary/30'
                : 'bg-blue-500/15 border border-blue-500/30'
            }`}
          >
            <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
              Now Picking
            </p>
            <p className="mt-1 font-display text-base font-bold text-white">
              {activeCaptain?.name}'s Turn
            </p>
          </div>
          <ShotClock
            key={`${draftTurn}-${draftPool.length}`}
            duration={DRAFT_TIMER}
            isActive={!activeCaptain?.isBot}
            onExpire={handleAutoExpire}
            size={56}
            label="Shot Clock"
          />
        </div>

        {/* Draft Layout — 3 columns */}
        <div className="mt-5 flex flex-1 gap-4 overflow-hidden">
          {/* Team A Column */}
          <div className={`flex w-1/4 flex-col rounded-xl border p-3 ${
            draftTurn === 'teamA' ? 'active-turn-glow border-arena-primary/30' : 'border-arena-outline-variant/15'
          }`}>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-arena-primary" />
              <span className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-primary">
                Team A
              </span>
              <span className="ml-auto font-display text-[10px] text-arena-on-surface-faint">
                {teamAPlayers.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {teamAPlayers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 rounded-lg bg-arena-container-high p-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-arena-container-highest text-sm">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xs font-bold text-white">{p.name}</p>
                    {p.id === captains.teamA && (
                      <span className="captain-badge text-[8px]">Captain</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Available Pool — Center */}
          <div className="flex flex-1 flex-col rounded-xl border border-arena-outline-variant/15 p-3">
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              Available Players
            </p>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {poolPlayers.map((p) => (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => canPick && handlePick(p.id)}
                    className="draft-card flex items-center gap-3 text-left"
                    disabled={!canPick}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${
                      p.isBot ? 'bg-blue-500/15' : 'bg-arena-container-highest'
                    }`}>
                      {p.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-white">
                        {p.name}
                      </p>
                      <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                        {p.isBot ? 'Smart Bot' : 'Player'}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {poolPlayers.length === 0 && (
                <div className="flex flex-1 items-center justify-center py-12 text-center">
                  <p className="font-display text-sm text-arena-on-surface-faint">
                    Draft complete!
                  </p>
                </div>
              )}
            </div>
            {!canPick && !activeCaptain?.isBot && poolPlayers.length > 0 && (
              <div className="mt-3 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-4 py-3 text-sm text-arena-on-surface-faint">
                Waiting for {activeCaptain?.name} to make the next draft pick...
              </div>
            )}
          </div>

          {/* Team B Column */}
          <div className={`flex w-1/4 flex-col rounded-xl border p-3 ${
            draftTurn === 'teamB' ? 'active-turn-glow border-blue-500/30' : 'border-arena-outline-variant/15'
          }`}>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="font-display text-xs font-bold uppercase tracking-broadcast text-blue-400">
                Team B
              </span>
              <span className="ml-auto font-display text-[10px] text-arena-on-surface-faint">
                {teamBPlayers.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {teamBPlayers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 rounded-lg bg-arena-container-high p-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-arena-container-highest text-sm">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xs font-bold text-white">{p.name}</p>
                    {p.id === captains.teamB && (
                      <span className="captain-badge text-[8px]">Captain</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraftPhase;
