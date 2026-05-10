"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GenerateNotesButton from "../../../components/GenerateNotesButton";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import GenerateQAButton from "../../../components/GenerateQAButton";

const toolCards = (projectId, router) => [
  {
    key: "ask",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Ask Questions",
    description: "Chat with your project content using AI",
    accent: "#6366f1",
    accentBg: "#eef2ff",
    action: () => router.push(`/questions/${projectId}`),
    isButton: true,
    buttonText: "Open Chat →",
  },
  {
    key: "mindmap",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <circle cx="4" cy="6" r="2" />
        <circle cx="20" cy="6" r="2" />
        <circle cx="4" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <line x1="12" y1="9" x2="6" y2="7" />
        <line x1="12" y1="9" x2="18" y2="7" />
        <line x1="12" y1="15" x2="6" y2="17" />
        <line x1="12" y1="15" x2="18" y2="17" />
      </svg>
    ),
    label: "Mind Map",
    description: "Visualize concepts and relationships",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
    action: () => router.push(`/project/${projectId}/mindmap`),
    isButton: true,
    buttonText: "View Map →",
  },
  {
    key: "notes",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    label: "Generate Notes",
    description: "Create structured study notes from your content",
    accent: "#10b981",
    accentBg: "#f0fdf4",
    isCustom: "notes",
  },
  {
    key: "qa",
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: "Generate Q&A",
    description: "Build a question bank from your material",
    accent: "#f59e0b",
    accentBg: "#fffbeb",
    isCustom: "qa",
  },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/project/${projectId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        console.log("Error fetching project", err);
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div style={s.fullCenter}>
        <div style={s.spinner} />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={s.fullCenter}>
        <p style={{ color: "#94a3b8" }}>Project not found</p>
      </div>
    );
  }

  const stats = [
    { label: "Notes", value: project.notes?.length ?? 0, icon: "📄" },
    { label: "Question Banks", value: project.questionBanks?.length ?? 0, icon: "❓" },
    { label: "Content Files", value: project.contents?.length ?? 0, icon: "📁" },
  ];

  const cards = toolCards(projectId, router);

  return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Navbar />

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroBadge}>Project</div>
          <h1 style={s.heroTitle}>{project.title}</h1>
          {project.description && (
            <p style={s.heroDesc}>{project.description}</p>
          )}
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {stats.map((stat) => (
            <div key={stat.label} style={s.statCard}>
              <span style={s.statIcon}>{stat.icon}</span>
              <div>
                <div style={s.statValue}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Tools</h2>
          <p style={s.sectionSub}>Everything you need to study this project</p>
        </div>

        <div style={s.grid}>
          {cards.map((card) => (
            <div key={card.key} style={{ ...s.card, borderTopColor: card.accent }}>
              <div style={{ ...s.cardIcon, background: card.accentBg, color: card.accent }}>
                {card.icon}
              </div>
              <div style={s.cardBody}>
                <h3 style={s.cardTitle}>{card.label}</h3>
                <p style={s.cardDesc}>{card.description}</p>
              </div>
              <div style={s.cardFooter}>
                {card.isButton && (
                  <button
                    onClick={card.action}
                    style={{ ...s.cardBtn, background: card.accent }}
                  >
                    {card.buttonText}
                  </button>
                )}
                {card.isCustom === "notes" && (
                  <GenerateNotesButton projectId={projectId} accent={card.accent} />
                )}
                {card.isCustom === "qa" && (
                  <GenerateQAButton projectId={projectId} accent={card.accent} />
                )}
              </div>
            </div>
          ))}
        </div>
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
  fullCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f8fafc",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  hero: {
    padding: "48px 48px 36px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
  },
  heroBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6366f1",
    background: "#eef2ff",
    padding: "4px 12px",
    borderRadius: "99px",
    marginBottom: "14px",
  },
  heroTitle: {
    fontSize: "clamp(26px, 3.5vw, 38px)",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 10px",
    letterSpacing: "-0.02em",
  },
  heroDesc: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
    maxWidth: 520,
    lineHeight: 1.7,
  },

  statsRow: {
    display: "flex",
    gap: "14px",
    padding: "24px 48px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 22px",
    flex: "1 1 140px",
  },
  statIcon: { fontSize: "22px" },
  statValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "2px",
  },

  sectionHeader: {
    padding: "36px 48px 20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.01em",
  },
  sectionSub: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    padding: "0 48px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderTop: "3px solid transparent",
    borderRadius: "14px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  cardIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 650,
    color: "#0f172a",
    margin: "0 0 5px",
    letterSpacing: "-0.01em",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },
  cardFooter: { marginTop: "4px" },
  cardBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
};