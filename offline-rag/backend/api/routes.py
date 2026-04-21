import os
import shutil
import hashlib
import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

logger = logging.getLogger(__name__)

MAX_UPLOAD_SIZE_MB = 500
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

from db.database import get_db
from db import models
from core.config import settings
from services.ingestion import extractor
from services.vector_store import vector_store
from services.llm import llm_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    answer: str
    citations: List[dict]

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Save file to disk
        file_location = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # Enforce upload size limit
        file_size = os.path.getsize(file_location)
        if file_size > MAX_UPLOAD_SIZE_BYTES:
            os.remove(file_location)
            raise HTTPException(
                status_code=413,
                detail=f"File too large ({file_size / (1024*1024):.1f}MB). Maximum is {MAX_UPLOAD_SIZE_MB}MB."
            )

        # Generate file hash to prevent duplicates (stream in chunks to avoid RAM spike)
        hasher = hashlib.md5()
        with open(file_location, "rb") as f:
            for block in iter(lambda: f.read(8192), b""):
                hasher.update(block)
        file_hash = hasher.hexdigest()

        # Check if already exists
        existing_doc = db.query(models.Document).filter(models.Document.content_hash == file_hash).first()
        if existing_doc:
            return {"message": "Document already exists", "document_id": existing_doc.id}

        # Create basic DB record
        db_doc = models.Document(
            filename=file.filename,
            filepath=file_location,
            file_type=file.content_type or "unknown",
            content_hash=file_hash
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        # Extract text via ingestion pipeline
        text = extractor.extract_text(file_location, db_doc.file_type)
        if not text:
            return {"message": "File uploaded but no text could be extracted.", "document_id": db_doc.id}

        # Process chunks and add to vector store
        num_chunks = vector_store.add_document(doc_id=db_doc.id, filename=db_doc.filename, text=text)

        return {"message": f"Successfully processed {file.filename} into {num_chunks} chunks.", "document_id": db_doc.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        query = request.message
        
        # 1. Retrieve Context
        results = vector_store.search(query, top_k=4)
        
        # 2. Generate Answer
        answer = llm_service.generate_response(query, results)
        
        # 3. Store Chat History
        user_msg = models.ChatMessage(session_id=request.session_id, role="user", content=query)
        ai_msg = models.ChatMessage(session_id=request.session_id, role="assistant", content=answer)
        db.add(user_msg)
        db.add(ai_msg)
        db.commit()

        # 4. Prepare Citations
        citations = [{"filename": r["filename"], "chunk": r["chunk"], "distance": r["distance"]} for r in results]

        return {"answer": answer, "citations": citations}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process chat: {str(e)}")

@router.get("/documents")
async def list_documents(db: Session = Depends(get_db)):
    docs = db.query(models.Document).order_by(models.Document.uploaded_at.desc()).all()
    return [{"id": d.id, "filename": d.filename, "type": d.file_type, "uploaded_at": d.uploaded_at} for d in docs]
