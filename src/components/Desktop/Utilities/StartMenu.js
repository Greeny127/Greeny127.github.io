import React, { useEffect, useRef } from "react";
import shutdownIcon from "../../../Icons/Programs/shutdown.svg";
import "../../../styles/Desktop/StartMenu.css";

function StartMenu({ apps, onOpenApp, onShutdown, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="start-menu win95-raised" ref={menuRef}>
      <div className="start-menu-banner">
        <span className="start-menu-banner-text">Portfolio 98</span>
      </div>
      <div className="start-menu-items">
        {apps.map((app) => (
          <button
            key={app.tag}
            className="start-menu-item"
            onClick={() => {
              onOpenApp(app);
              onClose();
            }}
          >
            <img src={app.iconPath} alt="" className="start-menu-item-icon" />
            <span>{app.title}</span>
          </button>
        ))}
        <div className="start-menu-divider" />
        <button
          className="start-menu-item"
          onClick={() => {
            onShutdown();
            onClose();
          }}
        >
          <img src={shutdownIcon} alt="" className="start-menu-item-icon" />
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  );
}

export default StartMenu;
