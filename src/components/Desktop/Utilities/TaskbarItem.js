import React from "react";

function TaskbarItem({ imageIcon, startIcon, tag, title, windowListHandler, isHidden, isFocused }) {
  const handleClick = () => {
    if (tag !== "startmenu" && windowListHandler) {
      // Toggle window visibility
      windowListHandler("toggle", tag);
    }
  };

  return (
    <div
      className={
        startIcon
          ? "taskbarIconNotClicked"
          : isFocused
          ? "taskbarIconFocused"
          : isHidden
          ? "taskbarIconHidden"
          : "taskbarIconShown"
      }
      onMouseDown={handleClick}
      title={title}
    >
      {imageIcon && <img src={imageIcon} alt={tag} className="taskbarIconImage" />}
      {!startIcon && (
        <span
          className={
            isFocused
              ? "taskbarStateDot focused"
              : isHidden
              ? "taskbarStateDot hidden"
              : "taskbarStateDot shown"
          }
          title={isFocused ? "Focused" : isHidden ? "Hidden" : "Shown"}
        />
      )}
    </div>
  );
}

export default TaskbarItem;
