<div align="center">
  <h1>🧠 Offline Multimodal RAG System</h1>
  <p><i>A completely offline, production-grade Retrieval-Augmented Generation (RAG) AI assistant.</i></p>
  
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
</div>

---

## 📖 Description

The **Offline Multimodal RAG System** is a next-generation AI chat application designed to keep your data **100% private and secure**. Operating entirely on your local hardware without any external API calls, it leverages powerful local Large Language Models (LLMs) to retrieve, analyze, and synthesize information from a variety of your local files. 

Whether you need to summarize a 50-page PDF report, extract data from a scanned image, or transcribe a recorded meeting, the system intelligently links your documents directly to the AI's localized knowledge base. It even provides direct source citations in the chat interface!

## ✨ Key Features

- 🔒 **Absolute Privacy:** Everything runs locally. No data is ever sent to the cloud.
- 📄 **Rich Document Parsing:** Natively supports uploading and parsing standard text documents (`.pdf`, `.docx`, `.txt`).
- 👁️ **Visual Intelligence (OCR):** Extracts text directly from images (`.png`, `.jpg`, `.jpeg`) using Tesseract OCR.
- 🎙️ **Audio Transcription (STT):** Converts spoken audio to text (`.mp3`, `.wav`) using OpenAI's Whisper model locally.
- 🧠 **Local LLM Integration:** Powered by [Ollama](https://ollama.com/), natively defaulting to the highly capable `mistral` model.
- ⚡ **Lightning Fast Interface:** Built with React, Vite, and TailwindCSS for a responsive, modern, and beautiful user experience.
- 🐳 **Docker Ready:** Spin up the entire environment in a single command using Docker Compose.

---

## 🛠️ Technology Stack

| Component | Technology |
| --- | --- |
| **Backend** | Python, FastAPI, Uvicorn |
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide Icons |
| **Vector Store** | FAISS, SQLite (metadata matching) |
| **AI Elements** | Ollama (Mistral), Whisper (Audio STT), Tesseract (Images OCR) |

---

## 🚀 Getting Started

### Prerequisites
1. **Docker & Docker Compose** (for the easiest setup experience).
2. **[Ollama](https://ollama.com/)** running locally on your machine.
3. Download the default model by running:
   ```bash
   ollama run mistral
   ```

*(Note: The backend Docker container automatically installs Tesseract OCR and FFmpeg. If running natively without Docker, you must externally install `tesseract-ocr` and `ffmpeg` on your system to process images and audio.)*

### Method 1: Docker Compose (Recommended)

Ensure Ollama is running on your host machine (typically on port `11434`), then execute:

```bash
docker-compose up --build
```

- **Frontend Chat UI**: Navigate to `http://localhost:3000`
- **Backend API Docs**: Navigate to `http://localhost:8000/docs`

### Method 2: Local Development Setup

If you prefer to run the components independently or develop locally:

**1. Backend Server**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Frontend Client**
```bash
cd frontend
npm install
npm run dev
```
*The React frontend will be available at `http://localhost:5173`*

---

## 💡 Example Queries

Not sure where to start? Upload a file into the chat and try asking:

* **Documents:** *"Can you summarize the main findings from the uploaded Q3 report in 5 bullet points?"*
* **Audio:** *"What were the key takeaways and action items discussed in the meeting recording?"*
* **Images:** *"Extract all the text and identify the total invoice amount from the uploaded image."*

<br/>
<div align="center">
  <i>Designed with ❤️ for privacy enthusiasts and power users.</i>
</div>
