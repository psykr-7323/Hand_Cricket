import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import { useGame } from './context/GameContext';
import { useMultiplayer } from './context/MultiplayerContext';
import MainMenu from './views/MainMenu';
import Lobby from './views/Lobby';
import Toss from './views/Toss';
import Match from './views/Match';
import SeriesResult from './views/SeriesResult';

// Multiplayer Views
import MPGateway from './views/multiplayer/MPGateway';
import MPCreateSettings from './views/multiplayer/MPCreateSettings';
import MPLobby from './views/multiplayer/MPLobby';
import CaptainReveal from './views/multiplayer/CaptainReveal';
import MPToss from './views/multiplayer/MPToss';
import DraftPhase from './views/multiplayer/DraftPhase';
import MPMatchToss from './views/multiplayer/MPMatchToss';
import MPPreMatchSummary from './views/multiplayer/MPPreMatchSummary';
import MPPlayerIntro from './views/multiplayer/MPPlayerIntro';
import CaptainSelect from './views/multiplayer/CaptainSelect';
import MPMatch from './views/multiplayer/MPMatch';
import SuperOverSetup from './views/multiplayer/SuperOverSetup';
import SuperOverReveal from './views/multiplayer/SuperOverReveal';
import SuperOverMatch from './views/multiplayer/SuperOverMatch';
import TeamChatWidget from './views/multiplayer/TeamChatWidget';

const TEAM_CHAT_PHASES = new Set([
  'MP_MATCH_TOSS',
  'MP_MATCH_TOSS_RESULT',
  'MP_PRE_MATCH',
  'MP_PLAYER_INTRO',
  'MP_SELECT_BATTER',
  'MP_SELECT_BOWLER',
  'MP_MATCH',
  'MP_RESOLVE_MOVE',
  'MP_INNINGS_BREAK',
  'MP_MATCH_RESULT',
  'MP_SUPER_OVER_SETUP',
  'MP_SUPER_OVER_REVEAL',
  'MP_SUPER_OVER',
  'MP_RESOLVE_SO',
  'MP_SUPER_OVER_RESULT',
  'MP_SERIES_RESULT',
]);

