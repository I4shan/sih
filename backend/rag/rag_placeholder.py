"""
RAG & Document Intelligence (Extensible Hook for Future Vector DB / FAISS / Qdrant)
----------------------------------------------------------------------------------
This module manages document chunks, full-text keyword indexing,
and provides slots for dense semantic vector embeddings.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime

class DocumentChunk:
    def __init__(self, chunk_id: str, document_id: str, content: str, metadata: Dict[str, Any]):
        self.chunk_id = chunk_id
        self.document_id = document_id
        self.content = content
        self.metadata = metadata
        self.embedding: Optional[List[float]] = None

class RAGService:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunks: List[DocumentChunk] = []

    def ingest_document(self, doc_id: str, title: str, content: str, source_type: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Chunk and index document."""
        self.documents[doc_id] = {
            "id": doc_id,
            "title": title,
            "content": content,
            "source_type": source_type,
            "metadata": metadata or {},
            "ingested_at": datetime.utcnow()
        }
        
        # Simple paragraph / sentence chunking
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        for i, para in enumerate(paragraphs):
            chunk = DocumentChunk(
                chunk_id=f"{doc_id}_chunk_{i+1}",
                document_id=doc_id,
                content=para,
                metadata={"title": title, "source_type": source_type, "chunk_index": i+1}
            )
            self.chunks.append(chunk)
            
        return {
            "document_id": doc_id,
            "chunks_created": len(paragraphs),
            "status": "indexed"
        }

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Hybrid search over document chunks.
        Hook for future dense vector semantic similarity (FAISS/Qdrant/Nomic).
        """
        query_terms = set(query.lower().split())
        scored_chunks = []
        
        for chunk in self.chunks:
            chunk_words = set(chunk.content.lower().split())
            overlap = len(query_terms.intersection(chunk_words))
            if overlap > 0:
                score = overlap / max(len(query_terms), 1)
                scored_chunks.append({
                    "chunk_id": chunk.chunk_id,
                    "document_id": chunk.document_id,
                    "title": chunk.metadata.get("title"),
                    "content": chunk.content,
                    "score": round(score, 3)
                })
                
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

rag_service = RAGService()
