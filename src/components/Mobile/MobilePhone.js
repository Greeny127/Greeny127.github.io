import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/Mobile/MobilePhone.css";
import calculatorIcon from "../../Icons/Apps/Calculator.png";
import notesIcon from "../../Icons/Apps/Notes.png";
import photosIcon from "../../Icons/Apps/Photos.png";
import safariIcon from "../../Icons/Apps/Safari.png";
import settingsIcon from "../../Icons/Apps/Settings.png";
import folderIcon from "../../Icons/Folder/folder.ico";
import resumePdf from "../../Sohan_Resume_Final.pdf";

const projectItems = [
  {
    title: "Game Companion Discord Bot",
    summary: "Serving 1000+ servers with game event relays.",
    details:
      "Built robust command routing, event listeners, anti-spam controls, and role-aware notifications for high-volume communities.",
  },
  {
    title: "In-Terminal Video Player (ASCII Rendering)",
    summary: "Rendered video frames as terminal-safe ASCII.",
    details:
      "Implemented grayscale-to-character mapping and frame timing logic to preserve playback continuity in text mode.",
  },
  {
    title: "Automation with Machine Vision",
    summary: "Automated repetitive visual tasks.",
    details:
      "Used visual state detection plus scripted actions to increase consistency and throughput in recurring workflows.",
  },
  {
    title: "OpenGL Particle Simulator",
    summary: "Real-time particle effects and emitters.",
    details:
      "Designed configurable emitters, velocity lifecycles, and force fields with smooth rendering at interactive framerates.",
  },
  {
    title: "Language Models for Exam Prep",
    summary: "Compiled IGCSE question sets with model-assisted tagging.",
    details:
      "Structured and indexed exam question data to speed up topic-based retrieval and revision workflow generation.",
  },
  {
    title: "AI for Turn-Based Strategy Game",
    summary: "Built a proof-of-concept tactical decision AI.",
    details:
      "Combined heuristic scoring with turn search to evaluate board states and choose competitive actions.",
  },
  {
    title: "Research Paper on Genetic Algorithms",
    summary: "Researched effectiveness of GA-based optimization.",
    details:
      "Compared mutation, crossover, and selection variants across optimization tasks and documented convergence behavior.",
  },
  {
    title: "GBA ROM Hacking with Assembly",
    summary: "Modified game behavior via custom assembly patches.",
    details:
      "Reverse engineered ROM routines and injected assembly modifications while validating behavior through emulator testing.",
  },
];

const filesMap = {
  root: [
    { id: "f1", name: "Projects", type: "folder", next: "projects" },
    { id: "f2", name: "Notes", type: "folder", next: "notes" },
    {
      id: "f3",
      name: "about.txt",
      type: "file",
      content: "Mobile portfolio build inspired by classic iPhone OS.",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "discord-bot.md",
      type: "file",
      content:
        "Game Companion Discord Bot\n- 1000+ servers\n- event relay\n- command routing",
    },
    {
      id: "p2",
      name: "opengl-sim.md",
      type: "file",
      content:
        "OpenGL Particle Simulator\n- emitters\n- lifespan update\n- force fields",
    },
  ],
  notes: [
    {
      id: "n1",
      name: "ideas.txt",
      type: "file",
      content: "Ideas:\n1) polish animations\n2) add sounds\n3) ship update",
    },
  ],
};

const photoItems = [
  { title: "Sunset Street", url: "https://picsum.photos/id/1015/800/800" },
  { title: "Forest Light", url: "https://picsum.photos/id/1043/800/800" },
  { title: "Architecture", url: "https://picsum.photos/id/1040/800/800" },
  { title: "Ocean View", url: "https://picsum.photos/id/1056/800/800" },
  { title: "Mountain Air", url: "https://picsum.photos/id/1025/800/800" },
  { title: "Night Drive", url: "https://picsum.photos/id/1074/800/800" },
];

const HOME_APPS = [
  { id: "projects", label: "Projects", icon: safariIcon },
  { id: "files", label: "Files", icon: folderIcon },
  { id: "resume", label: "My Resume", icon: notesIcon },
  { id: "settings", label: "Settings", icon: settingsIcon },
  { id: "photos", label: "Photos", icon: photosIcon },
  { id: "calculator", label: "Calculator", icon: calculatorIcon },
];

const DOCK_APPS = [
  { id: "projects", label: "Projects", icon: safariIcon },
  { id: "resume", label: "My Resume", icon: notesIcon },
  { id: "photos", label: "Photos", icon: photosIcon },
  { id: "calculator", label: "Calculator", icon: calculatorIcon },
  { id: "files", label: "Files", icon: folderIcon },
];