function App() {
  const { state, dispatch: gameDispatch } = useGame();
  const { state: mpState, dispatch: mpDispatch } = useMultiplayer();
  const [teamChatOpen, setTeamChatOpen] = useState(false);

  const currentTeam = useMemo(() => {
    if (mpState.teams?.teamA?.roster?.includes(mpState.currentPlayerId)) return 'teamA';
    if (mpState.teams?.teamB?.roster?.includes(mpState.currentPlayerId)) return 'teamB';
    return null;
  }, [mpState.currentPlayerId, mpState.teams]);

  const canOpenTeamChat =
    TEAM_CHAT_PHASES.has(mpState.phase) &&
    Boolean(currentTeam) &&
    !mpState.players?.[mpState.currentPlayerId]?.isBot;

  const backConfig = useMemo(() => {
    if (mpState.phase !== 'MP_GATEWAY') {
      if (mpState.phase === 'MP_MENU') {
        return { label: 'Main Menu', action: 'mp-main-menu' };
      }

      if (['MP_CREATE_SETTINGS', 'MP_LOBBY'].includes(mpState.phase)) {
        return { label: 'Back', action: 'mp-leave-room' };
      }

      return null;
    }

    if (state.currentPhase === 'LOBBY') {
      return { label: 'Main Menu', action: 'sp-main-menu' };
    }

    if (['TOSS_SETUP', 'TOSS', 'TOSS_RESULT'].includes(state.currentPhase)) {
      return { label: 'Lobby', action: 'sp-lobby' };
    }

    return null;
  }, [mpState.phase, state.currentPhase]);

  const handleBack = () => {
    switch (backConfig?.action) {
      case 'mp-main-menu':
        mpDispatch({ type: 'MP_BACK_TO_GATEWAY' });
        break;
      case 'mp-leave-room':
        mpDispatch({ type: 'MP_LEAVE_ROOM' });
        break;
      case 'sp-main-menu':
        gameDispatch({ type: 'GO_TO_MAIN_MENU' });
        break;
      case 'sp-lobby':
        gameDispatch({ type: 'BACK_TO_LOBBY' });
        break;
      default:
        break;
    }
  };

  const renderPhase = () => {
    // ─── Multiplayer Phases ───
    if (mpState.phase !== 'MP_GATEWAY') {
      switch (mpState.phase) {
        case 'MP_CREATE_SETTINGS':
          return <MPCreateSettings />;
        case 'MP_LOBBY':
          return <MPLobby />;
        case 'MP_CAPTAIN_REVEAL':
          return <CaptainReveal />;
        case 'MP_TOSS':
        case 'MP_TOSS_RESULT':
          return <MPToss />;
        case 'MP_DRAFT':
          return <DraftPhase />;
        case 'MP_MATCH_TOSS':
        case 'MP_MATCH_TOSS_RESULT':
          return <MPMatchToss />;
        case 'MP_PRE_MATCH':
          return <MPPreMatchSummary />;
        case 'MP_PLAYER_INTRO':
          return <MPPlayerIntro />;
        case 'MP_SELECT_BATTER':
        case 'MP_SELECT_BOWLER':
          return <CaptainSelect />;
        case 'MP_MATCH':
        case 'MP_RESOLVE_MOVE':
        case 'MP_INNINGS_BREAK':
        case 'MP_MATCH_RESULT':
          return <MPMatch />;
        case 'MP_SUPER_OVER_SETUP':
          return <SuperOverSetup />;
        case 'MP_SUPER_OVER_REVEAL':
          return <SuperOverReveal />;
        case 'MP_SUPER_OVER':
        case 'MP_RESOLVE_SO':
        case 'MP_SUPER_OVER_RESULT':
          return <SuperOverMatch />;
        case 'MP_SERIES_RESULT':
          return <MPSeriesResult />;
        default:
          return <MPGateway />;
      }
    }

    // ─── Single-Player Phases ───
    switch (state.currentPhase) {
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'LOBBY':
        return <Lobby />;
      case 'TOSS_SETUP':
      case 'TOSS':
      case 'TOSS_RESULT':
        return <Toss />;
      case 'MATCH':
      case 'RESOLVE_MOVE':
      case 'INNINGS_BREAK':
      case 'MATCH_RESULT':
        return <Match />;
      case 'SERIES_RESULT':
        return <SeriesResult />;
      default:
        return <MainMenu />;
    }
  };

  // Group related phases under the same key so AnimatePresence doesn't
  // remount the entire view on sub-phase transitions (e.g. MATCH → RESOLVE_MOVE).
  const getViewKey = () => {
    if (mpState.phase !== 'MP_GATEWAY') {
      const mp = mpState.phase;
      if (['MP_CREATE_SETTINGS'].includes(mp)) return 'mp-settings';
      if (['MP_LOBBY'].includes(mp)) return 'mp-lobby';
      if (['MP_CAPTAIN_REVEAL'].includes(mp)) return 'mp-captain-reveal';
      if (['MP_TOSS', 'MP_TOSS_RESULT'].includes(mp)) return 'mp-toss';
      if (['MP_DRAFT'].includes(mp)) return 'mp-draft';
      if (['MP_MATCH_TOSS', 'MP_MATCH_TOSS_RESULT'].includes(mp)) return 'mp-match-toss';
      if (['MP_PRE_MATCH'].includes(mp)) return 'mp-pre-match';
      if (['MP_PLAYER_INTRO'].includes(mp)) return 'mp-player-intro';
      if (['MP_SELECT_BATTER', 'MP_SELECT_BOWLER'].includes(mp)) return 'mp-captain-select';
      if (['MP_MATCH', 'MP_RESOLVE_MOVE', 'MP_INNINGS_BREAK', 'MP_MATCH_RESULT'].includes(mp)) return 'mp-match';
      if (['MP_SUPER_OVER_SETUP'].includes(mp)) return `mp-so-setup-${mpState.superOver?.sequence ?? 1}`;
      if (['MP_SUPER_OVER_REVEAL'].includes(mp)) return `mp-so-reveal-${mpState.superOver?.sequence ?? 1}`;
      if (['MP_SUPER_OVER', 'MP_RESOLVE_SO', 'MP_SUPER_OVER_RESULT'].includes(mp)) return `mp-super-over-${mpState.superOver?.sequence ?? 1}`;
      if (['MP_SERIES_RESULT'].includes(mp)) return 'mp-series-result';
      return mp;
    }
    const sp = state.currentPhase;
    if (['TOSS_SETUP', 'TOSS', 'TOSS_RESULT'].includes(sp)) {
      return `sp-toss-${state.match_settings.current_match}`;
    }
    if (['MATCH', 'RESOLVE_MOVE', 'INNINGS_BREAK', 'MATCH_RESULT'].includes(sp)) return 'sp-match';
    return sp;
  };

  const viewKey = getViewKey();
  const showNavbar = viewKey !== 'MAIN_MENU' && viewKey !== 'MP_GATEWAY';

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-arena-void text-arena-on-surface">
      {/* ─── Top Navbar ─── */}
      {showNavbar && (
        <header className="relative z-30 flex items-center justify-between border-b border-arena-outline-variant/15 bg-arena-surface px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {backConfig && (
              <button
                onClick={handleBack}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-arena-outline-variant/20 bg-arena-container px-3 text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim transition hover:text-white"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">{backConfig.label}</span>
              </button>
            )}
            <h1 className="esports-headline text-lg tracking-esports text-arena-primary">
              Hand Cricket
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {mpState.phase !== 'MP_GATEWAY' && (
              <span className="rounded-md bg-blue-500/15 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-broadcast text-blue-400">
                Multiplayer
              </span>
            )}
            {canOpenTeamChat && (
              <button
                onClick={() => setTeamChatOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-arena-primary/25 bg-arena-primary/10 px-3 text-xs font-bold uppercase tracking-broadcast text-arena-primary transition hover:bg-arena-primary/15"
              >
                <MessageSquare size={15} />
                <span className="hidden sm:inline">
                  {currentTeam === 'teamA' ? 'Team A Chat' : 'Team B Chat'}
                </span>
              </button>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-arena-primary/20 text-arena-primary">
              <User size={16} />
            </div>
          </div>
        </header>
      )}

      {/* ─── Main Content ─── */}
      <div className="relative flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 flex min-h-0 w-full flex-1 flex-col"
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
      {mpState.phase !== 'MP_GATEWAY' && (
        <TeamChatWidget open={canOpenTeamChat && teamChatOpen} onClose={() => setTeamChatOpen(false)} />
      )}
    </div>
  );
}

