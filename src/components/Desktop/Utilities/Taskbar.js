import React from "react";
import TaskbarIcon from "./TaskbarItem";
import startmenu from "../../../Icons/Programs/start-menu.ico"
import "../../../styles/Desktop/Taskbar.css";

function Taskbar(props) {
  const { windowMetadata = {}, windowListHandler, hiddenWindows = {}, focusedWindowTag = null } = props;

  return (
    <div className="taskbar-comp">
      <TaskbarIcon imageIcon={startmenu} startIcon={true} tag="startmenu" />
      {Object.entries(windowMetadata).map(([tag, metadata]) => (
        <TaskbarIcon 
          key={tag}
          imageIcon={metadata.icon}
          tag={tag}
          title={metadata.title}
          windowListHandler={windowListHandler}
          isHidden={hiddenWindows[tag]}
          isFocused={focusedWindowTag === tag}
        />
      ))}
    </div>
  );
}

export default Taskbar;
