---
title: "RAG (Retrieval-Augmented Generation)"
letter: "R"
categories:
  - "ai-ml"
  - "architecture"
shortDefinition: "An architecture pattern that enhances LLM responses by first retrieving relevant information from external knowledge sources and including it in the prompt."
---

## Why does it exist?

Large language models have a fundamental limitation: their knowledge is frozen at training time. They cannot access your company's internal documents, recent events, or proprietary data. When asked about information outside their training data, they either refuse to answer or confidently hallucinate incorrect facts. Fine-tuning the model on private data is expensive, slow, and must be repeated as data changes.

RAG solves this by separating knowledge from reasoning. Instead of baking knowledge into the model's weights, RAG retrieves relevant documents at query time and injects them into the prompt as context. The LLM then generates its answer based on the retrieved information. This approach gives the model access to up-to-date, domain-specific knowledge without retraining, and it provides traceability because you can see exactly which documents informed the response.

## Practical example of use

A company builds an internal Q&A assistant that answers employee questions using the company's knowledge base articles.

```python
from openai import OpenAI
from qdrant_client import QdrantClient

openai_client = OpenAI()
qdrant = QdrantClient(url="http://localhost:6333")

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        model="text-embedding-3-small", input=text
    )
    return response.data[0].embedding

def retrieve_context(query: str, top_k: int = 3) -> list[str]:
    """Retrieve the most relevant documents for the query."""
    query_vector = get_embedding(query)
    results = qdrant.search(
        collection_name="company_docs",
        query_vector=query_vector,
        limit=top_k,
    )
    return [hit.payload["text"] for hit in results]

def ask(question: str) -> str:
    """RAG pipeline: retrieve context, then generate an answer."""
    # Step 1: Retrieve relevant documents
    context_docs = retrieve_context(question)
    context = "\n\n---\n\n".join(context_docs)

    # Step 2: Generate answer using retrieved context
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that answers questions based on "
                    "the provided company documentation. If the documentation does "
                    "not contain the answer, say so. Do not make up information."
                ),
            },
            {
                "role": "user",
                "content": f"Documentation:\n{context}\n\nQuestion: {question}",
            },
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content

# Usage
answer = ask("What is our company's policy on remote work?")
print(answer)
```

## When to use

- When building Q&A systems over private or frequently updated knowledge bases (internal docs, product manuals, legal documents)
- When you need LLM responses grounded in specific sources to reduce hallucination and enable citation
- When the knowledge domain is too large or changes too often for fine-tuning to be practical
- When building customer support bots, documentation assistants, or research tools that must reference authoritative sources

## When to avoid

- When the LLM's built-in knowledge is sufficient for the task (general knowledge questions, creative writing, code generation without domain-specific context)
- When the use case requires real-time data that is not available in a pre-indexed document store (live stock prices, sensor data)
- When the retrieved documents are so long that they exceed the model's context window, requiring additional summarization or chunking strategies
- When the quality of the knowledge base is poor — RAG over bad documents produces bad answers with a veneer of authority

## Trade-offs

- **Accuracy vs. latency**: The retrieval step adds latency (embedding the query, searching the vector database, fetching documents) before the LLM can begin generating.
- **Groundedness vs. completeness**: Constraining the LLM to the retrieved documents reduces hallucination but may cause it to miss relevant information that was not retrieved.
- **Simplicity vs. chunking complexity**: Documents must be split into appropriately sized chunks for embedding and retrieval. Chunks that are too small lose context; chunks that are too large dilute relevance and waste context window tokens.

## Common small mistakes

- Using chunk sizes that are too large (losing retrieval precision) or too small (losing context that the LLM needs to form a coherent answer)
- Not including metadata (source, date, section title) with retrieved chunks, making it impossible for the LLM to cite sources or assess recency
- Retrieving too many documents and stuffing them all into the prompt, exceeding the context window or drowning the relevant information in noise
- Not evaluating retrieval quality separately from generation quality — a good LLM cannot compensate for a retrieval step that returns irrelevant documents
- Skipping the system prompt instruction to only answer based on provided context, which allows the model to fall back to hallucinating from its training data
