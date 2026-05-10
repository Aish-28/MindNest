"use client";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/project/fetch", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProjects(data.projects);
        else console.error(data.message);
      } catch (err) {
        console.log("Error in fetching projects: ", err);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async () => {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: form.title, description: form.description }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [data.newProject, ...prev]);
        setForm({ title: "", description: "" });
        setShowForm(false);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("Error in creating project: ", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  return (
    <div style={s.layout}>
      <Sidebar />

      <div style={s.main}>
        <Navbar />

        {/* Page header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Projects</h1>
            <p style={s.pageSubtitle}>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            style={showForm ? s.cancelBtn : s.newBtn}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "+ New Project"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>New Project</h3>
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={form.title}
              onChange={handleChange}
              style={s.input}
            />
            <textarea
              name="description"
              placeholder="Project description (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={s.textarea}
            />
            <div style={s.formActions}>
              <button
                onClick={handleCreateProject}
                disabled={creating || !form.title.trim()}
                style={{
                  ...s.createBtn,
                  opacity: creating || !form.title.trim() ? 0.6 : 1,
                  cursor: creating || !form.title.trim() ? "not-allowed" : "pointer",
                }}
              >
                {creating ? "Creating…" : "Create Project"}
              </button>
            </div>
          </div>
        )}

        {/* Project grid */}
        {projects.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>📁</div>
            <h3 style={s.emptyTitle}>No projects yet</h3>
            <p style={s.emptyDesc}>Create your first project to get started</p>
            <button style={s.newBtn} onClick={() => setShowForm(true)}>
              + New Project
            </button>
          </div>
        ) : (
          <div style={s.grid}>
            {projects.map((proj) => (
              <div key={proj.id} style={s.card}>
                {/* Card top */}
                <div style={s.cardTop}>
                  <div style={s.cardIconWrap}>📌</div>
                  <span style={s.cardDate}>
                    {new Date(proj.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Card body */}
                <div style={s.cardBody}>
                  <h3 style={s.cardTitle}>{proj.title}</h3>
                  <p style={s.cardDesc}>
                    {proj.description || "No description provided."}
                  </p>
                </div>

                {/* Card footer */}
                <div style={s.cardFooter}>
                  <button
                    style={s.openBtn}
                    onClick={() => {
                      localStorage.setItem("selectedProject", JSON.stringify(proj));
                      router.push(`/project/${proj.id}`);
                    }}
                  >
                    Open →
                  </button>
                  <button
                    style={s.deleteBtn}
                    onClick={() => handleDelete(proj.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "60px",
  },

  /* Page header */
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 48px 28px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  newBtn: {
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: 600,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  cancelBtn: {
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: 600,
    background: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
  },

  /* Create form */
  formCard: {
    margin: "28px 48px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderTop: "3px solid #6366f1",
    borderRadius: "14px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  formTitle: {
    fontSize: "15px",
    fontWeight: 650,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    outline: "none",
    color: "#0f172a",
    background: "#f8fafc",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    outline: "none",
    color: "#0f172a",
    background: "#f8fafc",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.6,
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  createBtn: {
    padding: "10px 22px",
    fontSize: "13px",
    fontWeight: 600,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    letterSpacing: "0.01em",
  },

  /* Empty state */
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "100px 48px",
    textAlign: "center",
  },
  emptyIcon: { fontSize: "48px" },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 650,
    color: "#0f172a",
    margin: 0,
  },
  emptyDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "0 0 8px",
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "18px",
    padding: "32px 48px",
  },

  /* Card */
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardIconWrap: {
    fontSize: "20px",
    lineHeight: 1,
  },
  cardDate: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: 500,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 650,
    color: "#0f172a",
    margin: "0 0 6px",
    letterSpacing: "-0.01em",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    display: "flex",
    gap: "8px",
    paddingTop: "4px",
    borderTop: "1px solid #f1f5f9",
  },
  openBtn: {
    flex: 1,
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  deleteBtn: {
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 500,
    background: "transparent",
    color: "#ef4444",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    cursor: "pointer",
  },
};