# Kredo

**Decentralized Risk Infrastructure for Last-Mile Agricultural Lending**

Kredo is a modern web application designed to help underwrite thin-file borrowers, such as smallholder farmers, by mapping local economic footprints and querying decentralized trust networks. It uses index-free adjacency lookups to transform verifiable social collateral (e.g., historical milk deliveries, cooperative network relationships) into auditable risk profiles, unlocking access to credit.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, shadcn/ui
- **Database:** Neo4j (Graph Database for index-free adjacency traversal)
- **AI/Agents:** OpenAI (for evaluating borrower profiles and generating narrative summaries)
- **Graph Visualization:** vis-network
- **Linting & Formatting:** Biome

## Features

- **Trust Network Traversal:** Map out relationships, supply chain histories (like daily dairy deliveries), and cooperative affiliations using Neo4j graph databases.
- **Dynamic Underwriting:** Evaluate thin-file borrowers instantly by relying on social and economic graphs instead of traditional Credit Reference Bureau (CRB) scores.
- **Auditable Narrative Summaries:** Automatically generates contextual summaries of borrower risk using AI agents to assist loan officers.
- **Interactive Dashboard:** Explore borrower networks via interactive graph visualizations.
- **Admin & Ingestion APIs:** Programmatic endpoints to ingest new social/economic data into the graph.

## Getting Started

### Prerequisites

- Node.js (v20+)
- [Bun](https://bun.sh/) (Recommended), npm, yarn, or pnpm
- A Neo4j Database instance (Local or AuraDB)
- OpenAI API Key

### Environment Variables

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

Make sure to configure your Neo4j credentials and OpenAI API key.

### Installation

```bash
bun install
# or npm install / yarn install
```

### Running the Development Server

```bash
bun run dev
# or npm run dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/`: Next.js App Router containing views (`/dashboard`, `/admin`) and API routes (`/api/evaluate`, `/api/ingest`).
- `src/components/`: Reusable UI components including complex graph visualizations.
- `src/lib/`: Core backend logic including `neo4j.ts` for database connections and `agent.ts` for AI integrations.

## Code Quality

This project uses [Biome](https://biomejs.dev/) for fast linting and formatting.

```bash
# Run the linter
npm run lint

# Format the codebase
npm run format
```
