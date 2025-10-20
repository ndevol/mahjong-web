import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import Tile from "./tile";
import "./App.css";

function App() {
  const [hands, setHands] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [playerHands, setPlayerHands] = useState([[], [], [], []]);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0: bottom, 1: right, 2: top, 3: left
  const [gamePhase, setGamePhase] = useState('not_started'); // 'not_started', 'draw', 'discard', 'waiting'
  const [lastDiscarded, setLastDiscarded] = useState(null);
  const [timerProgress, setTimerProgress] = useState(100);

  const TIMER_DURATION = 3000; // milliseconds

  const drawTile = useCallback(() => {
    if (remaining.length === 0) return;
    
    const newTile = remaining[0];
    console.log("Player ", currentPlayer, "drew tile:", newTile);
    const newRemaining = remaining.slice(1);
    setRemaining(newRemaining);

    setPlayerHands(prevHands => {
      const newHands = [...prevHands];
      newHands[currentPlayer] = [...prevHands[currentPlayer], newTile];
      return newHands;
    });

    setGamePhase('discard');
  }, [remaining, currentPlayer]);

  const discardTile = useCallback((tile) => {
    console.log("Player", currentPlayer, "Discarded tile:", tile);
    setLastDiscarded(tile);
    setPlayerHands(prevHands => {
      const newHands = [...prevHands];
      newHands[currentPlayer] = prevHands[currentPlayer].filter(t => t.id !== tile.id);
      return newHands;
    });
    setGamePhase('waiting');
  }, [currentPlayer]);

  const startGame = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/start_game");
      setHands(res.data.hands);
      setRemaining(res.data.remaining_tiles);
      setPlayerHands(res.data.hands);
      setGamePhase('draw');
      setCurrentPlayer(0);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  };

  // End game if no remaining tiles
  useEffect(() => {
    if (gamePhase != 'not_started' && remaining.length === 0) {
      alert("Game over! No remaining tiles.");
    }
  }, [remaining]);

  // Draw tiles when gamePhase changes to 'draw'
  useEffect(() => {
    if (currentPlayer === 0 && gamePhase === 'draw') {
      drawTile();
    }
  }, [currentPlayer, gamePhase, drawTile]);

  // Handle computer turns
  useEffect(() => {
    if (currentPlayer != 0 && gamePhase === 'draw') {
      // Computer draws a tile
      setTimeout(() => {
        drawTile();
        // Computer discards the oldest tile in their hand
        setTimeout(() => {
          discardTile(playerHands[currentPlayer][0]);
        }, 1000);
      }, 500);
    }
  }, [currentPlayer, gamePhase, drawTile, discardTile, playerHands]);

  // Handle waiting period timer
  useEffect(() => {
    if (gamePhase === 'waiting') {
      let startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.max(0, 100 - (elapsed / TIMER_DURATION) * 100);
        setTimerProgress(progress);
        
        if (progress === 0) {
          clearInterval(timer);
          // Move to next player
          setCurrentPlayer((prev) => (prev + 1) % 4);
          setGamePhase('draw');
          setTimerProgress(100);
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [gamePhase]);

  // Handle tile click for human player
  const handleTileClick = (tile) => {
    if (currentPlayer === 0 && gamePhase === 'discard') {
      discardTile(tile);
    }
  };

  if (gamePhase === 'not_started') {
    return (
      <div className="start-screen">
        <button className="start-button" onClick={startGame}>Start Game</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header"></div>
      <div className="player-vertical" id="player-left">
        <div className="hand">
          {playerHands[3].map((tile) => (
            <Tile key={tile.id} tile={tile} faceUp={false} />
          ))}
        </div>
        <div className="pairs"></div>
      </div>
      <div className="player-horizontal" id="player-top">
        <div className="hand">
          {playerHands[2].map((tile) => (
            <Tile key={tile.id} tile={tile} faceUp={false} />
          ))}
        </div>
        <div className="pairs"></div>
      </div>
      <div className="middle">
        {gamePhase === 'waiting' && lastDiscarded && (
          <>
            <div className="centered-tile">
              <Tile tile={lastDiscarded} faceUp={true} />
            </div>
            <div className="timer-bar">
              <div 
                className="timer-progress" 
                style={{ width: `${timerProgress}%` }} 
              />
            </div>
          </>
        )}
      </div>
      <div className="player-vertical" id="player-right">
        <div className="pairs"></div>
        <div className="hand">
          {playerHands[1].map((tile) => (
            <Tile key={tile.id} tile={tile} faceUp={false} />
          ))}
        </div>
      </div>
      <div className="player-horizontal" id="player-bottom">
        <div className="pairs"></div>
          <div className="hand">
            {playerHands[0].map((tile) => (
              <Tile 
                key={tile.id} 
                tile={tile} 
                faceUp={true}
                canDiscard={currentPlayer === 0 && gamePhase === 'discard'}
                onClick={handleTileClick}
              />
            ))}
          </div>
      </div>
    </div>
  )
}

export default App;
