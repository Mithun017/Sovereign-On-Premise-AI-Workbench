import re
import math
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.entities import DocumentChunk, KnowledgeCollection, Document
from app.schemas.schemas import KnowledgeSearchResult

class LocalKnowledgeEngine:
    """
    On-Premise Enterprise Knowledge Engine:
    Handles document chunking, deterministic vector embeddings, local similarity 
    scoring, metadata filtering, and citation generation with zero external calls.
    """
    def __init__(self):
        pass

    def _simple_embedding(self, text: str) -> List[float]:
        """Deterministic local embedding generation for air-gapped indexing"""
        words = re.findall(r'\w+', text.lower())
        vec = [0.0] * 32
        for w in words:
            h = hash(w)
            idx = abs(h) % 32
            vec[idx] += 1.0
        # Normalize
        norm = math.sqrt(sum(x*x for x in vec)) or 1.0
        return [round(x / norm, 4) for x in vec]

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        return sum(a * b for a, b in zip(vec1, vec2))

    def chunk_and_index_document(
        self, 
        db: Session, 
        doc_id: str, 
        doc_name: str, 
        full_text: str, 
        department: str = "Refinery Operations",
        collection_id: Optional[str] = None
    ) -> int:
        paragraphs = [p.strip() for p in full_text.split("\n\n") if len(p.strip()) > 30]
        if not paragraphs:
            paragraphs = [full_text]

        chunk_count = 0
        for idx, para in enumerate(paragraphs):
            page_approx = (idx // 3) + 1
            citation = f"[{doc_name.split('.')[0]}, Page {page_approx}]"
            vec = self._simple_embedding(para)

            chunk = DocumentChunk(
                id=str(uuid.uuid4()),
                document_id=doc_id,
                collection_id=collection_id,
                chunk_index=idx,
                content=para,
                citation_reference=citation,
                metadata_json={
                    "doc_name": doc_name,
                    "department": department,
                    "page": page_approx,
                    "length": len(para)
                },
                embedding_vector=vec
            )
            db.add(chunk)
            chunk_count += 1

        db.commit()
        return chunk_count

    def hybrid_search(
        self, 
        db: Session, 
        query: str, 
        collection_id: Optional[str] = None,
        department: Optional[str] = None,
        top_k: int = 5
    ) -> List[KnowledgeSearchResult]:
        query_vec = self._simple_embedding(query)
        query_terms = set(re.findall(r'\w+', query.lower()))

        chunks_query = db.query(DocumentChunk)
        if collection_id:
            chunks_query = chunks_query.filter(DocumentChunk.collection_id == collection_id)

        all_chunks = chunks_query.all()
        scored_results: List[Dict[str, Any]] = []

        for chunk in all_chunks:
            # Vector score
            v_score = self._cosine_similarity(query_vec, chunk.embedding_vector or [])
            
            # Keyword / BM25 lexical boost
            chunk_terms = set(re.findall(r'\w+', chunk.content.lower()))
            overlap = len(query_terms.intersection(chunk_terms))
            k_score = overlap / (len(query_terms) or 1)

            hybrid_score = (0.55 * v_score) + (0.45 * k_score)
            doc_meta = chunk.metadata_json or {}

            scored_results.append({
                "chunk": chunk,
                "score": hybrid_score,
                "doc_name": doc_meta.get("doc_name", "Enterprise Document")
            })

        # Sort by score descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        top_items = scored_results[:top_k]

        return [
            KnowledgeSearchResult(
                chunk_id=item["chunk"].id,
                document_id=item["chunk"].document_id,
                document_name=item["doc_name"],
                citation=item["chunk"].citation_reference,
                content=item["chunk"].content,
                score=round(float(item["score"]), 4),
                metadata=item["chunk"].metadata_json or {}
            )
            for item in top_items
        ]

knowledge_engine = LocalKnowledgeEngine()
