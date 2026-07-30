import React, { useState, useRef, useLayoutEffect } from "react";
import Draggable from 'react-draggable';
import "../../../styles/Desktop/Window.css";

const CLOSE_ANIM_MS = 140;

/**
 * Window component that allows dragging, focus, minimize, maximize and close.
 *
 * @param {Object} props - The props object.
 * @return {JSX.Element} The rendered Window component.
 */

function Window({ windowHandle, windowContent, windowIcon, tag, windowListHandler, isFocused, isHidden = false, cascadeIndex = 0 }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const nodeRef = useRef(null);
  // Tracks the window's last known dragged position and pre-maximize size so
  // minimizing/maximizing can restore them instead of resetting to spawn defaults.
  const lastSizeRef = useRef(null);

  const [defaultPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 20, y: 20 };
    }

    const defaultWidth = Math.min(Math.max(window.innerWidth * 0.55, 360), window.innerWidth * 0.94);
    const defaultHeight = Math.min(Math.max(window.innerHeight * 0.6, 260), window.innerHeight * 0.86);

    const baseX = Math.max((window.innerWidth - defaultWidth) / 2, 8);
    const baseY = Math.max((window.innerHeight - defaultHeight) / 2, 8);

    // Cascade each successive window diagonally so newly opened/focused
    // windows don't spawn exactly on top of existing ones and permanently
    // hide them - without this, every window computes the same centered
    // position and a focused window fully occludes whatever is beneath it.
    const cascadeStep = 28;
    const cascadeSlot = cascadeIndex % 8;
    const maxX = window.innerWidth - defaultWidth - 8;
    const maxY = window.innerHeight * 0.93 - defaultHeight - 8;

    return {
      x: Math.min(Math.max(baseX + cascadeSlot * cascadeStep, 8), Math.max(maxX, 8)),
      y: Math.min(Math.max(baseY + cascadeSlot * cascadeStep, 8), Math.max(maxY, 8)),
    };
  });

  // Draggable is uncontrolled - it only reads `defaultPosition` once, at mount.
  // Since the maximize toggle unmounts/remounts it (it lives in a different
  // JSX branch than the maximized view), we track the latest dragged
  // position ourselves and feed it back in as the new `defaultPosition` so
  // restoring from maximize returns to where the window actually was.
  const lastPositionRef = useRef(defaultPosition);

  // Applied imperatively (not via the `style` prop) so it only runs once per
  // restore and doesn't fight the browser's native `resize` handle on
  // unrelated re-renders (a style-prop value gets re-applied on every
  // render, which would undo any manual resize the user made afterward).
  useLayoutEffect(() => {
    if (!isMaximized && lastSizeRef.current && nodeRef.current) {
      nodeRef.current.style.width = `${lastSizeRef.current.width}px`;
      nodeRef.current.style.height = `${lastSizeRef.current.height}px`;
      lastSizeRef.current = null;
    }
  }, [isMaximized]);

  const handleFocus = () => windowListHandler("focus", tag);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => windowListHandler("remove", tag), CLOSE_ANIM_MS);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    windowListHandler("toggle", tag);
  };

  const handleMaximizeToggle = (e) => {
    if (e) e.stopPropagation();
    if (!isMaximized && nodeRef.current) {
      // About to maximize - remember the exact size (including any manual
      // resize) so restoring returns to it instead of the spawn default.
      const rect = nodeRef.current.getBoundingClientRect();
      lastSizeRef.current = { width: rect.width, height: rect.height };
    }
    setIsMaximized((prev) => !prev);
    handleFocus();
  };

  // Positioning/sizing classes live on the outer (Draggable-controlled) node.
  // Draggable applies its own `transform: translate(x, y)` inline style to
  // that node, so the open/close scale+fade animation must live on an inner
  // wrapper instead - animating `transform` on the same node Draggable
  // positions would fight with it and cause a flash-then-snap jump.
  const outerClassName = `Window ${isFocused ? "windowFocused" : "windowUnfocused"} ${
    isMaximized ? "windowMaximized" : ""
  }`;
  const innerClassName = `WindowInner ${isClosing ? "windowClosing" : "windowOpening"}`;
  // Kept mounted (rather than unmounted) while minimized, via display:none,
  // so the Draggable's internal position state and any manual resize survive
  // a minimize/restore cycle instead of resetting.
  const hiddenStyle = isHidden ? { display: "none" } : undefined;

  const titlebar = (
    <div className="windowHandle" onDoubleClick={handleMaximizeToggle}>
      <div className="windowHandleTitle">
        {windowIcon && <img src={windowIcon} alt="" className="windowHandleIcon" />}
        <span className="windowHandleText">{windowHandle}</span>
      </div>
      <div className="windowControls">
        <button className="windowBtn windowMinimize" onClick={handleMinimize} title="Minimize" aria-label="Minimize">
          <span className="windowBtnGlyph windowBtnGlyphMinimize" />
        </button>
        <button
          className="windowBtn windowMaximize"
          onClick={handleMaximizeToggle}
          title={isMaximized ? "Restore" : "Maximize"}
          aria-label="Maximize"
        >
          <span className={isMaximized ? "windowBtnGlyph windowBtnGlyphRestore" : "windowBtnGlyph windowBtnGlyphMaximize"} />
        </button>
        <button className="windowBtn windowClose" onClick={handleClose} title="Close" aria-label="Close">
          <span className="windowBtnGlyph windowBtnGlyphClose">x</span>
        </button>
      </div>
    </div>
  );

  const inner = (
    <div className={innerClassName}>
      {titlebar}
      <div className="windowBody">{windowContent}</div>
    </div>
  );

  if (isMaximized) {
    return (
      <div className={outerClassName} style={hiddenStyle} onMouseDown={handleFocus}>
        {inner}
      </div>
    );
  }

  return (
    // Wrap the window with Draggable to allow dragging
    <Draggable
      nodeRef={nodeRef}
      handle=".windowHandle"
      onMouseDown={handleFocus}
      defaultPosition={lastPositionRef.current}
      onStop={(e, data) => {
        lastPositionRef.current = { x: data.x, y: data.y };
      }}
    >
      <div ref={nodeRef} className={outerClassName} style={hiddenStyle} onMouseDown={handleFocus}>
        {inner}
      </div>
    </Draggable>
  );
}

export default Window;
