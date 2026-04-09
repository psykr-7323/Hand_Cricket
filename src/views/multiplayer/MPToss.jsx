import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useMultiplayer } from '../../context/MultiplayerContext';

function MPToss() {
  const { state, dispatch } = useMultiplayer();
  const { phase, captains, tossMoves, tossWinner, players, currentPlayerId } = state;

  const capA = players[captains.teamA];
  const capB = players[captains.teamB];
  const myRole = currentPlayerId === captains.teamA ? 'captainA' : (currentPlayerId === captains.teamB ? 'captainB' : null);
  const myMoveLocked = myRole ? tossMoves[myRole] != null : true;
  const showNumberPad = phase === 'MP_TOSS' && myRole !== null;
  const winningCaptainId = tossWinner ? captains[tossWinner] : null;
  const canChooseDraftOrder = currentPlayerId === winningCaptainId;

  const tossResult = useMemo(() => {
    if (tossMoves.captainA == null || tossMoves.captainB == null) return null;
    const sum = tossMoves.captainA + tossMoves.captainB;
    return { sum, isOdd: sum % 2 !== 0 };
  }, [tossMoves]);

  const handleCaptainPick = (num) => {
    if (!myRole || tossMoves[myRole] != null) return;
    dispatch({ type: 'MP_SUBMIT_TOSS_MOVE', payload: { who: myRole, move: num } });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-arena-surface px-4 pb-6 pt-6 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="esports-headline text-4xl tracking-[0.15em] text-white sm:text-5xl">
            The Toss
          </h2>
          <p className="mt-2 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Determines Draft Pick Order
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="rounded-md bg-arena-primary/15 border border-arena-primary/30 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-arena-primary">
              {capA?.name}: Odd
            </span>
            <span className="rounded-md bg-blue-500/15 border border-blue-500/30 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-broadcast text-blue-400">
              {capB?.name}: Even
            </span>
          </div>
        </div>

        {/* Number Selection */}
        {showNumberPad && (
          <div className="arena-panel rounded-xl p-5">
            <p className="text-center font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              {myMoveLocked
                ? `You locked in ✓ — Waiting for opponent...`
                : `${myRole === 'captainA' ? capA?.name : capB?.name}: Pick your toss number (1-6)`}
            </p>
            <div
              className={`mt-4 grid grid-cols-3 gap-3 ${
                myMoveLocked ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <motion.button
                  key={number}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleCaptainPick(number)}
                  className="num-pad-btn py-5 text-2xl"
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Waiting screen for non-captains */}
        {phase === 'MP_TOSS' && myRole === null && (
          <div className="arena-panel rounded-xl p-5 text-center">
            <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              Captains are tossing...
            </p>
          </div>
        )}

        {/* Toss Result */}
        {phase === 'MP_TOSS_RESULT' && tossResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="arena-panel rounded-xl p-5"
          >
            <div className="text-center">
              {/* Move Display */}
              <div className="flex items-center justify-center gap-4">
                <div className="rounded-lg bg-arena-container-highest px-5 py-4">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    {capA?.name}
                  </p>
                  <div className="mt-1 font-display text-3xl font-bold text-arena-primary">
                    {tossMoves.captainA}
                  </div>
                </div>
                <div className="font-display text-sm font-bold uppercase tracking-broadcast text-arena-on-surface-faint">
                  +
                </div>
                <div className="rounded-lg bg-arena-container-highest px-5 py-4">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    {capB?.name}
                  </p>
                  <div className="mt-1 font-display text-3xl font-bold text-blue-400">
                    {tossMoves.captainB}
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
                    {tossResult.sum} ({tossResult.isOdd ? 'Odd' : 'Even'})
                  </div>
                </div>
              </div>

              {/* Winner Banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`mt-5 rounded-lg px-5 py-3 ${
                  tossWinner === 'teamA'
                    ? 'bg-arena-primary/15 border border-arena-primary/30'
                    : 'bg-blue-500/15 border border-blue-500/30'
                }`}
              >
                <h3 className="esports-headline text-lg tracking-esports text-white">
                  {tossWinner === 'teamA' ? capA?.name : capB?.name} Wins The Toss!
                </h3>
              </motion.div>

              {/* Choice Buttons */}
              {canChooseDraftOrder ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      dispatch({ type: 'MP_CHOOSE_FIRST_PICK', payload: true })
                    }
                    className="tactile-btn rounded-lg px-4 py-3 text-sm"
                  >
                    <Zap size={14} className="mr-1 inline" />
                    Pick First
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: 'MP_CHOOSE_FIRST_PICK', payload: false })
                    }
                    className="tactile-btn-secondary rounded-lg px-4 py-3 text-sm"
                  >
                    Pick Second
                  </button>
                </div>
              ) : (
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm text-arena-on-surface-faint">
                  Waiting for toss winner to choose the draft order...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MPToss;
