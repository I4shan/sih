import os
import json
import networkx as nx
from typing import Dict, List, Any, Optional, Set, Tuple
from datetime import datetime
from backend.models.entity_models import BaseNode, NodeCreate, NodeUpdate, NodeType
from backend.models.relation_models import BaseEdge, EdgeCreate, RelationType, VerificationStatus
from backend.security.provenance import generate_edge_provenance_hash
from backend.security.audit_ledger import audit_ledger

class GraphStore:
    def __init__(self):
        self.nodes: Dict[str, BaseNode] = {}
        self.edges: Dict[str, BaseEdge] = {}
        self.nx_graph: nx.MultiDiGraph = nx.MultiDiGraph()

    def add_node(self, node_in: NodeCreate, actor: str = "System") -> BaseNode:
        node_id = node_in.id or f"node_{len(self.nodes) + 1}_{int(datetime.utcnow().timestamp())}"
        
        node = BaseNode(
            id=node_id,
            type=node_in.type,
            label=node_in.label,
            properties=node_in.properties,
            risk_score=node_in.risk_score or 0.0,
            risk_factors=node_in.risk_factors or [],
            tags=node_in.tags or []
        )
        
        self.nodes[node_id] = node
        self.nx_graph.add_node(
            node_id,
            type=node.type.value,
            label=node.label,
            risk_score=node.risk_score,
            properties=node.properties
        )
        
        audit_ledger.record_event(
            action="ADD_NODE",
            details={"node_id": node_id, "type": node.type.value, "label": node.label},
            actor=actor
        )
        return node

    def get_node(self, node_id: str) -> Optional[BaseNode]:
        return self.nodes.get(node_id)

    def list_nodes(
        self,
        node_type: Optional[NodeType] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None,
        min_risk: Optional[float] = None,
        limit: int = 200
    ) -> List[BaseNode]:
        results = list(self.nodes.values())
        
        if node_type:
            results = [n for n in results if n.type == node_type]
        if tag:
            results = [n for n in results if tag in n.tags]
        if search:
            query = search.lower()
            results = [
                n for n in results 
                if query in n.label.lower() or 
                   query in n.id.lower() or 
                   any(query in str(v).lower() for v in n.properties.values())
            ]
        if min_risk is not None:
            results = [n for n in results if n.risk_score >= min_risk]
            
        return results[:limit]

    def add_edge(self, edge_in: EdgeCreate, actor: str = "System") -> BaseEdge:
        if edge_in.source not in self.nodes:
            raise ValueError(f"Source node '{edge_in.source}' does not exist")
        if edge_in.target not in self.nodes:
            raise ValueError(f"Target node '{edge_in.target}' does not exist")
            
        edge_id = edge_in.id or f"edge_{len(self.edges) + 1}_{int(datetime.utcnow().timestamp())}"
        
        # Provenance hash
        hash_val = generate_edge_provenance_hash(
            edge_in.source, edge_in.target, edge_in.type.value, edge_in.evidence_id or ""
        )
        
        edge = BaseEdge(
            id=edge_id,
            source=edge_in.source,
            target=edge_in.target,
            type=edge_in.type,
            label=edge_in.label or edge_in.type.value,
            properties=edge_in.properties,
            source_id=edge_in.source_id,
            evidence_id=edge_in.evidence_id,
            timestamp=edge_in.timestamp or datetime.utcnow(),
            confidence=edge_in.confidence if edge_in.confidence is not None else 1.0,
            extraction_method=edge_in.extraction_method or "Structured Ingestion",
            verification_status=edge_in.verification_status or VerificationStatus.VERIFIED,
            sha256_hash=hash_val
        )
        
        self.edges[edge_id] = edge
        self.nx_graph.add_edge(
            edge.source,
            edge.target,
            key=edge_id,
            type=edge.type.value,
            label=edge.label,
            confidence=edge.confidence,
            properties=edge.properties
        )
        
        audit_ledger.record_event(
            action="ADD_EDGE",
            details={
                "edge_id": edge_id,
                "source": edge.source,
                "target": edge.target,
                "type": edge.type.value,
                "hash": hash_val
            },
            actor=actor
        )
        return edge

    def get_edge(self, edge_id: str) -> Optional[BaseEdge]:
        return self.edges.get(edge_id)

    def list_edges(self, limit: int = 500) -> List[BaseEdge]:
        return list(self.edges.values())[:limit]

    def get_node_connections(self, node_id: str) -> Dict[str, Any]:
        """Return all incoming and outgoing connections for a specific node."""
        if node_id not in self.nodes:
            return {"node": None, "edges": [], "connected_nodes": []}
            
        incident_edges = [
            e for e in self.edges.values()
            if e.source == node_id or e.target == node_id
        ]
        
        connected_node_ids = set()
        for e in incident_edges:
            connected_node_ids.add(e.source)
            connected_node_ids.add(e.target)
            
        connected_nodes = [self.nodes[nid] for nid in connected_node_ids if nid in self.nodes]
        
        return {
            "node": self.nodes[node_id],
            "edges": incident_edges,
            "connected_nodes": connected_nodes
        }

    def get_neighborhood(self, node_id: str, depth: int = 1) -> Dict[str, Any]:
        """Retrieve bounded k-hop neighborhood around a node."""
        if node_id not in self.nodes:
            return {"nodes": [], "edges": []}
            
        visited_nodes: Set[str] = {node_id}
        current_frontier: Set[str] = {node_id}
        
        for _ in range(depth):
            next_frontier: Set[str] = set()
            for nid in current_frontier:
                if self.nx_graph.has_node(nid):
                    # Outgoing and incoming neighbors
                    neighbors = set(self.nx_graph.successors(nid)).union(set(self.nx_graph.predecessors(nid)))
                    for neigh in neighbors:
                        if neigh not in visited_nodes:
                            visited_nodes.add(neigh)
                            next_frontier.add(neigh)
            current_frontier = next_frontier

        subgraph_nodes = [self.nodes[nid] for nid in visited_nodes if nid in self.nodes]
        subgraph_edges = [
            e for e in self.edges.values()
            if e.source in visited_nodes and e.target in visited_nodes
        ]
        
        return {
            "nodes": subgraph_nodes,
            "edges": subgraph_edges
        }

    def find_shortest_path(self, source_id: str, target_id: str) -> Dict[str, Any]:
        """Find the shortest path between two entities using undirected projection."""
        if source_id not in self.nodes or target_id not in self.nodes:
            return {"found": False, "nodes": [], "edges": [], "hop_count": 0}
            
        undirected = self.nx_graph.to_undirected()
        try:
            path_node_ids = nx.shortest_path(undirected, source=source_id, target=target_id)
            path_nodes = [self.nodes[nid] for nid in path_node_ids]
            
            # Collect connecting edges along the path
            path_edges = []
            for i in range(len(path_node_ids) - 1):
                u, v = path_node_ids[i], path_node_ids[i + 1]
                connecting = [
                    e for e in self.edges.values()
                    if (e.source == u and e.target == v) or (e.source == v and e.target == u)
                ]
                if connecting:
                    path_edges.append(connecting[0])
                    
            return {
                "found": True,
                "hop_count": len(path_node_ids) - 1,
                "node_ids": path_node_ids,
                "nodes": path_nodes,
                "edges": path_edges
            }
        except nx.NetworkXNoPath:
            return {"found": False, "nodes": [], "edges": [], "hop_count": 0}

    def get_full_graph(self) -> Dict[str, Any]:
        return {
            "nodes": list(self.nodes.values()),
            "edges": list(self.edges.values())
        }

    def clear(self):
        self.nodes.clear()
        self.edges.clear()
        self.nx_graph.clear()

graph_store = GraphStore()
