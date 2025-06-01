import json
from typing import List, Tuple

# this function should load the data from "vectorstore.json"
# return it as a list of (chunk, embedding) tuples
# each embedding should be a list of floats, and chunk should be a string
def load_embeddings() -> List[Tuple[str, List[float]]]:
    with open("vectorstore.json", "r") as file:
        json_data = json.load(file)
        return [(item["chunk"], item["embedding"]) for item in json_data]
