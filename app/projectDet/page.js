"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./projectDet.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("selectedProject");

    if (saved) {
      setProject(JSON.parse(saved));
    }
  }, []);

  if (!project) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Navbar />
          <div className={styles.loading}>No project selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className={styles.main}>
        {/* ✅ Navbar */}
        <Navbar />

        {/* Project Info */}
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>

        {/* Topics */}
        <div className={styles.section}>
          <h2>Important Topics</h2>
          <div className={styles.tags}>
            {project.topicAnalysis?.topics.map((topic, index) => (
              <span key={index} className={styles.tag}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className={styles.section}>
          <h2>Generated Questions</h2>
          <ul className={styles.list}>
            {project.questionBanks?.map((q, index) => (
              <li key={index} className={styles.card}>
                {q.question}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className={styles.section}>
          <h2>Notes</h2>
          <ul className={styles.list}>
            {project.notes?.map((note, index) => (
              <li key={index} className={styles.card}>
                {note.content}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.askBtnContainer}>
          <button
            className={styles.askBtn}
            onClick={() => router.push("/questions")}
          >
            Ask Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;