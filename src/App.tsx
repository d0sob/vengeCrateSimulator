import React, { useState, useEffect } from "react";
import CrateBox from "./components/CrateBox";
import Inventory from "./components/Inventory";
import Modal from "./components/ChestModal";
import Header from "./components/Header";
import Background from "./components/Background";
import crateData from "./data/items.json";
import { useBackgroundMusic } from "./hooks/useSounds";
import { useCrateOpening } from "./hooks/useCrateOpeningLogic";
import { useInventoryStorage } from "./hooks/useInventoryStorage";

const App: React.FC = () => {
  const [showInventory, setShowInventory] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const {
    selectedItem,
    openingCrate,
    openCrate,
    setSelectedItem,
    inventory,
    setInventory,
  } = useCrateOpening();

  const { inventory: storedInventory, setInventory: setStoredInventory } =
    useInventoryStorage();

  useEffect(() => {
    if (Object.keys(storedInventory).length > 0) {
      setInventory(storedInventory); // Set state if loaded from localStorage
    }
  }, [storedInventory, setInventory]);

  //Background music Implementation
  useBackgroundMusic(isAudioPlaying);
  const toggleAudio = () => setIsAudioPlaying((prev) => !prev);
  const toggleInventory = () => setShowInventory((prev) => !prev);

  return (
    <div className="min-h-screen text-white flex flex-col items-center py-10">
      {/* Background Component */}
      <Background />

      {/* Header Section */}
      <Header
        toggleInventory={toggleInventory}
        toggleAudio={toggleAudio}
        isAudioPlaying={isAudioPlaying}
        showInventory={showInventory}
      />

      {/* Crate List or Inventory */}
      {!showInventory ? (
        <div className="container opacity-85 mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {Object.entries(crateData.crates).map(([level, crate]) => (
            <CrateBox
              key={level}
              level={level}
              name={crate.name}
              image={crate.image}
              rarityDrops={crate.rarityDrops}
              itemCount={inventory[crate.name] || 0}
              onOpen={() => openCrate(level, setInventory)}
            />
          ))}
        </div>
      ) : (
        <Inventory inventory={inventory} />
      )}

      {/* Modals for opening crates and revealing items */}
      <Modal
        openingCrate={openingCrate}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      {/* Footer */}
      <div className="z-10 bottom-4 w-full text-center text-gray-500">
        <p className="text-sm">
          &copy; Made by <span className="text-yellow-400">d0sob</span>
        </p>
      </div>
    </div>
  );
};

export default App;
