import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GameProvider } from './context/GameContext.jsx'
import { MultiplayerProvider } from './context/MultiplayerContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>
      <MultiplayerProvider>
        <App />
      </MultiplayerProvider>
    </GameProvider>
  </StrictMode>,
)
