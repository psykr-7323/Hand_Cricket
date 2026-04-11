import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Swords } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useMultiplayer } from '../context/MultiplayerContext';

function MainMenu() {
  const { dispatch } = useGame();
  const { dispatch: mpDispatch } = useMultiplayer();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-arena-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,240,179,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(52,211,153,0.04),transparent_40%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-10 sm:px-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="esports-headline text-5xl tracking-esports neon-text-primary sm:text-6xl">
            Hand Cricket
          </h1>
          <p className="mt-3 font-display text-sm font-medium uppercase tracking-broadcast text-arena-on-surface-faint">
            eSports Edition — Global Circuit
          </p>
        </motion.div>

        {/* Menu Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 grid w-full max-w-lg gap-4"
        >
          {/* VS Bot */}
          <button
            onClick={() => dispatch({ type: 'START_VS_COMPUTER' })}
            className="group arena-panel rounded-lg p-5 text-left transition hover:border-arena-primary/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-[11px] font-medium uppercase tracking-broadcast text-arena-primary">
                  Quick Match
                </p>
                <h2 className="esports-headline mt-2 text-2xl tracking-esports text-white">
                  VS Bot
                </h2>
                <p className="mt-2 text-sm text-arena-on-surface-faint">
                  AI-powered AI opponent that learns from your every move.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-arena-container-highest text-arena-primary transition group-hover:scale-105">
                <Bot size={26} />
              </div>
            </div>
          </button>

          {/* Friends Mode */}
          <button
            onClick={() => mpDispatch({ type: 'MP_OPEN_GATEWAY' })}
            className="group arena-panel rounded-lg p-5 text-left transition hover:border-blue-500/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-[11px] font-medium uppercase tracking-broadcast text-blue-400">
                  Multiplayer
                </p>
                <h3 className="esports-headline mt-2 text-2xl tracking-esports text-white">
                  Friends Mode
                </h3>
                <p className="mt-2 text-sm text-arena-on-surface-faint">
                  Create or join rooms — multiplayer showdown.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 transition group-hover:scale-105">
                <Swords size={26} />
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default MainMenu;
