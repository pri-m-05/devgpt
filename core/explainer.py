"""
explainer.py

Take the top-K code chunks plus a question and use
ChatCompletion to produce a human-readable answer.
"""

import os
import openai
from dotenv import load_dotenv

# 1. Load .env and set API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def explain(chunks: list[dict], question: str) -> str:
    """
    - Build system & user messages, each as a {"role": "...", "content": "..."} dict.
    - Call openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[...]).
    - Return the assistant’s reply (string).
    """
    # 1) Combine the top chunks into a single string
    snippet_text = ""
    for chunk in chunks:
        # Use chunk['path'] for file name and chunk['text'] for code
        snippet_text += f"File: {chunk['path']}\n{chunk['text']}\n\n"

    # 2) Create the system message as a dict
    system_msg = {
        "role": "system",
        "content": "You are an AI assistant specialized in explaining code."
    }

    # 3) Create the user message as a dict, embedding the snippet_text and the question
    user_msg = {
        "role": "user",
        "content": f"{snippet_text}\nQuestion: {question}"
    }

    # 4) Call the ChatCompletion endpoint with a list of dict messages
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[system_msg, user_msg],
        temperature=0.0
    )

    # 5) Extract and return the assistant’s reply text
    return resp["choices"][0]["message"]["content"].strip()
