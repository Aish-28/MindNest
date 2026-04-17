import { NextResponse } from "next/server";
import { searchSimilarChunks } from "../../../../lib/search";
import { askGemini } from "../../../../lib/geminiConfig";

export async function POST(request) {
    try {
        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json({ error: "projectId is required" }, { status: 400 });
        }

        const seedQueries = [
            "main topics and concepts",
            "key definitions and terms",
            "relationships between ideas",
            "core principles and theories",
            "processes and mechanisms",
        ];

        const chunkSets = await Promise.all(
            seedQueries.map(q => searchSimilarChunks(q, projectId, 4))
        );

        const allChunks = [...new Set(chunkSets.flat())];

        if (allChunks.length === 0) {
            return NextResponse.json({ error: "No content found for this project" }, { status: 404 });
        }

        const prompt = `
You are an expert at analyzing study material and identifying concept relationships.
Based ONLY on the context below, generate a mind map structure.

CONTEXT:
${allChunks.join("\n\n---\n\n")}

Return ONLY a valid JSON object in this exact format, no markdown, no explanation:
{
  "title": "Central topic of the material",
  "nodes": [
    { "id": "1", "label": "Central Topic", "type": "root" },
    { "id": "2", "label": "Main Concept A", "type": "concept" },
    { "id": "3", "label": "Main Concept B", "type": "concept" },
    { "id": "4", "label": "Sub concept of A", "type": "detail" },
    { "id": "5", "label": "Sub concept of A", "type": "detail" },
    { "id": "6", "label": "Sub concept of B", "type": "detail" }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "label": "includes" },
    { "id": "e1-3", "source": "1", "target": "3", "label": "includes" },
    { "id": "e2-4", "source": "2", "target": "4", "label": "involves" },
    { "id": "e2-5", "source": "2", "target": "5", "label": "involves" },
    { "id": "e3-6", "source": "3", "target": "6", "label": "involves" }
  ]
}

STRUCTURE RULES (strictly follow all of these):
- The structure must be exactly 3 levels deep: root → concept → detail. No other hierarchy is allowed.
- There must be exactly 1 root node (type: "root") representing the central topic.
- There must be between 3 and 6 concept nodes (type: "concept"). Concept nodes must connect ONLY to the root node, never to other concept nodes.
- Each concept node must have between 2 and 4 detail nodes (type: "detail") connected to it. Detail nodes must connect ONLY to a concept node, never to the root or to other detail nodes.
- Every node must have at least one edge.
- Keep all labels short, maximum 4 words.
- Edge labels must describe the relationship. Allowed values: "includes", "uses", "involves", "leads to", "depends on".
- Do not create intermediary or grouping nodes. Every concept node must directly hold its own detail children.
NEGATIVE EXAMPLE (never do this):
- DO NOT create edges between two concept nodes like: { "source": "3", "target": "7" } where both are type "concept"
- DO NOT leave a concept node with no detail children
- DO NOT leave any concept node disconnected from the root node

SELF-CHECK before returning JSON:
1. Does every concept node have an edge FROM the root? If not, add it.
2. Does every concept node have 2-4 detail children? If not, fix it.
3. Does any edge connect two concept nodes? If yes, restructure.
4. Does any detail node connect to another detail or to the root? If yes, fix it.
`;

        const raw = await askGemini(prompt);
        const clean = raw.replace(/```json|```/g, "").trim();
        const mindmap = JSON.parse(clean);

        return NextResponse.json({ mindmap });

    } catch (err) {
        console.error("Mind map generation error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}