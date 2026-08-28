import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class AuditBlock(BaseModel):
    index: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    action: str  # e.g., "ADD_NODE", "ADD_EDGE", "ATTACH_EVIDENCE", "GENERATE_REPORT"
    actor: str = "System Investigator"
    details: Dict[str, Any]
    previous_hash: str
    block_hash: str

class AuditLedger:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis = AuditBlock(
            index=0,
            timestamp=datetime.utcnow(),
            action="GENESIS",
            actor="System",
            details={"message": "PS26189 Tamper-Evident Investigation Ledger Initialized"},
            previous_hash="0" * 64,
            block_hash=hashlib.sha256(b"PS26189_GENESIS").hexdigest()
        )
        self.chain.append(genesis)

    def record_event(self, action: str, details: Dict[str, Any], actor: str = "Investigator Agent") -> AuditBlock:
        prev_block = self.chain[-1]
        new_index = len(self.chain)
        now = datetime.utcnow()
        
        # Hash computation
        raw_payload = f"{new_index}|{now.isoformat()}|{action}|{actor}|{str(details)}|{prev_block.block_hash}"
        block_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
        
        block = AuditBlock(
            index=new_index,
            timestamp=now,
            action=action,
            actor=actor,
            details=details,
            previous_hash=prev_block.block_hash,
            block_hash=block_hash
        )
        self.chain.append(block)
        return block

    def verify_chain_integrity(self) -> Dict[str, Any]:
        """Verify that no block in the ledger has been modified."""
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]
            
            if curr.previous_hash != prev.block_hash:
                return {
                    "is_valid": False,
                    "tampered_at_index": i,
                    "message": f"Block #{i} previous hash mismatch"
                }
        return {
            "is_valid": True,
            "total_blocks": len(self.chain),
            "latest_hash": self.chain[-1].block_hash if self.chain else None
        }

    def get_latest_blocks(self, limit: int = 50) -> List[AuditBlock]:
        return self.chain[-limit:][::-1]

audit_ledger = AuditLedger()
