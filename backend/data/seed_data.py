from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any
from backend.models.entity_models import NodeCreate, NodeType
from backend.models.relation_models import EdgeCreate, RelationType, VerificationStatus
from backend.models.evidence_models import EvidenceRecord
from backend.graph.graph_store import graph_store
from backend.security.provenance import generate_evidence_hash
from backend.rag.rag_placeholder import rag_service

# Evidence Repository Store
evidence_store: Dict[str, EvidenceRecord] = {}

def seed_synthetic_investigation_data():
    """
    Populate the graph store with realistic, ground-truth synthetic data
    for Case C104 ('Operation Hawala Matrix') and Network N7 syndicate.
    """
    graph_store.clear()
    evidence_store.clear()
    
    # 1. Create Evidence Records with Cryptographic Hashes
    t0 = datetime(2026, 1, 15, 10, 30, 0, tzinfo=timezone.utc)
    
    cdr_title = "Telecom CDR Intercept Log #DL-CDR-2026-981"
    cdr_content = "24 calls logged between +91 98110 99881 (Singhania) and +91 98200 44332 (Rajesh Hawala) between Jan 10 and Jan 20, 2026, with 14 calls originating near Chandni Chowk cell tower."
    cdr_ts = t0 - timedelta(days=2)
    ev_cdr = EvidenceRecord(
        id="ev_cdr_104_01",
        title=cdr_title,
        source_type="CDR_LOG",
        file_name="telecom_intercept_singhania_rajesh.csv",
        content_snippet=cdr_content,
        source_uri="secure://evidence_vault/2026/cdr/DL-CDR-2026-981.csv",
        timestamp=cdr_ts,
        extraction_method="Automated Telecom Ingestion",
        confidence=0.98,
        verification_status="Verified",
        sha256_hash=generate_evidence_hash("ev_cdr_104_01", cdr_title, "CDR_LOG", cdr_content, cdr_ts.isoformat()),
        extracted_entities=["+91 98110 99881", "+91 98200 44332", "Chandni Chowk"],
        metadata={"tower_id": "DEL-CC-094", "operator": "Airtel / Jio"}
    )
    evidence_store[ev_cdr.id] = ev_cdr

    bank_title = "FIU-IND Suspicious Transaction Report (STR #STR-2026-4491)"
    bank_content = "Wire transfer of ₹3,20,00,000 from Singhania Infra (HDFC 501004928192) to BlueStar Trading (ICICI 001205009182) disguised as 'Heavy Machinery Advance', immediately followed by ₹4,80,00,000 outward remittance to RAKBANK Dubai."
    ev_bank = EvidenceRecord(
        id="ev_bank_104_02",
        title=bank_title,
        source_type="BANK_STATEMENT",
        file_name="fiu_str_bluestar_singhania.pdf",
        content_snippet=bank_content,
        source_uri="secure://fiu_secure_gateway/str/2026/STR-2026-4491.pdf",
        timestamp=t0,
        extraction_method="Banking API / FIU Integration",
        confidence=0.99,
        verification_status="Verified",
        sha256_hash=generate_evidence_hash("ev_bank_104_02", bank_title, "BANK_STATEMENT", bank_content, t0.isoformat()),
        extracted_entities=["501004928192", "001205009182", "₹3.20,00,000", "RAKBANK Dubai"],
        metadata={"swift_ref": "BSTRINBB20260115009"}
    )
    evidence_store[ev_bank.id] = ev_bank

    fir_title = "Special Cell Crime Branch FIR #104/2026"
    fir_content = "FIR registered under IPC 420, 120B, and Section 3/4 PMLA against Vikram Singhania and unknown syndicate members for transnational tax evasion, hawala remittances, and fake trade invoicing."
    fir_ts = t0 - timedelta(days=10)
    ev_fir = EvidenceRecord(
        id="ev_fir_104_03",
        title=fir_title,
        source_type="FIR",
        file_name="fir_104_2026_special_cell.pdf",
        content_snippet=fir_content,
        source_uri="secure://delhipolice_cctns/fir/2026/FIR-104-2026.pdf",
        timestamp=fir_ts,
        extraction_method="Police Document OCR & NLP",
        confidence=0.95,
        verification_status="Verified",
        sha256_hash=generate_evidence_hash("ev_fir_104_03", fir_title, "FIR", fir_content, fir_ts.isoformat()),
        extracted_entities=["Vikram Singhania", "IPC 420", "IPC 120B", "Section 3/4 PMLA"],
        metadata={"police_station": "Special Cell Lodhi Colony"}
    )
    evidence_store[ev_fir.id] = ev_fir

    mca_title = "Ministry of Corporate Affairs Shell Entity Dossier"
    mca_content = "BlueStar Import Export Pvt Ltd (CIN U51909DL2024PTC398124) incorporated with authorized capital ₹1 Lakh. Director: Rajesh Kumar. Registered address found to be a 10x10 sq ft empty commercial stall."
    mca_ts = t0 - timedelta(days=5)
    ev_mca = EvidenceRecord(
        id="ev_mca_104_04",
        title=mca_title,
        source_type="PUBLIC_REGISTRY",
        file_name="mca_filing_bluestar_trading.pdf",
        content_snippet=mca_content,
        source_uri="https://mca.gov.in/company/U51909DL2024PTC398124",
        timestamp=mca_ts,
        extraction_method="MCA Registry Ingestion",
        confidence=0.92,
        verification_status="Verified",
        sha256_hash=generate_evidence_hash("ev_mca_104_04", mca_title, "PUBLIC_REGISTRY", mca_content, mca_ts.isoformat()),
        extracted_entities=["BlueStar Import Export Pvt Ltd", "Rajesh Kumar", "U51909DL2024PTC398124"],
        metadata={"cin": "U51909DL2024PTC398124"}
    )
    evidence_store[ev_mca.id] = ev_mca

    # Also index into RAG Document Service
    for ev in [ev_cdr, ev_bank, ev_fir, ev_mca]:
        rag_service.ingest_document(
            doc_id=ev.id,
            title=ev.title,
            content=ev.content_snippet,
            source_type=ev.source_type,
            metadata=ev.metadata
        )

    # 2. Create Graph Nodes
    # --- Case C104 Cluster ---
    case_c104 = graph_store.add_node(NodeCreate(
        id="case_c104",
        type=NodeType.CASE,
        label="Case C104: Hawala Matrix",
        properties={"case_number": "FIR-104/2026", "sections": "IPC 420, 120B, PMLA Sec 3/4", "status": "Active Investigation", "court": "Patiala House Courts"},
        risk_score=85.0,
        risk_factors=["High value transnational Hawala", "Multiple shell accounts", "Cross-border conduit"],
        tags=["Case", "Hawala", "PMLA", "High Priority"]
    ))

    singhania = graph_store.add_node(NodeCreate(
        id="person_vikram_singhania",
        type=NodeType.PERSON,
        label="Vikram Singhania",
        properties={"alias": "Singhania Saab", "pan": "ABCPS8819K", "age": 48, "residence": "Vasant Vihar, New Delhi", "profession": "Real Estate Developer"},
        risk_score=78.5,
        risk_factors=["Primary suspect in FIR-104", "Heavy unexplained cash flow", "Direct ties to overseas remitter"],
        tags=["Suspect", "Real Estate", "Case C104 Lead"]
    ))

    org_singhania = graph_store.add_node(NodeCreate(
        id="org_singhania_infra",
        type=NodeType.ORGANIZATION,
        label="Singhania Infra Projects Ltd",
        properties={"cin": "L45200DL2015PLC281900", "gstin": "07AAACS8819K1ZX", "hq": "Barakhamba Road, Connaught Place, New Delhi"},
        risk_score=65.0,
        risk_factors=["Originating account for ₹3.2 Cr unbilled transaction"],
        tags=["Corporate", "Case C104"]
    ))

    phone_singhania = graph_store.add_node(NodeCreate(
        id="phone_singhania",
        type=NodeType.PHONE,
        label="+91 98110 99881",
        properties={"imei": "864910049281726", "carrier": "Airtel Delhi", "handset": "iPhone 15 Pro (Encrypted Signal App)"},
        risk_score=72.0,
        risk_factors=["High encrypted traffic", "Frequent communications with known hawala hubs"],
        tags=["Phone", "Burner"]
    ))

    acc_hdfc = graph_store.add_node(NodeCreate(
        id="acc_hdfc_singhania",
        type=NodeType.BANK_ACCOUNT,
        label="HDFC Current A/C #501004928192",
        properties={"bank": "HDFC Bank", "branch": "KG Marg, New Delhi", "ifsc": "HDFC0000003", "balance": "₹14,50,000"},
        risk_score=80.0,
        risk_factors=["Source of ₹3.2 Cr layered remittance"],
        tags=["Financial", "Outflow Hub"]
    ))

    vehicle_singhania = graph_store.add_node(NodeCreate(
        id="vehicle_suv_singhania",
        type=NodeType.VEHICLE,
        label="Toyota Fortuner (DL-01-CZ-8899)",
        properties={"color": "Black", "chassis_no": "MBJ11FV28990182", "registered_owner": "Singhania Infra Projects Ltd"},
        risk_score=40.0,
        risk_factors=["Spotted at Chandni Chowk cash handover location on Jan 14"],
        tags=["Vehicle", "Surveillance Target"]
    ))

    # --- Crucial Bridge Node: Rajesh Kumar (Hawala Broker) ---
    rajesh_hawala = graph_store.add_node(NodeCreate(
        id="person_rajesh_hawala",
        type=NodeType.PERSON,
        label="Rajesh Kumar (Hawala Broker)",
        properties={"alias": "Rajesh Chandni Chowk / RK Operator", "pan": "BPLPK4491J", "age": 42, "address": "Kucha Mahajani, Chandni Chowk, Delhi"},
        risk_score=94.0,
        risk_factors=["Highest Betweenness Centrality (0.84)", "Key Bridge connecting Domestic Delhi Case to Dubai Network N7", "Controls 8 shell bank accounts"],
        tags=["Bridge Node", "Hawala Operator", "Key Intermediary", "Critical Suspect"]
    ))

    org_bluestar = graph_store.add_node(NodeCreate(
        id="org_bluestar_trading",
        type=NodeType.ORGANIZATION,
        label="BlueStar Import Export Pvt Ltd",
        properties={"cin": "U51909DL2024PTC398124", "status": "Shell Company", "turnover_reported": "₹50,000", "actual_transits": "₹48.5 Crores"},
        risk_score=91.0,
        risk_factors=["Shell company intermediary", "Zero employee footprint", "Immediate fund transit pass-through"],
        tags=["Shell Org", "Laundering Conduit"]
    ))

    phone_rajesh = graph_store.add_node(NodeCreate(
        id="phone_rajesh",
        type=NodeType.PHONE,
        label="+91 98200 44332",
        properties={"imei": "358901048291024", "carrier": "Vodafone Idea", "handset": "Samsung Knox Secure"},
        risk_score=88.0,
        risk_factors=["Frequent communications with UAE satellite phone numbers"],
        tags=["Phone", "Hawala Hotline"]
    ))

    acc_icici = graph_store.add_node(NodeCreate(
        id="acc_icici_bluestar",
        type=NodeType.BANK_ACCOUNT,
        label="ICICI A/C #001205009182",
        properties={"bank": "ICICI Bank", "branch": "Chandni Chowk, Delhi", "ifsc": "ICIC0000012", "balance": "₹42,000"},
        risk_score=95.0,
        risk_factors=["Rapid smurfing: ₹3.2 Cr in, ₹4.8 Cr out within 4 hours", "Circular laundering node"],
        tags=["Financial", "Transit Account"]
    ))

    loc_chandni_chowk = graph_store.add_node(NodeCreate(
        id="loc_chandni_chowk",
        type=NodeType.LOCATION,
        label="Kucha Mahajani, Chandni Chowk",
        properties={"city": "Delhi", "coordinates": "28.6562° N, 77.2307° E", "zone": "Central Delhi Bullion Market"},
        risk_score=60.0,
        risk_factors=["Physical cash drop point", "Surveillance hotspot"],
        tags=["Location", "Meeting Point"]
    ))

    courier_amit = graph_store.add_node(NodeCreate(
        id="person_amit_sharma",
        type=NodeType.PERSON,
        label="Amit Sharma (Cash Courier)",
        properties={"alias": "Chhotu Courier", "age": 26, "role": "Cash Carrier"},
        risk_score=55.0,
        risk_factors=["Apprehended with ₹45 Lakhs unaccounted cash at Chandni Chowk"],
        tags=["Courier", "Associate"]
    ))

    # --- Network N7 Syndicate (Dubai / Overseas Node Hub) ---
    tariq_dubai = graph_store.add_node(NodeCreate(
        id="person_tariq_dubai",
        type=NodeType.PERSON,
        label="Tariq Sheikh (Dubai Controller)",
        properties={"alias": "Tariq Bhai / TS Dubai", "passport": "Z9810291", "location": "Deira, Dubai, UAE", "syndicate": "Network N7"},
        risk_score=96.5,
        risk_factors=["Head of Network N7 Overseas Hawala Hub", "Subject of Red Corner Notice request", "Beneficiary of transnational wire funds"],
        tags=["Syndicate Boss", "Network N7", "International Target"]
    ))

    org_dubai_express = graph_store.add_node(NodeCreate(
        id="org_dubai_express",
        type=NodeType.ORGANIZATION,
        label="Gulf Oasis General Trading LLC",
        properties={"trade_license": "DXB-7749102", "jurisdiction": "Dubai DED", "address": "Al Rigga Road, Deira, Dubai"},
        risk_score=92.0,
        risk_factors=["Network N7 Destination Shell Entity", "Invoice fabrication"],
        tags=["Overseas Shell", "Network N7 Hub"]
    ))

    acc_rakbank = graph_store.add_node(NodeCreate(
        id="acc_rakbank_dubai",
        type=NodeType.BANK_ACCOUNT,
        label="RAKBANK UAE A/C #88491029482",
        properties={"bank": "National Bank of Ras Al Khaimah (RAKBANK)", "currency": "AED / USD", "jurisdiction": "UAE"},
        risk_score=89.0,
        risk_factors=["Final destination of illicit capital flight from Delhi accounts"],
        tags=["Financial", "Offshore Account", "Network N7"]
    ))

    phone_tariq = graph_store.add_node(NodeCreate(
        id="phone_tariq",
        type=NodeType.PHONE,
        label="+971 50 123 4567",
        properties={"carrier": "Etisalat UAE", "type": "International Satellite & Signal Phone"},
        risk_score=85.0,
        risk_factors=["Encrypted coordination point with Indian brokers"],
        tags=["Phone", "International"]
    ))

    # 3. Create Graph Edges (Relationships with Provenance)
    # Case connections
    graph_store.add_edge(EdgeCreate(
        id="edge_01",
        source="person_vikram_singhania",
        target="case_c104",
        type=RelationType.INVOLVED_IN,
        label="Named in FIR",
        properties={"role": "Accused #1", "sections": "IPC 420/120B"},
        source_id="ev_fir_104_03",
        evidence_id="ev_fir_104_03",
        confidence=0.98
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_02",
        source="person_vikram_singhania",
        target="org_singhania_infra",
        type=RelationType.OWNS,
        label="Majority Shareholder (78%)",
        properties={"directorship_start": "2015-04-01"},
        source_id="ev_mca_104_04",
        evidence_id="ev_mca_104_04",
        confidence=0.99
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_03",
        source="person_vikram_singhania",
        target="phone_singhania",
        type=RelationType.USES,
        label="Registered Subscriber",
        source_id="ev_cdr_104_01",
        evidence_id="ev_cdr_104_01",
        confidence=0.95
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_04",
        source="person_vikram_singhania",
        target="vehicle_suv_singhania",
        type=RelationType.OWNS_VEHICLE,
        label="Personal Vehicle",
        confidence=0.90
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_05",
        source="org_singhania_infra",
        target="acc_hdfc_singhania",
        type=RelationType.OWNS,
        label="Corporate Account",
        source_id="ev_bank_104_02",
        evidence_id="ev_bank_104_02",
        confidence=1.0
    ))

    # CDR communication link (Singhania <-> Rajesh Hawala)
    graph_store.add_edge(EdgeCreate(
        id="edge_06",
        source="phone_singhania",
        target="phone_rajesh",
        type=RelationType.COMMUNICATED_WITH,
        label="24 Intercepted Calls",
        properties={"call_count": 24, "total_duration_secs": 5160, "time_range": "Jan 10-20, 2026"},
        source_id="ev_cdr_104_01",
        evidence_id="ev_cdr_104_01",
        confidence=0.98
    ))

    # Rajesh ownership and location
    graph_store.add_edge(EdgeCreate(
        id="edge_07",
        source="person_rajesh_hawala",
        target="phone_rajesh",
        type=RelationType.USES,
        label="Operator Phone",
        source_id="ev_cdr_104_01",
        evidence_id="ev_cdr_104_01",
        confidence=0.96
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_08",
        source="person_rajesh_hawala",
        target="org_bluestar_trading",
        type=RelationType.OWNS,
        label="Managing Director & Shell Beneficiary",
        source_id="ev_mca_104_04",
        evidence_id="ev_mca_104_04",
        confidence=0.99
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_09",
        source="org_bluestar_trading",
        target="acc_icici_bluestar",
        type=RelationType.OWNS,
        label="Primary Current A/C",
        source_id="ev_bank_104_02",
        evidence_id="ev_bank_104_02",
        confidence=1.0
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_10",
        source="person_rajesh_hawala",
        target="loc_chandni_chowk",
        type=RelationType.LOCATED_AT,
        label="Operates Office & Safehouse",
        confidence=0.92
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_11",
        source="person_amit_sharma",
        target="person_rajesh_hawala",
        type=RelationType.ASSOCIATED_WITH,
        label="Employed Cash Courier",
        confidence=0.90
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_12",
        source="person_amit_sharma",
        target="loc_chandni_chowk",
        type=RelationType.VISITED,
        label="Frequent Cash Pickup (3x/week)",
        confidence=0.88
    ))

    # Bank Layering (Singhania HDFC -> BlueStar ICICI -> RAKBANK Dubai)
    graph_store.add_edge(EdgeCreate(
        id="edge_13",
        source="acc_hdfc_singhania",
        target="acc_icici_bluestar",
        type=RelationType.TRANSFERRED_TO,
        label="₹3.20 Cr Wire (Jan 15, 2026)",
        properties={"amount": 32000000, "currency": "INR", "date": "2026-01-15T11:42:00Z", "ref": "RTGS/HDFC/001928"},
        source_id="ev_bank_104_02",
        evidence_id="ev_bank_104_02",
        confidence=1.0
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_14",
        source="acc_icici_bluestar",
        target="acc_rakbank_dubai",
        type=RelationType.TRANSFERRED_TO,
        label="₹4.80 Cr Outward Wire (Jan 16, 2026)",
        properties={"amount": 48000000, "currency": "INR", "date": "2026-01-16T15:10:00Z", "ref": "SWIFT/ICIC/DXB991"},
        source_id="ev_bank_104_02",
        evidence_id="ev_bank_104_02",
        confidence=1.0
    ))

    # Dubai Network N7 Connections
    graph_store.add_edge(EdgeCreate(
        id="edge_15",
        source="org_dubai_express",
        target="acc_rakbank_dubai",
        type=RelationType.OWNS,
        label="Corporate Account Holder",
        confidence=0.95
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_16",
        source="person_tariq_dubai",
        target="org_dubai_express",
        type=RelationType.OWNS,
        label="Managing Partner",
        confidence=0.97
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_17",
        source="person_tariq_dubai",
        target="phone_tariq",
        type=RelationType.USES,
        label="Satellite Contact",
        confidence=0.92
    ))

    graph_store.add_edge(EdgeCreate(
        id="edge_18",
        source="phone_rajesh",
        target="phone_tariq",
        type=RelationType.COMMUNICATED_WITH,
        label="42 Encrypted Calls (Hawala Settlement)",
        properties={"call_count": 42, "encrypted": True, "time_range": "Jan 1-25, 2026"},
        confidence=0.94
    ))

    return {
        "nodes_seeded": len(graph_store.nodes),
        "edges_seeded": len(graph_store.edges),
        "evidence_records": len(evidence_store)
    }

# Run seed on import
seed_synthetic_investigation_data()
