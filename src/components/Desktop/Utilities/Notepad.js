import React, { useState, useRef, useCallback } from "react";
import "../../../styles/Desktop/Notepad.css";

function getLineCol(text, selectionStart) {
  const upToCursor = text.slice(0, selectionStart);
  const lines = upToCursor.split("\n");
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  return { line, col };
}

function Notepad({ fileContent = "", fileName = "Untitled.txt" }) {
  const [content, setContent] = useState(fileContent);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [savedFlash, setSavedFlash] = useState(false);
  const textareaRef = useRef(null);

  const updateCursor = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    setCursor(getLineCol(el.value, el.selectionStart));
  }, []);

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.includes(".") ? fileName : `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  };

  return (
    <div className="notepad">
      <div className="notepad-menubar">
        <button className="notepad-menu-btn" onClick={handleSave}>
          Save
        </button>
        <span className="notepad-menu-label">File</span>
        <span className="notepad-menu-label">Edit</span>
        <span className="notepad-menu-label">Format</span>
        {savedFlash && <span className="notepad-saved-flash">Saved!</span>}
      </div>
      <div className="notepad-content">
        <textarea
          ref={textareaRef}
          className="notepad-textarea"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            requestAnimationFrame(updateCursor);
          }}
          onClick={updateCursor}
          onKeyUp={updateCursor}
          onSelect={updateCursor}
          spellCheck="false"
        />
      </div>
      <div className="notepad-statusbar">
        <span>{fileName}</span>
        <span>{content.length} characters</span>
        <span>Ln {cursor.line}, Col {cursor.col}</span>
      </div>
    </div>
  );
}

export default Notepad;