function MobilePhone() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [now, setNow] = useState(new Date());
  const [sliderX, setSliderX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef(null);
  const dragOffsetRef = useRef(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fileLocation, setFileLocation] = useState("root");
  const [openedFile, setOpenedFile] = useState(null);
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(false);
  const [brightness, setBrightness] = useState(78);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [calcDisplay, setCalcDisplay] = useState("0");

  const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateLabel = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  const filesAtLocation = filesMap[fileLocation] || [];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isDragging) return undefined;

    const onMove = (e) => {
      if (e.touches && e.touches[0]) {
        moveDrag(e.touches[0].clientX);
      } else {
        moveDrag(e.clientX);
      }
    };

    const onEnd = () => {
      endDrag();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, sliderX]);

  const getMaxSliderX = () => {
    if (!sliderTrackRef.current) return 0;
    const trackWidth = sliderTrackRef.current.clientWidth;
    const knobWidth = 58;
    return Math.max(trackWidth - knobWidth - 4, 0);
  };

  const startDrag = (clientX) => {
    setIsDragging(true);
    dragOffsetRef.current = clientX - sliderX;
  };

  const moveDrag = (clientX) => {
    if (!isDragging) return;
    const next = clientX - dragOffsetRef.current;
    const clamped = Math.max(0, Math.min(next, getMaxSliderX()));
    setSliderX(clamped);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const threshold = getMaxSliderX() * 0.72;
    if (sliderX >= threshold) {
      setIsUnlocked(true);
      setSliderX(0);
    } else {
      setSliderX(0);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const point = e.touches[0];
    if (!point) return;
    startDrag(point.clientX);
  };

  const handleTouchMove = (e) => {
    const point = e.touches[0];
    if (!point) return;
    moveDrag(point.clientX);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX);
  };
  const handleMouseMove = (e) => moveDrag(e.clientX);
  const handleMouseUp = () => endDrag();

  const appHeaderTitle = useMemo(() => {
    if (activeApp === "projects") return "Project Explorer";
    if (activeApp === "files") return "Files";
    if (activeApp === "resume") return "My Resume";
    if (activeApp === "settings") return "Settings";
    if (activeApp === "photos") return "Photos";
    if (activeApp === "calculator") return "Calculator";
    return "";
  }, [activeApp]);

  const closeApp = () => {
    setActiveApp(null);
    setSelectedProject(null);
    setOpenedFile(null);
    setSelectedPhoto(null);
  };

  const handleCalcPress = (value) => {
    if (value === "C") {
      setCalcDisplay("0");
      return;
    }

    if (value === "⌫") {
      setCalcDisplay((prev) => {
        if (prev.length <= 1) return "0";
        return prev.slice(0, -1);
      });
      return;
    }

    if (value === "=") {
      try {
        const expression = calcDisplay.replace(/÷/g, "/").replace(/×/g, "*");
        const result = Function(`"use strict"; return (${expression})`)();
        if (Number.isFinite(result)) {
          setCalcDisplay(String(result));
        } else {
          setCalcDisplay("Error");
        }
      } catch (error) {
        setCalcDisplay("Error");
      }
      return;
    }

    setCalcDisplay((prev) => {
      const cleanPrev = prev === "Error" ? "0" : prev;
      if (cleanPrev === "0" && /[0-9.]/.test(value)) return value;
      return cleanPrev + value;
    });
  };

  if (!isUnlocked) {
    return (
      <div className="iphone-shell">
        <div className="iphone-screen lock-screen">
          <div className="mobile-statusbar">
            <div className="status-left">
              <span className="signal-bars">.....</span>
              <span>Cingular</span>
            </div>
            <span className="status-time">{timeLabel}</span>
            <div className="status-right">
              <span>100%</span>
              <span className="battery">|====|</span>
            </div>
          </div>

          <div className="lock-main">
            <h1>{timeLabel}</h1>
            <p>{dateLabel}</p>
          </div>

          <div ref={sliderTrackRef} className="slide-unlock" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={endDrag}>
            <div className="slide-shimmer" />
            <div
              className="slide-knob"
              style={{ transform: `translateX(${sliderX}px)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              &gt;
            </div>
            <span className="slide-text">slide to unlock</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iphone-shell">
      <div className="iphone-screen home-screen" style={{ filter: `brightness(${brightness}%)` }}>
        <div className="mobile-statusbar">
          <div className="status-left">
            <span className="signal-bars">.....</span>
            <span>Cingular</span>
          </div>
          <span className="status-time">{timeLabel}</span>
          <div className="status-right">
            <span>100%</span>
            <span className="battery">|====|</span>
          </div>
        </div>

        {!activeApp && (
          <>
            <div className="app-grid">
              {HOME_APPS.map((app) => (
                <button key={app.id} className="app-icon" onClick={() => setActiveApp(app.id)}>
                  <span className="app-glyph icon-shell">
                    <img src={app.icon} alt={app.label} className="app-icon-image" />
                  </span>
                  <span>{app.label}</span>
                </button>
              ))}
            </div>

            <div className="iphone-dock">
              {DOCK_APPS.map((app) => (
                <button key={app.id} className="dock-icon-btn" onClick={() => setActiveApp(app.id)}>
                  <img src={app.icon} alt={app.label} className="dock-icon-image" />
                </button>
              ))}
            </div>
          </>
        )}

        {activeApp && (
          <div className="mobile-app-window">
            <div className="mobile-app-header">
              <button onClick={closeApp}>Home</button>
              <h3>{appHeaderTitle}</h3>
            </div>

            <div className="mobile-app-content">
              {activeApp === "projects" && (
                <>
                  {!selectedProject && (
                    <ul className="mobile-list">
                      {projectItems.map((item) => (
                        <li key={item.title} onClick={() => setSelectedProject(item)} className="mobile-list-item">
                          <strong>{item.title}</strong>
                          <small>{item.summary}</small>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedProject && (
                    <div className="mobile-detail">
                      <button className="inline-back" onClick={() => setSelectedProject(null)}>Back to list</button>
                      <h4>{selectedProject.title}</h4>
                      <p>{selectedProject.summary}</p>
                      <p>{selectedProject.details}</p>
                    </div>
                  )}
                </>
              )}

              {activeApp === "files" && (
                <>
                  <div className="files-topbar">
                    <button
                      className="inline-back"
                      disabled={fileLocation === "root"}
                      onClick={() => {
                        setOpenedFile(null);
                        setFileLocation("root");
                      }}
                    >
                      Root
                    </button>
                    <span>{fileLocation}</span>
                  </div>

                  {!openedFile && (
                    <ul className="mobile-list">
                      {filesAtLocation.map((entry) => (
                        <li
                          key={entry.id}
                          onClick={() => {
                            if (entry.type === "folder") {
                              setFileLocation(entry.next);
                            } else {
                              setOpenedFile(entry);
                            }
                          }}
                          className="mobile-list-item"
                        >
                          <strong>{entry.name}</strong>
                          <small>{entry.type === "folder" ? "Folder" : "File"}</small>
                        </li>
                      ))}
                    </ul>
                  )}

                  {openedFile && (
                    <div className="mobile-detail">
                      <button className="inline-back" onClick={() => setOpenedFile(null)}>Back to files</button>
                      <h4>{openedFile.name}</h4>
                      <pre>{openedFile.content}</pre>
                    </div>
                  )}
                </>
              )}

              {activeApp === "resume" && (
                <div className="mobile-resume-viewer">
                  <iframe title="My Resume PDF" src={resumePdf} className="mobile-resume-frame" />
                  <a href={resumePdf} target="_blank" rel="noreferrer" className="mobile-resume-link">
                    Open PDF in new tab
                  </a>
                </div>
              )}

              {activeApp === "settings" && (
                <div className="settings-list">
                  <button className="setting-row" onClick={() => setWifiOn((prev) => !prev)}>
                    <span>Wi-Fi</span>
                    <strong>{wifiOn ? "On" : "Off"}</strong>
                  </button>
                  <button className="setting-row" onClick={() => setBtOn((prev) => !prev)}>
                    <span>Bluetooth</span>
                    <strong>{btOn ? "On" : "Off"}</strong>
                  </button>
                  <div className="setting-slider">
                    <span>Brightness</span>
                    <input
                      type="range"
                      min="45"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                    />
                    <strong>{brightness}%</strong>
                  </div>
                </div>
              )}

              {activeApp === "photos" && (
                <>
                  {!selectedPhoto && (
                    <div className="photo-grid">
                      {photoItems.map((photo, idx) => (
                        <button key={photo.title} className="photo-cell" onClick={() => setSelectedPhoto({ ...photo, id: idx })}>
                          <img src={photo.url} alt={photo.title} className="photo-thumb" />
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPhoto && (
                    <div className="mobile-detail">
                      <button className="inline-back" onClick={() => setSelectedPhoto(null)}>Back to album</button>
                      <h4>{selectedPhoto.title}</h4>
                      <div className="photo-preview">
                        <img src={selectedPhoto.url} alt={selectedPhoto.title} className="photo-preview-image" />
                      </div>
                      <p>Captured and curated for portfolio presentation.</p>
                    </div>
                  )}
                </>
              )}

              {activeApp === "calculator" && (
                <div className="calc-wrap">
                  <div className="calc-display">{calcDisplay}</div>
                  <div className="calc-grid">
                    {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+", "C", "⌫"].map((key) => (
                      <button
                        key={key}
                        className={key === "=" ? "calc-btn equals" : "calc-btn"}
                        onClick={() => handleCalcPress(key)}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobilePhone;
