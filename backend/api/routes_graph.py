from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from backend.models.relation_models import BaseEdge, EdgeCreate
from backend.graph.graph_store import graph_store

router = APIRouter(prefix="/graph", tags=["Graph Network"])

@router.get("/full")
def get_full_graph():
    """Retrieve all nodes and edges for Cytoscape workspace."""
    return graph_store.get_full_graph()

@router.get("/neighborhood/{node_id}")
def get_neighborhood(node_id: str, depth: int = Query(1, ge=1, le=4)):
    """Retrieve k-hop bounded neighborhood around target entity."""
    return graph_store.get_neighborhood(node_id=node_id, depth=depth)

@router.get("/path")
def find_path(source: str = Query(..., description="Source node ID"), target: str = Query(..., description="Target node ID")):
    """Compute shortest path between two nodes."""
    res = graph_store.find_shortest_path(source_id=source, target_id=target)
    if not res.get("found"):
        raise HTTPException(status_code=404, detail="No connecting path discovered between nodes")
    return res

@router.post("/edge", response_model=BaseEdge)
def create_edge(payload: EdgeCreate):
    """Add a relationship edge between two existing nodes."""
    try:
        return graph_store.add_edge(payload, actor="Investigator UI")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
