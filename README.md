# PS26189: Agentic Graph Intelligence Platform for Criminal Network Analysis
**Team Technical Implementation • SIH 2026**

> **Core Principle**: The system assists investigators; it does not determine guilt. Every important relationship is traceable to evidence, source, timestamp, confidence, and cryptographic hash integrity.

---

## 🌟 Overview & Capabilities

This platform transforms structured records, CDR logs, bank statements, surveillance reports, and unstructured FIR documents into an interactive investigation network graph with cryptographic provenance and multi-agent reasoning.

### Key Highlights
- **Interactive Graph Workspace**: Cytoscape.js canvas with force-directed (`cose`), hierarchical (`dagre`), and concentric layouts, multi-hop neighborhood expansion, glyph badges, and live pathfinding.
- **Topological Analytics**: Degree and betweenness centrality to isolate critical **Bridge Nodes** and bottleneck intermediaries (e.g. Rajesh Kumar connecting domestic Case C104 to Dubai Network N7).
- **Financial Anomaly Detection**: Detection of circular laundering rings and rapid transit smurfing hubs.
- **Evidence Provenance Vault**: SHA-256 tamper-evident integrity checking and append-only blockchain audit ledger.
- **Chronological Timeline**: Interactive temporal correlation of telecom CDR calls, surveillance sightings, and layered fund transfers.
- **Automated Intelligence Dossier**: Formatted investigation report generator with citations, suspect profiles, and export to Markdown/PDF.
- **1-Click SIH Live Demo Sequence**: Step-by-step guided story walkthrough matching Section 24 of the blueprint.
- **Extensible Architecture**: Modular backend structure (`agents/`, `analytics/`, `graph/`, `rag/`, `extraction/`) with dedicated hooks for future LangGraph agents, Qwen LLM, PyTorch GNNs, and Neo4j databases.

---

## 🏗️ Repository Architecture

```
SIH/
├── backend/
│   ├── api/                     # FastAPI route handlers
│   │   ├── routes_investigations.py
│   │   ├── routes_entities.py
│   │   ├── routes_graph.py
│   │   ├── routes_analytics.py
│   │   ├── routes_evidence.py
│   │   ├── routes_timeline.py
│   │   ├── routes_reports.py
│   │   ├── routes_ingest.py
│   │   └── routes_agents.py
│   ├── agents/                  # Multi-agent orchestrators & future LangGraph hooks
│   │   ├── orchestrator_mock.py
│   │   └── langgraph_placeholder.py
│   ├── graph/                   # In-memory graph engine + Neo4j connector
│   │   ├── graph_store.py
│   │   └── neo4j_adapter.py
│   ├── analytics/               # Graph algorithms & future ML hooks
│   │   ├── graph_metrics.py
│   │   └── ml_placeholder.py
│   ├── security/                # Cryptographic hashing & audit ledger
│   │   ├── provenance.py
│   │   └── audit_ledger.py
│   ├── extraction/              # Rule-based NLP entity extractor
│   │   └── entity_extractor.py
│   ├── rag/                     # Vector retrieval & document chunker hook
│   │   └── rag_placeholder.py
│   ├── models/                  # Pydantic schemas (13 Node & 13 Edge Types)
│   │   ├── entity_models.py
│   │   ├── relation_models.py
│   │   ├── evidence_models.py
│   │   ├── investigation_models.py
│   │   └── report_models.py
│   ├── data/                    # Synthetic ground-truth datasets (Case C104 & Network N7)
│   │   └── seed_data.py
│   ├── tests/                   # Automated pytest suite
│   │   └── test_backend.py
│   ├── main.py                  # FastAPI application entrypoint
│   ├── config.py                # Environment configurations
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── graph/           # CytoscapeGraph, GraphControls
│   │   │   ├── entity/          # EntityProfileDrawer
│   │   │   ├── evidence/        # EvidenceProvenanceModal, EvidenceLedgerPage
│   │   │   ├── timeline/        # TimelineView
│   │   │   ├── analytics/       # AnalyticsPanel
│   │   │   ├── agents/          # AgentActivityFeed
│   │   │   ├── reports/         # ReportViewer
│   │   │   ├── ingestion/       # DocumentIngestModal
│   │   │   └── common/          # Navbar, DemoStoryGuide
│   │   ├── context/             # InvestigationContext (React state)
│   │   ├── services/            # api.js client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
python3 main.py
```
*Backend runs on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Running Automated Tests
```bash
python3 -m pytest backend/tests/test_backend.py
```

---

## 🔮 Future Integration Slots
- **Neo4j**: Set `NEO4J_URI` in `backend/config.py` and activate `backend/graph/neo4j_adapter.py`.
- **LangGraph & Local Qwen LLM**: Plug your LangGraph workflows into `backend/agents/langgraph_placeholder.py`.
- **PyTorch GNN & Embeddings**: Implement your custom graph embedding or link prediction models in `backend/analytics/ml_placeholder.py`.
- **FAISS / Qdrant Vector Store**: Plug vector embeddings into `backend/rag/rag_placeholder.py`.
