import os
import threading
import faiss
import numpy as np
import pickle
import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from core.config import settings

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        self._lock = threading.Lock()
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.dimension = self.embedding_model.get_sentence_embedding_dimension()
        self.index_path = os.path.join(settings.FAISS_DIR, "faiss.index")
        self.metadata_path = os.path.join(settings.FAISS_DIR, "metadata.pkl")
        
        # Load or initialize FAISS index
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = [] # List of dicts: {"doc_id": id, "text": chunk_text}

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len
        )

    def save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata, f)

    def add_document(self, doc_id: int, filename: str, text: str):
        # 1. Chunking
        chunks = self.text_splitter.split_text(text)
        if not chunks:
            return 0
        
        # 2. Embedding
        embeddings = self.embedding_model.encode(chunks, convert_to_numpy=True)
        
        # 3. Add to FAISS and Metadata (thread-safe)
        with self._lock:
            self.index.add(embeddings)
            for chunk in chunks:
                self.metadata.append({
                    "doc_id": doc_id,
                    "filename": filename,
                    "text": chunk
                })
            self.save()
        
        logger.info(f"Indexed {len(chunks)} chunks for doc_id={doc_id} ({filename})")
        return len(chunks)

    def search(self, query: str, top_k: int = 4):
        with self._lock:
            if self.index.ntotal == 0:
                return []
            
            query_embedding = self.embedding_model.encode([query], convert_to_numpy=True)
            distances, indices = self.index.search(query_embedding, top_k)
            
            results = []
            for i, idx in enumerate(indices[0]):
                if idx != -1 and idx < len(self.metadata):
                    results.append({
                        "distance": float(distances[0][i]),
                        "chunk": self.metadata[idx]["text"],
                        "doc_id": self.metadata[idx]["doc_id"],
                        "filename": self.metadata[idx]["filename"]
                    })
        return results

# Singleton instance
vector_store = VectorStore()
