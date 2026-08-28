import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "PS26189 - Agentic Graph Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    
    # Storage paths
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))
    STORAGE_FILE: str = os.getenv("STORAGE_FILE", os.path.join(os.path.dirname(__file__), "data", "graph_store.json"))
    
    # Future integration settings (Ready to be configured)
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")
    
    # LLM / Agent settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_LLM_MODEL: str = os.getenv("DEFAULT_LLM_MODEL", "qwen2.5:7b")
    
    # Security / Integrity
    HASH_SALT: str = os.getenv("HASH_SALT", "ps26189_sih_secure_salt_2026")

settings = Settings()
