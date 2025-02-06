import React, { useState, useEffect } from "react";

const bgImages = [
  "./bgs/Sierra-Large.jpg",
  "./bgs/Xibalba-Large.jpg",
  "./bgs/Mistle-Large.jpg",
  "./bgs/Runes-Large.jpg",
  "./bgs/SandstormBlitz-Large.jpg",
  "./bgs/Temple-Large.jpg",
  "./bgs/Tundra-Large.jpg",
];

const Background: React.FC = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out

      setTimeout(() => {
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
        setFade(true); // Start fading in after the image changes
      }, 1000); // Duration of fade-out before switching
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImages[currentBgIndex]})`,
        opacity: fade ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        filter: "blur(10px) brightness(0.5)",
      }}
    ></div>
  );
};

export default Background;
