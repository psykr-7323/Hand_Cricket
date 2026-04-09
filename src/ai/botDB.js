import { get, push, ref, runTransaction, set, update } from 'firebase/database';
import { db } from '../firebase.js';

const ROOT = 'bot_memory';
const MAX_RECENT_MOVES = 150;

const safeKey = (value) =>
  String(value ?? 'unknown')
    .replace(/[.#$/[\]]/g, '_')
    .replace(/\s+/g, '_');

const moveRef = () => ref(db, `${ROOT}/moves`);
const statsRef = () => ref(db, `${ROOT}/stats`);
const historyRef = () => ref(db, `${ROOT}/match_history`);

export async function recordMove(movePayload) {
  const entry = {
    ...movePayload,
    timestamp: movePayload.timestamp ?? Date.now(),
  };

  try {
    const newMoveRef = push(moveRef());
    await set(newMoveRef, entry);

    const contextKey = safeKey(entry.context?.key);
    const playerMoveKey = safeKey(entry.playerMove);

    await runTransaction(ref(db, `${ROOT}/patterns/${contextKey}`), (current) => {
      const next = current ?? {
        total: 0,
        lastUpdated: entry.timestamp,
        frequencies: {},
      };

      next.total += 1;
      next.lastUpdated = entry.timestamp;
      next.frequencies[playerMoveKey] = (next.frequencies[playerMoveKey] ?? 0) + 1;

      return next;
    });

    await runTransaction(statsRef(), (current) => {
      const next = current ?? {
        movesRecorded: 0,
        matches: 0,
        wins: 0,
        losses: 0,
        runsScored: 0,
        wicketsTaken: 0,
        highestScore: 0,
        dismissals: 0,
        recentMoves: [],
      };

      next.movesRecorded += 1;
      next.recentMoves = [...(next.recentMoves ?? []), entry].slice(-MAX_RECENT_MOVES);
      if (entry.botRole === 'batter') {
        next.runsScored += entry.runs ?? 0;
        next.highestScore = Math.max(next.highestScore ?? 0, entry.botInningsScore ?? 0);
      }
      if (entry.isOut && entry.botRole === 'bowler') {
        next.wicketsTaken += 1;
      }
      if (entry.isOut && entry.botRole === 'batter') {
        next.dismissals += 1;
      }

      return next;
    });
  } catch (error) {
    console.error('Failed to record bot move', error);
  }
}

export async function getPatternPrediction(contextKey) {
  try {
    const snapshot = await get(ref(db, `${ROOT}/patterns/${safeKey(contextKey)}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Failed to fetch pattern prediction', error);
    return null;
  }
}

export async function getBotStats() {
  try {
    const snapshot = await get(statsRef());
    if (!snapshot.exists()) {
      return {
        movesRecorded: 0,
        matches: 0,
        wins: 0,
        losses: 0,
        runsScored: 0,
        wicketsTaken: 0,
        highestScore: 0,
        dismissals: 0,
        recentMoves: [],
      };
    }

    return snapshot.val();
  } catch (error) {
    console.error('Failed to load bot stats', error);
    return {
      movesRecorded: 0,
      matches: 0,
      wins: 0,
      losses: 0,
      runsScored: 0,
      wicketsTaken: 0,
      highestScore: 0,
      dismissals: 0,
      recentMoves: [],
    };
  }
}

export async function recordMatchResult(matchPayload) {
  const entry = {
    ...matchPayload,
    timestamp: matchPayload.timestamp ?? Date.now(),
  };

  try {
    const newHistoryRef = push(historyRef());
    await set(newHistoryRef, entry);

    await runTransaction(statsRef(), (current) => {
      const next = current ?? {
        movesRecorded: 0,
        matches: 0,
        wins: 0,
        losses: 0,
        runsScored: 0,
        wicketsTaken: 0,
        highestScore: 0,
        dismissals: 0,
        recentMoves: [],
      };

      next.matches += 1;
      if (entry.botWon) {
        next.wins += 1;
      } else {
        next.losses += 1;
      }

      next.highestScore = Math.max(
        next.highestScore ?? 0,
        entry.botBattingScore ?? 0,
        entry.botBowlingConceded ?? 0,
      );

      return next;
    });

    await update(ref(db, `${ROOT}/latest_series`), {
      currentMatch: entry.currentMatch,
      seriesLength: entry.seriesLength,
      winner: entry.botWon ? 'BOT' : 'PLAYER',
      scoreline: entry.seriesScoreline,
      updatedAt: entry.timestamp,
    });
  } catch (error) {
    console.error('Failed to record match result', error);
  }
}
