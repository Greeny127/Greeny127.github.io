import React, { useEffect } from "react";
import beepSfx from "../../../beep.mp3";
import "../../../styles/Desktop/ConfirmDialog.css";

/**
 * Generic Windows-95-esque modal dialog for confirmations and alerts.
 */
function ConfirmDialog({ title, message, icon = "!", onConfirm, onCancel, confirmLabel = "OK", cancelLabel = "Cancel" }) {
  useEffect(() => {
    const audio = new Audio(beepSfx);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog win95-raised">
        <div className="confirm-titlebar">
          <span>{title}</span>
          <button className="confirm-titlebar-close" onClick={onCancel}>
            <span>x</span>
          </button>
        </div>
        <div className="confirm-body">
          <div className={`confirm-icon confirm-icon-${icon === "?" ? "question" : icon === "!" ? "warning" : "info"}`}>
            {icon}
          </div>
          <div className="confirm-message">{message}</div>
        </div>
        <div className="confirm-actions">
          <button className="confirm-btn win95-raised" onClick={onConfirm}>
            {confirmLabel}
          </button>
          {onCancel && (
            <button className="confirm-btn win95-raised" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
