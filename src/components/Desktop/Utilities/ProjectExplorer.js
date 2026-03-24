import React, { useState } from "react";
import "../../../styles/Desktop/ProjectExplorer.css";

const projects = [
  {
    id: "discord-bot",
    title: "Game Companion Discord Bot",
    summary:
      "Developed a bot currently serving over 1000 servers, intercepting and relaying game data.",
    details: [
      "Built a stable event pipeline to process incoming game data and route it to server-specific channels.",
      "Added command handlers for status, alerts, and role-based notifications to keep communities updated in real time.",
      "Focused on uptime and moderation safety so it could scale to high traffic without noisy false triggers.",
    ],
  },
  {
    id: "ascii-player",
    title: "In-Terminal Video Player (ASCII Rendering)",
    summary:
      "Created a program displaying videos using ASCII characters within a terminal environment.",
    details: [
      "Implemented frame sampling and grayscale mapping to convert pixels into readable ASCII characters.",
      "Optimized frame timing and buffering so playback remained smooth within terminal rendering constraints.",
      "Added configurable character sets to trade visual clarity for speed depending on terminal size.",
    ],
  },
  {
    id: "machine-vision-automation",
    title: "Automation with Machine Vision",
    summary:
      "Developed automation scripts utilizing machine vision for increased efficiency in various domains.",
    details: [
      "Used template matching and image preprocessing to detect UI states before triggering automated actions.",
      "Designed workflow scripts that recover from mismatches and retry safely instead of failing silently.",
      "Reduced repetitive manual tasks by combining detection logic with rule-based decision pipelines.",
    ],
  },
  {
    id: "particle-opengl",
    title: "Particle Simulator using OpenGL",
    summary:
      "Built a particle simulator using the OpenGL graphics library.",
    details: [
      "Implemented emitter systems, velocity updates, and lifetime decay for thousands of particles.",
      "Used GPU-friendly rendering paths to keep frame rates stable while increasing visual complexity.",
      "Added tunable parameters for force fields and spawn rates to experiment with different physical behaviors.",
    ],
  },
  {
    id: "exam-prep-lm",
    title: "Language Models for Exam Prep",
    summary:
      "Implemented language models to compile a comprehensive database of IGCSE exam questions for efficient studying.",
    details: [
      "Built extraction and normalization scripts to structure question banks by subject, topic, and difficulty.",
      "Used model-assisted tagging to improve discoverability and reduce duplicate entries in revision sets.",
      "Created fast retrieval workflows so students can pull targeted practice questions in seconds.",
    ],
  },
  {
    id: "tbs-ai",
    title: "AI for Turn-Based Strategy Game",
    summary:
      "Developed a proof-of-concept AI system for a complex strategy game.",
    details: [
      "Modeled game states and action scoring to evaluate tactical choices under turn constraints.",
      "Combined heuristic evaluation with search depth controls for practical runtime performance.",
      "Validated decision quality by testing against baseline scripted opponents and edge-case scenarios.",
    ],
  },
  {
    id: "ga-paper",
    title: "Research Paper on Genetic Algorithms",
    summary:
      "Authored a research paper exploring the application and effectiveness of genetic algorithms.",
    details: [
      "Investigated selection, mutation, and crossover strategies across multiple optimization problem types.",
      "Compared convergence behavior and robustness under different population sizes and stopping criteria.",
      "Documented trade-offs between exploration and exploitation with reproducible experimental setups.",
    ],
  },
  {
    id: "gba-rom-hacking",
    title: "GBA ROM Hacking with Assembly",
    summary:
      "Modified existing GBA game code using custom Assembly language.",
    details: [
      "Reverse engineered memory regions and instruction flow to patch behavior in targeted gameplay systems.",
      "Wrote and injected custom assembly routines while preserving compatibility with original ROM structures.",
      "Tested modifications on emulator tooling to verify stability, timing, and expected behavior changes.",
    ],
  },
];

function ProjectExplorer() {
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const handleOpenProject = (project) => {
    setOpenTabs((prev) => {
      const exists = prev.find((item) => item.id === project.id);
      if (exists) return prev;
      return [...prev, project];
    });
    setActiveTabId(project.id);
  };

  const handleCloseTab = (projectId) => {
    setOpenTabs((prev) => {
      const updated = prev.filter((item) => item.id !== projectId);
      if (activeTabId === projectId) {
        setActiveTabId(updated.length ? updated[updated.length - 1].id : null);
      }
      return updated;
    });
  };

  const activeProject = openTabs.find((item) => item.id === activeTabId) || null;

  return (
    <div className="project-explorer">
      <div className="project-toolbar">
        <span>Project Explorer</span>
      </div>

      <div className="project-main">
        <div className="project-list-wrap">
          {projects.map((project, index) => (
            <button
              key={project.id}
              className="project-title-row"
              onDoubleClick={() => handleOpenProject(project)}
              title="Double click to open in a new tab"
            >
              <span className="project-index">{index + 1}.</span>
              <span className="project-title-text">{project.title}</span>
            </button>
          ))}
        </div>

        <div className="project-detail-wrap">
          <div className="project-tabs">
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTabId === tab.id ? "project-tab active" : "project-tab"}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span>{tab.title}</span>
                <button
                  className="project-tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                  aria-label="Close tab"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <div className="project-detail-content">
            {!activeProject && (
              <div className="project-empty-state">
                Double click a project title from the left list to open details in a new tab.
              </div>
            )}

            {activeProject && (
              <div className="project-description">
                <h3>{activeProject.title}</h3>
                <p>{activeProject.summary}</p>
                {activeProject.details.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="project-statusbar">
        <span>{projects.length} project(s) | {openTabs.length} tab(s) open</span>
      </div>
    </div>
  );
}

export default ProjectExplorer;
