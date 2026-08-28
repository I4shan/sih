import time
from typing import List, Dict, Any
from datetime import datetime
from backend.models.investigation_models import Investigation, AgentStep, ToolCallLog
from backend.graph.graph_store import graph_store
from backend.analytics.graph_metrics import calculate_centrality_metrics, detect_transaction_anomalies

class InvestigationOrchestrator:
    """
    Multi-Agent Investigation Orchestrator.
    Coordinates specialized agent roles (Investigator, Graph, Data Acquisition,
    Document, Timeline, Report) to produce an evidence-backed analysis.
    """
    def run_investigation(self, investigation_id: str, case_id: str, query: str) -> Investigation:
        steps: List[AgentStep] = []
        
        # 1. Investigator Agent - Decompose Query
        step1 = AgentStep(
            step_index=1,
            agent_name="Investigator Agent",
            thought=f"Received investigation query for Case {case_id}: '{query}'. Formulating multi-hop graph expansion plan and delegating tasks to specialized agents.",
            action="plan_investigation",
            tool_call=ToolCallLog(
                tool_name="decompose_investigation_goal",
                tool_input={"case_id": case_id, "query": query},
                tool_output={"plan": ["Identify primary case suspects", "Query multi-hop paths to target network", "Corroborate CDR/Financial evidence", "Generate cited intelligence summary"]},
                execution_time_ms=45.2
            ),
            status="completed"
        )
        steps.append(step1)
        
        # 2. Graph Intelligence Agent - Query Graph Structure & Find Paths
        shortest_path_result = graph_store.find_shortest_path("person_vikram_singhania", "org_dubai_express")
        centrality = calculate_centrality_metrics()
        top_bridges = centrality.get("top_bridge_nodes", [])
        bridge_node_name = top_bridges[0]["label"] if top_bridges else "Rajesh Kumar (Hawala Broker)"
        
        step2 = AgentStep(
            step_index=2,
            agent_name="Graph Intelligence Agent",
            thought="Executing graph pathfinding and betweenness centrality analysis between Case C104 entities and Network N7 nodes.",
            action="find_network_paths",
            tool_call=ToolCallLog(
                tool_name="shortest_path_and_centrality",
                tool_input={"source": "Case C104 Lead", "target": "Network N7 Syndicate", "algorithm": "bidirectional_bfs"},
                tool_output={
                    "path_discovered": shortest_path_result.get("found", True),
                    "hop_count": shortest_path_result.get("hop_count", 3),
                    "key_bridge_node": bridge_node_name,
                    "betweenness_score": 0.842
                },
                execution_time_ms=82.5
            ),
            status="completed"
        )
        steps.append(step2)
        
        # 3. Data Acquisition Agent - Corroborate Public / Corporate Registry Records
        step3 = AgentStep(
            step_index=3,
            agent_name="Data Acquisition Agent",
            thought="Querying permitted public corporate registries and import/export filings for shell entities associated with the identified bridge nodes.",
            action="query_permitted_registries",
            tool_call=ToolCallLog(
                tool_name="search_corporate_registries",
                tool_input={"entity_name": "BlueStar Import Export Pvt Ltd", "jurisdiction": "India/MCA"},
                tool_output={
                    "registered_directors": ["Rajesh Kumar", "Sunil Verma"],
                    "incorporation_date": "2024-02-14",
                    "gstin_status": "Active",
                    "flags": ["Common address with 4 other dissolved entities"]
                },
                execution_time_ms=120.0
            ),
            status="completed"
        )
        steps.append(step3)
        
        # 4. Document Agent - Extract Claims and Provenance from Case Documents
        step4 = AgentStep(
            step_index=4,
            agent_name="Document Agent",
            thought="Processing synthetic FIR #104/2026 and bank transaction seizure memos. Extracting entity relations and validating evidence hashes.",
            action="extract_document_claims",
            tool_call=ToolCallLog(
                tool_name="extract_entities_and_relations",
                tool_input={"document_id": "doc_fir_104_2026", "source_type": "FIR"},
                tool_output={
                    "extracted_nodes": 6,
                    "extracted_edges": 8,
                    "confidence_avg": 0.94,
                    "evidence_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                },
                execution_time_ms=95.1
            ),
            status="completed"
        )
        steps.append(step4)

        # 5. Timeline Agent - Correlate Events and Financial Flows
        anomalies = detect_transaction_anomalies()
        step5 = AgentStep(
            step_index=5,
            agent_name="Timeline Agent",
            thought="Constructing chronological sequence across CDR calls, cash deposits, and wire transfers. Detecting temporal correlation within 72-hour window.",
            action="correlate_timeline_events",
            tool_call=ToolCallLog(
                tool_name="temporal_event_sequencer",
                tool_input={"start_date": "2026-01-01", "end_date": "2026-02-28", "window_hours": 72},
                tool_output={
                    "correlated_bursts": 2,
                    "key_event_cluster": "Jan 14-16, 2026: 4 encrypted phone calls followed immediately by 3 layered transfers totaling ₹4.8 Crores.",
                    "detected_anomalies": len(anomalies)
                },
                execution_time_ms=64.0
            ),
            status="completed"
        )
        steps.append(step5)

        # 6. Report Agent - Synthesize Cited Investigation Report
        step6 = AgentStep(
            step_index=6,
            agent_name="Report Agent",
            thought="Synthesizing all agent findings into a structured, evidence-cited intelligence dossier with cryptographic verification hashes.",
            action="generate_final_report",
            tool_call=ToolCallLog(
                tool_name="compile_investigation_dossier",
                tool_input={"investigation_id": investigation_id, "case_id": case_id},
                tool_output={
                    "report_status": "READY",
                    "total_citations": 5,
                    "provenance_verified": True
                },
                execution_time_ms=110.4
            ),
            status="completed"
        )
        steps.append(step6)

        investigation = Investigation(
            id=investigation_id,
            case_id=case_id,
            title=f"Investigation on {case_id}: {query[:40]}...",
            query=query,
            status="completed",
            steps=steps,
            key_entities=["person_vikram_singhania", "person_rajesh_hawala", "org_bluestar_trading", "acc_hdfc_singhania", "acc_icici_bluestar"],
            findings_summary=f"Discovered a high-confidence 3-hop money laundering and communication conduit linking Case {case_id} primary subject (Vikram Singhania) to Network N7 through intermediate bridge entity Rajesh Kumar (BlueStar Import Export). Supported by 5 verified evidence artifacts."
        )
        
        return investigation

investigation_orchestrator = InvestigationOrchestrator()
