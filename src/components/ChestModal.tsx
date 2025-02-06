import React from "react";
import crateData from "../data/items.json";
import { useSound } from "../hooks/useSounds";
import { CrateLevel, Item } from "../types/Item";

interface ModalProps {
  openingCrate: string | null;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
}

const Modal: React.FC<ModalProps> = ({
  openingCrate,
  selectedItem,
  setSelectedItem,
}) => {
  const { playClickSound, playHoverSound } = useSound();
  return (
    <>
      {openingCrate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="text-center animate-pulse">
            <img
              src={crateData.crates[openingCrate as CrateLevel].image}
              alt="Opening Crate"
              className="w-128 h-128 mx-auto"
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
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `#${
                    crateData.colors[
                      selectedItem.rarity as keyof typeof crateData.colors
                    ]
                  }`, // Use color from crateData
                }}
              >
                {selectedItem.rarity} {/* Display the rarity here */}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-3">{selectedItem.name}</h3>
            <p className="text-gray-400">Creator: {selectedItem.owner}</p>
            <button
              onClick={() => setSelectedItem(null)}
              onPointerDown={playClickSound}
              onMouseEnter={playHoverSound}
              className="mt-5 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all"
            >
              Continue Opening
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
