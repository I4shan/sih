import sys
from pathlib import Path

# Ensure project root is in sys.path when running from inside backend/
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings

# Import API routes
from backend.api.routes_investigations import router as investigations_router
from backend.api.routes_entities import router as entities_router
from backend.api.routes_graph import router as graph_router
from backend.api.routes_analytics import router as analytics_router
from backend.api.routes_evidence import router as evidence_router
from backend.api.routes_timeline import router as timeline_router
from backend.api.routes_reports import router as reports_router
from backend.api.routes_ingest import router as ingest_router
from backend.api.routes_agents import router as agents_router

app = FastAPI(
    title="PS26189 - Agentic Graph Intelligence Platform",
    description="Backend API for Criminal Network Analysis, Evidence Provenance, and Multi-Agent Investigation Workflows (SIH 2026)",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(investigations_router, prefix="/api/v1")
app.include_router(entities_router, prefix="/api/v1")
app.include_router(graph_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(evidence_router, prefix="/api/v1")
app.include_router(timeline_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(ingest_router, prefix="/api/v1")
app.include_router(agents_router, prefix="/api/v1")

@app.get("/")
def root_status():
    return {
        "platform": "PS26189 Agentic Graph Intelligence Platform",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs",
        "core_principle": "The system assists investigators; it does not determine guilt. Every important relationship is traceable to evidence, source, timestamp, and confidence."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
