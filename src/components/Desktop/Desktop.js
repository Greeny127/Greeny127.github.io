// create a react component with the same name as the file
import React from "react";
import { useState, createContext } from "react";

import Taskbar from "./Utilities/Taskbar";
import Window from "./Utilities/Window";
import SystemFolder from "./Utilities/SystemFolder";
import Notepad from "./Utilities/Notepad";
import RecycleBin from "./Utilities/RecycleBin";
import ProjectExplorer from "./Utilities/ProjectExplorer";

import DesktopIcon from "./Utilities/DesktopIcon";
import DesktopArea from "./Utilities/DesktopArea";

import recyclebin from "../../Icons/RecycleBin/recycle-bin-empty.ico";
import folder from "../../Icons/Folder/folder.ico";
import resumeDocIcon from "../../Icons/Folder/notepad-document.ico";
import internet from "../../Icons/Programs/internet.ico";
import notepad from "../../Icons/Programs/notepad.ico";
import resumePdf from "../../Sohan_Resume_Final.pdf";
import "../../styles/Desktop/Desktop.css"

/**
 * Desktop component that renders the desktop UI.
 *
 * @returns {JSX.Element} The rendered Desktop component.
 */


export const WindowFocusList = createContext();

function Desktop() {
    const resumeView = (
        <div style={{ width: "100%", height: "calc(100% - 4vh)", backgroundColor: "#fff" }}>
            <iframe
                title="My Resume PDF"
                src={resumePdf}
                style={{ width: "100%", height: "100%", border: "none" }}
            />
        </div>
    );

    // State variables to track the desktop's various windows
    const [windowList, setwindowList] = useState([]); // Store window data, not JSX
    const [windowMetadata, setWindowMetadata] = useState({}); // Stores {tag: {icon, title, type, handle, content}}
    const [hiddenWindows, setHiddenWindows] = useState({}); // Stores {tag: boolean}
    const [focusedWindowTag, setFocusedWindowTag] = useState(null);
    
    const handleWindowList = (mode, tag, handle, content, icon = null) => {
        // Add a new window to the list
        if (mode === "add") {
            setwindowList(prevList => [...prevList, { tag, handle, content, icon }]);
            // Store metadata for this window
            setWindowMetadata(prev => ({
                ...prev,
                [tag]: { icon, title: handle, type: handle.toLowerCase(), handle, content }
            }));
            // Ensure window is visible when opened
            setHiddenWindows(prev => ({
                ...prev,
                [tag]: false
            }));
            setFocusedWindowTag(tag);
        }
        // Remove the window with the given tag from the list
        else if (mode === "remove") {
            console.log("Removing window:", tag);
            setwindowList((prevWindowList) => {
                const filtered = prevWindowList.filter((window) => window.tag !== tag);
                console.log("Windows after remove:", filtered.map(w => w.tag));
                return filtered;
            });
            // Remove metadata
            setWindowMetadata(prev => {
                const newMetadata = { ...prev };
                delete newMetadata[tag];
                return newMetadata;
            });
            // Remove from hidden state
            setHiddenWindows(prev => {
                const newHidden = { ...prev };
                delete newHidden[tag];
                return newHidden;
            });

            setFocusedWindowTag((prev) => {
                if (prev !== tag) return prev;
                const remaining = windowList.filter((window) => window.tag !== tag);
                return remaining.length ? remaining[remaining.length - 1].tag : null;
            });
        }
        // Toggle window visibility (minimize/show)
        else if (mode === "toggle") {
            setHiddenWindows(prev => {
                const nextHidden = !prev[tag];
                setFocusedWindowTag((currentFocus) => {
                    if (!nextHidden) return tag;
                    return currentFocus === tag ? null : currentFocus;
                });

                return {
                    ...prev,
                    [tag]: nextHidden
                };
            });
        }
        else if (mode === "focus") {
            setFocusedWindowTag(tag);
        }
    };


    // Render the desktop UI\
    return (
        <div className="desktop">
            {/* Window components - render from stored data */}
            {windowList.map((windowData) => {
                if (!windowData.tag) return null; // Skip empty initial state
                const isHidden = hiddenWindows[windowData.tag];
                if (isHidden) return null;
                return (
                    <Window 
                        key={windowData.tag}
                        windowHandle={windowData.handle}
                        windowContent={windowData.content}
                        tag={windowData.tag}
                        windowListHandler={handleWindowList}
                        isFocused={focusedWindowTag === windowData.tag}
                    />
                );
            })}

            <WindowFocusList.Provider value={{ windowList, windowMetadata, hiddenWindows, focusedWindowTag }}>
            {/* Desktop icon component */}
            <DesktopArea>
                <DesktopIcon iconPath={recyclebin} tag="recycle_bin" windowListHandler={handleWindowList} title="Recycle Bin" content={<RecycleBin />} icon={recyclebin} />
                <DesktopIcon iconPath={folder} tag="system_folder" windowListHandler={handleWindowList} title="System Folder" content={<SystemFolder windowListHandler={handleWindowList} />} icon={folder} />
                <DesktopIcon iconPath={internet} tag="project_explorer" windowListHandler={handleWindowList} title="Project Explorer" content={<ProjectExplorer />} icon={internet} />
                <DesktopIcon iconPath={notepad} tag="notepad" windowListHandler={handleWindowList} title="Notepad" content={<Notepad />} icon={notepad} />
                <DesktopIcon iconPath={resumeDocIcon} tag="my_resume" windowListHandler={handleWindowList} title="My Resume" content={resumeView} icon={resumeDocIcon} />
            </DesktopArea>

            {/* Taskbar component */}
            <Taskbar
                className="taskBar"
                windowMetadata={windowMetadata}
                windowListHandler={handleWindowList}
                hiddenWindows={hiddenWindows}
                focusedWindowTag={focusedWindowTag}
            />
            </WindowFocusList.Provider>
        </div>
    );
}

export default Desktop;