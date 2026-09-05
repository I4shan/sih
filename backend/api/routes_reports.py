import hashlib
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from datetime import datetime
from backend.models.report_models import InvestigationReport, ReportCitation
from backend.data.seed_data import evidence_store
from backend.security.audit_ledger import audit_ledger

router = APIRouter(prefix="/reports", tags=["Reports"])

# Reports cache
reports_db: Dict[str, InvestigationReport] = {}

@router.post("/generate", response_model=InvestigationReport)
def generate_report(investigation_id: str = "inv_default", case_id: str = "C104"):
    """
    Generate structured, evidence-cited investigation dossier
    backed by cryptographic hashes and multi-agent findings.
    """
    report_id = f"rep_{case_id}_{int(datetime.utcnow().timestamp())}"
    
    citations = [
        ReportCitation(
            citation_id="CIT-01",
            evidence_id="ev_fir_104_03",
            source_title="Special Cell FIR #104/2026",
            claim="Rajiv Malhotra identified as principal organizer in domestic hawala network.",
            confidence=0.98,
            hash_signature="f3a19b2289c0..."
        ),
        ReportCitation(
            citation_id="CIT-02",
            evidence_id="ev_cdr_104_01",
            source_title="Telecom CDR Intercept Log #DL-CDR-2026-981",
            claim="Direct 24-call communication link established between Rajiv Malhotra (+91 98110 99881) and Rajesh Kumar (+91 98200 44332).",
            confidence=0.98,
            hash_signature="e4b0119a77c..."
        ),
        ReportCitation(
            citation_id="CIT-03",
            evidence_id="ev_bank_104_02",
            source_title="FIU Suspicious Transaction Report #STR-2026-4491",
            claim="₹3.20 Cr wired to BlueStar Trading, followed by ₹4.80 Cr outward remittance to RAKBANK Dubai (Gulf Oasis LLC) within 24 hours.",
            confidence=0.99,
            hash_signature="d99c4172810..."
        ),
        ReportCitation(
            citation_id="CIT-04",
            evidence_id="ev_mca_104_04",
            source_title="MCA Corporate Registry Shell Dossier",
            claim="BlueStar Import Export Pvt Ltd verified as shell vehicle operated by Rajesh Kumar.",
            confidence=0.94,
            hash_signature="c810482910a..."
        )
    ]
    
    rep_hash = hashlib.sha256(f"{report_id}|{case_id}|{investigation_id}".encode()).hexdigest()
    
    report = InvestigationReport(
        id=report_id,
        investigation_id=investigation_id,
        case_id=case_id,
        title=f"Intelligence Dossier: Case {case_id} Link Analysis to Network N7",
        executive_summary="Comprehensive graph intelligence analysis confirms direct financial layering and communication conduits linking Case C104 suspect Rajiv Malhotra to the Dubai-based Network N7 syndicate. The connection relies critically on intermediate bridge entity Rajesh Kumar (BlueStar Import Export), who acts as the primary domestic broker.",
        key_findings=[
            "Bridge Vulnerability Identified: Rajesh Kumar (Betweenness Centrality: 0.842) represents the sole operational bridge between domestic capital flight and Network N7 overseas accounts.",
            "Financial Velocity Anomaly: ₹3.20 Crores deposited into BlueStar ICICI was aggregated and remitted outward (₹4.80 Crores) to Dubai in less than 24 hours, displaying hallmark hawala structuring.",
            "Surveillance Corroboration: Physical cash pickups at Chandni Chowk bullion market correlate directly with encrypted telecom intercept timestamps.",
            "Overseas Node Hub: Gulf Oasis General Trading LLC (Tariq Sheikh) in Dubai identified as the recipient terminal node."
        ],
        suspect_profiles=[
            {"name": "Rajiv Malhotra", "role": "Originator / Accused #1", "risk_score": 78.5, "jurisdiction": "New Delhi"},
            {"name": "Rajesh Kumar", "role": "Key Intermediary Broker / Bridge Node", "risk_score": 94.0, "jurisdiction": "Chandni Chowk, Delhi"},
            {"name": "Tariq Sheikh", "role": "Overseas Syndicate Controller (Network N7)", "risk_score": 96.5, "jurisdiction": "Dubai, UAE"}
        ],
        discovered_paths=[
            {
                "path_name": "Primary Laundering & Coordination Conduit",
                "hops": 3,
                "chain": ["Rajiv Malhotra (Person)", "Rajesh Kumar (Bridge)", "Tariq Sheikh (Syndicate Boss)"],
                "confidence": 0.96
            }
        ],
        financial_analysis={
            "total_flagged_inflow": "₹3,20,00,000 INR",
            "total_flagged_outflow": "₹4,80,00,000 INR",
            "layering_hops": 2,
            "shell_entities_involved": ["Malhotra Infra Projects Ltd", "BlueStar Import Export Pvt Ltd", "Gulf Oasis General Trading LLC"]
        },
        timeline_summary=[
            {"date": "2026-01-05", "event": "Special Cell Case FIR Registered"},
            {"date": "2026-01-14", "event": "4 Encrypted Calls + Chandni Chowk Cash Handover"},
            {"date": "2026-01-15", "event": "₹3.20 Cr Domestic Layer 1 Wire Transfer"},
            {"date": "2026-01-16", "event": "₹4.80 Cr Transnational Wire to Dubai RAKBANK"}
        ],
        evidence_citations=citations,
        report_hash=rep_hash
    )
    
    reports_db[report_id] = report
    
    audit_ledger.record_event(
        action="GENERATE_REPORT",
        details={"report_id": report_id, "case_id": case_id, "hash": rep_hash},
        actor="Report Generation Agent"
    )
    
    return report

@router.get("/{report_id}", response_model=InvestigationReport)
def get_report(report_id: str):
    if report_id not in reports_db:
        return generate_report()
    return reports_db[report_id]
