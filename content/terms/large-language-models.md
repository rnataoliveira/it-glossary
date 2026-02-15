---
title: "Large Language Models (LLMs)"
letter: "L"
categories:
  - "ai-ml"
  - "architecture"
shortDefinition: "Neural networks trained on massive text datasets that can understand, generate, and reason about natural language."
---

## Why does it exist?

Before LLMs, interacting with computers required structured inputs — SQL queries, API calls, command-line arguments. Natural language was too ambiguous and varied for machines to process reliably. LLMs changed this by learning statistical patterns across billions of text documents, enabling them to understand context, follow instructions, generate coherent text, translate languages, summarize documents, and even write code. They represent a fundamental shift in how humans can interact with software.

LLMs exist because the transformer architecture, combined with massive scale (billions of parameters trained on terabytes of text), unlocked emergent capabilities that smaller models could not achieve. Tasks that once required specialized NLP pipelines — sentiment analysis, named entity recognition, text classification — can now be handled by a single general-purpose model through natural language prompts.

## Practical example of use

A developer integrates an LLM into their application to automatically categorize customer support tickets and draft initial responses.

```python
from openai import OpenAI

client = OpenAI()

def categorize_and_respond(ticket_text: str) -> dict:
    """Categorize a support ticket and generate an initial response."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a customer support assistant. Given a support ticket, "
                    "return a JSON object with two fields: "
                    "'category' (one of: billing, technical, account, feature-request) "
                    "and 'draft_response' (a helpful, empathetic reply to the customer)."
                ),
            },
            {"role": "user", "content": ticket_text},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    import json
    return json.loads(response.choices[0].message.content)

# Example usage
ticket = "I was charged twice for my subscription this month. Please fix this."
result = categorize_and_respond(ticket)
print(f"Category: {result['category']}")
print(f"Draft: {result['draft_response']}")
```

## When to use

- When building features that require natural language understanding — search, summarization, classification, translation, or conversational interfaces
- When the task benefits from general knowledge and reasoning that would be impractical to encode manually
- When you need to process unstructured text data at scale (customer feedback, documents, emails)
- When building developer tools that assist with code generation, review, documentation, or debugging

## When to avoid

- For deterministic tasks that require exact, reproducible outputs — LLMs are probabilistic and can produce different answers for the same input
- When the task requires real-time, safety-critical decisions where a hallucinated answer could cause harm
- When cost is a primary concern and the task can be solved with simpler methods like keyword matching or regex
- When data privacy requirements prohibit sending sensitive information to external API providers

## Trade-offs

- **Capability vs. cost**: LLMs handle remarkably diverse tasks, but API calls are expensive compared to traditional algorithms, especially at scale.
- **Flexibility vs. reliability**: LLMs can handle ambiguous inputs that rigid systems cannot, but they may hallucinate facts, ignore instructions, or produce inconsistent outputs.
- **Development speed vs. control**: Integrating an LLM lets you ship features quickly with simple prompts, but you have less control over behavior compared to hand-coded logic, and debugging incorrect outputs is harder.

## Common small mistakes

- Trusting LLM outputs without validation, especially for factual claims or numerical calculations where hallucination is common
- Sending unnecessary context in every request, inflating token usage and cost without improving results
- Not implementing rate limiting, retries, and fallback behavior for LLM API calls, which can fail or be slow
- Using maximum temperature for tasks that require consistency, or zero temperature for tasks that benefit from creativity
- Ignoring prompt injection risks where user input can manipulate the model's behavior in unintended ways
