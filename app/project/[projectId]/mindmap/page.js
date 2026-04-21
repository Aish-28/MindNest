"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeStyles = {
  root:    { background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: "bold", fontSize: 16, width: 180 },
  concept: { background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8,  padding: "8px 16px",  fontWeight: "600",  fontSize: 14, width: 160 },
  detail:  { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 6, padding: "6px 12px", fontSize: 13, width: 150 },
};

function layoutNodes(rawNodes, rawEdges) {
  const root = rawNodes.find(n => n.type === "root");
  const concepts = rawNodes.filter(n => n.type === "concept");
  const details = rawNodes.filter(n => n.type === "detail");

  const positioned = [];

  positioned.push({
    id: root.id,
    data: { label: root.label },
    position: { x: 600, y: 300 },
    type: "default", // ✅ always use "default"
    style: nodeStyles.root,
  });

  concepts.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / concepts.length;
    const x = 600 + 300 * Math.cos(angle);
    const y = 300 + 220 * Math.sin(angle);
    positioned.push({
      id: node.id,
      data: { label: node.label },
      position: { x, y },
      type: "default", // ✅
      style: nodeStyles.concept,
    });
  });

  details.forEach((node) => {
    const parentEdge = rawEdges.find(e => e.target === node.id);
    const parent = positioned.find(n => n.id === parentEdge?.source);
    const siblings = details.filter(d => {
      const e = rawEdges.find(edge => edge.target === d.id);
      return e?.source === parentEdge?.source;
    });
    const sibIndex = siblings.findIndex(s => s.id === node.id);
    const offset = (sibIndex - (siblings.length - 1) / 2) * 170;
    const x = parent ? parent.position.x + offset : 600;
    const y = parent ? parent.position.y + (parent.position.y > 300 ? 160 : -160) : 500;

    positioned.push({
      id: node.id,
      data: { label: node.label },
      position: { x, y },
      type: "default", // ✅
      style: nodeStyles.detail,
    });
  });

  return positioned;
}

export default function MindMapPage() {
  const { projectId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const generateMindMap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/gen/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { mindmap } = data;
      setTitle(mindmap.title);

      const positionedNodes = layoutNodes(mindmap.nodes, mindmap.edges);

      const formattedEdges = mindmap.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: false,
        style: { stroke: "#475569", strokeWidth: 2 },
        labelStyle: { fill: "#94a3b8", fontSize: 11 },
        labelBgStyle: { fill: "#0f172a" },
      }));

      setNodes(positionedNodes);
      setEdges(formattedEdges);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    generateMindMap();
  }, [generateMindMap]);

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #6366f1", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#94a3b8" }}>Generating mind map from your material...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#f87171", marginBottom: 16 }}>{error}</p>
        <button onClick={generateMindMap} style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    // ✅ explicit height on every wrapper
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", background: "#020617" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#fff", fontWeight: "bold", fontSize: 20, margin: 0 }}>{title}</h1>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>AI-generated concept map</p>
        </div>
        <button onClick={generateMindMap} style={{ padding: "8px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
          Regenerate
        </button>
      </div>

      {/* ✅ this div must have explicit height */}
      <div style={{ flex: 1, height: "calc(100vh - 73px)", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <Controls />
          <MiniMap
            nodeColor={n => n.style?.background ?? "#334155"}
            style={{ background: "#1e293b" }}
          />
          <Background color="#1e293b" gap={24} />
        </ReactFlow>
      </div>
    </div>
  );
}