import os
from pypdf import PdfReader
from docx import Document
import pytesseract
from PIL import Image
import whisper

class DocumentExtractor:
    def __init__(self):
        # We can load Whisper lazily or keep it in memory
        self.whisper_model = None

    def _load_whisper(self):
        if self.whisper_model is None:
            self.whisper_model = whisper.load_model("base")
        return self.whisper_model

    def extract_text(self, filepath: str, file_type: str) -> str:
        if file_type == "application/pdf":
            return self._extract_pdf(filepath)
        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or filepath.endswith(".docx"):
            return self._extract_docx(filepath)
        elif file_type.startswith("image/") or filepath.endswith((".png", ".jpg", ".jpeg")):
            return self._extract_image(filepath)
        elif file_type.startswith("audio/") or filepath.endswith((".mp3", ".wav", ".m4a")):
            return self._extract_audio(filepath)
        elif file_type == "text/plain" or filepath.endswith(".txt"):
            return self._extract_txt(filepath)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    def _extract_pdf(self, filepath: str) -> str:
        text = ""
        reader = PdfReader(filepath)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text

    def _extract_docx(self, filepath: str) -> str:
        doc = Document(filepath)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])

    def _extract_txt(self, filepath: str) -> str:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    def _extract_image(self, filepath: str) -> str:
        # Note: Requires Tesseract to be installed on the system
        try:
            image = Image.open(filepath)
            # You might need to specify tesseract cmd path if not in PATH
            # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            print(f"Error extracting image: {e}")
            return ""

    def _extract_audio(self, filepath: str) -> str:
        # Note: Requires ffmpeg installed on the system
        model = self._load_whisper()
        result = model.transcribe(filepath)
        return result.get("text", "")

extractor = DocumentExtractor()
