import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap } from 'lucide-react';
import NumberPad from '../components/NumberPad';
import { useGame } from '../context/GameContext';

const TOSS_NUMBERS = [0, 1, 2, 3, 4, 5, 6];

function TossSetup({ onDone }) {
  const [stage, setStage] = useState('flip');

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setStage('ready'), 900);
    const doneTimer = window.setTimeout(() => onDone(), 1800);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4 pt-4 sm:px-6">
      <div className="arena-panel w-full max-w-md rounded-xl p-6 text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-arena-container-highest text-arena-primary ${
            stage === 'flip' ? 'coin-orbit' : ''
          }`}
        >
          <Coins size={28} />
        </div>
        <p className="mt-4 font-display text-xs font-medium uppercase tracking-broadcast text-arena-on-surface-faint">
          Toss Setup
        </p>

        <AnimatePresence mode="wait">
          {stage === 'flip' ? (
            <motion.div key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="esports-headline mt-3 text-2xl tracking-esports text-white">
                Flipping the coin
              </h2>
              <p className="mt-2 text-sm text-arena-on-surface-faint">
                Getting the odd-even toss ready...
              </p>
            </motion.div>
          ) : (
            <motion.div key="ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="esports-headline mt-3 text-2xl tracking-esports text-white">
                Toss Ready
              </h2>
              <p className="mt-3 text-sm text-arena-on-surface-faint">
                Claim odd or even first, then lock in your toss number.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TossReveal({ tossResult, tossMoves, playerSide, botSide, onChoose }) {
  const [revealCountdown, setRevealCountdown] = useState(3);

  useEffect(() => {
    if (revealCountdown === 0) return undefined;
    const timer = window.setTimeout(() => {
      setRevealCountdown((count) => Math.max(0, count - 1));
    }, 550);
    return () => window.clearTimeout(timer);
  }, [revealCountdown]);

  useEffect(() => {
    if (revealCountdown > 0 || tossResult.playerWon) return undefined;
    const timer = window.setTimeout(() => {
      const botChoice = Math.random() > 0.5 ? 'bat' : 'bowl';
      onChoose(botChoice === 'bat' ? 'bowl' : 'bat');
    }, 700);
    return () => window.clearTimeout(timer);
  }, [revealCountdown, tossResult.playerWon, onChoose]);

  const showReveal = revealCountdown === 0;
  const sideText = tossResult.parity === 'even' ? 'Even' : 'Odd';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="arena-panel rounded-xl p-5"
    >
      {!showReveal ? (
        <div className="py-8 text-center">
          <p className="font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Coin Flip Sequence
          </p>
          <div className="esports-headline mt-3 text-5xl tracking-esports text-arena-primary animate-neon-pulse">
            {revealCountdown}
          </div>
          <p className="mt-2 text-sm text-arena-on-surface-faint">Revealing both calls...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-arena-primary/30 bg-arena-primary/10 px-4 py-3">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-primary">
                You
              </p>
              <p className="mt-1 font-display text-lg font-bold uppercase text-white">
                {playerSide}
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-blue-400">
                Bot
              </p>
              <p className="mt-1 font-display text-lg font-bold uppercase text-white">
                {botSide}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="rounded-lg bg-arena-container-highest px-5 py-4">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                You
              </p>
              <div className="mt-1 font-display text-3xl font-bold text-arena-primary">
                {tossMoves.player}
              </div>
            </div>
            <div className="font-display text-sm font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
              +
            </div>
            <div className="rounded-lg bg-arena-container-highest px-5 py-4">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                Bot
              </p>
              <div className="mt-1 font-display text-3xl font-bold text-arena-secondary">
                {tossMoves.bot}
              </div>
            </div>
            <div className="font-display text-sm font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
              =
            </div>
            <div className="rounded-lg border border-arena-outline-variant/30 bg-arena-container px-5 py-4">
              <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                Total
              </p>
              <div className="esports-headline mt-1 text-2xl tracking-esports text-white">
                {tossResult.sum} ({sideText})
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`mt-5 rounded-lg px-5 py-3 ${
              tossResult.playerWon
                ? 'bg-arena-primary/15 border border-arena-primary/30'
                : 'bg-red-500/15 border border-red-500/30'
            }`}
          >
            <h3 className="esports-headline text-lg tracking-esports text-white">
              {tossResult.playerWon ? 'You Win The Toss' : 'Bot Wins The Toss'}
            </h3>
          </motion.div>

          {tossResult.playerWon ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => onChoose('bat')}
                className="flex items-center justify-center gap-2 rounded-lg bg-arena-container-highest px-4 py-3 font-display text-sm font-bold uppercase tracking-broadcast text-white transition hover:bg-arena-container-high"
              >
                <Zap size={16} className="text-arena-primary" />
                Choose to Bat
              </button>
              <button
                onClick={() => onChoose('bowl')}
                className="flex items-center justify-center gap-2 rounded-lg bg-arena-container-highest px-4 py-3 font-display text-sm font-bold uppercase tracking-broadcast text-white transition hover:bg-arena-container-high"
              >
                <Zap size={16} className="text-arena-on-surface-faint" />
                Choose to Bowl
              </button>
            </div>
          ) : (
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm text-arena-on-surface-faint">
              <div className="h-2 w-2 animate-pulse rounded-full bg-arena-primary" />
              BOT is deciding...
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function Toss() {
  const { state, dispatch } = useGame();
  const { toss_moves, currentPhase } = state;
  const [playerSide, setPlayerSide] = useState(null);
  const [botSide, setBotSide] = useState(null);

  useEffect(() => {
    if (currentPhase !== 'TOSS' || !playerSide || botSide) return undefined;
    const timer = window.setTimeout(() => {
      setBotSide(playerSide === 'odd' ? 'even' : 'odd');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [botSide, currentPhase, playerSide]);

  useEffect(() => {
    if (
      currentPhase !== 'TOSS' ||
      !playerSide ||
      !botSide ||
      toss_moves.player === null ||
      toss_moves.bot !== null
    ) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      dispatch({
        type: 'SUBMIT_TOSS_MOVE',
        payload: { who: 'bot', move: Math.floor(Math.random() * 7) },
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [botSide, currentPhase, dispatch, playerSide, toss_moves.bot, toss_moves.player]);

  const tossResult = useMemo(() => {
    if (toss_moves.player === null || toss_moves.bot === null || !playerSide) return null;
    const sum = toss_moves.player + toss_moves.bot;
    const parity = sum % 2 === 0 ? 'even' : 'odd';
    return { sum, parity, playerWon: parity === playerSide };
  }, [playerSide, toss_moves]);

  const assignmentComplete = Boolean(playerSide && botSide);
  const locked = toss_moves.player !== null;

  if (currentPhase === 'TOSS_SETUP') {
    return <TossSetup onDone={() => dispatch({ type: 'COMPLETE_TOSS_SETUP' })} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-6 pt-6 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h2 className="esports-headline text-4xl tracking-[0.15em] text-white sm:text-5xl">
            The Toss
          </h2>
          <p className="mt-4 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Claim odd or even first, then pick your toss number
          </p>
        </div>

        {currentPhase === 'TOSS' && (
          <div className="arena-panel rounded-xl p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-arena-outline-variant/20 bg-arena-container px-4 py-3 text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                  Your Side
                </p>
                <p className="mt-1 font-display text-lg font-bold text-arena-primary">
                  {playerSide ? playerSide.toUpperCase() : 'Unclaimed'}
                </p>
              </div>
              <div className="rounded-lg border border-arena-outline-variant/20 bg-arena-container px-4 py-3 text-center">
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                  Bot Side
                </p>
                <p className="mt-1 font-display text-lg font-bold text-arena-on-surface-dim">
                  {botSide ? botSide.toUpperCase() : 'Waiting'}
                </p>
              </div>
            </div>

            {!playerSide && (
              <div className="mt-5">
                <p className="text-center font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                  Claim Odd or Even
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {['odd', 'even'].map((side) => (
                    <button
                      key={side}
                      onClick={() => setPlayerSide(side)}
                      className={`rounded-lg border px-4 py-3 font-display text-sm font-bold uppercase tracking-broadcast transition ${
                        side === 'odd'
                          ? 'border-arena-primary/30 bg-arena-primary/15 text-arena-primary hover:bg-arena-primary/20'
                          : 'border-blue-500/30 bg-blue-500/15 text-blue-400 hover:bg-blue-500/20'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {playerSide && !assignmentComplete && (
              <div className="mt-5 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-4 text-center text-sm text-arena-on-surface-faint">
                You claimed <span className="font-bold uppercase text-white">{playerSide}</span>.
                BOT is taking the remaining side...
              </div>
            )}

            {assignmentComplete && (
              <>
                <p className="mt-5 text-center font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                  {locked ? `You locked ${toss_moves.player}. BOT is choosing...` : 'Pick your toss number (0-6)'}
                </p>
                <NumberPad
                  options={TOSS_NUMBERS}
                  disabled={locked}
                  onSelect={(number) =>
                    dispatch({
                      type: 'SUBMIT_TOSS_MOVE',
                      payload: { who: 'player', move: number },
                    })
                  }
                  className="mt-4"
                  buttonClassName="py-5 text-2xl"
                />
              </>
            )}
          </div>
        )}

        {currentPhase === 'TOSS_RESULT' && tossResult && (
          <TossReveal
            key={`${toss_moves.player}-${toss_moves.bot}`}
            tossResult={tossResult}
            tossMoves={toss_moves}
            playerSide={playerSide}
            botSide={botSide}
            onChoose={(choice) =>
              dispatch({ type: 'CHOOSE_BAT_BOWL', payload: { choice } })
            }
          />
        )}
      </div>
    </div>
  );
}

export default Toss;
