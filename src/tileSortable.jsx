import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Tile from './tile';


export default function SortableTile({ id, tile, faceUp, onHover, onClick }) {
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
    border: isDragging ? '2px solid black' : null,
    cursor: 'grab',
  };

  const handleClick = (e) => {
    if (!isDragging && onClick) {
      onClick(tile);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onMouseEnter={() => onHover && onHover(id)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <Tile tile={tile} faceUp={faceUp} isSelected={tile.id === id} />
    </div>
  );
}