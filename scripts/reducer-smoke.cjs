require('sucrase/register/jsx');

const { gameReducer } = require('../src/context/GameContext.jsx');

let state = gameReducer(undefined, { type: '@@INIT' });
state = gameReducer(state, { type: 'START_VS_COMPUTER' });
state = gameReducer(state, { type: 'UPDATE_SERIES_LENGTH', payload: 3 });
state = gameReducer(state, { type: 'UPDATE_OVERS', payload: 1 });
state = gameReducer(state, { type: 'UPDATE_TIMER', payload: 5 });
state = gameReducer(state, { type: 'START_MATCH' });
state = gameReducer(state, { type: 'SUBMIT_TOSS_MOVE', payload: { who: 'player', move: 3 } });
state = gameReducer(state, { type: 'SUBMIT_TOSS_MOVE', payload: { who: 'bot', move: 2 } });
state = gameReducer(state, { type: 'CHOOSE_BAT_BOWL', payload: { choice: 'bat' } });

for (const pair of [
  [1, 2],
  [6, 5],
  [4, 3],
  [2, 1],
  [3, 4],
  [5, 6],
]) {
  state = gameReducer(state, { type: 'SUBMIT_MATCH_MOVE', payload: { role: 'batter', move: pair[0] } });
  state = gameReducer(state, { type: 'SUBMIT_MATCH_MOVE', payload: { role: 'bowler', move: pair[1] } });
  state = gameReducer(state, { type: 'PROCESS_RESOLUTION' });
}

const firstInnings = {
  phase: state.currentPhase,
  target: state.target,
  innings: state.innings,
  score: state.score,
  series: state.series_scores,
  timer: state.match_settings.timer_duration,
  ballLog: state.ball_log.length,
};

if (state.currentPhase === 'INNINGS_BREAK') {
  state = gameReducer(state, { type: 'ADVANCE_INNINGS' });
}

state = gameReducer(state, { type: 'SUBMIT_MATCH_MOVE', payload: { role: 'batter', move: 6 } });
state = gameReducer(state, { type: 'SUBMIT_MATCH_MOVE', payload: { role: 'bowler', move: 1 } });
state = gameReducer(state, { type: 'PROCESS_RESOLUTION' });

const secondInnings = {
  phase: state.currentPhase,
  innings: state.innings,
  score: state.score,
  series: state.series_scores,
  result: state.result_meta,
  matchResults: state.match_results.length,
  seriesWinner: state.series_winner,
};

console.log(
  JSON.stringify(
    {
      firstInnings,
      secondInnings,
    },
    null,
    2,
  ),
);
