<h1 align="center">DevGPT — Your AI Codebase Navigator 🧠</h1>
**DevGPT** is a full-stack AI assistant built to help developers understand, navigate, and reason about large codebases with ease. It embeds your project into a semantic vector space and lets you ask natural language questions like:

>
> “How does authentication work?”  
> “Where is this function used?”  
> “What happens when the user logs in?”
>

It then returns grounded, context-aware answers based on the actual source code.

---

## Overview

DevGPT is designed for:

- Rapid onboarding into unfamiliar repositories  
- Faster comprehension of large or legacy codebases  
- Debugging and tracing logic without context switching  
- Improving developer productivity by reducing manual searching

---

## Built With

**Frontend:** React, TailwindCSS, shadcn/ui  
**Backend:** Flask, LangChain, FAISS  
**Embeddings:** OpenAI Embeddings (for semantic understanding)

---

## Key Features

### Semantic Search Over Code  
Ask high-level or low-level questions about your codebase using natural language. DevGPT retrieves relevant context from across the repository, not just by keywords.

### Conversational UI  
Interact with your codebase through a clean, familiar chat interface — ask questions, request summaries, or trace logic flows across files.

### Fast Local Embedding and Indexing  
Embeds and indexes your code locally using FAISS and OpenAI for fast and accurate retrieval.

### Multi-File and Directory-Level Summaries  
Understand how different components connect by summarizing entire directories or groups of files.

### Prompt-Based Exploration  
Examples of useful queries:
- "Summarize the auth directory."
- "What happens when the user clicks login?"
- "Trace the logic from this route to the database layer."

---

## Project Structure

```plaintext
devgpt/
├── backend/       # Flask API, LangChain logic, vector database
├── frontend/      # React interface (chat window, file explorer)
├── embeddings/    # Generated FAISS vector indexes
├── docs/          # Assets for demo and documentation
├── embeddings/     # Generated FAISS vector indexes
├── docs/           # Assets for demo/docs
