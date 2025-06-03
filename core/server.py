# server.py
import os
from flask import Flask, request, jsonify

# Import the existing modules you already have:
from chunker import chunk_files_in_directory
from embedder import embed_chunks, embed_text
from retriever import retrieve
from explainer import explain

app = Flask(__name__)

# In-memory cache for embedded chunks (so we don't re-run embeddings on every question)
_cached_embedded_chunks = None

@app.route('/api/load_and_embed', methods=['POST'])
def load_and_embed():
    """
    Expects JSON: { "directory": "<relative-path-to-your-codebase>" }
    Returns JSON: { "status": "ok", "num_chunks": <int> } on success,
                 or     { "error": "<message>" } with a 4xx/5xx status code.
    """
    global _cached_embedded_chunks

    data = request.get_json()
    if not data or 'directory' not in data:
        return jsonify({"error": "Missing 'directory' field"}), 400

    directory = data['directory']
    try:
        # 1) Chunk all source files under the given directory
        chunks = chunk_files_in_directory(directory)

        # 2) Embed all those chunks (this may take some time on first run)
        embedded = embed_chunks(chunks)

        # 3) Cache for future question calls
        _cached_embedded_chunks = embedded

        return jsonify({
            "status": "ok",
            "num_chunks": len(embedded)
        }), 200

    except FileNotFoundError as fnf:
        return jsonify({"error": f"Directory not found: {str(fnf)}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/question', methods=['POST'])
def answer_question():
    """
    Expects JSON: { "question": "<plain-text question>" }
    Requires that /api/load_and_embed was already called successfully.
    Returns JSON: { "answer": "<LLM-generated explanation>" }
    """
    global _cached_embedded_chunks

    if _cached_embedded_chunks is None:
        return jsonify({"error": "Embeddings not loaded. Call /api/load_and_embed first."}), 400

    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "Missing 'question' field"}), 400

    question = data['question']
    try:
        # 1) Embed the question text
        q_vec = embed_text(question)

        # 2) Retrieve the top 5 most‐relevant chunks
        top_chunks = retrieve(q_vec, _cached_embedded_chunks, top_k=5)

        # 3) Get an explanation from the LLM using those top chunks + question
        answer_text = explain(top_chunks, question)

        return jsonify({"answer": answer_text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # By default, Flask listens on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
