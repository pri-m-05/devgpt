"""
chunker.py

Split every source file into manageable "chunks" so that each piece
is small enough for embedding & LLM context windows.
"""

import os

def list_source_files(directory, extensions=('.py', '.js', '.java')):
    """
    1. Walk the directory tree.
    2. Yield only files matching our language extensions.
    """
    for root, dirs, files in os.walk(directory):
        for fname in files:
            if fname.endswith(extensions):
                yield os.path.join(root, fname)

def read_file(path):
    """
    Open & read a file's contents in UTF-8.
    Returns a single string.
    """
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def chunk_source_code(code_str, max_lines=20):
    """
    1. Split the code into lines.
    2. Group lines into blocks of ≤ max_lines.
    3. Return a list of chunk-strings.
    """
    lines = code_str.splitlines()
    chunks = []
    for i in range(0, len(lines), max_lines):
        chunk = "\n".join(lines[i : i + max_lines])
        chunks.append(chunk)
    return chunks

def chunk_files_in_directory(directory):
    """
    1. For each source file in `directory`:
       a. Read its code.
       b. Chunk it.
    2. Return a list of dicts:
       {
         'path': full file path,
         'chunk_id': unique identifier (e.g. "file.py_part2"),
         'text': chunk string
       }
    """
    all_chunks = []
    for filepath in list_source_files(directory):
        code = read_file(filepath)
        pieces = chunk_source_code(code)
        for idx, text in enumerate(pieces):
            all_chunks.append({
                'path': filepath,
                'chunk_id': f"{os.path.basename(filepath)}_part{idx}",
                'text': text
            })
    return all_chunks

# Quick test when run directly:
if __name__ == '__main__':
    chunks = chunk_files_in_directory('Users/priya/OneDrive/Projects/devgpt')
    for c in chunks[:3]:
        print(c['chunk_id'], '▶', c['text'][:60].replace('\n','␤'))
