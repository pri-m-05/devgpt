DevGPT — Your AI Codebase Navigator 🧠
DevGPT is a full-stack AI assistant built to help developers understand, navigate, and reason about large codebases with ease. It embeds your project into a semantic vector space and lets you ask natural language questions like “How does authentication work?” or “Where is this function used?” — returning grounded, context-aware answers based on the actual source code.

🛠 Built With
React + Tailwind + shadcn/ui (Frontend)

Flask + LangChain + FAISS (Backend)

OpenAI Embeddings (for semantic search)

✨ Key Features
🔍 Semantic Search Over Code
Navigate unfamiliar repos with questions like “What does this file do?” or “Where is the main loop?”

💬 Chat with Your Codebase
A familiar conversational UI lets you talk to your code as if it were another dev on your team.

⚡ Lightning-Fast Embedding & Indexing
Code is parsed and embedded locally using OpenAI + FAISS, enabling rapid, intelligent retrieval.

📁 Multi-File + Directory-Level Summaries
Understand file relationships and structure without having to read each one line-by-line.

🧪 Example Prompts
"Summarize the auth directory."
"What happens when the user clicks login?"
"Trace the logic from this route to the database layer."

📂 Project Structure
devgpt/
├── backend/        # Flask API, LangChain logic, vector database
├── frontend/       # React interface (chat window, file explorer)
├── embeddings/     # Generated FAISS vector indexes
├── docs/           # Assets for demo/docs
