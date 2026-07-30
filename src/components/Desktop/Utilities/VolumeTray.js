import React, { useEffect, useRef, useState } from "react";
import "../../../styles/Desktop/VolumeTray.css";

function SpeakerIcon({ muted }) {
  return (
    <svg viewBox="0 0 16 16" className="volume-tray-icon" shapeRendering="crispEdges">
      <rect x="1" y="6" width="3" height="4" fill="#000" />
      <polygon points="4,6 7,3 7,13 4,10" fill="#000" />
      {!muted && (
        <>
          <rect x="9" y="6" width="1" height="4" fill="#000" />
          <rect x="11" y="4" width="1" height="8" fill="#000" />
        </>
      )}
      {muted && <rect x="9" y="7.5" width="5" height="1.5" fill="#c00000" />}
    </svg>
  );
}

function VolumeTray() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="volume-tray-wrap" ref={wrapRef}>
      <button className="volume-tray-btn" onClick={() => setOpen((prev) => !prev)} title="Volume">
        <SpeakerIcon muted={muted} />
      </button>

      {open && (
        <div className="volume-flyout win95-raised">
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <label className="volume-mute-row">
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
            Mute
          </label>
        </div>
      )}
    </div>
  );
}

export default VolumeTray;
