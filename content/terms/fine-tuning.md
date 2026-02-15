---
title: "Fine-Tuning"
letter: "F"
categories:
  - "ai-ml"
shortDefinition: "The process of further training a pre-trained model on a smaller, task-specific dataset to specialize its behavior for a particular use case."
---

## Why does it exist?

Pre-trained models like LLMs are generalists — they know a lot about many topics but are not optimized for any specific one. Prompt engineering can guide their behavior, but some tasks require a level of specialization that prompting alone cannot achieve: matching a specific writing style, learning domain-specific terminology, consistently following a complex output format, or achieving higher accuracy on a narrow task. Fine-tuning bridges this gap by continuing the model's training on curated examples that teach it exactly how to behave for your use case.

Fine-tuning is more efficient than training a model from scratch because the pre-trained model already understands language structure, grammar, and general knowledge. You are adding a thin layer of specialization on top of a deep foundation, which requires far less data and compute than starting from zero.

## Practical example of use

A company fine-tunes a model to classify internal support tickets into specific categories that are unique to their product and not well-handled by a general-purpose model with prompting alone.

```python
# Step 1: Prepare training data in JSONL format
# training_data.jsonl
# Each line is a conversation with the desired classification behavior
"""
{"messages": [{"role": "system", "content": "Classify the support ticket into exactly one category: billing-error, feature-request, bug-report, account-access, integration-help."}, {"role": "user", "content": "I can't connect my Slack workspace to your app. It keeps timing out."}, {"role": "assistant", "content": "integration-help"}]}
{"messages": [{"role": "system", "content": "Classify the support ticket into exactly one category: billing-error, feature-request, bug-report, account-access, integration-help."}, {"role": "user", "content": "I was charged $49 but my plan is the $29 tier."}, {"role": "assistant", "content": "billing-error"}]}
"""

# Step 2: Upload training data and create fine-tuning job
from openai import OpenAI

client = OpenAI()

# Upload the training file
training_file = client.files.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune",
)

# Start fine-tuning
job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model="gpt-4o-mini-2024-07-18",
    hyperparameters={
        "n_epochs": 3,
        "batch_size": 4,
        "learning_rate_multiplier": 1.8,
    },
)

print(f"Fine-tuning job created: {job.id}")

# Step 3: Monitor the job
status = client.fine_tuning.jobs.retrieve(job.id)
print(f"Status: {status.status}")
print(f"Fine-tuned model: {status.fine_tuned_model}")

# Step 4: Use the fine-tuned model
response = client.chat.completions.create(
    model=status.fine_tuned_model,  # e.g., "ft:gpt-4o-mini-2024-07-18:org::abc123"
    messages=[
        {"role": "system", "content": "Classify the support ticket into exactly one category: billing-error, feature-request, bug-report, account-access, integration-help."},
        {"role": "user", "content": "The dashboard crashes when I filter by date range."},
    ],
)
print(response.choices[0].message.content)  # "bug-report"
```

## When to use

- When prompt engineering produces inconsistent results and the task requires highly reliable, specific outputs
- When you need to match a particular style, tone, or format that general models handle poorly with prompting alone
- When you have hundreds or thousands of high-quality labeled examples for a well-defined task
- When reducing inference cost matters — a fine-tuned smaller model can often match or exceed a larger model prompted with many examples

## When to avoid

- When prompt engineering or few-shot examples already produce satisfactory results — fine-tuning adds unnecessary cost and complexity
- When you lack sufficient high-quality training data (typically at least 50-100 examples, ideally hundreds)
- When the task or domain changes frequently — every change requires re-training, which is slower than updating a prompt
- When the model provider does not support fine-tuning for the specific model you need

## Trade-offs

- **Specialization vs. generality**: Fine-tuning improves performance on the target task but can reduce the model's ability to handle other tasks it was previously good at (catastrophic forgetting).
- **Quality vs. data effort**: The results are only as good as the training data. Curating, cleaning, and labeling a high-quality dataset is time-consuming and requires domain expertise.
- **Per-request cost savings vs. upfront investment**: Fine-tuned smaller models can reduce per-request token costs, but the training process itself costs money, time, and engineering effort.

## Common small mistakes

- Training on too few examples or low-quality data, producing a model that memorizes the training set without learning to generalize
- Not evaluating the fine-tuned model against a held-out test set, leading to overconfidence in its performance
- Forgetting to include the system message in training examples, causing the fine-tuned model to ignore system instructions at inference time
- Fine-tuning when RAG would be more appropriate — if the model needs access to specific facts (not behavioral patterns), retrieval is usually the better approach
- Not versioning training data alongside the model, making it impossible to reproduce or debug model behavior later
