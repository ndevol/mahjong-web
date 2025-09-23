import React, { useState } from "react";
import axios from "axios";
import Tile from "./tile";
import "./App.css";

function App() {
  const [hands, setHands] = useState([]);
  const [remaining, setRemaining] = useState([]);

  const startGame = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/start_game");
      setHands(res.data.hands);
      setRemaining(res.data.remaining_tiles);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  };

  if (hands.length === 0) {
    return (
      <div className="start-screen">
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  return (
    <div className="table">
      {/* Top Hand */}
      <div className="hand top">
        {hands[1].map((tile, i) => (
          <Tile key={i} faceUp={false} />
        ))}
      </div>

      {/* Left + Right + Center */}
      <div className="middle-row">
        <div className="hand left">
          {hands[2].map((tile, i) => (
            <Tile key={i} faceUp={false} />
          ))}
        </div>

        {/* Remaining Tiles in center */}
        <div className="remaining">
          {remaining.slice(0, 36).map((tile, i) => (
            <Tile key={i} faceUp={false} />
          ))}
        </div>

        <div className="hand right">
          {hands[3].map((tile, i) => (
            <Tile key={i} faceUp={false} />
          ))}
        </div>
      </div>

      {/* Bottom Hand (player) */}
      <div className="hand bottom">
        {hands[0].map((tile, i) => (
          <Tile key={i} tile={tile} faceUp={true} />
        ))}
      </div>
    </div>
  );
}

export default App;
