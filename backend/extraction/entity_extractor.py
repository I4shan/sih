import re
from typing import Dict, List, Any

class EntityExtractor:
    """
    Heuristic, regex, and pattern-based entity extractor tailored
    for Indian investigation reports, FIRs, CDRs, and bank statements.
    Provides extensible hooks for future deep spaCy/Qwen NER integration.
    """
    def __init__(self):
        # Patterns for Indian investigation entities
        self.phone_pattern = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}')
        self.pan_pattern = re.compile(r'[A-Z]{5}[0-9]{4}[A-Z]{1}')
        self.vehicle_pattern = re.compile(r'[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}')
        self.account_pattern = re.compile(r'\b(?:AC|A/C|ACC|Account)\s*[:#\-]?\s*([0-9]{9,18})\b', re.IGNORECASE)
        self.ipc_section_pattern = re.compile(r'(?:IPC|Section|Sec\.?)\s*([0-9]{3}[A-Z]?(?:\s*,\s*[0-9]{3}[A-Z]?)*)', re.IGNORECASE)
        self.money_pattern = re.compile(r'(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d+)?)\s*(?:Cr|Crore|Lakh|Lakhs|k)?', re.IGNORECASE)

    def extract_from_text(self, text: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        Extract structured entities and suspected relations from unstructured text.
        """
        extracted = {
            "phones": [],
            "pan_cards": [],
            "vehicles": [],
            "bank_accounts": [],
            "legal_sections": [],
            "monetary_values": [],
            "entities": []
        }

        # Phones
        for match in self.phone_pattern.finditer(text):
            val = match.group(0).strip()
            extracted["phones"].append({"value": val, "span": match.span()})

        # PAN Cards
        for match in self.pan_pattern.finditer(text):
            val = match.group(0).strip()
            extracted["pan_cards"].append({"value": val, "span": match.span()})

        # Vehicles
        for match in self.vehicle_pattern.finditer(text):
            val = match.group(0).strip()
            extracted["vehicles"].append({"value": val, "span": match.span()})

        # Bank Accounts
        for match in self.account_pattern.finditer(text):
            val = match.group(1).strip()
            extracted["bank_accounts"].append({"value": val, "span": match.span()})

        # IPC / Legal Sections
        for match in self.ipc_section_pattern.finditer(text):
            val = match.group(0).strip()
            extracted["legal_sections"].append({"value": val, "span": match.span()})

        # Monetary Values
        for match in self.money_pattern.finditer(text):
            val = match.group(0).strip()
            extracted["monetary_values"].append({"value": val, "span": match.span()})

        return extracted

entity_extractor = EntityExtractor()
