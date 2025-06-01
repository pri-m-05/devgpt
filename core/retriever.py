"""
retriever.py

Compare a query vector against code-chunk vectors and
return the top-K most similar chunks.
"""

import numpy as np

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """
    - Convert lists a, b to numpy arrays
    - Compute dot(a,b)
    - Divide by (||a|| * ||b||)
    - Return the similarity score (float)
    """
    arr_a = np.array(a)
    arr_b = np.array(b)
    similarity = np.dot(arr_a, arr_b)
    return similarity

def retrieve(query_vec: list[float],
             chunks: list[dict],
             top_k: int = 5) -> list[dict]:
    """
    - For each chunk in chunks:
        1. Read chunk['embedding']
        2. Compute similarity = cosine_similarity(query_vec, embedding)
        3. Store similarity in chunk['score']
    - Sort chunks by chunk['score'] descending
    - Return the first top_k chunks
    """
    for chunk in chunks:
        chunk['score'] = cosine_similarity(query_vec, chunk['embedding'])
    chunks.sort(key=lambda x: x['score'], reverse=True)
    return chunks[:top_k]
    
