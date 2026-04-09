export const OVER_OPTIONS = [1, 2, 5, 10, 20, 50, null];
export const SERIES_OPTIONS = [1, 3, 5];
export const DRAFT_TIMER = 15;
export const SELECTION_TIMER = 15;
export const SUPER_OVER_BALLS = 6;

export const EMOJIS = ['🏏', '⚡', '🔥', '💎', '🎯', '🌟', '🦊', '🐉', '🦅', '🐺', '🦁', '🎭', '🛡️', '⚔️', '🏆', '🚀', '🌊', '🎪', '🎲', '💫', '🦈', '🐍'];

export const BOT_NAMES = [
  'SmartBot Alpha', 'NeuralNet X', 'CyberStrike', 'PixelMind',
  'BitCrusher', 'SyntheticPro', 'DataForge', 'LogicPrime',
  'TurboAI', 'QuantumBot', 'IronCalc',
];

export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const generatePlayerId = () => `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
export const generateBotId = () => `bot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

export const createPlayerStats = () => ({
  runs: 0,
  ballsFaced: 0,
  wickets: 0,
  ballsBowled: 0,
  runsConceded: 0,
  dismissals: 0,
});

export const createMatchState = () => ({
  battingTeam: null,
  bowlingTeam: null,
  tossChoice: null,
  activeBatterId: null,
  activeBowlerId: null,
  innings: 1,
  target: null,
  score: { batting: 0, bowling: 0 },
  wickets: { batting: 0, bowling: 0 },
  ballsBowled: 0,
  lockedMoves: { batterMove: null, bowlerMove: null },
  currentOverLog: [],
  ballLog: [],
  deliveryCounter: 0,
  usedBowlersThisOver: [],
  lastOverBowlerId: null,
  inningsResults: [],
  resultMeta: null,
  playerStats: {},
  deadline: null,
});

export const createSuperOverState = () => ({
  teamASelections: { batters: [], bowler: null },
  teamBSelections: { batters: [], bowler: null },
  teamALocked: false,
  teamBLocked: false,
  innings: 1,
  battingTeam: null,
  bowlingTeam: null,
  activeBatterId: null,
  activeBowlerId: null,
  currentBatterIndex: 0,
  score: { teamA: 0, teamB: 0 },
  wickets: { teamA: 0, teamB: 0 },
  ballsBowled: 0,
  ballLog: [],
  lockedMoves: { batterMove: null, bowlerMove: null },
  target: null,
  deadline: null,
});

export const defaultSettings = {
  maxPlayers: 4,
  oversPerInnings: 2,
  seriesLength: 1,
  currentMatch: 1,
};

/**
 * Adapter: Transforms the flat Firebase namespace back into the shape
 * expected by the 11 React UI views.
 */
export const mapFirebaseToState = (fb, localState) => {
  if (!fb || !fb.meta) {
    return null; // Room not ready or invalid
  }

  // Fallbacks for arrays/objects that Firebase drops when empty
  const players = fb.players || {};
  
  const teams = {
    teamA: fb.teams?.teamA ? { ...fb.teams.teamA, roster: fb.teams.teamA.roster || [] } : null,
    teamB: fb.teams?.teamB ? { ...fb.teams.teamB, roster: fb.teams.teamB.roster || [] } : null,
  };

  const draftPool = fb.draft?.pool || [];
  
  const matchTossMoves = { captainA: null, captainB: null, ...(fb.matchToss?.moves || {}) };
  const tossMoves = { captainA: null, captainB: null, ...(fb.toss?.moves || {}) };

  const match = fb.match || createMatchState();
  
  const superOver = fb.superOver ? {
    ...fb.superOver,
    teamASelections: {
      batters: fb.superOver.teamASelections?.batters || [],
      bowler: fb.superOver.teamASelections?.bowler || null
    },
    teamBSelections: {
      batters: fb.superOver.teamBSelections?.batters || [],
      bowler: fb.superOver.teamBSelections?.bowler || null
    },
    ballLog: fb.superOver.ballLog || [],
    lockedMoves: { batterMove: null, bowlerMove: null, ...(fb.superOver.lockedMoves || {}) },
    score: { teamA: 0, teamB: 0, ...(fb.superOver.score || {}) },
    wickets: { teamA: 0, teamB: 0, ...(fb.superOver.wickets || {}) }
  } : createSuperOverState();

  const series = fb.series || { scores: { teamA: 0, teamB: 0 }, results: [], winner: null };

  return {
    phase: fb.meta.status,
    roomCode: localState.roomCode,
    hostId: fb.meta.hostId,
    currentPlayerId: localState.userId,

    settings: fb.settings || defaultSettings,
    players,
    captains: fb.captains || { teamA: null, teamB: null },
    teams,
    
    draftPool,
    draftTurn: fb.draft?.turn || 'teamA',
    draftTimer: DRAFT_TIMER, // UI handles countdown locally
    selectionTimer: SELECTION_TIMER, // UI handles countdown locally

    tossAssignment: { odd: null, even: null, ...(fb.toss?.assignment || {}) },
    tossMoves,
    tossWinner: fb.toss?.winner || null,

    matchTossAssignment: { odd: null, even: null, ...(fb.matchToss?.assignment || {}) },
    matchTossMoves,
    matchTossWinner: fb.matchToss?.winner || null,

    ...match,
    lockedMoves: { batterMove: null, bowlerMove: null, ...(match.lockedMoves || {}) },
    currentOverLog: match.currentOverLog || [],
    ballLog: match.ballLog || [],
    usedBowlersThisOver: match.usedBowlersThisOver || [],
    inningsResults: match.inningsResults || [],
    playerStats: match.playerStats || {},
    score: { batting: 0, bowling: 0, ...(match.score || {}) },
    wickets: { batting: 0, bowling: 0, ...(match.wickets || {}) },

    superOver,

    seriesScores: series.scores || { teamA: 0, teamB: 0 },
    matchResults: series.results || [],
    seriesWinner: series.winner || null,
    resultMeta: fb.resultMeta || null,
  };
};