/* ─── Multiplayer Series Result ─── */
function MPSeriesResult() {
  const { state, dispatch } = useMultiplayer();
  const { seriesScores, matchResults, seriesWinner, settings, players, captains, currentPlayerId, hostId } = state;
  const isHost = currentPlayerId === hostId;

  const winnerLabel = seriesWinner === 'teamA' ? 'Team A' : 'Team B';
  const capA = players[captains.teamA];
  const capB = players[captains.teamB];

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-y-auto bg-arena-surface px-4 pb-8 pt-6 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.08),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center">
          <span className="inline-block rounded-md border border-arena-outline-variant/30 bg-arena-container px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
            Series {seriesScores.teamA}-{seriesScores.teamB}
          </span>
        </div>

        <h2 className="esports-headline mt-5 text-center text-3xl tracking-esports text-white sm:text-4xl">
          {winnerLabel} Wins The Series!
        </h2>
        <p className="mt-3 text-center font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
          Best of {settings.seriesLength} completed.
        </p>

        <div className="mt-6 arena-panel rounded-xl overflow-hidden">
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-primary">Team A</p>
                <p className="mt-1 font-display text-xs text-arena-on-surface-faint">{capA?.name}</p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded bg-arena-primary" />
                <p className="mt-4 font-display text-5xl font-bold text-white">{seriesScores.teamA}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-blue-400">Team B</p>
                <p className="mt-1 font-display text-xs text-arena-on-surface-faint">{capB?.name}</p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded bg-blue-400" />
                <p className="mt-4 font-display text-5xl font-bold text-arena-on-surface-dim">{seriesScores.teamB}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-arena-outline-variant/15 px-5 py-4">
            <h4 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim">Match Breakdown</h4>
            <div className="mt-3 space-y-2.5">
              {matchResults.map((match) => (
                <div key={match.matchNumber} className="flex items-center justify-between rounded-lg bg-arena-container-highest px-4 py-3">
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                      Match {match.matchNumber}
                    </p>
                    <p className={`mt-1 font-display text-sm font-bold ${
                      match.winner === 'teamA' ? 'text-arena-primary' : 'text-blue-400'
                    }`}>
                      {match.winner === 'teamA' ? 'Team A won' : 'Team B won'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-arena-on-surface-dim">{match.teamAScore}</p>
                    <p className="text-xs text-arena-on-surface-faint">{match.teamBScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isHost ? (
            <button
              onClick={() => dispatch({ type: 'MP_RESET' })}
              className="tactile-btn flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 text-base"
            >
              New Series
            </button>
          ) : (
            <div className="rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm text-arena-on-surface-faint text-center">
              Waiting for host to start a new series...
            </div>
          )}
          <button
            onClick={() => dispatch({ type: 'MP_BACK_TO_GATEWAY' })}
            className="font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint hover:text-arena-on-surface-dim transition text-center"
          >
            Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
