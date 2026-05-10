"use client";
import { useState } from "react";

export default function GenerateNotesButton({ projectId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);

    const handleGenerate = async () => {
        if (!projectId) { alert("No project selected."); return; }

        setLoading(true);
        setError(null);
        setDone(false);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/content/gen/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            downloadDocx(data.notes);
            setDone(true);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadDocx = (notes) => {
        // Build plain text content formatted for .txt download
        // For a real .docx, wire in the docx library (see note below)
        const lines = [
            notes.title,
            "=".repeat(notes.title.length),
            "",
            ...notes.sections.flatMap(s => [
                s.heading,
                "-".repeat(s.heading.length),
                ...s.points.map(p => `• ${p}`),
                "",
            ]),
            "Summary",
            "-------",
            notes.summary,
        ];

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${notes.title || "notes"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
            <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: done ? "#16a34a" : loading ? "#93c5fd" : "#3b82f6",
                    color: "#fff",
                    transition: "background 0.2s",
                    opacity: loading ? 0.8 : 1,
                }}
            >
                {loading ? "Generating…" : done ? "✓ Notes Generated" : "Generate Notes"}
            </button>

            {error && (
                <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>
                    {error}
                </p>
            )}
        </div>
    );
}