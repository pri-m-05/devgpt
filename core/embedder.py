"""
embedder.py

Turn text (code chunks or a question) into embedding vectors
using OpenAI's embeddings API.
"""

import os
import openai
from dotenv import load_dotenv
import tiktoken

# 1. Load environment variables
load_dotenv()

# 2. Set your OpenAI API key (new API uses client)
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def embed_text(text: str) -> list[float]:
    """
    - Call client.embeddings.create with:
        • model="text-embedding-3-small"
        • input=text
    - Extract the vector from the response
    - Return the vector as a list of floats
    """
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    vector = response.data[0].embedding
    return vector
    

def embed_chunks(chunks: list[dict]) -> list[dict]:
    """
    - Given a list of chunk dicts, each with a 'text' key:
      1. Loop over each chunk
      2. Call embed_text(chunk['text'])
      3. Add the resulting vector under chunk['embedding']
      4. Return the list of updated chunk dicts
    """
    enc = tiktoken.encoding_for_model("text-embedding-3-small")
    MAX_EMBED_TOKENS = 7900  # Model's context window
    for chunk in chunks:
        tokens = enc.encode(chunk['text'])
        if len(tokens) > MAX_EMBED_TOKENS:
            tokens = tokens[:MAX_EMBED_TOKENS]
            chunk['text'] = enc.decode(tokens) + "\n...[chunk truncated for embedding]..."
        chunk['embedding'] = embed_text(chunk['text'])
    return chunks
