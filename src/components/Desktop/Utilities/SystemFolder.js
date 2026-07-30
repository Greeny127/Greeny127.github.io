import React, { useState } from "react";
import "../../../styles/Desktop/SystemFolder.css";
import Notepad from "./Notepad";
import ConfirmDialog from "./ConfirmDialog";
import folderIcon from "../../../Icons/Folder/folder.ico";
import fileIcon from "../../../Icons/Folder/notepad-document.ico";
import notepadIcon from "../../../Icons/Programs/notepad.ico";

function SystemFolder({ windowListHandler }) {
  const [currentPath, setCurrentPath] = useState("C:\\System");
  const [unsupportedFile, setUnsupportedFile] = useState(null);

  // Mock file system structure with content
  const fileSystem = {
    "C:\\System": [
      { name: "Documents", type: "folder" },
      { name: "Pictures", type: "folder" },
      { name: "Music", type: "folder" },
      { name: "Videos", type: "folder" },
      { name: "Downloads", type: "folder" },
      { name: "config.ini", type: "file", content: "[System Configuration]\nVersion=1.0\nAuthor=Sohan\nLanguage=EN" },
      { name: "system.log", type: "file", content: "[2026-03-24] System startup\n[2026-03-24] Loading drivers\n[2026-03-24] Portfolio initialized" },
    ],
    "C:\\System\\Documents": [
      { name: "Work", type: "folder" },
      { name: "Personal", type: "folder" },
      { name: "resume.txt", type: "file", content: "Sohan - Portfolio Developer\n\nSkills:\n- React\n- Web Design\n- UI/UX" },
      { name: "notes.txt", type: "file", content: "Project ideas:\n1. Portfolio Website\n2. File Explorer\n3. Text Editor" },
    ],
    "C:\\System\\Documents\\Work": [
      { name: "Projects", type: "folder" },
      { name: "Meetings", type: "folder" },
      { name: "report.doc", type: "file", content: "Project Report\n\nStatus: In Progress\nDeadline: Q2 2026" },
    ],
    "C:\\System\\Documents\\Personal": [
      { name: "diary.txt", type: "file", content: "Today was a good day.\nWorked on the portfolio.\nFeels productive." },
      { name: "ideas.txt", type: "file", content: "Random Ideas:\n- Add sound effects\n- Implement more programs\n- Add file operations" },
    ],
    "C:\\System\\Pictures": [
      { name: "Vacation", type: "folder" },
      { name: "Screenshots", type: "folder" },
      { name: "photo.jpg", type: "file" },
    ],
    "C:\\System\\Music": [
      { name: "Playlists", type: "folder" },
      { name: "song1.mp3", type: "file" },
      { name: "song2.mp3", type: "file" },
    ],
    "C:\\System\\Downloads": [
      { name: "software.exe", type: "file" },
      { name: "archive.zip", type: "file" },
      { name: "image.iso", type: "file" },
    ],
  };

  const getFiles = (path) => {
    return fileSystem[path] || [];
  };

  const handleDoubleClick = (item) => {
    if (item.type === "folder") {
      setCurrentPath(`${currentPath}\\${item.name}`);
    } else if (item.type === "file" && (item.name.endsWith(".txt") || item.name.endsWith(".ini") || item.name.endsWith(".log") || item.name.endsWith(".doc"))) {
      // Open text files in notepad
      const uniqueTag = `notepad_${Date.now()}`;
      const notepadContent = <Notepad fileContent={item.content || ""} fileName={item.name} />;
      windowListHandler("add", uniqueTag, item.name, notepadContent, notepadIcon);
    } else if (item.type === "file") {
      setUnsupportedFile(item.name);
    }
  };

  const handleBack = () => {
    const parts = currentPath.split("\\");
    if (parts.length > 2) {
      parts.pop();
      setCurrentPath(parts.join("\\"));
    }
  };

  const files = getFiles(currentPath);
  const canGoBack = currentPath !== "C:\\System";

  return (
    <div className="system-folder">
      {/* Toolbar */}
      <div className="folder-toolbar">
        <button className="toolbar-btn" onClick={handleBack} disabled={!canGoBack}>
          Back
        </button>
        <button className="toolbar-btn" disabled>
          Forward
        </button>
        <div className="location-bar">
          <span className="location-label">Address:</span>
          <input 
            type="text" 
            className="location-input" 
            value={currentPath} 
            readOnly 
          />
        </div>
      </div>

      {/* File listing */}
      <div className="folder-content">
        {files.length === 0 ? (
          <div className="empty-folder">This folder is empty</div>
        ) : (
          <div className="file-list">
            {files.map((item, index) => (
              <div
                key={index}
                className={`file-item ${item.type}`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(item);
                }}
              >
                <img 
                  src={item.type === "folder" ? folderIcon : fileIcon}
                  alt={item.type}
                  className="file-icon"
                />
                <div className="file-name">{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statusbar */}
      <div className="folder-statusbar">
        <span>{files.length} object(s)</span>
      </div>

      {unsupportedFile && (
        <ConfirmDialog
          title={unsupportedFile}
          message={`Windows cannot open this file.\n\nTo open this file, Windows needs to know what program you meant to make this joke with.`}
          icon="!"
          confirmLabel="OK"
          onConfirm={() => setUnsupportedFile(null)}
          onCancel={() => setUnsupportedFile(null)}
        />
      )}
    </div>
  );
}

export default SystemFolder;
