"use client";
import styles from "./project.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState, useEffect } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  // Load projects
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // Create project
  const handleCreateProject = () => {
    if (!newProject.trim()) return;

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    setNewProject("");
  };

  // Delete project (optional but useful)
  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        <h2 className={styles.title}>Projects</h2>

        {/* Create Project */}
        <div className={styles.createBox}>
          <input
            type="text"
            placeholder="Enter project name..."
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button onClick={handleCreateProject}>
            Create
          </button>
        </div>

        {/* Project List */}
        <div className={styles.projectGrid}>
          {projects.length === 0 ? (
            <p className={styles.para}>No projects yet? Create one...</p>
          ) : (
            projects.map((proj, index) => (
              <div key={index} className={styles.card}>
                <h3 className={styles.projName}>{proj}</h3>

                <div className={styles.actions}>
                  <button className={styles.openBtn}>
                    Open
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}