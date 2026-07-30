import React, { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import "../../../styles/Desktop/RecycleBin.css";

function RecycleBin({ items, onEmpty, onRestore }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmptyBin = () => {
    onEmpty();
    setSelectedId(null);
    setShowConfirm(false);
  };

  const handleRestore = () => {
    if (!selectedId) return;
    onRestore(selectedId);
    setSelectedId(null);
  };

  return (
    <div className="recycle-bin">
      <div className="bin-toolbar">
        <button className="bin-btn" onClick={handleRestore} disabled={!selectedId}>
          Restore
        </button>
        <button className="bin-btn" onClick={() => setShowConfirm(true)} disabled={items.length === 0}>
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

      {showConfirm && (
        <ConfirmDialog
          title="Confirm Multiple File Delete"
          message={`Are you sure you want to permanently delete ${items.length} item(s)?`}
          icon="!"
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={handleEmptyBin}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default RecycleBin;
