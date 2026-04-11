import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  RotateCcw,
  Zap,
  X,
  TrendingUp,
  Award,
} from 'lucide-react';
import { BOT, buildContextKey, getBotDecision } from '../ai/botBrain';
import { PlayerMarker } from '../components/CricketIcons';
import MoveTimer from '../components/MoveTimer';
import NumberPad from '../components/NumberPad';
import Scorecard from '../components/Scorecard';
import { useGame } from '../context/GameContext';

const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;
const MOVE_OPTIONS = [0, 1, 2, 3, 4, 5, 6];

/* ─── OUT Overlay (screen9) ─── */
function OutOverlay({ onContinue, score, wickets, balls, botName }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-arena-void/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.1 }}
        className="text-center"
      >
        {/* Wicket Badge */}
        <div className="inline-block rounded-md bg-red-500/20 border border-red-500/40 px-5 py-1.5">
          <span className="esports-headline text-sm tracking-esports text-arena-secondary">
            Wicket!
          </span>
        </div>

        {/* Giant OUT */}
        <h2 className="esports-headline mt-4 text-[5rem] leading-none tracking-esports neon-text-out sm:text-[7rem]">
          OUT!
        </h2>

        {/* Bot Avatar */}
        <div className="mx-auto mt-6 w-56 rounded-xl bg-arena-container-high p-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-arena-container-highest text-3xl">
            🤖
          </div>
          <p className="mt-3 font-display text-sm font-bold uppercase tracking-broadcast text-white">
            {botName}
          </p>
          <p className="mt-1 font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-secondary">
            Wicket Taken
          </p>
        </div>

        {/* Score Cards */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="rounded-lg bg-arena-container px-5 py-3 text-center">
            <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
              Total Score
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {score}<span className="text-sm text-arena-secondary">/{wickets}</span>
            </p>
          </div>
          <div className="rounded-lg bg-arena-container px-5 py-3 text-center">
            <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
              Match Progress
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {formatOvers(balls)} <span className="text-sm text-arena-on-surface-faint">overs</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onContinue}
            className="tactile-btn rounded-lg px-8 py-3 text-sm"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Innings Break (screen4) ─── */
