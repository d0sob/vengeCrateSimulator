import React, { useState } from "react";
import crateData from "./data/items.json";

interface Item {
  id: string;
  name: string;
  thumbnail: string;
  filename: string;
  color: string;
  rarity: string;
  owner: string;
  type: string;
  count: number;
}

function CrateBox({
  level,
  name,
  onOpen,
  image,
}: {
  level: string;
  name: string;
  onOpen: () => void;
  image: string;
}) {
  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 w-full max-w-xs"
      onClick={onOpen}
    >
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-700 group-hover:border-yellow-500">
        <img
          src={image}
          alt={name}
          className="w-48 h-48 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white p-2 rounded-b-lg text-center">
        <h3 className="text-lg font-bold w-full">{name}</h3>
      </div>
    </div>
  );
}

function App() {
  const [openingCrate, setOpeningCrate] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  function openCrate(crateLevel: string) {
    const crate = crateData.crates[crateLevel];
    if (!crate) return;

    setOpeningCrate(crateLevel);

    setTimeout(() => {
      const rarityPool: string[] = [];
      Object.entries(crate.rarityDrops).forEach(([rarity, chance]) => {
        for (let i = 0; i < chance; i++) {
          rarityPool.push(rarity);
        }
      });
      const selectedRarity =
        rarityPool[Math.floor(Math.random() * rarityPool.length)];
      const filteredItems = Object.values(crateData.items).filter(
        (item) => item.rarity === selectedRarity
      );
      const selectedItem =
        filteredItems.length > 0
          ? filteredItems[Math.floor(Math.random() * filteredItems.length)]
          : null;

      setSelectedItem(selectedItem);
      setOpeningCrate(null);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <header className="text-center">
        <img
          src="https://venge.io/files/assets/182916517/1/Logo.png"
          alt="Venge.io"
          className="h-16 inline"
        />
        <h1 className="text-4xl py-2 font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Crate Simulator
        </h1>
        <p className="mt-3 text-gray-400">A fun way to test your luck!</p>
      </header>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {Object.entries(crateData.crates).map(([level, crate]) => (
          <CrateBox
            key={level}
            level={level}
            name={crate.name}
            image={crate.image}
            onOpen={() => openCrate(level)}
          />
        ))}
      </div>

      {openingCrate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="text-center animate-pulse">
            <img
              src={crateData.crates[openingCrate].image}
              alt="Opening Crate"
              className="w-48 h-48 mx-auto"
            />
            <p className="text-yellow-400 mt-3 text-lg font-semibold">
              Opening...
            </p>
          </div>
        </div>
      )}

      {selectedItem && !openingCrate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
            <img
              src={selectedItem.thumbnail}
              alt={selectedItem.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: `#${selectedItem.color}` }}
              >
                {selectedItem.rarity}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-3">{selectedItem.name}</h3>
            <p className="text-gray-400">Owner: {selectedItem.owner}</p>
            <button
              onClick={() => setSelectedItem(null)}
              className="mt-5 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all"
            >
              Continue Opening
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
