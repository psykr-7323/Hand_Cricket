require('sucrase/register/jsx');

const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('../src/App.jsx').default;
const { GameProvider } = require('../src/context/GameContext.jsx');
const { MultiplayerProvider } = require('../src/context/MultiplayerContext.jsx');

try {
  const html = renderToString(
    React.createElement(
      GameProvider,
      null,
      React.createElement(
        MultiplayerProvider,
        null,
        React.createElement(App),
      ),
    ),
  );
  console.log(`rendered:${html.length}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
