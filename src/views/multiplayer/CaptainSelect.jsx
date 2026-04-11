import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Crown } from 'lucide-react';
import { PlayerMarker } from '../../components/CricketIcons';
import { useMultiplayer, SELECTION_TIMER } from '../../context/MultiplayerContext';
import ShotClock from '../../components/ShotClock';

function CaptainSelect() {
  const { state, dispatch } = useMultiplayer();
  const {
    phase,
    battingTeam,
    bowlingTeam,
    teams,
    players,
    ballLog,
    lastOverBowlerId,
    currentPlayerId,
  } = state;

  const isBatterSelect = phase === 'MP_SELECT_BATTER';
  const relevantTeam = isBatterSelect ? battingTeam : bowlingTeam;
  const relevantTeamLabel = relevantTeam === 'teamA' ? 'Team A' : 'Team B';
  const captainId = teams[relevantTeam]?.captainId;
  const captain = players[captainId];
  const roster = teams[relevantTeam]?.roster || [];
  const canSelect = currentPlayerId === captainId && !captain?.isBot;
  const viewerTeam = teams.teamA?.roster?.includes(currentPlayerId)
    ? 'teamA'
    : teams.teamB?.roster?.includes(currentPlayerId)
      ? 'teamB'
      : null;
  const viewerIsRelevantTeam = viewerTeam === relevantTeam;

  // Find dismissed batters (they can't be re-selected)
  const dismissedIds = ballLog
    .filter((b) => b.isOut)
    .map((b) => b.batterId);

  const getAvailable = () => {
    if (isBatterSelect) {
      return roster.filter((id) => !dismissedIds.includes(id));
    }
    // Bowler: filter out last over's bowler if team has more than 1 player
    return roster.filter((id) => {
      if (lastOverBowlerId === id && roster.length > 1) return false;
      return true;
    });
  };

  const available = getAvailable();

  const handleSelect = (playerId) => {
    if (isBatterSelect) {
      dispatch({ type: 'MP_SELECT_BATTER', payload: playerId });
    } else {
      dispatch({ type: 'MP_SELECT_BOWLER', payload: playerId });
    }
  };

  const handleExpire = useCallback(() => {
    if (isBatterSelect) {
      dispatch({ type: 'MP_AUTO_SELECT_BATTER' });
    } else {
      dispatch({ type: 'MP_AUTO_SELECT_BOWLER' });
    }
  }, [dispatch, isBatterSelect]);

  // Auto-select for bot captains
  useEffect(() => {
    if (!captain?.isBot) return;
    const timer = setTimeout(() => {
      handleExpire();
    }, 1000 + Math.random() * 500);
    return () => clearTimeout(timer);
  }, [captain, handleExpire]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-arena-surface px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.05),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-arena-primary/15 text-arena-primary">
            {isBatterSelect ? <Target size={24} /> : <Shield size={24} />}
          </div>
          <h2 className="esports-headline mt-4 text-3xl tracking-esports text-white">
            {isBatterSelect ? 'Select Batter' : 'Select Bowler'}
          </h2>
          <p className="mt-2 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            {relevantTeamLabel}: {captain?.name}&apos;s Decision
          </p>
        </div>

        {/* Shot Clock */}
        <div className="mt-4 flex justify-center">
          <ShotClock
            key={`${phase}-${available.length}`}
            duration={SELECTION_TIMER}
            isActive={!captain?.isBot}
            onExpire={handleExpire}
            size={64}
            label="Time Remaining"
          />
        </div>

        {viewerIsRelevantTeam ? (
          <>
            <div className="mt-5 arena-panel rounded-xl p-5">
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                {isBatterSelect ? 'Available Batters' : 'Available Bowlers'}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {roster.map((id) => {
                  const player = players[id];
                  if (!player) return null;

                  const isDismissed = isBatterSelect && dismissedIds.includes(id);
                  const isBlocked = !isBatterSelect && lastOverBowlerId === id && roster.length > 1;
                  const isDisabled = isDismissed || isBlocked;

                  return (
                    <motion.button
                      key={id}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      onClick={() => !isDisabled && canSelect && handleSelect(id)}
                      disabled={isDisabled || !canSelect}
                      className={`relative flex flex-col items-center gap-2 rounded-xl p-4 text-center transition ${
                        isDisabled
                          ? 'bg-arena-container opacity-30 cursor-not-allowed'
                          : 'bg-arena-container-high hover:bg-arena-container-highest hover:border-arena-primary/30 border border-transparent cursor-pointer'
                      }`}
                    >
                      {id === captainId && (
                        <div className="absolute -top-2 right-2">
                          <Crown size={12} className="text-amber-500" />
                        </div>
                      )}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${
                        player.isBot ? 'bg-blue-500/15' : 'bg-arena-container-highest'
                      }`}>
                        <PlayerMarker token={player.emoji} className="h-7 w-7" />
                      </div>
                      <p className="truncate font-display text-xs font-bold text-white">
                        {player.name}
                      </p>
                      {isDismissed && (
                        <span className="font-display text-[10px] text-arena-secondary">Dismissed</span>
                      )}
                      {isBlocked && (
                        <span className="font-display text-[10px] text-arena-on-surface-faint">Last Over</span>
                      )}
                      {!isDisabled && state.playerStats[id] && (
                        <span className="font-display text-[10px] text-arena-on-surface-faint">
                          {isBatterSelect
                            ? `${state.playerStats[id].runs}(${state.playerStats[id].ballsFaced})`
                            : `${state.playerStats[id].wickets}-${state.playerStats[id].runsConceded}`}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            {!canSelect && !captain?.isBot && (
              <div className="mt-4 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-4 py-3 text-sm text-arena-on-surface-faint">
                Waiting for {captain?.name} to choose the next {isBatterSelect ? 'batter' : 'bowler'}...
              </div>
            )}
          </>
        ) : (
          <div className="mt-5 arena-panel rounded-xl p-5 text-center">
            <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              {relevantTeamLabel} is making the next call
            </p>
            <h3 className="esports-headline mt-3 text-xl tracking-esports text-white">
              Waiting for {captain?.name} to choose the next {isBatterSelect ? 'batter' : 'bowler'}
            </h3>
            <p className="mt-3 text-sm text-arena-on-surface-faint">
              Your side will stay on standby here, then the matchup reveal will appear before the next ball starts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaptainSelect;
