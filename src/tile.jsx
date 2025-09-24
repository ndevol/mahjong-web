import React from "react";
import "./App.css";

const svgs = import.meta.glob('./assets/tiles/*.svg', { eager: true });

export default function Tile({ tile, faceUp }) {
  const suit = String(tile?.suit ?? '');
  const value = String(tile?.value ?? '');

  if (!faceUp) {
    const key = `./assets/tiles/Back.svg`;
    const SvgURL = svgs[key].default;

    return (
    <div className="tile">
      <img src={SvgURL} alt={`${suit} ${value}`} />
    </div>
  );
  }

  const key = `./assets/tiles/${suit}-${value}.svg`;
  const SvgURL = svgs[key].default;

  return (
    <div className="tile">
      <img src={SvgURL} alt={`${suit} ${value}`} />
    </div>
  );
}


// export default function Tile({ tile, faceUp }) {
//   // In a real app you’d import actual SVGs for each tile.
//   // For demo, we’ll just render text or a generic back.
//   if (!faceUp) {
//     return <div className="tile back"></div>;
//   }

//   return (
//     <div className="tile">
//       {tile.suit}-{tile.value}
//     </div>
//   );
// }
