import React from "react";
import "../../../styles/Desktop/ResumeViewer.css";

function ResumeViewer({ pdfSrc }) {
  return (
    <div className="resume-viewer">
      <div className="resume-toolbar">
        <span className="resume-toolbar-label">Sohan_Resume_Final.pdf</span>
        <div className="resume-toolbar-actions">
          <a className="resume-toolbar-btn" href={pdfSrc} target="_blank" rel="noopener noreferrer">
            Open in New Tab
          </a>
          <a className="resume-toolbar-btn" href={pdfSrc} download="Sohan_Resume_Final.pdf">
            Download
          </a>
        </div>
      </div>
      <div className="resume-embed-wrap">
        <embed src={pdfSrc} type="application/pdf" className="resume-embed" />
      </div>
    </div>
  );
}

export default ResumeViewer;
