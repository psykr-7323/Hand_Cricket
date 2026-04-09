import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase.js';
import { ref, onValue, set, update, remove, serverTimestamp } from 'firebase/database';
import { BOT_NAMES, EMOJIS, generateBotId } from '../utils/firebaseUtils.js';

// Helper to get a random bot
const createBot = (existingPlayersCount) => {
  const botId = generateBotId();
  return {
    id: botId,
    name: BOT_NAMES[existingPlayersCount % BOT_NAMES.length],
    emoji: '🤖',
    isBot: true,
    isReady: true,
    isOnline: true,
  };
};

export function useGameRoom(roomCode, userId) {
  const [roomState, setRoomState] = useState(null);
  
  const roomRef = useMemo(() => roomCode ? ref(db, `rooms/${roomCode}`) : null, [roomCode]);

  useEffect(() => {
    if (!roomRef) return;
    const unsubscribe = onValue(roomRef, (snapshot) => {
      setRoomState(snapshot.exists() ? snapshot.val() : null);
    });
    return () => unsubscribe();
  }, [roomRef]);

  const isHost = userId && roomState?.meta?.hostId === userId;

  // -- Action Writers --
  const actions = useMemo(() => {
    if (!roomCode) return {};

    const path = (subPath) => `rooms/${roomCode}/${subPath}`;

    return {
      createRoom: async (name, settings) => {
        await set(ref(db, `rooms/${roomCode}`), {
          meta: {
            hostId: userId,
            createdAt: serverTimestamp(),
            status: 'MP_CREATE_SETTINGS'
          },
          settings,
          players: {
            [userId]: {
              id: userId,
              name,
              emoji: EMOJIS[0],
              isBot: false,
              isReady: false,
              isOnline: true
            }
          }
        });
      },
      joinRoom: async (name) => {
        // Read current count (could race, but good for MVP)
        update(ref(db), {
          [path(`players/${userId}`)]: {
            id: userId,
            name,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            isBot: false,
            isReady: false,
            isOnline: true
          }
        });
      },
      updateSettings: (key, value) => {
        update(ref(db), { [path(`settings/${key}`)]: value });
      },
      confirmSettings: () => {
        update(ref(db), { [path('meta/status')]: 'MP_LOBBY' });
      },
      addBot: (currentCount) => {
        const bot = createBot(currentCount);
        update(ref(db), { [path(`players/${bot.id}`)]: bot });
      },
      toggleReady: (isReady) => {
        update(ref(db), { [path(`players/${userId}/isReady`)]: isReady });
      },
      removePlayer: (pid) => {
        remove(ref(db, path(`players/${pid}`)));
      },
      startGame: () => {
        update(ref(db), { [path('meta/status')]: 'MP_CAPTAIN_REVEAL' });
      },
      submitTossMove: (who, move) => {
        update(ref(db), { [path(`toss/moves/${who}`)]: move });
      },
      submitMatchTossMove: (who, move) => {
        update(ref(db), { [path(`matchToss/moves/${who}`)]: move });
      },
      resetRoom: () => {
        remove(ref(db, `rooms/${roomCode}`));
      },
    };
  }, [roomCode, userId]);

  return { roomState, actions, isHost };
}
