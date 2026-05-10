"use client";
import { useState } from "react";

export default function GenerateQAButton({ projectId, count = 5 }) {
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
      const res = await fetch("/api/content/gen/qanda", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId, count }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      downloadTxt(data.pairs);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = (pairs) => {
    const lines = pairs.flatMap((pair, i) => [
      `Q${i + 1}: ${pair.question}`,
      `A${i + 1}: ${pair.answer}`,
      "",
    ]);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qa-bank.txt";
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
        {loading ? "Generating…" : done ? "✓ Q&A Generated" : "Generate Q&A"}
      </button>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "12px", margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}