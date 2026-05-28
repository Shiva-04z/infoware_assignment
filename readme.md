# 🚀 Multi-Tenant RAG System (Production-Grade Assignment)

A production-style **Multi-Tenant Retrieval-Augmented Generation (RAG)** system that enables organizations to securely upload documents, build embeddings, and query their private knowledge base using LLMs — with strict **tenant isolation and RBAC enforcement**.

---

## 🎯 Overview

This system allows multiple organizations (tenants) to:

- Upload documents (PDF/TXT/FAQs/manuals)
- Automatically process and embed content
- Query their own private knowledge base using natural language
- Receive LLM-generated answers grounded only in their own data

🔒 Strict multi-tenant isolation is enforced across API, database, and vector store layers.

---

## 🧠 Key Highlights

- End-to-end RAG pipeline (ingestion → retrieval → generation)
- True multi-tenant isolation using tenant-aware filtering in Qdrant + Postgres
- Role-Based Access Control (RBAC): Admin vs Tenant
- Production-grade API structure with Swagger/OpenAPI
- Redis caching + rate limiting for performance and protection
- Prompt injection detection and guardrails
- Modular, scalable backend architecture

---

## 🏗️ Architecture

Client
↓
Express API (Auth + RBAC + Validation)
↓
PostgreSQL | Redis | Qdrant
↓
Gemini LLM
↓
Final Answer

---

## ⚙️ Tech Stack

- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL (Prisma ORM)
- Vector DB: Qdrant
- Cache / Rate Limit: Redis
- LLM & Embeddings: Google Gemini API
- Validation: Zod
- Auth: JWT + RBAC
- API Docs: Swagger (OpenAPI 3.0)
- Infra: Docker Compose

---

## 👥 Roles & Permissions (RBAC)

### Admin
- Create tenants
- Fetch tenant details
- Manage tenant lifecycle

### Tenant
- Login & authenticate
- Upload documents
- Query own documents only
- View own documents

---

## 🔐 Multi-Tenant Isolation

Strict isolation is enforced at multiple layers:

- Every document chunk contains tenantId
- Every Qdrant vector stores tenant_id
- Vector search always filters by:

tenant_id == JWT.tenantId

- API validation ensures:

req.params.tenantId == decodedToken.tenantId

No cross-tenant data access is possible by design.

---

## 📄 Core Features

### Document Ingestion
- Upload PDF/TXT files
- Extract raw text
- Chunk text with overlap
- Generate embeddings using Gemini
- Store in:
  - PostgreSQL (metadata)
  - Qdrant (vector embeddings)

---

### RAG Query Pipeline
- Embed user query
- Perform tenant-filtered vector search
- Retrieve top-K relevant chunks
- Build context window
- Generate response using Gemini LLM
- Return:
  - Answer
  - Source chunks
  - Confidence score

---

### Guardrails
- Prompt injection detection
- Low-confidence fallback handling
- Out-of-scope detection
- Safe response enforcement

---

### Performance Optimizations
- Redis caching for repeated queries
- IP + identity-based rate limiting
- Efficient vector filtering
- Optimized chunk retrieval

---

## 📡 API Base Info

- Base URL: http://localhost:3000/api
- Swagger UI: http://localhost:3000/docs
- OpenAPI Spec: GET /openapi.yaml

---

## 🧭 API Endpoints

### Admin
- POST /admin → Create admin (no authentication; bootstrap first admin)

### Tenant (Admin JWT Required)
- POST /tenant → Create tenant
- GET /tenant/:tenantId → Fetch tenant

### Authentication
- POST /tenant/login → Tenant login
- POST /tenant/refresh-token → Refresh token

### Documents (Tenant Only)
- POST /:tenantId/documents → Upload document
- GET /:tenantId/documents → List documents
- DELETE /:tenantId/documents/:documentId → Delete document

### Query (RAG Engine)
- POST /:tenantId/query → Query knowledge base

---

## 🔄 System Flows

### Ingestion Flow

Upload → Extract Text → Chunk → Embed → Store (Postgres + Qdrant)

---

### Query Flow

User Query → Embed → Vector Search (tenant filtered) → Retrieve Context → Gemini LLM → Final Answer + Sources

---

## ⚙️ Setup Instructions

### Install Dependencies

npm install

---

### Run Infrastructure

docker compose up --build

---

### Environment Variables

PORT=3000

DATABASE_URL=your_postgres_url
REDIS_URL=redis://localhost:6379

GEMINI_API_KEY=your_gemini_key

JWT_AUTH_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

QDRANT_API_KEY=your_qdrant_key

EMBEDDING_MODEL=text-embedding-004
LLM_MODEL=gemini-1.5-pro

---

## 📦 Infrastructure Used

- PostgreSQL → structured tenant + document storage
- Redis → caching + rate limiting
- Qdrant → vector database for embeddings
- Gemini → LLM + embeddings
- Express → API layer
- Prisma → ORM
- Swagger → API documentation

---

## 🧠 Why This Project Matters

This project demonstrates:

- Real-world multi-tenant SaaS architecture
- Secure RAG system design
- Scalable vector search pipelines
- Production-level backend engineering practices
- Strong focus on data isolation and security

---

## 🚀 Author

Built as a production-style backend system showcasing:

- LLM integration
- Multi-tenant architecture
- Vector database design
- Secure API development