import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

function TossSetup({ onDone }) {
  const [stage, setStage] = useState('flip');

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setStage('assigned'), 1100);
    const doneTimer = window.setTimeout(() => onDone(), 2200);
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
              <p className="mt-2 text-sm text-arena-on-surface-faint">Assigning odd and even...</p>
            </motion.div>
          ) : (
            <motion.div key="assigned" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="esports-headline mt-3 text-2xl tracking-esports text-white">
                Sides Assigned
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-arena-primary/10 border border-arena-primary/30 px-4 py-3">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-primary">
                    Your Side
                  </p>
                  <p className="esports-headline mt-1.5 text-xl tracking-esports text-arena-primary">
                    Odd
                  </p>
                </div>
                <div className="rounded-lg bg-arena-container-highest px-4 py-3">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    Bot Side
                  </p>
                  <p className="esports-headline mt-1.5 text-xl tracking-esports text-arena-on-surface-dim">
                    Even
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TossReveal({ tossResult, tossMoves, onChoose }) {
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
  const sum = tossMoves.player + tossMoves.bot;
  const parity = sum % 2 === 0 ? 'Even' : 'Odd';

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
          {/* Move Display */}
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
                {sum} ({parity})
              </div>
            </div>
          </div>

          {/* Winner Banner */}
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

          {/* Choice Buttons */}
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

  useEffect(() => {
    if (currentPhase !== 'TOSS' || toss_moves.bot !== null) return undefined;
    const timer = window.setTimeout(() => {
      dispatch({
        type: 'SUBMIT_TOSS_MOVE',
        payload: { who: 'bot', move: Math.floor(Math.random() * 6) + 1 },
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [currentPhase, toss_moves.bot, dispatch]);

  const tossResult = useMemo(() => {
    if (toss_moves.player === null || toss_moves.bot === null) return null;
    const sum = toss_moves.player + toss_moves.bot;
    return { sum, playerWon: sum % 2 !== 0 };
  }, [toss_moves]);

  const locked = toss_moves.player !== null;

  if (currentPhase === 'TOSS_SETUP') {
    return <TossSetup onDone={() => dispatch({ type: 'COMPLETE_TOSS_SETUP' })} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-6 pt-6 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="esports-headline text-4xl tracking-[0.15em] text-white sm:text-5xl">
            The Toss
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="rounded-md bg-arena-primary/15 border border-arena-primary/30 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-arena-primary">
              Your Side: Odd
            </span>
            <span className="rounded-md bg-arena-container-highest px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              Bot Side: Even
            </span>
          </div>
        </div>

        {/* Toss Number Selection */}
        {currentPhase === 'TOSS' && (
          <div className="arena-panel rounded-xl p-5">
            <p className="text-center font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              {locked ? `You locked ${toss_moves.player}. BOT is choosing...` : 'Pick your toss number (1-6)'}
            </p>
            <div
              className={`mt-4 grid grid-cols-3 gap-3 ${
                locked ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <motion.button
                  key={number}
                  whileTap={{ scale: 0.94 }}
                  onClick={() =>
                    dispatch({
                      type: 'SUBMIT_TOSS_MOVE',
                      payload: { who: 'player', move: number },
                    })
                  }
                  className="num-pad-btn py-5 text-2xl"
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Toss Result */}
        {currentPhase === 'TOSS_RESULT' && tossResult && (
          <TossReveal
            key={`${toss_moves.player}-${toss_moves.bot}`}
            tossResult={tossResult}
            tossMoves={toss_moves}
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
