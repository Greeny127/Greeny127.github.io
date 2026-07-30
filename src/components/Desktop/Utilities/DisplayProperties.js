import React, { useState } from "react";
import "../../../styles/Desktop/DisplayProperties.css";

const swatches = [
  { name: "Teal", value: "#008080" },
  { name: "Navy", value: "#000080" },
  { name: "Maroon", value: "#800000" },
  { name: "Dark Green", value: "#004040" },
  { name: "Purple", value: "#400040" },
  { name: "Charcoal", value: "#1a1a1a" },
  { name: "Gray", value: "#808080" },
  { name: "Slate Blue", value: "#003366" },
];

function DisplayProperties({ currentColor, onApply }) {
  const [pending, setPending] = useState(currentColor);

  return (
    <div className="display-props">
      <div className="display-props-tabs">
        <div className="display-props-tab active">Background</div>
        <div className="display-props-tab">Screen Saver</div>
        <div className="display-props-tab">Appearance</div>
      </div>

      <div className="display-props-body">
        <div className="display-props-preview-wrap">
          <div className="display-monitor">
            <div className="display-monitor-screen" style={{ backgroundColor: pending }} />
          </div>
        </div>

        <div className="display-props-swatches">
          <div className="display-props-label">Desktop Color:</div>
          <div className="swatch-grid">
            {swatches.map((s) => (
              <button
                key={s.value}
                className={pending === s.value ? "swatch-btn swatch-selected" : "swatch-btn"}
                style={{ backgroundColor: s.value }}
                title={s.name}
                onClick={() => setPending(s.value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="display-props-actions">
        <button className="display-props-btn" onClick={() => onApply(pending)}>
          OK
        </button>
        <button className="display-props-btn" onClick={() => setPending(currentColor)}>
          Cancel
        </button>
        <button className="display-props-btn" onClick={() => onApply(pending)}>
          Apply
        </button>
      </div>
    </div>
  );
}

export default DisplayProperties;
