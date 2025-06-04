# core/server.py

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# ───── Create Flask app + enable CORS ───────────────────
app = Flask(__name__)
CORS(app)  
# CORS(app) makes Flask send:
#   Access-Control-Allow-Origin: *
#   Access-Control-Allow-Methods: GET, POST, OPTIONS
#   Access-Control-Allow-Headers: Content-Type

print(">>> RUNNING Python from:", sys.executable)
print(">>> CURRENT server.py path:", __file__)
print(">>> Contents of this folder:", os.listdir(os.path.dirname(__file__)))

# ───── In-memory cache to hold embedded chunks ────────────
_cached_embedded_chunks = None

# ───── POST /api/load_and_embed ───────────────────────────
@app.route("/api/load_and_embed", methods=["POST"])
def load_and_embed():
    """
    Expects JSON: { "directory": "<relative-or-absolute-path>" }
    1) Split files into chunks
    2) Embed them
    3) Save in _cached_embedded_chunks
    4) Return { "status": "ok", "num_chunks": <int> }
    """
    global _cached_embedded_chunks

    data = request.get_json(silent=True)
    if not data or "directory" not in data:
        return jsonify({"error": "Missing 'directory'"}), 400

    directory = data["directory"]
    try:
        # ─── Import your existing chunker/embedder here ───
        from chunker import chunk_files_in_directory
        from embedder import embed_chunks

        # 1) Chunk all source files under `directory`
        chunks = chunk_files_in_directory(directory)

        # 2) Embed those chunks
        embedded = embed_chunks(chunks)

        # 3) Cache for question time
        _cached_embedded_chunks = embedded

        return jsonify({
            "status": "ok",
            "num_chunks": len(embedded)
        }), 200

    except FileNotFoundError as e:
        return jsonify({"error": f"Directory not found: {str(e)}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ───── POST /api/question ───────────────────────────────────
@app.route("/api/question", methods=["POST"])
def answer_question():
    """
    Expects JSON: { "question": "<plain-text>" }
    Must be called after /api/load_and_embed.
    Returns: { "answer": "<LLM response>" }
    """
    global _cached_embedded_chunks

    if _cached_embedded_chunks is None:
        return jsonify({"error": "Embeddings not loaded. Call load_and_embed first."}), 400

    data = request.get_json(silent=True)
    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question'"}), 400

    question = data["question"]
    try:
        from embedder import embed_text
        from retriever import retrieve
        from explainer import explain

        # 1) Embed question text
        q_vec = embed_text(question)

        # 2) Retrieve top-5 chunks
        top_chunks = retrieve(q_vec, _cached_embedded_chunks, top_k=5)

        # 3) Ask LLM to explain
        answer_text = explain(top_chunks, question)

        return jsonify({ "answer": answer_text }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ───── Main entrypoint ─────────────────────────────────────
if __name__ == "__main__":
    # Print the final URL map so we know both routes are registered
    print("---- URL MAP (FINAL) ----")
    print(app.url_map)
    print("-------------------------")
    # Run on port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
