import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import { generateEmbedding } from "./embeding";


export async function searchSimilarChunks(queryText, projectId, topK = 5) {
    const queryVector = await generateEmbedding(queryText);
    const vectorString = `[${queryVector.join(",")}]`;

    const results = await prisma.$queryRaw`
    SELECT content, 1 - (vector <=> ${Prisma.raw(`'${vectorString}'::vector`)}) AS similarity
    FROM "Embedding"
    WHERE "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT ${topK}
  `;
    const confident = results.filter(r => Number(r.similarity) > 0.2);
    return confident.map(r => r.content);

}