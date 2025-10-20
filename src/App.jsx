import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import Tile from "./tile";
import "./App.css";

function App() {
  const [hands, setHands] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [playerHands, setPlayerHands] = useState({
        top: [],
        bottom: [],
        left: [],
        right: []
  });
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0: bottom, 1: right, 2: top, 3: left
  const [gamePhase, setGamePhase] = useState('draw'); // 'draw', 'discard', 'waiting'
  const [selectedTile, setSelectedTile] = useState(null);
  const [lastDiscarded, setLastDiscarded] = useState(null);
  const [timerProgress, setTimerProgress] = useState(100);

  const TIMER_DURATION = 3000; // milliseconds

  const drawTile = useCallback(() => {
    if (remaining.length === 0) return;
    
    const newTile = { ...remaining[0], isNew: true};
    console.log("Drew tile:", newTile);
    const newRemaining = remaining.slice(1);
    setRemaining(newRemaining);
    
    setPlayerHands(prev => {
      const positions = ['bottom', 'left', 'top', 'right'];
      const position = positions[currentPlayer];
      return {
        ...prev,
        [position]: [...prev[position], newTile]
      };
    });

    // Remove the isNew flag after animation
    setTimeout(() => {
      setPlayerHands(prev => {
        const positions = ['bottom', 'left', 'top', 'right'];
        const position = positions[currentPlayer];
        return {
          ...prev,
          [position]: prev[position].map(tile => ({
            ...tile,
            isNew: false
          }))
        };
      });
    }, 1000); // Match animation duration
    
    setGamePhase('discard');
  }, [remaining, currentPlayer]);

  const discardTile = useCallback((tile) => {
    console.log("Discarded tile:", tile);
    setLastDiscarded(tile);
    setPlayerHands(prev => {
      const positions = ['bottom', 'left', 'top', 'right'];
      const position = positions[currentPlayer];
      return {
        ...prev,
        [position]: prev[position].filter(t => t.id !== tile.id)
      };
    });
    setGamePhase('waiting');
  }, [currentPlayer]);

  const startGame = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/start_game");
      setHands(res.data.hands);
      setRemaining(res.data.remaining_tiles);
      setPlayerHands({
        top: res.data.hands[0],
        bottom: res.data.hands[0],
        left: res.data.hands[0],
        right: res.data.hands[0]
      });
      setGamePhase('draw');
      setCurrentPlayer(0);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  };

  // Handle initial draw
  useEffect(() => {
    if (gamePhase === 'draw' && remaining.length > 0) {
      drawTile();
    }
  }, [gamePhase, remaining.length, drawTile]);

  // Handle computer turns
  useEffect(() => {
    if (currentPlayer === 0 && gamePhase === 'draw') {
      // Computer draws a tile
      setTimeout(() => {
        drawTile();
        // Computer discards the last tile they drew
        setTimeout(() => {
          const positions = ['bottom', 'left', 'top', 'right'];
          const position = positions[currentPlayer];
          const lastTile = playerHands[position][playerHands[position].length - 1];
          discardTile(lastTile);
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

  // Handle tile hover for human player
  const handleTileHover = (tileId) => {
    if (currentPlayer === 0 && gamePhase === 'discard') {
      setSelectedTile(tileId);
    }
  };

  // Handle tile click for human player
  const handleTileClick = (tile) => {
    if (currentPlayer === 0 && gamePhase === 'discard') {
      discardTile(tile);
    }
  };

  if (hands.length === 0) {
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
          {playerHands.left.map((tile, i) => (
            <Tile key={i} tile={tile} faceUp={false} />
          ))}
        </div>
        <div className="pairs"></div>
      </div>
      <div className="player-horizontal" id="player-top">
        <div className="hand">
          {playerHands.top.map((tile, i) => (
            <Tile key={i} tile={tile} faceUp={false} />
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
          {playerHands.right.map((tile, i) => (
            <Tile key={i} tile={tile} faceUp={false} />
          ))}
        </div>
      </div>
      <div className="player-horizontal" id="player-bottom">
        <div className="pairs"></div>
          <div className="hand">
            {playerHands.bottom.map((tile, i) => (
              <Tile
                key={i}
                tile={tile}
                faceUp={true}
              />
            ))}
          </div>
      </div>
    </div>
  )
}

export default App;
