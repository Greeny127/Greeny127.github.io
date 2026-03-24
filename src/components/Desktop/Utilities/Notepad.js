import React, { useState } from "react";
import "../../../styles/Desktop/Notepad.css";

function Notepad({ fileContent = "", fileName = "Untitled.txt" }) {
  const [content, setContent] = useState(fileContent);

  return (
    <div className="notepad">
      <div className="notepad-content">
        <textarea
          className="notepad-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck="false"
        />
      </div>
      <div className="notepad-statusbar">
        <span>{fileName}</span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
}

export default Notepad;
