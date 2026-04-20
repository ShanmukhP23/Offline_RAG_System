import requests
import json
from core.config import settings

class LLMService:
    def __init__(self):
        self.base_url = settings.LLM_BASE_URL
        self.model = settings.DEFAULT_MODEL

    def generate_response(self, query: str, context: list) -> str:
        # Build prompt format, could use Langchain but direct requests is simpler for Ollama
        context_str = "\n\n".join([f"Document excerpt ({c['filename']}):\n{c['chunk']}" for c in context])
        
        prompt = f"""You are a helpful AI assistant. Use the following pieces of retrieved context to answer the user's question. 
If you don't know the answer or the context doesn't contain the answer, just say that you don't know, don't try to make up an answer.

Context:
{context_str}

Question: {query}

Answer:"""

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(f"{self.base_url}/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "Error generating response.")
        except requests.exceptions.RequestException as e:
            return f"Error communicating with local LLM: {str(e)}\nMake sure Ollama is running at {self.base_url} with model '{self.model}'."

llm_service = LLMService()
