# Offline Multimodal RAG System

A completely offline, production-grade Retrieval Augmented Generation AI assistant. 
Supports uploading standard documents (PDF, DOCX, TXT), images (OCR via Tesseract), and audio (STT via Whisper) to a local AI for chatting.

## Prerequisites

Before running this application, you must install the following on your host system:

1. **Docker & Docker Compose**
2. **Ollama**: Download and install Ollama from [https://ollama.com/](https://ollama.com/).
3. **Pull local model**: Run `ollama run mistral` in your terminal to download the language model. The backend defaults to `mistral`.

*Note: The backend Docker container automatically installs Tesseract OCR and FFmpeg. If you run the backend natively (without Docker), you must install `tesseract-ocr` and `ffmpeg` on your host system.*

## Project Structure

- `/backend`: FastAPI Python server containing the ingestion pipeline, FAISS vector store logic, and LLM communication integrations.
- `/frontend`: React + Vite single page application with Tailwind CSS and Lucide icons.
- `/data` (Auto-generated): Local directory where SQLite metadata, uploaded files, and FAISS indices are securely stored offline.

## Running the Application

### Method 1: Docker Compose (Recommended)

Make sure Ollama is running on your host machine on port `11434`.

```bash
docker-compose up --build
```

- **Frontend Chat**: Navigate to `http://localhost:3000`
- **Backend API Docs**: Navigate to `http://localhost:8000/docs`

### Method 2: Local Development Setup

To run things manually without Docker:

**1. Backend**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
# Ensure tesseract and ffmpeg are installed via apt/brew/choco.
uvicorn main:app --reload --port 8000
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
# The frontend will start at http://localhost:5173
```

## Example Queries

Once you have uploaded a document (like a PDF report or a recorded meeting MP3), try asking:
- "Can you summarize the main findings from the uploaded Q3 report?"
- "What did John say about the new product launch in the audio meeting?"
- "Extract the total invoice value from the uploaded image."

The LLM will cite its sources directly in the chat layout!