function InningsBreak({ score, wickets, oversDisplay, target, onAdvance, matchSettings }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
      {/* Background particles hint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.08),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Title */}
        <h2 className="esports-headline text-4xl tracking-[0.15em] neon-text-primary sm:text-5xl">
          Innings Over
        </h2>
        <p className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
          First Half Concluded
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* 1st Innings Recap */}
          <div className="accent-bar-left arena-panel rounded-xl p-5 text-left">
            <h3 className="esports-headline text-sm tracking-esports text-arena-on-surface-dim">
              1st Innings Recap
            </h3>
            <p className="mt-3 font-display text-5xl font-bold text-white">
              {score}<span className="text-xl text-arena-secondary">/{wickets}</span>
            </p>
            <p className="mt-2 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
              {oversDisplay} Overs
            </p>
          </div>

          {/* Target Card */}
          <div className="arena-panel-high rounded-xl p-5 text-center border border-arena-outline-variant/20">
            <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              Target to Win
            </p>
            <p className="esports-headline mt-3 text-6xl tracking-esports text-white">
              {target}
              <span className="esports-headline ml-2 text-xl text-arena-on-surface-faint">Runs</span>
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="stat-chip text-arena-primary">
                ● Required RR: {((target - 1) / (matchSettings.overs_per_innings || 20)).toFixed(2)}
              </span>
              {matchSettings.overs_per_innings && (
                <span className="stat-chip text-arena-on-surface-dim">
                  Max Overs: {matchSettings.overs_per_innings}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Start Next Innings */}
        <button
          onClick={onAdvance}
          className="tactile-btn mx-auto mt-8 flex items-center gap-3 rounded-lg px-8 py-4 text-base"
        >
          <ArrowRight size={20} />
          Start Next Innings
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Victory Result (screen5) ─── */
function VictoryResult({ resultMeta, matchStats, matchSettings, ballLog, oversDisplay, onAction, actionLabel }) {
  const overRuns = useMemo(() => {
    const result = [];
    ballLog.forEach((ball, index) => {
      const overIndex = Math.floor(index / 6);
      result[overIndex] = result[overIndex] ?? { label: `${overIndex + 1}`, runs: 0 };
      result[overIndex].runs += ball.runs ?? 0;
    });
    return result;
  }, [ballLog]);

  const maxRuns = Math.max(1, ...overRuns.map((o) => o.runs));

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.1),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <h2 className="esports-headline text-5xl tracking-[0.15em] neon-text-primary sm:text-6xl">
          Victory
        </h2>
        <p className="mt-3 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
          Match {matchSettings.current_match} of {matchSettings.series_length}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          {/* Score Card with Bar Chart */}
          <div className="accent-bar-left arena-panel rounded-xl p-5 text-left">
            <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
              Final Score
            </p>
            <p className="mt-2 font-display text-5xl font-bold text-white">
              {matchStats.player.runs}
              <span className="text-lg text-arena-on-surface-faint">/{matchStats.player.dismissals}</span>
              <span className="ml-3 text-lg text-arena-on-surface-faint">{oversDisplay} Overs</span>
            </p>
            {/* Bar chart */}
            <div className="mt-4 flex items-end gap-1.5 h-20">
              {overRuns.map((over) => (
                <div key={over.label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-16 w-full items-end">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-arena-primary to-arena-primary-dark"
                      style={{ height: `${Math.max(12, (over.runs / maxRuns) * 100)}%`, opacity: over.runs > 0 ? 1 : 0.3 }}
                    />
                  </div>
                  <span className="text-[9px] text-arena-on-surface-faint">{over.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MVP Card */}
          <div className="arena-panel rounded-xl p-5 text-left border border-arena-primary/20">
            <p className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-primary">
              Match MVP
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-arena-container-highest text-xl">
                {resultMeta.playerWon ? (
                  <PlayerMarker token="bat" className="h-7 w-7" />
                ) : (
                  '🤖'
                )}
              </div>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                  {resultMeta.playerWon ? 'Player_One' : 'Bot'}
                </p>
                <p className="text-[10px] text-arena-on-surface-faint">
                  Global Rank #24
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-arena-on-surface-faint">Win Probability</span>
                <span className="font-bold text-arena-primary">94.2%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-arena-on-surface-faint">Arena Bonus</span>
                <span className="font-bold text-arena-primary">+450 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="accent-bar-left arena-panel rounded-xl p-4 text-left">
            <h4 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim flex items-center gap-2">
              <Zap size={14} className="text-arena-primary" /> Your Batting Prowess
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Total Runs', value: matchStats.player.runs, color: 'text-arena-primary' },
                { label: 'Balls Faced', value: matchStats.player.ballsFaced, color: 'text-white' },
                { label: 'Boundaries (4s)', value: '—', color: 'text-arena-primary' },
                { label: 'Maximums (6s)', value: '—', color: 'text-arena-primary' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg bg-arena-container-highest p-3">
                  <p className="text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">{label}</p>
                  <p className={`mt-1 font-display text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="accent-bar-left-danger arena-panel rounded-xl p-4 text-left">
            <h4 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim flex items-center gap-2">
              <Bot size={14} className="text-arena-secondary" /> Bot Performance
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Innings Total', value: matchStats.bot.runs, color: 'text-arena-secondary' },
                { label: 'Total Overs', value: formatOvers(matchStats.bot.ballsBowled), color: 'text-white' },
                { label: 'Wickets Lost', value: matchStats.bot.dismissals, color: 'text-arena-secondary' },
                { label: 'Dots Forced', value: '—', color: 'text-arena-secondary' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg bg-arena-container-highest p-3">
                  <p className="text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">{label}</p>
                  <p className={`mt-1 font-display text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={onAction} className="tactile-btn rounded-lg px-8 py-3 text-sm">
            {actionLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Defeat Result (screen3) ─── */
function DefeatResult({ resultMeta, matchStats, onAction, actionLabel }) {
  const playerSR = matchStats.player.ballsFaced > 0
    ? ((matchStats.player.runs / matchStats.player.ballsFaced) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,179,173,0.06),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <h2 className="esports-headline text-5xl tracking-[0.15em] neon-text-danger sm:text-6xl">
          Defeat
        </h2>
        <p className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
          {resultMeta.summary}
        </p>

        {/* Score Comparison */}
        <div className="mt-6 accent-bar-left-danger arena-panel rounded-xl p-5 text-left">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">Your Score</p>
              <p className="mt-2 font-display text-5xl font-bold text-arena-primary">
                {resultMeta.playerScore}
              </p>
            </div>
            <span className="esports-headline text-2xl tracking-esports text-arena-on-surface-faint">VS</span>
            <div className="text-center">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">Opponent</p>
              <p className="mt-2 font-display text-5xl font-bold text-arena-secondary">
                {resultMeta.botScore}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Breakdown & Earnings */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="arena-panel rounded-xl p-5 text-left">
            <h4 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim">
              Performance Breakdown
            </h4>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-arena-on-surface-faint">Run Rate Efficiency</span>
                  <span className="text-white">{playerSR} / 200.0</span>
                </div>
                <div className="progress-bar mt-2">
                  <div className="progress-fill-danger" style={{ width: `${Math.min(100, parseFloat(playerSR) / 2)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-arena-on-surface-faint">Strike Accuracy</span>
                  <span className="text-white">
                    {matchStats.player.ballsFaced > 0
                      ? `${((1 - matchStats.player.dismissals / matchStats.player.ballsFaced) * 100).toFixed(0)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="progress-bar mt-2">
                  <div
                    className="progress-fill-danger"
                    style={{
                      width: matchStats.player.ballsFaced > 0
                        ? `${((1 - matchStats.player.dismissals / matchStats.player.ballsFaced) * 100)}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="arena-panel rounded-xl p-5 text-left">
            <h4 className="esports-headline text-xs tracking-esports text-arena-secondary">
              Earnings
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-arena-on-surface-dim">
                  <TrendingUp size={14} /> Arena Credits
                </div>
                <span className="font-bold text-arena-primary">+120</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-arena-on-surface-dim">
                  <Award size={14} /> XP Gained
                </div>
                <span className="font-bold text-arena-primary">+450</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={onAction} className="tactile-btn-danger rounded-lg px-8 py-3 text-sm font-display font-bold uppercase tracking-broadcast">
            <RotateCcw size={16} className="mr-2 inline" />
            {actionLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Live Match Feed Item ─── */
function FeedItem({ ball }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className={`font-display text-xs font-bold ${ball.isOut ? 'text-arena-secondary' : 'text-arena-primary'}`}>
        {ball.over}
      </span>
      <div className={`h-full w-0.5 rounded ${ball.isOut ? 'bg-arena-secondary' : 'bg-arena-primary'}`} />
      <span className="text-xs text-arena-on-surface-dim">
        {ball.isOut
          ? 'WICKET! Player dismissed.'
          : ball.runs === 0
            ? 'Dot ball.'
            : `+${ball.runs} RUNS scored.`}
      </span>
    </div>
  );
}

function QuitConfirmModal({ onCancel, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-arena-void/85 px-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-2xl border border-red-500/25 bg-arena-surface p-6 text-center shadow-2xl"
      >
        <h3 className="esports-headline text-2xl tracking-esports text-white">
          Quit Match?
        </h3>
        <p className="mt-3 text-sm text-arena-on-surface-faint">
          If you quit now, this match will be recorded as a loss.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onConfirm}
            className="tactile-btn-danger flex-1 rounded-lg px-5 py-3 text-sm font-display font-bold uppercase tracking-broadcast"
          >
            Quit And Take Loss
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm font-display font-bold uppercase tracking-broadcast text-arena-on-surface-dim transition hover:text-white"
          >
            Keep Playing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Match Component ─── */
function Match() {
  const { state, dispatch } = useGame();
  const {
    currentPhase,
    player_role,
    bowling_player,
    score,
    wickets,
    innings,
    target,
    balls_bowled,
    locked_moves,
    players,
    match_settings,
    match_stats,
    current_over_log,
    ball_log,
    result_meta,
    derivedStats,
    series_winner,
  } = state;

  const [scorecardOpen, setScorecardOpen] = useState(false);
  const [quitPromptOpen, setQuitPromptOpen] = useState(false);
  const bowler = players[bowling_player];
  const myMove = player_role === 'batter' ? locked_moves.batter_move : locked_moves.bowler_move;
  const oversLimit = match_settings.overs_per_innings;
  const oversDisplay = formatOvers(balls_bowled);
  const timerDuration = match_settings.timer_duration;
  const showOutOverlay =
    currentPhase === 'RESOLVE_MOVE' && locked_moves.batter_move === locked_moves.bowler_move;

  // Bot move logic
  useEffect(() => {
    if (currentPhase !== 'MATCH') return undefined;
    const botRole = player_role === 'batter' ? 'bowler' : 'batter';
    const botLocked = botRole === 'batter' ? locked_moves.batter_move : locked_moves.bowler_move;
    if (botLocked !== null) return undefined;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const context = {
        innings,
        playerRole: player_role,
        score: score.batting,
        wickets: wickets.batting,
        ballsBowled: balls_bowled,
        oversLimit,
        target,
        botRole,
        previousPlayerMoves: ball_log.slice(-3).map((entry) => entry.playerMove),
      };
      context.key = buildContextKey(context);
      const move = await getBotDecision({ context, moveHistory: ball_log });
      if (!cancelled) {
        dispatch({ type: 'SUBMIT_MATCH_MOVE', payload: { role: botRole, move } });
      }
    }, 500 + Math.random() * 550);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [currentPhase, player_role, locked_moves, innings, score.batting, wickets.batting, balls_bowled, oversLimit, target, ball_log, dispatch]);

  // Resolution processing
  useEffect(() => {
    if (currentPhase !== 'RESOLVE_MOVE') return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'PROCESS_RESOLUTION' });
    }, showOutOverlay ? 2500 : 600);
    return () => window.clearTimeout(timer);
  }, [currentPhase, dispatch, showOutOverlay]);

  const handleMove = (value) => {
    if (myMove !== null) return;
    dispatch({ type: 'SUBMIT_MATCH_MOVE', payload: { role: player_role, move: value } });
  };

  const summary = useMemo(() => {
    const overRuns = [];
    ball_log.forEach((ball, index) => {
      const overIndex = Math.floor(index / 6);
      overRuns[overIndex] = overRuns[overIndex] ?? { label: `${overIndex + 1}`, runs: 0 };
      overRuns[overIndex].runs += ball.runs ?? 0;
    });
    return {
      overRuns,
      playerRuns: match_stats.player.runs,
      botRuns: match_stats.bot.runs,
      playerWickets: match_stats.player.wickets,
      oversDisplay,
    };
  }, [ball_log, match_stats, oversDisplay]);

  const needText =
    innings === 2 && target
      ? `${Math.max(0, target - score.batting)} needed from ${
          oversLimit === null ? 'unlimited balls' : `${Math.max(0, oversLimit * 6 - balls_bowled)} balls`
        }`
      : null;

  const actionLabel =
    currentPhase === 'MATCH_RESULT'
      ? series_winner
        ? 'View Series Result'
        : 'Next Match'
      : '';

  const lastBall = ball_log[ball_log.length - 1];
  const showRunsBadge = lastBall && !lastBall.isOut && currentPhase !== 'MATCH_RESULT';

  /* ─── INNINGS BREAK ─── */
  if (currentPhase === 'INNINGS_BREAK') {
    return (
      <div className="relative flex flex-1 flex-col overflow-hidden bg-arena-surface">
        <InningsBreak
          score={score.batting}
          wickets={wickets.batting}
          oversDisplay={oversDisplay}
          target={target}
          onAdvance={() => dispatch({ type: 'ADVANCE_INNINGS' })}
          matchSettings={match_settings}
        />
      </div>
    );
  }

  /* ─── MATCH RESULT ─── */
  if (currentPhase === 'MATCH_RESULT') {
    const isVictory = result_meta?.playerWon;

    if (isVictory) {
      return (
        <div className="relative flex flex-1 flex-col overflow-hidden bg-arena-surface">
          <VictoryResult
            resultMeta={result_meta}
            matchStats={match_stats}
            matchSettings={match_settings}
            ballLog={ball_log}
            oversDisplay={oversDisplay}
            onAction={() => dispatch({ type: 'NEXT_MATCH' })}
            actionLabel={actionLabel}
          />
        </div>
      );
    }

    return (
      <div className="relative flex flex-1 flex-col overflow-hidden bg-arena-surface">
        <DefeatResult
          resultMeta={result_meta}
          matchStats={match_stats}
          onAction={() => dispatch({ type: 'NEXT_MATCH' })}
          actionLabel={actionLabel}
        />
      </div>
    );
  }

  /* ─── MAIN MATCH / RESOLVE ─── */
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-arena-surface">
      <Scorecard
        open={scorecardOpen}
        onClose={() => setScorecardOpen(false)}
        inningsLog={ball_log}
        currentOver={current_over_log}
        stats={derivedStats}
        summary={summary}
      />

      {/* OUT Overlay */}
      <AnimatePresence>
        {showOutOverlay && currentPhase === 'RESOLVE_MOVE' && (
          <OutOverlay
            onContinue={() => dispatch({ type: 'PROCESS_RESOLUTION' })}
            score={score.batting}
            wickets={wickets.batting + 1}
            balls={balls_bowled}
            botName={bowler?.name ?? 'BOT'}
          />
        )}
      </AnimatePresence>

      {/* ─── Top Bar ─── */}
      <div className="border-b border-arena-outline-variant/15 bg-arena-container-low px-4 pb-3 pt-3 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="esports-headline text-xl tracking-esports text-white sm:text-2xl">
                Hand Cricket
              </h2>
              <span className="font-display text-xs text-arena-on-surface-faint">
                {oversDisplay}
                {oversLimit ? ` / ${oversLimit}` : ''}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`rounded-sm px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-broadcast ${
                  player_role === 'batter'
                    ? 'bg-arena-primary/15 text-arena-primary'
                    : 'bg-arena-secondary/15 text-arena-secondary'
                }`}
              >
                {player_role === 'batter' ? 'Batting' : 'Bowling'}
              </span>
              <span className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                Live Broadcast — Session {innings}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xs text-arena-on-surface-faint">
              M{match_settings.current_match}/{match_settings.series_length}
            </span>
            <button
              onClick={() => setQuitPromptOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 text-xs font-bold uppercase tracking-broadcast text-red-200 transition hover:bg-red-500/15"
            >
              <X size={14} />
              <span className="hidden sm:inline">Quit</span>
            </button>
            <button
              onClick={() => setScorecardOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-arena-container-highest text-arena-on-surface-dim transition hover:text-white"
            >
              <BarChart3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left: Score & Clash Zone */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-3 sm:px-5">
          {/* Massive Score Display */}
          <div className="arena-panel relative rounded-xl p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                  Current Score
                </p>
                <div className="mt-1 flex items-end gap-1">
                  <span className="font-display text-6xl font-bold leading-none text-arena-primary sm:text-7xl">
                    {score.batting}
                  </span>
                  <span className="pb-1 font-display text-2xl font-bold text-arena-secondary">
                    /{wickets.batting}
                  </span>
                </div>
              </div>

              {/* Floating runs badge */}
              <AnimatePresence>
                {showRunsBadge && lastBall && lastBall.runs > 0 && (
                  <motion.div
                    key={lastBall.ballId}
                    initial={{ opacity: 0, y: 10, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 3 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-md bg-arena-primary px-3 py-1 font-display text-sm font-bold text-arena-surface"
                  >
                    +{lastBall.runs} RUNS
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {target && innings === 2 && (
              <span className="stat-chip text-arena-primary">
                Target: {target}
              </span>
            )}
            <span className="stat-chip text-arena-on-surface-dim">
              RR: {derivedStats.currentRunRate.toFixed(1)}
            </span>
            {innings === 2 && target && (
              <span className="stat-chip text-arena-secondary">
                RR Required: {derivedStats.requiredRunRate.toFixed(1)}
              </span>
              )}
            </div>
          </div>

          {/* Timer */}
          {currentPhase === 'MATCH' && timerDuration > 0 && (
            <div className="mt-3">
              <MoveTimer
                key={`${innings}-${balls_bowled}-${player_role}`}
                duration={timerDuration}
                isActive={currentPhase === 'MATCH' && myMove === null}
                onExpire={() => handleMove(Math.floor(Math.random() * 7))}
              />
            </div>
          )}

          {/* Need Text */}
          {needText && (
            <div className="mt-3 rounded-lg border border-arena-secondary/20 bg-arena-secondary/10 px-3 py-2.5 text-sm text-arena-secondary">
              {needText}
            </div>
          )}

          {/* ─── Clash Zone ─── */}
          <div className="mt-3 flex-1">
            <AnimatePresence mode="wait">
              {currentPhase === 'MATCH' && (
                <motion.div
                  key="match-clash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="clash-zone grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl p-4 sm:p-5"
                >
                  {/* Your Move */}
                  <div className="text-center">
                    <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                      Your Move
                    </p>
                    <div className={`mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-lg border-2 ${
                      myMove !== null ? 'border-arena-primary bg-arena-primary/10' : 'border-arena-outline-variant/30 bg-arena-container-highest'
                    }`}>
                      <span className="font-display text-4xl font-bold text-arena-primary">
                        {myMove ?? '?'}
                      </span>
                    </div>
                    <p className="mt-1 font-display text-[10px] uppercase tracking-broadcast text-arena-primary">
                      You
                    </p>
                  </div>

                  {/* VS */}
                  <div className="esports-headline text-xl tracking-esports text-arena-on-surface-faint">
                    VS
                  </div>

                  {/* CPU Move */}
                  <div className="text-center">
                    <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                      CPU Move
                    </p>
                    <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-lg border-2 border-arena-outline-variant/30 bg-arena-container-highest">
                      <span className="font-display text-4xl font-bold text-arena-on-surface-dim">
                        ?
                      </span>
                    </div>
                    <p className="mt-1 font-display text-[10px] uppercase tracking-broadcast text-arena-secondary">
                      Bot_X
                    </p>
                  </div>
                </motion.div>
              )}

              {currentPhase === 'RESOLVE_MOVE' && !showOutOverlay && (
                <motion.div
                  key="resolve-wrap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <div className="clash-zone grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl p-4 sm:p-5">
                    <div className="text-center">
                      <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                        Batter
                      </p>
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-lg border-2 border-arena-primary/40 bg-arena-primary/10"
                      >
                        <span className="font-display text-4xl font-bold text-arena-primary">
                          {locked_moves.batter_move}
                        </span>
                      </motion.div>
                    </div>
                    <div className="esports-headline text-xl tracking-esports text-arena-on-surface-faint">VS</div>
                    <div className="text-center">
                      <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                        Bowler
                      </p>
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-lg border-2 border-arena-secondary/40 bg-arena-secondary/10"
                      >
                        <span className="font-display text-4xl font-bold text-arena-secondary">
                          {locked_moves.bowler_move}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {locked_moves.batter_move === locked_moves.bowler_move ? (
                      <div className="rounded-lg bg-arena-secondary/15 border border-arena-secondary/30 px-6 py-2.5 esports-headline text-xl tracking-esports text-arena-secondary">
                        Wicket!
                      </div>
                    ) : locked_moves.batter_move === 0 ? (
                      <div className="rounded-lg border border-arena-outline-variant/25 bg-arena-container px-6 py-2.5 esports-headline text-xl tracking-esports text-arena-on-surface-dim">
                        Dot Ball
                      </div>
                    ) : (
                      <div className="rounded-lg bg-arena-primary/15 border border-arena-primary/30 px-6 py-2.5 esports-headline text-xl tracking-esports text-arena-primary">
                        +{locked_moves.batter_move} Runs
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* This Over Feed */}
          <div className="mt-3 flex flex-wrap gap-2">
            {current_over_log.length === 0 && (
              <span className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                This over will appear here
              </span>
            )}
            {current_over_log.map((ball) => (
              <div
                key={ball.ballId}
                className={`ball-chip ${
                  ball.isOut
                    ? 'ball-chip-wicket'
                    : ball.runs === 0
                      ? 'ball-chip-dot'
                      : 'ball-chip-runs'
                }`}
              >
                {ball.isOut ? 'W' : ball.runs}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Action Console (Desktop & Mobile) */}
        {currentPhase === 'MATCH' && (
          <div className="border-t border-arena-outline-variant/15 bg-arena-container-low px-4 pb-4 pt-3 lg:w-[320px] lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-arena-primary" />
              <h3 className="esports-headline text-xs tracking-esports text-arena-on-surface-dim">
                {player_role === 'batter' ? 'Select Your Strike' : 'Bowl Your Delivery'}
              </h3>
            </div>
            <NumberPad
              options={MOVE_OPTIONS}
              onSelect={handleMove}
              disabled={myMove !== null}
              className="mt-3"
              buttonClassName="py-4 text-2xl lg:py-6"
            />

            {/* Live Match Feed */}
            <div className="mt-4 hidden lg:block">
              <h4 className="font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
                Live Match Feed
              </h4>
              <div className="mt-2 max-h-32 space-y-0.5 overflow-y-auto">
                {ball_log.slice(-5).reverse().map((ball) => (
                  <FeedItem key={ball.ballId} ball={ball} />
                ))}
                {ball_log.length === 0 && (
                  <p className="text-xs text-arena-on-surface-faint">No deliveries yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {quitPromptOpen && (
          <QuitConfirmModal
            onCancel={() => setQuitPromptOpen(false)}
            onConfirm={() => {
              setQuitPromptOpen(false);
              dispatch({ type: 'FORFEIT_MATCH' });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Match;
