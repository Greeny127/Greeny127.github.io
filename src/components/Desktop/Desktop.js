// create a react component with the same name as the file
import React from "react";
import { useState, createContext } from "react";

import Taskbar from "./Utilities/Taskbar";
import Window from "./Utilities/Window";
import SystemFolder from "./Utilities/SystemFolder";
import Notepad from "./Utilities/Notepad";
import RecycleBin from "./Utilities/RecycleBin";
import ProjectExplorer from "./Utilities/ProjectExplorer";
import Calculator from "./Utilities/Calculator";
import ConfirmDialog from "./Utilities/ConfirmDialog";
import ResumeViewer from "./Utilities/ResumeViewer";
import DisplayProperties from "./Utilities/DisplayProperties";
import ContextMenu from "./Utilities/ContextMenu";

import DesktopIcon, { CELL_WIDTH, CELL_HEIGHT } from "./Utilities/DesktopIcon";
import DesktopArea from "./Utilities/DesktopArea";

import recyclebin from "../../Icons/RecycleBin/recycle-bin-empty.ico";
import folder from "../../Icons/Folder/folder.ico";
import resumeDocIcon from "../../Icons/Folder/notepad-document.ico";
import internet from "../../Icons/Programs/internet.ico";
import notepad from "../../Icons/Programs/notepad.ico";
import calculatorIcon from "../../Icons/Apps/calculator.svg";
import displayIcon from "../../Icons/Apps/display.svg";
import resumePdf from "../../Sohan_Resume_Final.pdf";
import "../../styles/Desktop/Desktop.css"

/**
 * Desktop component that renders the desktop UI.
 *
 * @returns {JSX.Element} The rendered Desktop component.
 */


export const WindowFocusList = createContext();

const DEFAULT_WALLPAPER = "#008080";
const GRID_PADDING = 16;

// Fills a column top-to-bottom before wrapping to the next one, same as a
// real Windows desktop icon grid.
const rowsPerColumn = () => {
    if (typeof window === "undefined") return 6;
    const availableHeight = window.innerHeight - window.innerHeight * 0.07 - GRID_PADDING * 2;
    return Math.max(1, Math.floor(availableHeight / CELL_HEIGHT));
};

const indexToPosition = (index) => {
    const perColumn = rowsPerColumn();
    const col = Math.floor(index / perColumn);
    const row = index % perColumn;
    return { x: GRID_PADDING + col * CELL_WIDTH, y: GRID_PADDING + row * CELL_HEIGHT };
};

