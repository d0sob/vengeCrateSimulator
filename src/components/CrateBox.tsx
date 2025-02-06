import React, { useState } from "react";
import { useSound } from "../hooks/sounds"; // Import sound hook

interface CrateProps {
  level: string;
  name: string;
  onOpen: () => void;
  image: string;
  rarityDrops: Record<string, number>;
  itemCount: number;
}

const CrateBox: React.FC<CrateProps> = ({
  level,
  name,
  onOpen,
  image,
  rarityDrops,
  itemCount,
}) => {
  const [showDropRates, setShowDropRates] = useState(false);
  const { playClickSound, playHoverSound } = useSound(); // Use sounds

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 w-full max-w-xs"
      onClick={() => {
        playClickSound();
        onOpen();
      }}
      onMouseEnter={() => {
        setShowDropRates(true);
        playHoverSound();
      }}
      onMouseLeave={() => setShowDropRates(false)}
    >
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-700 group-hover:border-yellow-500">
        <img
          src={image}
          alt={name}
          className="w-64 h-64 object-contain transition-transform duration-300 group-hover:scale-110"
        />
        {itemCount > 0 && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-black p-2 rounded-full text-xs font-bold">
            {itemCount}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white p-2 rounded-b-lg text-center">
        <h3 className="text-lg font-bold w-full">{name}</h3>
      </div>

      {showDropRates && (
        <div className="absolute top-0 left-0 w-full bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-lg text-sm">
          <h4 className="font-semibold text-yellow-400">Drop Rates:</h4>
          <ul>
            {Object.entries(rarityDrops).map(([rarity, chance]) => (
              <li key={rarity}>
                {rarity}: {chance}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CrateBox;
