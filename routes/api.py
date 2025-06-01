"""
api.py

Flask blueprint exposing two endpoints:
  - POST /api/initialize
  - POST /api/ask
"""

from flask import Blueprint, request, jsonify
from core.chunker import chunk_files_in_directory
from core.embedder import embed_chunks, embed_text
from core.retriever import retrieve
from core.explainer import explain


api = Blueprint('api', __name__)

# In-memory store for your embedded chunks
EMBEDDED_CHUNKS: list[dict] = []

@api.route('/initialize', methods=['POST'])
def initialize():
    """
    Expected JSON body: { "code_path": "<absolute/or/relative/path>" }
    Steps:
      1. Read JSON body and extract code_path
      2. Call chunk_files_in_directory(code_path) → list of chunks
      3. Call embed_chunks(...) → list of chunks with embeddings
      4. Store result in EMBEDDED_CHUNKS
      5. Return JSON { message, num_chunks }
    """
    code_path = request.json['code_path']
    chunks = chunk_files_in_directory(code_path)
    embedded_chunks = embed_chunks(chunks)
    EMBEDDED_CHUNKS.extend(embedded_chunks)
    return jsonify({'message': 'Initialization complete', 'num_chunks': len(embedded_chunks)})

@api.route('/ask', methods=['POST'])
def ask():
    """
    Expected JSON body: { "question": "Your query here" }
    Steps:
      1. Read JSON body and extract question
      2. Call embed_text(question) → query_vec
      3. Call retrieve(query_vec, EMBEDDED_CHUNKS) → top_chunks
      4. Call explain(top_chunks, question) → answer_str
      5. Return JSON { answer: answer_str }
    """
    question = request.json['question']
    query_vec = embed_text(question)
    top_chunks = retrieve(query_vec, EMBEDDED_CHUNKS)
    answer_str = explain(top_chunks, question)
    return jsonify({'answer': answer_str})
