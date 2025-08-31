import React, { useState, useRef, useEffect } from "react";

function VideoPlayer({ sources, width = "w-96", height = "h-56" }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1 % sources.length);
  const [showFirst, setShowFirst] = useState(true);

  const videoRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    // Auto start first video
    const v = videoRefs[0].current;
    if (v) v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnded = () => {
    const activeIndex = showFirst ? 1 : 0;
    const activeRef = videoRefs[activeIndex].current;

    // preload and play next
    if (activeRef) {
      activeRef.currentTime = 0;
      activeRef.play().catch(() => {});
    }

    setShowFirst(!showFirst);
    setCurrent(next);

    // if we reached last, go back to 0
    setNext((next + 1) % sources.length);
  };

  return (
    <div
      className={`relative ${width} ${height} mx-auto rounded-2xl shadow-2xl overflow-hidden 
      border border-gray-300 bg-gray-900 group`}
    >
      {/* Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10 pointer-events-none"></div>

      {/* Video A */}
      <video
        ref={videoRefs[0]}
        src={sources[current]}
        muted
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
          ${showFirst ? "opacity-100" : "opacity-0"}`}
      />

      {/* Video B */}
      <video
        ref={videoRefs[1]}
        src={sources[next]}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
          ${showFirst ? "opacity-0" : "opacity-100"}`}
      />

      {/* Hover Border Highlight */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-500/70 rounded-2xl transition"></div>
    </div>
  );
}

export default VideoPlayer;

