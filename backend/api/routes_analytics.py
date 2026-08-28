from fastapi import APIRouter
from typing import Dict, Any, List
from backend.analytics.graph_metrics import calculate_centrality_metrics, detect_communities, detect_transaction_anomalies

router = APIRouter(prefix="/analytics", tags=["Graph Analytics & Anomalies"])

@router.get("/centrality")
def get_centrality_metrics():
    """Retrieve betweenness, degree, and PageRank metrics with bridge identification."""
    return calculate_centrality_metrics()

@router.get("/communities")
def get_communities():
    """Detect dense modular network clusters and communities."""
    return detect_communities()

@router.get("/anomalies")
def get_anomalies():
    """Detect circular money laundering cycles and smurfing hubs."""
    return detect_transaction_anomalies()

@router.get("/summary")
def get_analytics_summary():
    """Aggregated graph intelligence metrics."""
    centrality = calculate_centrality_metrics()
    communities = detect_communities()
    anomalies = detect_transaction_anomalies()
    
    return {
        "top_bridges": centrality.get("top_bridge_nodes", []),
        "top_influencers": centrality.get("top_influencers", []),
        "community_count": len(communities),
        "anomaly_count": len(anomalies),
        "anomalies": anomalies
    }
