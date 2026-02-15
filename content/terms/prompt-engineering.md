---
title: "Prompt Engineering"
letter: "P"
categories:
  - "ai-ml"
shortDefinition: "The practice of designing and structuring inputs to LLMs to reliably produce accurate, relevant, and well-formatted outputs."
---

## Why does it exist?

LLMs are powerful but directionless — the same model can write poetry, debug code, or generate nonsense depending entirely on how you ask. A vague prompt produces vague results. A specific, well-structured prompt produces dramatically better outputs. Prompt engineering exists because the gap between what an LLM can do and what it actually does in practice is determined almost entirely by the quality of the input.

As LLMs became central to production applications (not just chatbots), the need for reliable, consistent outputs grew. Prompt engineering evolved from casual experimentation into a systematic discipline with established patterns: few-shot examples, chain-of-thought reasoning, role assignment, output format specification, and constraint definition. These techniques allow developers to steer model behavior without modifying the model itself.

## Practical example of use

A developer builds an API that extracts structured data from unstructured customer reviews. A well-engineered prompt ensures consistent, parseable output.

```python
from openai import OpenAI
import json

client = OpenAI()

def analyze_review(review_text: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": """You are a review analysis assistant. Extract structured data from customer reviews.

Rules:
- sentiment must be one of: positive, negative, mixed
- rating_estimate is your best guess of a 1-5 star rating based on the text
- topics is a list of discussed aspects (e.g., "battery life", "customer service")
- key_quote is the single most representative sentence from the review

Always respond with valid JSON matching this schema:
{
  "sentiment": "positive | negative | mixed",
  "rating_estimate": 1-5,
  "topics": ["topic1", "topic2"],
  "key_quote": "exact quote from the review",
  "actionable_feedback": "one-sentence summary of what the company should do"
}""",
            },
            {
                "role": "user",
                "content": f"Analyze this review:\n\n{review_text}",
            },
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)

# Example
review = (
    "The laptop is blazing fast and the screen is gorgeous, but the battery "
    "barely lasts 3 hours. For this price, I expected at least 8 hours. "
    "Customer support was helpful when I asked about a replacement."
)
result = analyze_review(review)
print(json.dumps(result, indent=2))
```

## When to use

- When building LLM-powered features that require consistent, structured, and predictable outputs
- When the task can be improved by providing the model with clear instructions, examples, or constraints without needing fine-tuning
- When iterating on model behavior rapidly — prompt changes deploy instantly, unlike model training
- When working with models you cannot fine-tune (closed APIs) and the prompt is your only lever for controlling behavior

## When to avoid

- When the task is simple enough that a regex, template, or rule-based approach would be more reliable and cheaper
- When the performance gap requires model-level changes (fine-tuning or a different model architecture) that prompting alone cannot close
- When the prompt becomes so long and complex that it consumes most of the context window, leaving little room for the actual input
- When deterministic, reproducible outputs are required — even the best prompt cannot guarantee identical outputs across calls

## Trade-offs

- **Flexibility vs. reliability**: Prompts can be changed instantly without retraining, but natural language instructions are inherently ambiguous and the model may interpret them inconsistently.
- **Simplicity vs. token cost**: Adding few-shot examples, detailed instructions, and output schemas to the prompt improves quality but increases token consumption and cost per request.
- **Generality vs. precision**: A general-purpose prompt handles varied inputs but produces less precise results than a narrow prompt optimized for a specific input type.

## Common small mistakes

- Writing prompts that are ambiguous about the desired output format, leading to outputs that are difficult to parse programmatically
- Not testing prompts against a diverse set of edge cases — a prompt that works for typical inputs may fail on empty, very long, or adversarial inputs
- Using overly complex prompts when the model can handle the task with simpler instructions, wasting tokens and increasing latency
- Ignoring the system message and putting all instructions in the user message, which reduces the model's ability to maintain consistent behavior across turns
- Hardcoding prompts without version control, making it impossible to track which prompt version produced which results in production
