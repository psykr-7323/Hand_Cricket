import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Gauge, History, X, Zap } from 'lucide-react';

const formatRate = (value) => (Number.isFinite(value) ? value.toFixed(1) : '0.0');

function Scorecard({ open, onClose, inningsLog = [], currentOver = [], stats, summary }) {
  const maxOverRuns = Math.max(1, ...summary.overRuns.map((over) => over.runs));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-arena-void/80 backdrop-blur-xl"
          />
          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 z-50 max-h-[85%] overflow-y-auto rounded-t-xl border border-arena-outline-variant/15 bg-arena-surface px-5 pb-8 pt-4 shadow-arena-ambient"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-display text-[10px] uppercase tracking-broadcast text-arena-on-surface-faint">
                  Live Scorecard
                </p>
                <h3 className="esports-headline mt-1 text-xl tracking-esports text-white">
                  Match Analytics
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-arena-container-highest text-arena-on-surface-dim transition hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4">
              {/* Ball by Ball */}
              <section className="arena-panel rounded-xl p-4">
                <div className="mb-3 flex items-center gap-2">
                  <History size={14} className="text-arena-primary" />
                  <h4 className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                    Ball by Ball
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {inningsLog.length === 0 && (
                    <span className="text-xs text-arena-on-surface-faint">No deliveries yet.</span>
                  )}
                  {inningsLog.map((ball) => (
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
              </section>

              {/* Run Rate Graph */}
              <section className="arena-panel rounded-xl p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 size={14} className="text-arena-primary" />
                  <h4 className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                    Run Rate Graph
                  </h4>
                </div>
                <div className="flex items-end gap-2">
                  {summary.overRuns.length === 0 && (
                    <span className="text-xs text-arena-on-surface-faint">
                      Over bars will appear as the innings grows.
                    </span>
                  )}
                  {summary.overRuns.map((over) => (
                    <div key={over.label} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-24 w-full items-end">
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-arena-primary to-arena-primary-dark"
                          style={{
                            height: `${Math.max(12, (over.runs / maxOverRuns) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="font-display text-[9px] uppercase tracking-broadcast text-arena-on-surface-faint">
                        {over.label}
                      </span>
                      <span className="text-xs font-bold text-white">{over.runs}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Metrics Grid */}
              <section className="grid gap-4 md:grid-cols-2">
                <div className="arena-panel rounded-xl p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Gauge size={14} className="text-arena-primary" />
                    <h4 className="font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                      Live Metrics
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'CRR', value: formatRate(stats.currentRunRate) },
                      { label: 'RRR', value: formatRate(stats.requiredRunRate) },
                      { label: 'Player SR', value: formatRate(stats.playerStrikeRate) },
                      { label: 'BOT Econ', value: formatRate(stats.botEconomy) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg bg-arena-container-highest p-3">
                        <p className="text-[10px] text-arena-on-surface-faint">{label}</p>
                        <p className="mt-1 font-display text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="arena-panel rounded-xl p-4">
                  <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                    Player vs BOT
                  </h4>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-arena-container-highest p-3">
                      <div className="flex items-center justify-between text-[10px] text-arena-on-surface-faint">
                        <span>You</span>
                        <span>BOT</span>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="font-display text-xl font-bold text-arena-primary">
                            {summary.playerRuns}
                          </p>
                          <p className="text-[10px] text-arena-on-surface-faint">Runs</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-arena-secondary">
                            {summary.botRuns}
                          </p>
                          <p className="text-[10px] text-arena-on-surface-faint">Runs</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-arena-container-highest p-3">
                      <div className="flex items-center justify-between text-[10px] text-arena-on-surface-faint">
                        <span>Wickets</span>
                        <span>Overs</span>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="font-display text-xl font-bold text-white">
                            {summary.playerWickets}
                          </p>
                          <p className="text-[10px] text-arena-on-surface-faint">Player</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-white">
                            {summary.oversDisplay}
                          </p>
                          <p className="text-[10px] text-arena-on-surface-faint">Current innings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* This Over */}
              <section className="arena-panel rounded-xl p-4">
                <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-broadcast text-arena-on-surface-dim">
                  This Over
                </h4>
                <div className="flex gap-2">
                  {currentOver.length === 0 && (
                    <span className="text-xs text-arena-on-surface-faint">
                      No balls yet in this over.
                    </span>
                  )}
                  {currentOver.map((ball) => (
                    <div
                      key={ball.ballId}
                      className={`ball-chip h-11 w-11 ${
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
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default Scorecard;
