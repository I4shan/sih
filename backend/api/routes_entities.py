from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from backend.models.entity_models import BaseNode, NodeCreate, NodeUpdate, NodeType
from backend.graph.graph_store import graph_store

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.get("", response_model=List[BaseNode])
def list_entities(
    type: Optional[NodeType] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    min_risk: Optional[float] = None,
    limit: int = Query(200, ge=1, le=1000)
):
    return graph_store.list_nodes(
        node_type=type,
        search=search,
        tag=tag,
        min_risk=min_risk,
        limit=limit
    )

@router.post("", response_model=BaseNode)
def create_entity(payload: NodeCreate):
    return graph_store.add_node(payload, actor="Investigator UI")

@router.get("/{entity_id}", response_model=BaseNode)
def get_entity(entity_id: str):
    node = graph_store.get_node(entity_id)
    if not node:
        raise HTTPException(status_code=404, detail="Entity not found")
    return node

@router.get("/{entity_id}/connections")
def get_entity_connections(entity_id: str):
    conn = graph_store.get_node_connections(entity_id)
    if not conn.get("node"):
        raise HTTPException(status_code=404, detail="Entity not found")
    return conn
