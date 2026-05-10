"use client";
import styles from "./upload.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState, useEffect, useRef } from "react";

const PDF_STEPS = [
  "Uploading file",
  "Extracting text from PDF",
  "Chunking document",
  "Generating embeddings",
  "Indexing into knowledge base",
];

const YOUTUBE_STEPS = [
  "Submitting link",
  "Fetching transcript",
  "Chunking transcript",
  "Generating embeddings",
  "Indexing into knowledge base",
];

export default function Upload() {
  const [activeTab, setActiveTab] = useState("pdf");
  const [file, setFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [contentLabel, setContentLabel] = useState(""); // file name or YT link

  const [contentId, setContentId] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const pollRef = useRef(null);

  // Derive steps based on active tab
  const PROCESSING_STEPS = activeTab === "pdf" ? PDF_STEPS : YOUTUBE_STEPS;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/project/fetch", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { setProjectsError("Unauthorized. Please log in."); return; }
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.projects);
        if (data.projects.length > 0) setSelectedProject(data.projects[0].id);
      } catch (err) {
        console.error(err);
        setProjectsError("Could not load projects.");
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!contentId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/content/upload/status/${contentId}`);
        if (!res.ok) {
          setProcessingStatus("failed");
          clearInterval(pollRef.current);
          return;
        }
        const data = await res.json();
        if (data.status === "ready") {
          setProcessingStatus("ready");
          setActiveStepIndex(PROCESSING_STEPS.length);
          clearInterval(pollRef.current);
        } else if (data.status === "failed") {
          setProcessingStatus("failed");
          clearInterval(pollRef.current);
        } else {
          setActiveStepIndex((prev) =>
            prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev
          );
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(pollRef.current);
  }, [contentId]);

  const resetProcessing = () => {
    setContentId(null);
    setProcessingStatus(null);
    setActiveStepIndex(0);
    setFile(null);
    setYoutubeLink("");
    setContentLabel("");
    clearInterval(pollRef.current);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedProject) { alert("Please select a project first!"); return; }
    if (!selectedFile) return;

    const maxSize = 2 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert("File size should be less than 2MB");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setContentLabel(selectedFile.name);
    setProcessingStatus("uploading");
    setActiveStepIndex(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", "PDF");
    formData.append("title", selectedFile.name);
    formData.append("projectId", selectedProject);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setContentId(data.content.id);
      setProcessingStatus("processing");
      setActiveStepIndex(1);
    } catch (err) {
      console.error(err);
      setProcessingStatus("failed");
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!selectedProject) { alert("Please select a project first!"); return; }
    if (!youtubeLink.trim()) { alert("Please enter a YouTube link."); return; }

    setContentLabel(youtubeLink.trim());
    setProcessingStatus("uploading");
    setActiveStepIndex(0);

    const formData = new FormData();
    formData.append("type", "YOUTUBE");
    formData.append("youtubeUrl", youtubeLink.trim());
    formData.append("title", youtubeLink.trim());
    formData.append("projectId", selectedProject);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setContentId(data.content.id);
      setProcessingStatus("processing");
      setActiveStepIndex(1);
    } catch (err) {
      console.error(err);
      setProcessingStatus("failed");
    }
  };

  const progressPercent =
    processingStatus === "ready"
      ? 100
      : processingStatus === "failed"
        ? Math.round((activeStepIndex / PROCESSING_STEPS.length) * 100)
        : Math.round((activeStepIndex / PROCESSING_STEPS.length) * 90);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />

        <div className={styles.header}>
          <h2>Upload Content</h2>
        </div>

        {/* Project Dropdown */}
        <div className={styles.projectSelector}>
          <label>Select Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={styles.dropdown}
            disabled={projectsLoading}
          >
            {projectsLoading ? (
              <option value="">Loading projects…</option>
            ) : projectsError ? (
              <option value="">{projectsError}</option>
            ) : projects.length === 0 ? (
              <option value="">No projects found</option>
            ) : (
              projects.map((proj) => (
                <option key={proj.id} value={proj.id}>{proj.title}</option>
              ))
            )}
          </select>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "pdf" ? styles.activeTab : ""}
            onClick={() => { setActiveTab("pdf"); resetProcessing(); }}
          >
            Upload PDF
          </button>
          <button
            className={activeTab === "youtube" ? styles.activeTab : ""}
            onClick={() => { setActiveTab("youtube"); resetProcessing(); }}
          >
            Add YouTube Link
          </button>
        </div>

        {/* Upload areas — hide while processing */}
        {!processingStatus && (
          <>
            {activeTab === "pdf" && (
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  id="fileUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <p>
                  Drag & drop your file here or{" "}
                  <label htmlFor="fileUpload" className={styles.browse}>Browse</label>
                </p>
              </div>
            )}

            {activeTab === "youtube" && (
              <div className={styles.uploadBox}>
                <input
                  type="text"
                  placeholder="Enter YouTube link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleYoutubeSubmit}>Submit</button>
              </div>
            )}
          </>
        )}

        {/* Processing Status Card */}
        {processingStatus && (
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <div className={styles.statusFileName}>
                <span>{contentLabel}</span>
              </div>
              <span className={`${styles.statusBadge} ${styles[`badge_${processingStatus}`]}`}>
                {processingStatus === "ready" ? "Ready" :
                  processingStatus === "failed" ? "Failed" : "Processing…"}
              </span>
            </div>

            <div className={styles.progressWrap}>
              <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
            </div>

            <div className={styles.steps}>
              {PROCESSING_STEPS.map((label, i) => {
                const isDone = processingStatus === "ready" || i < activeStepIndex;
                const isActive = !isDone && i === activeStepIndex && processingStatus !== "failed";
                const isFailed = processingStatus === "failed" && i === activeStepIndex;
                return (
                  <div key={i} className={styles.step}>
                    <div className={`${styles.stepIcon} ${
                      isFailed ? styles.stepFailed :
                      isDone ? styles.stepDone :
                      isActive ? styles.stepActive : styles.stepPending
                    }`}>
                      {isFailed ? "✕" : isDone ? "✓" : isActive ? <span className={styles.spinner} /> : "·"}
                    </div>
                    <span className={`${styles.stepLabel} ${
                      isDone ? styles.labelDone :
                      isActive ? styles.labelActive : styles.labelPending
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {(processingStatus === "ready" || processingStatus === "failed") && (
              <div className={styles.statusFooter}>
                {processingStatus === "failed" && (
                  <p className={styles.errorMsg}>Processing failed. Please try again.</p>
                )}
                <button onClick={resetProcessing} className={styles.retryBtn}>
                  {processingStatus === "failed" ? "Try Again" : "Upload Another"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}