import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.graph.graph_store import graph_store
from backend.data.seed_data import seed_synthetic_investigation_data

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_data():
    seed_synthetic_investigation_data()

def test_root_status():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ONLINE"

def test_entities_list():
    response = client.get("/api/v1/entities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10
    labels = [n["label"] for n in data]
    assert "Vikram Singhania" in labels

def test_graph_full():
    response = client.get("/api/v1/graph/full")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) >= 10
    assert len(data["edges"]) >= 10

def test_shortest_path_discovery():
    response = client.get("/api/v1/graph/path?source=person_vikram_singhania&target=org_dubai_express")
    assert response.status_code == 200
    data = response.json()
    assert data["found"] is True
    assert data["hop_count"] >= 1

def test_centrality_and_bridge_detection():
    response = client.get("/api/v1/analytics/centrality")
    assert response.status_code == 200
    data = response.json()
    assert "top_bridge_nodes" in data
    bridge_labels = [b["label"] for b in data["top_bridge_nodes"]]
    assert any("Rajesh Kumar" in label for label in bridge_labels)

def test_evidence_verification_and_tamper_detection():
    # Valid evidence test
    response = client.post("/api/v1/evidence/verify/ev_bank_104_02")
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["tampered"] is False

def test_agent_investigation_workflow():
    payload = {
        "case_id": "C104",
        "query": "Find connections to Network N7"
    }
    response = client.post("/api/v1/agent/investigate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["steps"]) == 6
    assert data["status"] == "completed"

def test_report_generation():
    response = client.post("/api/v1/reports/generate?case_id=C104")
    assert response.status_code == 200
    data = response.json()
    assert len(data["key_findings"]) >= 3
    assert len(data["evidence_citations"]) >= 3
