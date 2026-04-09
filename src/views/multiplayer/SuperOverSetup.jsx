import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Lock, Check } from 'lucide-react';
import { useMultiplayer } from '../../context/MultiplayerContext';

const getRequiredBatters = (roster) => Math.min(2, roster.length);
const canReuseBowler = (roster) => roster.length < 3;

function SuperOverSetup() {
  const { state, dispatch } = useMultiplayer();
  const { teams, players, captains, superOver, currentPlayerId, hostId, battingTeam } = state;

  const [teamABatters, setTeamABatters] = useState([]);
  const [teamABowler, setTeamABowler] = useState(null);
  const [teamBBatters, setTeamBBatters] = useState([]);
  const [teamBBowler, setTeamBBowler] = useState(null);

  const teamARoster = teams.teamA?.roster || [];
  const teamBRoster = teams.teamB?.roster || [];

  const toggleBatter = (team, id) => {
    if (team === 'teamA') {
      setTeamABatters((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
      );
    } else {
      setTeamBBatters((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
      );
    }
  };

  const lockTeam = (team) => {
    const batters = team === 'teamA' ? teamABatters : teamBBatters;
    const bowler = team === 'teamA' ? teamABowler : teamBBowler;
    const roster = team === 'teamA' ? teamARoster : teamBRoster;
    if (batters.length !== getRequiredBatters(roster) || !bowler) return;

    dispatch({
      type: 'MP_LOCK_SUPER_OVER_SELECTIONS',
      payload: { team, batters, bowler },
    });
  };

  const isTeamALocked = superOver.teamALocked;
  const isTeamBLocked = superOver.teamBLocked;
  const teamAValid = teamABatters.length === getRequiredBatters(teamARoster) && teamABowler !== null;
  const teamBValid = teamBBatters.length === getRequiredBatters(teamBRoster) && teamBBowler !== null;
  const superOverBattingTeam = superOver.battingTeam ?? battingTeam;
  const superOverBattingLabel = superOverBattingTeam === 'teamA' ? 'Team A' : 'Team B';

  const renderTeamPanel = (team, roster, selectedBatters, selectedBowler, setSelectedBowler, isLocked, isValid) => {
    const teamLabel = team === 'teamA' ? 'Team A' : 'Team B';
    const captainId = team === 'teamA' ? captains.teamA : captains.teamB;
    const captain = players[captainId];
    const canEdit = currentPlayerId === captainId || (captain?.isBot && currentPlayerId === hostId);
    const headingClass = team === 'teamA' ? 'text-arena-primary' : 'text-blue-400';
    const requiredBatters = getRequiredBatters(roster);
    const allowsSharedBowler = canReuseBowler(roster);
    const batterSelectedClass =
      team === 'teamA'
        ? 'bg-arena-primary/15 border-2 border-arena-primary/40'
        : 'bg-blue-500/15 border-2 border-blue-500/40';
    const batterCheckClass = team === 'teamA' ? 'text-arena-primary' : 'text-blue-400';

    return (
      <div className={`arena-panel rounded-xl p-5 ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`esports-headline text-lg tracking-esports ${headingClass}`}>
              {teamLabel}
            </h3>
            <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
              {captain?.name}'s Selection
            </p>
          </div>
          {isLocked && (
            <div className="flex items-center gap-1 rounded-md bg-arena-primary/15 px-3 py-1.5">
              <Lock size={12} className="text-arena-primary" />
              <span className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-primary">
                Locked
              </span>
            </div>
          )}
        </div>

        {/* Batter Selection */}
        <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
          <Target size={10} className="mr-1 inline" />
          {roster.length === 1
            ? ' Select 1 Batter - 1 wicket'
            : ` Select ${requiredBatters} Batters${allowsSharedBowler ? '' : ' - cannot bowl'}`}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3">
          {roster.map((id) => {
            const player = players[id];
            if (!player) return null;
            const isSelected = selectedBatters.includes(id);
            const isBowlerSelected = selectedBowler === id;
            const isDisabledByRole = !allowsSharedBowler && isBowlerSelected;

            return (
              <button
                key={`bat-${id}`}
                onClick={() => !isLocked && canEdit && !isDisabledByRole && toggleBatter(team, id)}
                disabled={isLocked || !canEdit || isDisabledByRole}
                className={`relative flex flex-col items-center gap-1 rounded-lg p-3 text-center transition ${
                  isSelected
                    ? batterSelectedClass
                    : isDisabledByRole
                      ? 'bg-arena-container opacity-30 cursor-not-allowed border-2 border-transparent'
                    : 'bg-arena-container-high border-2 border-transparent hover:border-arena-outline-variant/30'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <Check size={14} className={batterCheckClass} />
                  </div>
                )}
                <span className="text-lg">{player.emoji}</span>
                <span className="truncate font-display text-[10px] font-bold text-white w-full">
                  {player.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bowler Selection */}
        <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
          <Shield size={10} className="mr-1 inline" />
          Select 1 Bowler{allowsSharedBowler ? ' - can also bat' : ' - from remaining players'}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {roster.map((id) => {
            const player = players[id];
            if (!player) return null;
            const isSelected = selectedBowler === id;
            const isBatterSelected = selectedBatters.includes(id);
            const isDisabledByRole = !allowsSharedBowler && isBatterSelected;

            return (
              <button
                key={`bowl-${id}`}
                onClick={() => !isLocked && canEdit && !isDisabledByRole && setSelectedBowler(isSelected ? null : id)}
                disabled={isLocked || !canEdit || isDisabledByRole}
                className={`relative flex flex-col items-center gap-1 rounded-lg p-3 text-center transition ${
                  isSelected
                    ? 'bg-amber-500/15 border-2 border-amber-500/40'
                    : isDisabledByRole
                      ? 'bg-arena-container opacity-30 cursor-not-allowed border-2 border-transparent'
                    : 'bg-arena-container-high border-2 border-transparent hover:border-arena-outline-variant/30'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <Check size={14} className="text-amber-500" />
                  </div>
                )}
                <span className="text-lg">{player.emoji}</span>
                <span className="truncate font-display text-[10px] font-bold text-white w-full">
                  {player.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lock Button */}
        {!isLocked && (
          <button
            onClick={() => lockTeam(team)}
            disabled={!isValid || !canEdit}
            className={`tactile-btn-amber mt-4 w-full rounded-lg px-4 py-3 text-sm ${
              !isValid || !canEdit ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <Lock size={14} className="mr-2 inline" />
            Lock Selections
          </button>
        )}
        {!isLocked && !canEdit && !captain?.isBot && (
          <div className="mt-4 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-4 py-3 text-sm text-arena-on-surface-faint">
            Waiting for {captain?.name} to lock this team&apos;s Super Over lineup...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto bg-arena-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06),transparent_50%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-6 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-center"
        >
          <div className="super-over-banner inline-block px-6 py-3">
            <h2 className="esports-headline text-4xl tracking-[0.15em] neon-text-super sm:text-5xl">
              Super Over
            </h2>
          </div>
          <p className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
            1 player: reuse yourself. 2 players: both can bat. 3+ players: batters cannot bowl.
          </p>
          <p className="mt-2 font-display text-[11px] font-bold uppercase tracking-broadcast text-amber-400">
            {superOverBattingLabel} batted last, so they bat first in the Super Over
          </p>
        </motion.div>

        {/* Team Panels */}
        <div className="mt-6 w-full max-w-4xl grid gap-6 lg:grid-cols-2">
          {renderTeamPanel(
            'teamA', teamARoster, teamABatters, teamABowler,
            (id) => setTeamABowler(id), isTeamALocked, teamAValid
          )}
          {renderTeamPanel(
            'teamB', teamBRoster, teamBBatters, teamBBowler,
            (id) => setTeamBBowler(id), isTeamBLocked, teamBValid
          )}
        </div>

        {/* Waiting indicator */}
        {(isTeamALocked || isTeamBLocked) && !(isTeamALocked && isTeamBLocked) && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm text-arena-on-surface-faint">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Waiting for other captain to lock selections...
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperOverSetup;
