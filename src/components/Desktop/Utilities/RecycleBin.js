import React, { useState } from "react";
import "../../../styles/Desktop/RecycleBin.css";

function RecycleBin() {
  const [items, setItems] = useState([
    { id: 1, name: "old-notes.txt", type: "Text Document", deletedAt: "Today" },
    { id: 2, name: "draft-logo.png", type: "PNG Image", deletedAt: "Today" },
    { id: 3, name: "todo-backup.doc", type: "Word Document", deletedAt: "Yesterday" },
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const handleEmptyBin = () => {
    setItems([]);
    setSelectedId(null);
  };

  const handleRestore = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="recycle-bin">
      <div className="bin-toolbar">
        <button className="bin-btn" onClick={handleRestore} disabled={!selectedId}>
          Restore
        </button>
        <button className="bin-btn" onClick={handleEmptyBin} disabled={items.length === 0}>
          Empty Recycle Bin
        </button>
      </div>

      <div className="bin-list-wrap">
        {items.length === 0 ? (
          <div className="bin-empty">Recycle Bin is empty.</div>
        ) : (
          <div className="bin-list">
            <div className="bin-header-row">
              <span>Name</span>
              <span>Type</span>
              <span>Deleted</span>
            </div>
            {items.map((item) => (
              <button
                key={item.id}
                className={selectedId === item.id ? "bin-row selected" : "bin-row"}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.name}</span>
                <span>{item.type}</span>
                <span>{item.deletedAt}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bin-statusbar">
        <span>{items.length} object(s)</span>
      </div>
    </div>
  );
}

export default RecycleBin;
