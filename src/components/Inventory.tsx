import React from "react";
import crateData from "../data/items.json";

interface InventoryProps {
  inventory: Record<string, number>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory }) => {
  return (
    // Inventory Container
    <div className="container opacity-85 mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
      {Object.entries(inventory).map(([key, count]) => {
        const [itemName, itemType] = key.split("-");
        const item = Object.values(crateData.items).find(
          (i) => i.name === itemName && i.type === itemType
        );
        return (
          item && (
            <div
              key={key}
              className="relative group cursor-pointer space-y-10 w-[300px] h-full "
            >
              {/* Inventory Item Container */}
              <div className="w-full group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl flex items-center justify-center border-2 border-gray-700">
                {/* Inventory Item Image */}
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-48 h-48 object-contain transition-transform duration-300 group-hover:scale-150"
                />
                {/* Inventory Item Count */}
                <div className="bg-black absolute top-0 left-0 w-10 h-10 rounded-md">
                  <div className="absolute top-0 left-2 text-yellow-400 p-2 rounded-full text-sm font-bold">
                    {count}
                  </div>
                </div>
              </div>
              {/* Inventory Item Details */}
              <div className="absolute bottom-0 left-0 w-full bg-gray-400 bg-opacity-10 rounded-xl text-white p-2 rounded-b-lg text-center">
                <h3 className="text-lg font-bold w-full">{item.name}</h3>
                <p className="text-gray-400">{item.type}</p>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Inventory;
