import React from "react";
import "./App.css";

const svgs = import.meta.glob('./assets/tiles/*.svg', { eager: true });

export default function Tile({ tile, faceUp, isSelected  }) {
  // If we don't yet have a tile, render a placeholder
  if (!tile && faceUp) {
    return <div className="tile placeholder" />;
  }

  const suit = tile?.suit ?? '';
  const value = tile?.value ?? '';

  const key = faceUp
    ? `./assets/tiles/${suit}-${value}.svg`
    : `./assets/tiles/Back.svg`;

  const SvgURL = svgs[key]?.default; // ❗ safe optional chaining

  if (!SvgURL) {
    console.log(`${suit} ${value} not found`);
  }

  return (
    <div className={`tile ${isSelected ? 'selected' : ''} ${tile.isNew ? 'new-tile' : ''}`}>
      {SvgURL ? (
        <img
          src={SvgURL}
          alt={faceUp ? `${suit} ${value}` : 'Back'}
        />
      ) : (
        <span>?</span> // fallback if SVG not found
      )}
    </div>
  );
}
