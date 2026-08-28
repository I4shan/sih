from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, Optional
from datetime import datetime
from backend.extraction.entity_extractor import entity_extractor
from backend.rag.rag_placeholder import rag_service
from backend.graph.graph_store import graph_store
from backend.data.seed_data import seed_synthetic_investigation_data
from backend.models.entity_models import NodeCreate, NodeType
from backend.models.evidence_models import EvidenceRecord
from backend.data.seed_data import evidence_store
from backend.security.provenance import generate_evidence_hash

router = APIRouter(prefix="/ingest", tags=["Ingestion & Extraction"])

@router.post("/document")
def ingest_text_document(
    title: str = Form(...),
    source_type: str = Form("FIR"),
    content: str = Form(...)
):
    """
    Ingest raw text/FIR/report, run entity extraction, index in RAG store,
    and register into the tamper-evident evidence vault.
    """
    doc_id = f"doc_{int(datetime.utcnow().timestamp())}"
    
    # 1. Extract entities
    extracted = entity_extractor.extract_from_text(content)
    
    # 2. Compute evidence hash
    now_str = datetime.utcnow().isoformat()
    ev_hash = generate_evidence_hash(doc_id, title, source_type, content, now_str)
    
    # 3. Store in Evidence Vault
    ev = EvidenceRecord(
        id=doc_id,
        title=title,
        source_type=source_type,
        file_name=f"{title.lower().replace(' ', '_')}.txt",
        content_snippet=content[:300] + ("..." if len(content) > 300 else ""),
        source_uri=f"vault://uploaded/{doc_id}",
        timestamp=datetime.utcnow(),
        extraction_method="Automated NLP Extraction",
        confidence=0.95,
        verification_status="Verified",
        sha256_hash=ev_hash,
        extracted_entities=[p["value"] for p in extracted["phones"]] + [v["value"] for v in extracted["vehicles"]],
        metadata={"extracted_counts": {k: len(v) for k, v in extracted.items()}}
    )
    evidence_store[doc_id] = ev
    
    # 4. Ingest into RAG store
    rag_service.ingest_document(doc_id=doc_id, title=title, content=content, source_type=source_type)
    
    # 5. Add extracted phone numbers/vehicles as nodes if not present
    added_nodes = []
    for ph in extracted["phones"]:
        phone_val = ph["value"]
        if phone_val not in graph_store.nodes:
            n = graph_store.add_node(NodeCreate(
                id=f"phone_{phone_val.replace(' ', '').replace('+', '')}",
                type=NodeType.PHONE,
                label=phone_val,
                risk_score=50.0,
                risk_factors=["Extracted from newly ingested document"],
                tags=["Extracted", "Phone"]
            ), actor="Ingestion Pipeline")
            added_nodes.append(n.id)

    return {
        "status": "success",
        "evidence_id": doc_id,
        "sha256_hash": ev_hash,
        "extracted": extracted,
        "newly_added_nodes": added_nodes
    }

@router.post("/reset-seed")
def reset_seed_data():
    """Reset graph and evidence store to initial SIH Case C104 ground truth."""
    return seed_synthetic_investigation_data()
