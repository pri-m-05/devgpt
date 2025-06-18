"""
explainer.py

Take the top-K code chunks plus a question and use
ChatCompletion to produce a human-readable answer.
"""

import os
import openai
from dotenv import load_dotenv
import tiktoken

# 1. Load .env and set API key
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def explain(chunks: list[dict], question: str) -> str:
    """
    - Build system & user messages, each as a {"role": "...", "content": "..."} dict.
    - Call client.chat.completions.create(model="gpt-3.5-turbo", messages=[...]).
    - Return the assistant's reply (string).
    """
    enc = tiktoken.encoding_for_model("gpt-3.5-turbo")
    max_total_tokens = 7000  # leave room for answer
    max_chunk_tokens = 500

    # Build code context
    snippet_text = ""
    total_tokens = 0
    for chunk in chunks:
        chunk_text = f"File: {chunk['path']}\n{chunk['text']}\n\n"
        chunk_token_ids = enc.encode(chunk_text)
        if len(chunk_token_ids) > max_chunk_tokens:
            chunk_token_ids = chunk_token_ids[:max_chunk_tokens]
            chunk_text = enc.decode(chunk_token_ids) + "\n...[chunk truncated]..."
        chunk_tokens = len(enc.encode(chunk_text))
        if total_tokens + chunk_tokens > max_total_tokens:
            break
        snippet_text += chunk_text
        total_tokens += chunk_tokens

    # Compose messages
    system_msg = {
        "role": "system",
        "content": "You are an AI assistant specialized in explaining code."
    }
    user_msg = {
        "role": "user",
        "content": f"{snippet_text}\nQuestion: {question}"
    }

    # Final strict token check: truncate user message if needed
    def count_tokens(messages):
        return sum(len(enc.encode(m["content"])) for m in messages)

    messages = [system_msg, user_msg]
    while count_tokens(messages) > 3000:
        # Truncate user message content by 10% each time
        user_msg["content"] = user_msg["content"][:int(len(user_msg["content"]) * 0.9)] + "\n...[prompt truncated]..."
        messages = [system_msg, user_msg]

    # Now safe to send
    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.0
    )
    return resp.choices[0].message.content.strip()
