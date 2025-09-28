import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'; 
import "./App.css";

const svgs = import.meta.glob('./assets/tiles/*.svg', { eager: true });

export default function Tile({ id, tile, faceUp }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1, 
    border: isDragging ? '1px solid black' : null,
    cursor: 'grab',
  };


  // If we don't yet have a tile, render a placeholder
  if (!tile && faceUp) {
    return <div ref={setNodeRef} className="tile placeholder" />;
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
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="tile"
    >
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
