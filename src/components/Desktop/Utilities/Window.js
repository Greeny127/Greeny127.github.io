import React, { useState } from "react";
import Draggable from 'react-draggable';
import "../../../styles/Desktop/Window.css";

/**
 * Window component that allows dragging and handles focus.
 *
 * @param {Object} props - The props object.
 * @return {JSX.Element} The rendered Window component.
 */

function Window({windowHandle, windowContent, tag, windowListHandler, isFocused}) {
  const [defaultPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 20, y: 20 };
    }

    const defaultWidth = Math.min(Math.max(window.innerWidth * 0.55, 360), window.innerWidth * 0.94);
    const defaultHeight = Math.min(Math.max(window.innerHeight * 0.6, 260), window.innerHeight * 0.86);

    return {
      x: Math.max((window.innerWidth - defaultWidth) / 2, 8),
      y: Math.max((window.innerHeight - defaultHeight) / 2, 8),
    };
  });

  return (
    // Wrap the window with Draggable to allow dragging
    <Draggable
      handle=".windowHandle"
      onMouseDown={() => {windowListHandler("focus", tag);}}
      defaultPosition={defaultPosition}
    >
      <div
        // Set the class name based on props and focus state
        className={`Window ${isFocused ? "windowFocused" : "windowUnfocused"}`}
        onMouseDown={() => {windowListHandler("focus", tag);}}
      >
        {/* Window handle */}
        <div className="windowHandle">
          {windowHandle}
          <button className="windowClose" onClick={() => {windowListHandler("remove", tag);}}>X</button>
        </div>
        {/* Window content */}
        {windowContent}
      </div>
    </Draggable>
  );
}

export default Window;
