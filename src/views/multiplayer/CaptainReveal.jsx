import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayer } from '../../context/MultiplayerContext';

function CaptainReveal() {
  const { state, dispatch } = useMultiplayer();
  const { players, captains, currentPlayerId, hostId } = state;
  const [stage, setStage] = useState('intro');
  const playerList = Object.values(players);
  const capA = players[captains.teamA];
  const capB = players[captains.teamB];

  useEffect(() => {
    const t1 = setTimeout(() => setStage('reveal'), 1500);
    const t2 = setTimeout(() => {
      if (currentPlayerId === hostId) {
        dispatch({ type: 'MP_BEGIN_TOSS' });
      }
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentPlayerId, dispatch, hostId]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-arena-surface">
      {/* Background particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_60%)]" />

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/15 text-4xl">
              👑
            </div>
            <h2 className="esports-headline mt-6 text-3xl tracking-esports text-white sm:text-4xl">
              Selecting Captains...
            </h2>
            <p className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint">
              The system is randomly choosing
            </p>

            {/* Shuffling avatar strip */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {playerList.map((p, i) => (
                <motion.div
                  key={p.id}
                  animate={{
                    y: [0, -8, 0, 8, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-arena-container-highest text-xl"
                >
                  {p.emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative z-10 text-center"
          >
            {/* Giant Title */}
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="esports-headline text-5xl tracking-[0.15em] neon-text-super sm:text-6xl"
            >
              Captains Revealed
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 font-display text-sm uppercase tracking-broadcast text-arena-on-surface-faint"
            >
              Your leaders have been chosen
            </motion.p>

            {/* Captain Cards */}
            <div className="mt-8 flex items-center justify-center gap-6">
              {/* Captain A */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="arena-panel rounded-xl p-6 text-center"
                style={{ minWidth: 160 }}
              >
                <span className="captain-badge">Captain A</span>
                <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-xl bg-arena-primary/15 text-4xl splash-scale">
                  {capA?.emoji ?? '❔'}
                </div>
                <p className="mt-3 font-display text-base font-bold text-white">
                  {capA?.name ?? 'Pending'}
                </p>
                <p className="mt-1 rounded-md bg-arena-primary/10 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-broadcast text-arena-primary">
                  Team A Captain
                </p>
              </motion.div>

              {/* VS */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="esports-headline text-3xl tracking-esports text-arena-on-surface-faint"
              >
                VS
              </motion.span>

              {/* Captain B */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="arena-panel rounded-xl p-6 text-center"
                style={{ minWidth: 160 }}
              >
                <span className="captain-badge">Captain B</span>
                <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-xl bg-blue-500/15 text-4xl splash-scale">
                  {capB?.emoji ?? '❔'}
                </div>
                <p className="mt-3 font-display text-base font-bold text-white">
                  {capB?.name ?? 'Pending'}
                </p>
                <p className="mt-1 rounded-md bg-blue-500/10 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-broadcast text-blue-400">
                  Team B Captain
                </p>
              </motion.div>
            </div>

            {/* Auto-advance notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-xs text-arena-on-surface-faint"
            >
              Proceeding to toss...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CaptainReveal;
