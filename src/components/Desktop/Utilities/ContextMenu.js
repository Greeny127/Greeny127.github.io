import React, { useEffect, useRef } from "react";
import "../../../styles/Desktop/ContextMenu.css";

/**
 * Generic Win95-style right-click context menu.
 * items: [{ label, onClick, disabled? } | { divider: true }]
 */
function ContextMenu({ x, y, items, onClose }) {
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

  // Keep the menu on-screen near the right/bottom edges.
  const style = { left: x, top: y };
  if (typeof window !== "undefined") {
    if (x > window.innerWidth - 180) style.left = window.innerWidth - 180;
    if (y > window.innerHeight - items.length * 26 - 20) style.top = y - (items.length * 26 + 10);
  }

  return (
    <div className="ctx-menu win95-raised" style={style} ref={menuRef}>
      {items.map((item, idx) =>
        item.divider ? (
          <div className="ctx-divider" key={`divider-${idx}`} />
        ) : (
          <button
            key={item.label}
            className="ctx-item"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}

export default ContextMenu;
