// src/Tile.js
import React from "react";
import "./App.css";

export default function Tile({ tile, faceUp }) {
  // In a real app you’d import actual SVGs for each tile.
  // For demo, we’ll just render text or a generic back.
  if (!faceUp) {
    return <div className="tile back">🀫</div>;
  }

  return (
    <div className="tile">
      {tile.suit}-{tile.value}
    </div>
  );
}
