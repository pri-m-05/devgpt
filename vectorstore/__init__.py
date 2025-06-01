import json
from typing import List, Tuple

# this function should take in a list of (chunk, embedding) pairs
# and save them into a JSON file called "vectorstore.json"
# you can store each pair as a dictionary with keys "chunk" and "embedding"
# make sure the file is overwritten each time it's saved
def save_embeddings(data: List[Tuple[str, List[float]]]) -> None:
    json_data = [{"chunk": chunk, "embedding": embedding} for chunk, embedding in data]
    with open("vectorstore.json", "w") as file:
        json.dump(json_data, file)



# this function should read the "vectorstore.json" file and
# return a list of (chunk, embedding) tuples
# the embeddings should be loaded as lists of floats again
def load_embeddings() -> List[Tuple[str, List[float]]]:
    with open("vectorstore.json", "r") as file:
        json_data = json.load(file)
        return [(item["chunk"], item["embedding"]) for item in json_data]
    

