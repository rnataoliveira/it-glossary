---
title: "Vector Database"
letter: "V"
categories:
  - "ai-ml"
  - "data"
shortDefinition: "A database optimized for storing, indexing, and querying high-dimensional vectors to enable fast similarity search."
---

## Why does it exist?

Traditional databases search by exact matches or range queries: "find users where age = 30" or "find products where price < 50." But many modern applications need to search by similarity: "find images that look like this one," "find documents that are semantically related to this query," or "find products similar to what this customer purchased." These similarity searches operate on vectors — numerical representations of data points in high-dimensional space — and traditional databases are not designed to perform them efficiently.

Vector databases use specialized indexing algorithms (like HNSW, IVF, or product quantization) that can search through millions of high-dimensional vectors in milliseconds, returning the nearest neighbors to a query vector. This capability is the backbone of semantic search, recommendation systems, and retrieval-augmented generation (RAG) for LLMs.

## Practical example of use

A knowledge base application stores document embeddings and retrieves the most relevant articles when a user asks a question.

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import OpenAI

openai_client = OpenAI()
qdrant = QdrantClient(url="http://localhost:6333")

# Create a collection for document embeddings
qdrant.create_collection(
    collection_name="knowledge_base",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# Generate an embedding and store a document
def store_document(doc_id: int, text: str, metadata: dict):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small", input=text
    )
    vector = response.data[0].embedding

    qdrant.upsert(
        collection_name="knowledge_base",
        points=[PointStruct(id=doc_id, vector=vector, payload={"text": text, **metadata})],
    )

# Search for similar documents
def search_similar(query: str, top_k: int = 5):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small", input=query
    )
    query_vector = response.data[0].embedding

    results = qdrant.search(
        collection_name="knowledge_base",
        query_vector=query_vector,
        limit=top_k,
    )
    return [{"score": r.score, "text": r.payload["text"]} for r in results]

# Usage
store_document(1, "Kubernetes uses pods as the smallest deployable unit.", {"topic": "devops"})
store_document(2, "Docker containers package applications with their dependencies.", {"topic": "devops"})
store_document(3, "SQL indexes speed up query performance on large tables.", {"topic": "databases"})

results = search_similar("How do I deploy containers in a cluster?")
for r in results:
    print(f"Score: {r['score']:.3f} — {r['text']}")
```

## When to use

- When building semantic search that understands meaning rather than just keyword matching
- When implementing RAG to provide relevant context to an LLM from a private knowledge base
- When building recommendation systems that find similar items (products, articles, music) based on learned representations
- When performing anomaly detection by finding data points that are far from their nearest neighbors in vector space

## When to avoid

- When exact-match queries or traditional SQL filtering are sufficient for the use case
- When the dataset is small enough (a few thousand items) that brute-force similarity search is fast enough without a specialized database
- When the data does not have a meaningful vector representation — not everything benefits from embeddings
- When you need strong ACID transactions across vector and relational data; most vector databases prioritize search performance over transactional guarantees

## Trade-offs

- **Search speed vs. accuracy**: Approximate nearest neighbor (ANN) algorithms trade some accuracy for dramatic speed improvements, and tuning this tradeoff requires understanding the indexing parameters.
- **Flexibility vs. operational complexity**: Adding a vector database to your stack introduces another service to deploy, monitor, back up, and maintain.
- **Semantic power vs. embedding quality**: The usefulness of a vector database is entirely dependent on the quality of the embeddings; poor embeddings produce meaningless search results regardless of how good the database is.

## Common small mistakes

- Using the wrong distance metric (cosine vs. Euclidean vs. dot product) for the embedding model, which produces incorrect similarity rankings
- Not normalizing vectors when using dot product distance, leading to results biased toward longer vectors
- Storing raw text in the vector database without metadata filtering, making it impossible to scope searches to specific categories or time ranges
- Choosing embedding dimensions that are too small (losing information) or too large (wasting storage and slowing search) for the use case
- Forgetting to rebuild or update indexes after bulk data insertions, causing degraded search performance
