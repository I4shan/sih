import networkx as nx
from typing import Dict, List, Any, Optional
from backend.graph.graph_store import graph_store

def calculate_centrality_metrics() -> Dict[str, Any]:
    """
    Calculate degree, betweenness, closeness, and PageRank metrics
    using NetworkX over the current graph topology.
    """
    G = graph_store.nx_graph
    if G.number_of_nodes() == 0:
        return {
            "degree_centrality": {},
            "betweenness_centrality": {},
            "pagerank": {},
            "top_bridge_nodes": [],
            "top_influencers": []
        }

    undirected_G = G.to_undirected()
    
    # Degree Centrality
    deg_cent = nx.degree_centrality(undirected_G)
    
    # Betweenness Centrality (Crucial for finding bridge/cut nodes between networks)
    try:
        bet_cent = nx.betweenness_centrality(undirected_G, normalized=True)
    except Exception:
        bet_cent = {n: 0.0 for n in undirected_G.nodes()}

    # PageRank
    try:
        pagerank = nx.pagerank(G, alpha=0.85)
    except Exception:
        pagerank = {n: 0.0 for n in G.nodes()}

    # Identify Top Bridge Nodes (High betweenness centrality)
    sorted_bridges = sorted(bet_cent.items(), key=lambda x: x[1], reverse=True)
    top_bridges = []
    for node_id, score in sorted_bridges[:10]:
        node = graph_store.get_node(node_id)
        if node and score > 0:
            top_bridges.append({
                "node_id": node.id,
                "label": node.label,
                "type": node.type.value,
                "betweenness_score": round(score, 4),
                "degree": undirected_G.degree(node_id),
                "is_bridge": True
            })

    # Identify Top Influencers / Central Hubs
    sorted_deg = sorted(deg_cent.items(), key=lambda x: x[1], reverse=True)
    top_influencers = []
    for node_id, score in sorted_deg[:10]:
        node = graph_store.get_node(node_id)
        if node:
            top_influencers.append({
                "node_id": node.id,
                "label": node.label,
                "type": node.type.value,
                "degree_centrality": round(score, 4),
                "direct_connections": undirected_G.degree(node_id)
            })

    return {
        "degree_centrality": {k: round(v, 4) for k, v in deg_cent.items()},
        "betweenness_centrality": {k: round(v, 4) for k, v in bet_cent.items()},
        "pagerank": {k: round(v, 4) for k, v in pagerank.items()},
        "top_bridge_nodes": top_bridges,
        "top_influencers": top_influencers
    }

def detect_communities() -> List[Dict[str, Any]]:
    """
    Detect dense network clusters / communities using greedy modularity.
    """
    G = graph_store.nx_graph.to_undirected()
    if G.number_of_nodes() < 2:
        return []

    try:
        communities = nx.community.greedy_modularity_communities(G)
        results = []
        for idx, comm in enumerate(communities):
            members = []
            for nid in comm:
                node = graph_store.get_node(nid)
                if node:
                    members.append({
                        "id": node.id,
                        "label": node.label,
                        "type": node.type.value,
                        "risk_score": node.risk_score
                    })
            results.append({
                "community_id": f"community_{idx + 1}",
                "name": f"Sub-Network Group #{idx + 1}",
                "size": len(members),
                "members": members,
                "color_hue": (idx * 65) % 360
            })
        return results
    except Exception:
        return []

def detect_transaction_anomalies() -> List[Dict[str, Any]]:
    """
    Detect suspicious financial rings, circular transfers, and structuring patterns.
    """
    transfer_edges = [e for e in graph_store.edges.values() if e.type.value == "TRANSFERRED_TO"]
    
    anomalies = []
    
    # Build transfer directed graph
    tx_graph = nx.DiGraph()
    for e in transfer_edges:
        tx_graph.add_edge(e.source, e.target, amount=e.properties.get("amount", 0), edge_id=e.id)
        
    # 1. Circular Flow Detection (Cycles in transaction graph)
    try:
        cycles = list(nx.simple_cycles(tx_graph))
        for cycle in cycles:
            if len(cycle) >= 2:
                cycle_nodes = [graph_store.get_node(nid) for nid in cycle if graph_store.get_node(nid)]
                anomalies.append({
                    "type": "CIRCULAR_LAUNDERING_RING",
                    "severity": "HIGH",
                    "description": f"Detected circular fund movement across {len(cycle)} accounts ({' -> '.join([n.label for n in cycle_nodes if n])})",
                    "involved_node_ids": cycle,
                    "risk_boost": 25.0
                })
    except Exception:
        pass

    # 2. High Frequency Structuring / Smurfing
    for node_id in tx_graph.nodes():
        in_degree = tx_graph.in_degree(node_id)
        out_degree = tx_graph.out_degree(node_id)
        
        # Fan-in then Fan-out (Hawala Aggregator Pattern)
        if in_degree >= 3 and out_degree >= 1:
            node = graph_store.get_node(node_id)
            if node:
                anomalies.append({
                    "type": "HAWALA_AGGREGATION_HUB",
                    "severity": "HIGH",
                    "description": f"Account '{node.label}' displays rapid fan-in aggregation from {in_degree} distinct sources and immediate funneling.",
                    "involved_node_ids": [node_id],
                    "risk_boost": 30.0
                })

    return anomalies
