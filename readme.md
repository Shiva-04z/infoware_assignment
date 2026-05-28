# Multi-Tenant RAG System (Assignment)

Multi-tenant Retrieval-Augmented Generation (RAG) system where **each tenant uploads and queries their own knowledge base** with strict isolation and guardrails.

## Objective (from assignment)

Customers (legal firms, schools, retail companies, etc.) upload PDFs/policies/FAQs/manuals and can query them. Users must **only** receive answers grounded in their **own tenant data**.

## Tech Stack

- Node.js + TypeScript + Express
- PostgreSQL (Prisma)
- Vector DB: Qdrant
- Embeddings + LLM: OpenAI
- Redis (caching)

## Multi-tenant isolation (mandatory requirement)

- Every document chunk and vector includes `tenantId`.
- Retrieval always filters by `tenantId` (Qdrant filter on payload `tenant_id`).
- Auth middleware validates token → tenant match (path `tenantId` must match JWT tenantId).

## API Docs

- **Swagger UI**: `GET /docs` (when server is running)
- **OpenAPI spec file**: `documentation/openApi.yaml`
- **Raw spec served by API**: `GET /openapi.yaml`

Base URL: `http://localhost:3000`
API Docs URL: `http://localhost:3000/docs`

Note: This codebase mounts routes under **`/api`**, so the assignment endpoints are available as:

- Assignment: `POST /tenant` → Implemented: `POST /api/tenant`
- Assignment: `POST /tenant/:tenantId/documents` → Implemented: `POST /api/:tenantId/documents`
- Assignment: `POST /tenant/:tenantId/query` → Implemented: `POST /api/:tenantId/query`

## Architecture notes

- **PostgreSQL**: tenant + document + chunk metadata + query logs (see `prisma/schema.prisma`).
- **Qdrant**: stores embeddings for `document_chunks` collection with payload including `tenant_id`, `document_id`, `chunk_id`, etc.
- **Ingestion**:
    - extract text from PDF/TXT
    - chunk text (size/overlap)
    - embed chunks
    - store chunks in Postgres + vectors in Qdrant
- **Query**:
    - embed question
    - vector search in Qdrant filtered by `tenant_id`
    - build context from topK chunks
    - generate answer via LLM
    - return answer + sources
- **Guardrails**:
    - prompt injection detection
    - low-confidence handling using score threshold
    - out-of-scope answer handling

## Setup

### Requirements

- Node.js 18+
- Docker + Docker Compose (recommended)
- OpenAI API key

### Environment variables

Create a `.env` file (or export env vars) with at least:

- `PORT` (optional, defaults to `3000`)
- `GEMINI_API_KEY` (recommended to set)
- `DATABASE_URL` (recommended to set)
- `REDIS_URL` (recommended to set)
- `EMBEDDING_MODEL` (recommended to set)
- `LLM_MODEL` (recommended to set)
- `QDRANT_API_KEY` (recommended to set)
- `JWT_AUTH_SECRET` (recommended to set)
- `JWT_REFRESH_SECRET` (recommended to set)

Database / Redis / Qdrant configuration is expected via `docker-compose.yaml` (recommended).

### Run with Docker

```bash
docker compose up --build