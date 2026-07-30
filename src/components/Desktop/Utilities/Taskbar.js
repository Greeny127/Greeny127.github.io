import React, { useState, useEffect } from "react";
import TaskbarIcon from "./TaskbarItem";
import StartMenu from "./StartMenu";
import VolumeTray from "./VolumeTray";
import ContextMenu from "./ContextMenu";
import startmenu from "../../../Icons/Programs/start-menu.ico";
import "../../../styles/Desktop/Taskbar.css";

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function Taskbar(props) {
  const {
    windowMetadata = {},
    windowListHandler,
    hiddenWindows = {},
    focusedWindowTag = null,
    apps = [],
    onOpenApp = () => {},
    onShutdown = () => {},
  } = props;

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [winCtxMenu, setWinCtxMenu] = useState(null); // {x, y, tag} | null

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="taskbar-comp">
      <TaskbarIcon
        imageIcon={startmenu}
        startIcon={true}
        tag="startmenu"
        isPressed={isStartOpen}
        onStartClick={() => setIsStartOpen((prev) => !prev)}
      />
      <div className="taskbar-divider" />

      {isStartOpen && (
        <StartMenu
          apps={apps}
          onOpenApp={onOpenApp}
          onShutdown={onShutdown}
          onClose={() => setIsStartOpen(false)}
        />
      )}

      <div className="taskbar-open-windows">
        {Object.entries(windowMetadata).map(([tag, metadata]) => (
          <TaskbarIcon
            key={tag}
            imageIcon={metadata.icon}
            tag={tag}
            title={metadata.title}
            windowListHandler={windowListHandler}
            isHidden={hiddenWindows[tag]}
            isFocused={focusedWindowTag === tag}
            onContextMenu={(e, clickedTag) => setWinCtxMenu({ x: e.clientX, y: e.clientY, tag: clickedTag })}
          />
        ))}
      </div>

      {winCtxMenu && (
        <ContextMenu
          x={winCtxMenu.x}
          y={winCtxMenu.y}
          onClose={() => setWinCtxMenu(null)}
          items={[
            {
              label: hiddenWindows[winCtxMenu.tag] ? "Restore" : "Minimize",
              onClick: () => windowListHandler("toggle", winCtxMenu.tag),
            },
            { divider: true },
            { label: "Close", onClick: () => windowListHandler("remove", winCtxMenu.tag) },
          ]}
        />
      )}

      <div className="taskbar-tray win95-sunken">
        <VolumeTray />
        <div className="tray-clock-stack">
          <div className="tray-date">{formatDate(now)}</div>
          <div className="tray-clock">{formatTime(now)}</div>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