function Desktop() {
    const resumeView = <ResumeViewer pdfSrc={resumePdf} />;

    // State variables to track the desktop's various windows
    const [windowList, setwindowList] = useState([]); // Store window data, not JSX
    const [windowMetadata, setWindowMetadata] = useState({}); // Stores {tag: {icon, title, type, handle, content}}
    const [hiddenWindows, setHiddenWindows] = useState({}); // Stores {tag: boolean}
    const [focusedWindowTag, setFocusedWindowTag] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showShutdownConfirm, setShowShutdownConfirm] = useState(false);
    const [isShuttingDown, setIsShuttingDown] = useState(false);
    const [wallpaperColor, setWallpaperColor] = useState(DEFAULT_WALLPAPER);
    const [contextMenu, setContextMenu] = useState(null); // {x, y, kind: 'desktop'|'icon', app?}
    const [sortByName, setSortByName] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [textDocs, setTextDocs] = useState([]); // dynamically created "New Text Document" icons
    const [deletedTags, setDeletedTags] = useState([]); // desktop icons the user has sent to the Recycle Bin
    const [cannotDelete, setCannotDelete] = useState(false);
    const [binItems, setBinItems] = useState([
        { id: 1, name: "old-notes.txt", type: "Text Document", deletedAt: "Today" },
        { id: 2, name: "draft-logo.png", type: "PNG Image", deletedAt: "Today" },
        { id: 3, name: "todo-backup.doc", type: "Word Document", deletedAt: "Yesterday" },
    ]);

    const handleEmptyBin = () => setBinItems([]);

    const handleRestoreBinItem = (id) => {
        setBinItems((prev) => {
            const item = prev.find((i) => i.id === id);
            if (item && item.appTag) {
                setDeletedTags((tags) => tags.filter((t) => t !== item.appTag));
            }
            return prev.filter((i) => i.id !== id);
        });
    };

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
            setwindowList((prevWindowList) => {
                const filtered = prevWindowList.filter((window) => window.tag !== tag);
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

    // Central registry of every app so the desktop icons, the Start Menu
    // and the taskbar all stay in sync from a single source of truth.
    const staticApps = [
        { tag: "recycle_bin", title: "Recycle Bin", iconPath: recyclebin, content: <RecycleBin items={binItems} onEmpty={handleEmptyBin} onRestore={handleRestoreBinItem} /> },
        { tag: "system_folder", title: "System Folder", iconPath: folder, content: <SystemFolder windowListHandler={handleWindowList} /> },
        { tag: "project_explorer", title: "Project Explorer", iconPath: internet, content: <ProjectExplorer /> },
        { tag: "notepad", title: "Notepad", iconPath: notepad, content: <Notepad /> },
        { tag: "calculator", title: "Calculator", iconPath: calculatorIcon, content: <Calculator /> },
        { tag: "my_resume", title: "My Resume", iconPath: resumeDocIcon, content: resumeView },
    ];

    const dynamicApps = textDocs.map((doc) => ({
        tag: doc.tag,
        title: doc.title,
        iconPath: resumeDocIcon,
        content: <Notepad fileName={doc.title} />,
    }));

    const allApps = [...staticApps, ...dynamicApps];
    // Every app stays reachable from the Start Menu / taskbar even if its desktop
    // shortcut was deleted - deleting an icon only removes the shortcut, like real Windows.
    const apps = sortByName ? [...allApps].sort((a, b) => a.title.localeCompare(b.title)) : allApps;
    const visibleDesktopApps = apps.filter((app) => !deletedTags.includes(app.tag));

    const [iconPositions, setIconPositions] = useState(() => {
        const initial = {};
        staticApps.forEach((app, idx) => {
            initial[app.tag] = indexToPosition(idx);
        });
        return initial;
    });

    const openApp = (app) => {
        const uniqueTag = `${app.tag}_${Date.now()}`;
        handleWindowList("add", uniqueTag, app.title, app.content, app.iconPath);
    };

    const handleShutdown = () => setShowShutdownConfirm(true);

    const confirmShutdown = () => {
        setShowShutdownConfirm(false);
        setIsShuttingDown(true);
        setTimeout(() => window.location.reload(), 900);
    };

    const handleMoveIcon = (tag, x, y) => {
        setIconPositions((prev) => ({ ...prev, [tag]: { x, y } }));
    };

    const handleDesktopContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, kind: "desktop" });
    };

    const handleIconContextMenu = (app, e) => {
        setContextMenu({ x: e.clientX, y: e.clientY, kind: "icon", app });
    };

    const handleNewTextDocument = () => {
        const count = textDocs.length;
        const title = count === 0 ? "New Text Document.txt" : `New Text Document (${count + 1}).txt`;
        const tag = `text_doc_${Date.now()}`;
        setTextDocs((prev) => [...prev, { tag, title }]);
        setIconPositions((prev) => ({ ...prev, [tag]: indexToPosition(Object.keys(prev).length) }));
    };

    const handleArrangeIcons = () => {
        setSortByName(true);
        setIconPositions(() => {
            const sorted = [...allApps]
                .filter((app) => !deletedTags.includes(app.tag))
                .sort((a, b) => a.title.localeCompare(b.title));
            const positions = {};
            sorted.forEach((app, idx) => {
                positions[app.tag] = indexToPosition(idx);
            });
            return positions;
        });
    };

    const handleDeleteIcon = (app) => {
        if (app.tag === "recycle_bin") {
            setCannotDelete(true);
            return;
        }
        setDeletedTags((prev) => [...prev, app.tag]);
        setBinItems((prev) => [
            ...prev,
            { id: Date.now(), name: app.title, type: "Application", deletedAt: "Today", appTag: app.tag },
        ]);
        setSelectedIcon(null);
    };

    const handleProperties = () => {
        const uniqueTag = `display_properties_${Date.now()}`;
        const content = (
            <DisplayProperties currentColor={wallpaperColor} onApply={(color) => setWallpaperColor(color)} />
        );
        handleWindowList("add", uniqueTag, "Display Properties", content, displayIcon);
    };

    const desktopMenuItems = [
        { label: "Arrange Icons", onClick: handleArrangeIcons },
        { label: "Refresh", onClick: () => setRefreshKey((k) => k + 1) },
        { divider: true },
        { label: "New Text Document", onClick: handleNewTextDocument },
        { divider: true },
        { label: "Properties", onClick: handleProperties },
    ];

    const iconMenuItems = contextMenu?.app
        ? [
              { label: "Open", onClick: () => openApp(contextMenu.app) },
              { divider: true },
              {
                  label: "Delete",
                  onClick: () => handleDeleteIcon(contextMenu.app),
                  disabled: contextMenu.app.tag === "recycle_bin",
              },
          ]
        : [];

    // Render the desktop UI
    return (
        <div className="desktop" style={{ backgroundColor: wallpaperColor }}>
            {/* Window components - render from stored data */}
            {windowList.map((windowData, index) => {
                if (!windowData.tag) return null; // Skip empty initial state
                const isHidden = hiddenWindows[windowData.tag];
                if (isHidden) return null;
                return (
                    <Window
                        key={windowData.tag}
                        windowHandle={windowData.handle}
                        windowContent={windowData.content}
                        windowIcon={windowData.icon}
                        tag={windowData.tag}
                        windowListHandler={handleWindowList}
                        isFocused={focusedWindowTag === windowData.tag}
                        cascadeIndex={index}
                    />
                );
            })}

            <WindowFocusList.Provider value={{ windowList, windowMetadata, hiddenWindows, focusedWindowTag }}>
            {/* Desktop icon grid */}
            <DesktopArea onDeselect={() => setSelectedIcon(null)} onContextMenu={handleDesktopContextMenu}>
                {visibleDesktopApps.map((app) => (
                    <DesktopIcon
                        key={`${app.tag}-${iconPositions[app.tag]?.x}-${iconPositions[app.tag]?.y}-${refreshKey}`}
                        app={app}
                        isSelected={selectedIcon === app.tag}
                        onSelect={setSelectedIcon}
                        onOpen={openApp}
                        position={iconPositions[app.tag] || indexToPosition(0)}
                        onMove={handleMoveIcon}
                        onContextMenu={handleIconContextMenu}
                    />
                ))}
            </DesktopArea>

            {/* Taskbar component */}
            <Taskbar
                className="taskBar"
                windowMetadata={windowMetadata}
                windowListHandler={handleWindowList}
                hiddenWindows={hiddenWindows}
                focusedWindowTag={focusedWindowTag}
                apps={apps}
                onOpenApp={openApp}
                onShutdown={handleShutdown}
            />
            </WindowFocusList.Provider>

            {contextMenu && contextMenu.kind === "desktop" && (
                <ContextMenu x={contextMenu.x} y={contextMenu.y} items={desktopMenuItems} onClose={() => setContextMenu(null)} />
            )}

            {contextMenu && contextMenu.kind === "icon" && (
                <ContextMenu x={contextMenu.x} y={contextMenu.y} items={iconMenuItems} onClose={() => setContextMenu(null)} />
            )}

            {showShutdownConfirm && (
                <ConfirmDialog
                    title="Shut Down Portfolio"
                    message="Are you sure you want to shut down and return to the login screen?"
                    icon="?"
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onConfirm={confirmShutdown}
                    onCancel={() => setShowShutdownConfirm(false)}
                />
            )}

            {cannotDelete && (
                <ConfirmDialog
                    title="Recycle Bin"
                    message="The Recycle Bin cannot be removed from the desktop."
                    icon="!"
                    confirmLabel="OK"
                    onConfirm={() => setCannotDelete(false)}
                    onCancel={() => setCannotDelete(false)}
                />
            )}

            {isShuttingDown && (
                <div className="shutdown-overlay">
                    <span>It's now safe to close this browser tab.</span>
                </div>
            )}
        </div>
    );
}

export default Desktop;
