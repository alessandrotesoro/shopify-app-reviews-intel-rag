# Shopify Reviews Intel RAG

A RAG-powered product analysis system that analyzes Shopify customer reviews to identify pain points, feature gaps, and competitive opportunities using Mastra and vector embeddings.

## Prerequisites

- Node.js >= 22.13.0
- PostgreSQL with pgvector extension
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (create `.env` file):
```env
POSTGRES_CONNECTION_STRING=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_openai_api_key
```

3. Store reviews in vector database:
```bash
npm run store
```

4. Start the Mastra dev server:
```bash
npm run dev
```

## Usage

The RAG agent analyzes reviews stored in your vector database and provides structured insights on:
- Pain points and recurring complaints
- Missing features and functional limitations
- UX/UI customization gaps
- Integration and workflow issues
- Competitive opportunities and recommendations

## Project Structure

```
src/
  ├── mastra/
  │   ├── agents/
  │   │   └── rag-agent.ts    # RAG agent configuration
  │   └── index.ts             # Mastra instance setup
  ├── scripts/
  │   └── store.ts             # Script to ingest reviews from CSV
  └── data/
      └── reviews.csv          # Customer reviews data (CSV format)
```

## Scripts

- `npm run dev` - Start Mastra development server
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run store` - Process and store reviews from CSV into vector database

