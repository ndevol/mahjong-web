import React, { useState } from "react";
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
    } catch (err) {
      console.error("Error starting game:", err);
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
      <div className="game-container">
        <div className="vertical-flex">
          <div className="horizontal-player-container">
            <div className="hand top">
              {playerHands.top.map((tile, i) => (
                <Tile key={i} tile={tile} faceUp={false} />
              ))}
            </div>
            <div className="pairs top"></div>
          </div>
          <div className="middle-flex">
            <div className="vertical-player-container">
              <div className="hand left">
                {/* {playerHands.left.map((tile, i) => (
                  <Tile key={i} tile={tile} faceUp={false} />
                ))} */}
              </div>
              <div className="pairs left"></div>
            </div>
            <div className="middle"></div>
            <div className="vertical-player-container">
              <div className="hand right">
                {/* {playerHands.right.map((tile, i) => (
                  <Tile key={i} tile={tile} faceUp={false} />
                ))} */}
              </div>
              <div className="pairs right"></div>
            </div>
          </div>
          <div className="horizontal-player-container">
            <div className="hand bottom">
              {playerHands.bottom.map((tile, i) => (
                <Tile key={i} tile={tile} faceUp={true} />
              ))}
            </div>
            <div className="pairs bottom"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
