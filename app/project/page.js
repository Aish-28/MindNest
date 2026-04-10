"use client";
import styles from "./project.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // Load projects
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create project
  const handleCreateProject = () => {
    if (!form.title.trim()) return;

    const newProj = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      createdAt: new Date().toLocaleDateString(),

      // Add dummy details here so details page works
      topicAnalysis: {
        topics: ["Sample Topic 1", "Sample Topic 2"],
      },
      questionBanks: [
        { question: "Sample Question 1?" },
        { question: "Sample Question 2?" },
      ],
      notes: [
        { content: "Sample note 1" },
        { content: "Sample note 2" },
      ],
    };

    const updated = [newProj, ...projects];

    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));

    setForm({ title: "", description: "" });
  };

  // Delete project
  const handleDelete = (id) => {
    const updated = projects.filter((proj) => proj.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        <h2 className={styles.title}>Projects</h2>

        {/* Create Form */}
        <div className={styles.formBox}>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
          />

          <button onClick={handleCreateProject}>
            Create Project
          </button>
        </div>

        {/* Project List */}
        <div className={styles.projectGrid}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📁</div>
              <h3>No Projects Yet</h3>
              <p>Create your first project to get started</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className={styles.card}>
                
                <div className={styles.cardHeader}>
                  <h3>📌 {proj.title}</h3>
                  <span className={styles.date}>{proj.createdAt}</span>
                </div>

                <p className={styles.desc}>
                  {proj.description || "No description provided."}
                </p>

                <div className={styles.actions}>
                  <button
                    className={styles.openBtn}
                    onClick={() => {
                      localStorage.setItem("selectedProject", JSON.stringify(proj));
                      router.push("/projectDet");
                    }}
                  >
                    Open
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(proj.id)}
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