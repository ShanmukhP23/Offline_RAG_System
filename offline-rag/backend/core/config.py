import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Offline Multimodal RAG API"
    API_V1_STR: str = "/api"
    
    # Base paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    UPLOAD_DIR: str = os.path.join(DATA_DIR, "uploads")
    DB_DIR: str = os.path.join(DATA_DIR, "db")
    FAISS_DIR: str = os.path.join(DATA_DIR, "faiss")
    
    # Model configuration
    LLM_BASE_URL: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "mistral"  # Assume Mistral 7B is pulled in Ollama
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Chunking configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.DB_DIR, exist_ok=True)
os.makedirs(settings.FAISS_DIR, exist_ok=True)
