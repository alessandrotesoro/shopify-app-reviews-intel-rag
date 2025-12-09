import { openai } from "@ai-sdk/openai";
import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { mastra } from "../mastra/index";
import path from "path";
import { parseFile } from "fast-csv";

const csvFilePath = path.join(process.cwd(), "src/data/reviews.csv");

const vectorStore = mastra.getVector("pgVector");

await vectorStore.createIndex({
    indexName: "reviews",
    dimension: 1536,
});

interface ReviewRow {
    reviewId: string;
    author: string;
    country: string;
    monthsUsingApp: string;
    stars: string;
    date: string;
    reviewText: string;
    sourceUrl: string;
}

const reviews: ReviewRow[] = [];

await new Promise<void>((resolve, reject) => {
    parseFile(csvFilePath, { headers: true })
        .on("data", (row: ReviewRow) => {
            reviews.push(row);
        })
        .on("error", (error) => reject(error))
        .on("end", () => resolve());
});

console.log(`📖 Loaded ${reviews.length} reviews from CSV`);

for (const review of reviews) {
    if (!review.reviewText || review.reviewText.trim() === "") continue;

    const doc = MDocument.fromText(review.reviewText);
    const chunks = await doc.chunk({
        strategy: "recursive",
        size: 512,
        overlap: 50,
        separators: ["\n"],
    });

    const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: chunks.map((chunk) => chunk.text),
    });

    await vectorStore.upsert({
        indexName: "reviews",
        vectors: embeddings,
        metadata: chunks.map((chunk) => ({
            text: chunk.text,
            reviewId: review.reviewId,
            author: review.author,
            country: review.country,
            monthsUsingApp: review.monthsUsingApp,
            stars: review.stars,
            date: review.date,
            sourceUrl: review.sourceUrl,
        })),
    });

    console.log(`✅ Processed review ${review.reviewId} (${review.author}) with ${chunks.length} chunks`);
}

console.log(`🎉 Successfully processed ${reviews.length} reviews`);