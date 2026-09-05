from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from backend.graph.graph_store import graph_store

router = APIRouter(prefix="/timeline", tags=["Timeline & Temporal Analysis"])

@router.get("/events")
def get_timeline_events(
    entity_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Retrieve chronological timeline of real-world events, calls,
    bank transactions, and case milestones.
    """
    events = [
        {
            "id": "evt_01",
            "title": "Special Cell Case Registered",
            "type": "CASE_MILESTONE",
            "timestamp": "2026-01-05T09:00:00Z",
            "description": "FIR #104/2026 registered under IPC 420, 120B regarding Hawala remittances.",
            "entities": ["person_rajiv_malhotra", "case_c104"],
            "severity": "HIGH",
            "evidence_id": "ev_fir_104_03"
        },
        {
            "id": "evt_02",
            "title": "CDR Intercept Burst (Delhi - Chandni Chowk)",
            "type": "COMMUNICATION",
            "timestamp": "2026-01-14T18:22:00Z",
            "description": "4 encrypted calls (duration: 18 mins) between Rajiv Malhotra and Rajesh Hawala.",
            "entities": ["person_rajiv_malhotra", "person_rajesh_hawala", "phone_malhotra", "phone_rajesh"],
            "severity": "MEDIUM",
            "evidence_id": "ev_cdr_104_01"
        },
        {
            "id": "evt_03",
            "title": "Physical Surveillance Sighting",
            "type": "PHYSICAL_SURVEILLANCE",
            "timestamp": "2026-01-14T21:15:00Z",
            "description": "Toyota Fortuner (DL-01-CZ-8899) observed near Kucha Mahajani. Courier Amit Sharma seen receiving bag.",
            "entities": ["vehicle_suv_malhotra", "person_amit_sharma", "loc_chandni_chowk"],
            "severity": "HIGH",
            "evidence_id": "ev_cdr_104_01"
        },
        {
            "id": "evt_04",
            "title": "Domestic Wire Inflow (Layer 1)",
            "type": "FINANCIAL_TRANSACTION",
            "timestamp": "2026-01-15T11:42:00Z",
            "description": "₹3,20,00,000 transferred from Malhotra Infra (HDFC) to BlueStar Import Export (ICICI).",
            "entities": ["acc_hdfc_malhotra", "acc_icici_bluestar", "org_bluestar_trading"],
            "severity": "CRITICAL",
            "evidence_id": "ev_bank_104_02"
        },
        {
            "id": "evt_05",
            "title": "Transnational Outward Wire (Layer 2)",
            "type": "FINANCIAL_TRANSACTION",
            "timestamp": "2026-01-16T15:10:00Z",
            "description": "₹4,80,00,000 remitted outward from BlueStar ICICI to RAKBANK Dubai account of Gulf Oasis Trading.",
            "entities": ["acc_icici_bluestar", "acc_rakbank_dubai", "org_dubai_express"],
            "severity": "CRITICAL",
            "evidence_id": "ev_bank_104_02"
        },
        {
            "id": "evt_06",
            "title": "International Satellite Communication",
            "type": "COMMUNICATION",
            "timestamp": "2026-01-16T16:05:00Z",
            "description": "Rajesh Hawala contacted Tariq Sheikh (Dubai) immediately following confirmation of funds arrival.",
            "entities": ["person_rajesh_hawala", "person_tariq_dubai", "phone_rajesh", "phone_tariq"],
            "severity": "HIGH",
            "evidence_id": "ev_cdr_104_01"
        }
    ]
    
    if entity_id:
        events = [e for e in events if entity_id in e["entities"]]
        
    return events
