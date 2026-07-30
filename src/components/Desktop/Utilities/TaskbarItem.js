import React from "react";

function TaskbarItem({ imageIcon, startIcon, tag, title, windowListHandler, isHidden, isFocused, isPressed, onStartClick, onContextMenu }) {
  const handleClick = () => {
    if (startIcon) {
      onStartClick && onStartClick();
      return;
    }
    if (windowListHandler) {
      // Toggle window visibility
      windowListHandler("toggle", tag);
    }
  };

  if (startIcon) {
    return (
      <button
        className={isPressed ? "startButton startButtonPressed" : "startButton"}
        onClick={handleClick}
      >
        <img src={imageIcon} alt="Start" className="startButtonImage" />
        <span className="startButtonLabel">Start</span>
      </button>
    );
  }

  return (
    <button
      className={
        isFocused
          ? "taskbarIconFocused"
          : isHidden
          ? "taskbarIconHidden"
          : "taskbarIconShown"
      }
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu && onContextMenu(e, tag);
      }}
      title={title}
    >
      {imageIcon && <img src={imageIcon} alt="" className="taskbarIconImage" />}
      <span className="taskbarIconLabel">{title}</span>
    </button>
  );
}

export default TaskbarItem;
