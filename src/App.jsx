import React, { useState } from "react";
import axios from "axios";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import Tile from "./tile";
import SortableTile from "./tileSortable";
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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlayerHands((prevHands) => {
        const currentHand = prevHands.bottom;
        const oldIndex = currentHand.findIndex(tile => tile.id === active.id);
        const newIndex = currentHand.findIndex(tile => tile.id === over.id);
        // Safety check: ensure both tiles are found
        if (oldIndex === -1 || newIndex === -1) return prevHands;

        return {
          ...prevHands,
          bottom: arrayMove(currentHand, oldIndex, newIndex),
        };
      });
    }
  }

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
      <div className="middle"></div>
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={playerHands.bottom.map(tile => tile.id)}> 
            <div className="hand">
              {playerHands.bottom.map((tile) => (
                <SortableTile key={tile.id} id={tile.id} tile={tile} faceUp={true} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

export default App;
