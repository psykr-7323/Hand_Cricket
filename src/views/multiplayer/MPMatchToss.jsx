import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useMultiplayer } from '../../context/MultiplayerContext';

function MPMatchToss() {
  const { state, dispatch } = useMultiplayer();
  const { phase, captains, matchTossMoves, matchTossWinner, players, currentPlayerId } = state;

  const capA = players[captains.teamA];
  const capB = players[captains.teamB];
  const myRole = currentPlayerId === captains.teamA ? 'captainA' : (currentPlayerId === captains.teamB ? 'captainB' : null);
  const myMoveLocked = myRole ? matchTossMoves[myRole] != null : true;
  const showNumberPad = phase === 'MP_MATCH_TOSS' && myRole !== null;
  const winningCaptainId = matchTossWinner ? captains[matchTossWinner] : null;
  const canChooseInnings = currentPlayerId === winningCaptainId;

  const tossResult = useMemo(() => {
    if (matchTossMoves.captainA == null || matchTossMoves.captainB == null) return null;
    const sum = matchTossMoves.captainA + matchTossMoves.captainB;
    return { sum, isOdd: sum % 2 !== 0 };
  }, [matchTossMoves]);

  const handlePick = (num) => {
    if (!myRole || matchTossMoves[myRole] != null) return;
    dispatch({ type: 'MP_SUBMIT_MATCH_TOSS', payload: { who: myRole, move: num } });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-arena-surface px-4 pb-6 pt-6 sm:px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="esports-headline text-4xl tracking-[0.15em] text-white sm:text-5xl">
            Match Toss
          </h2>
          <p className="mt-2 font-display text-xs uppercase tracking-broadcast text-arena-on-surface-faint">
            Who Bats First?
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
                : `${myRole === 'captainA' ? capA?.name : capB?.name}: Pick your number (1-6)`}
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
                  onClick={() => handlePick(number)}
                  className="num-pad-btn py-5 text-2xl"
                >
                  {number}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Waiting screen for non-captains */}
        {phase === 'MP_MATCH_TOSS' && myRole === null && (
          <div className="arena-panel rounded-xl p-5 text-center">
            <p className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
              Captains are tossing...
            </p>
          </div>
        )}

        {/* Result */}
        {phase === 'MP_MATCH_TOSS_RESULT' && tossResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="arena-panel rounded-xl p-5"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="rounded-lg bg-arena-container-highest px-5 py-4">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    {capA?.name}
                  </p>
                  <div className="mt-1 font-display text-3xl font-bold text-arena-primary">
                    {matchTossMoves.captainA}
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-arena-on-surface-faint">+</span>
                <div className="rounded-lg bg-arena-container-highest px-5 py-4">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    {capB?.name}
                  </p>
                  <div className="mt-1 font-display text-3xl font-bold text-blue-400">
                    {matchTossMoves.captainB}
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-arena-on-surface-faint">=</span>
                <div className="rounded-lg border border-arena-outline-variant/30 bg-arena-container px-5 py-4">
                  <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                    Sum
                  </p>
                  <div className="esports-headline mt-1 text-2xl tracking-esports text-white">
                    {tossResult.sum} ({tossResult.isOdd ? 'Odd' : 'Even'})
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`mt-5 rounded-lg px-5 py-3 ${
                  matchTossWinner === 'teamA'
                    ? 'bg-arena-primary/15 border border-arena-primary/30'
                    : 'bg-blue-500/15 border border-blue-500/30'
                }`}
              >
                <h3 className="esports-headline text-lg tracking-esports text-white">
                  {matchTossWinner === 'teamA' ? capA?.name : capB?.name} Wins!
                </h3>
              </motion.div>

              {canChooseInnings ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => dispatch({ type: 'MP_CHOOSE_BAT_BOWL', payload: { choice: 'bat' } })}
                    className="tactile-btn rounded-lg px-4 py-3 text-sm"
                  >
                    <Zap size={14} className="mr-1 inline" />
                    Bat First
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'MP_CHOOSE_BAT_BOWL', payload: { choice: 'bowl' } })}
                    className="tactile-btn-secondary rounded-lg px-4 py-3 text-sm"
                  >
                    Bowl First
                  </button>
                </div>
              ) : (
                <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-arena-outline-variant/20 bg-arena-container px-5 py-3 text-sm text-arena-on-surface-faint">
                  Waiting for match toss winner to choose...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MPMatchToss;
