---
title: "MLOps"
letter: "M"
categories:
  - "ai-ml"
  - "devops"
shortDefinition: "The set of practices that combines machine learning, DevOps, and data engineering to deploy, monitor, and maintain ML models reliably in production."
---

## Why does it exist?

Training a machine learning model in a Jupyter notebook is one thing. Running it reliably in production, at scale, with monitoring, versioning, retraining pipelines, and rollback capability is a fundamentally different challenge. Most ML projects that succeed in research fail in production — not because the model is bad, but because the engineering infrastructure around it is missing. MLOps exists to bridge this gap.

Just as DevOps transformed software delivery from "throw it over the wall to ops" into a disciplined practice with CI/CD, infrastructure as code, and monitoring, MLOps applies the same principles to the ML lifecycle. It addresses questions that traditional DevOps does not: How do you version datasets? How do you detect when a model's predictions degrade because the input data has drifted? How do you automatically retrain and redeploy a model when performance drops?

## Practical example of use

A team defines an ML pipeline that trains a model, evaluates it against a baseline, and deploys it automatically if it passes quality gates. Here is a pipeline definition using a configuration-driven approach.

```yaml
# ml-pipeline.yaml — MLOps pipeline definition
name: churn-prediction-pipeline
schedule: "0 2 * * 1" # Retrain weekly at 2 AM Monday

stages:
  data-validation:
    image: python:3.11
    script:
      - python validate_data.py --source s3://data-lake/customers/latest/
      - python check_schema.py --expected schemas/customer_v3.json
    artifacts:
      - validation_report.json

  training:
    image: pytorch/pytorch:2.1.0
    depends_on: [data-validation]
    script:
      - python train.py
        --data s3://data-lake/customers/latest/
        --model-output s3://model-registry/churn/candidate/
        --experiment-tracking mlflow://experiments/churn
    resources:
      gpu: 1
      memory: 16Gi

  evaluation:
    image: python:3.11
    depends_on: [training]
    script:
      - python evaluate.py
        --candidate s3://model-registry/churn/candidate/
        --baseline s3://model-registry/churn/production/
        --test-data s3://data-lake/customers/test/
        --min-accuracy 0.85
        --max-accuracy-drop 0.02
    artifacts:
      - evaluation_report.json
      - confusion_matrix.png

  deployment:
    image: python:3.11
    depends_on: [evaluation]
    when: evaluation.exit_code == 0  # Only deploy if evaluation passes
    script:
      - python deploy.py
        --model s3://model-registry/churn/candidate/
        --endpoint churn-prediction-api
        --strategy canary
        --canary-percentage 10
        --promotion-metric prediction_accuracy
        --promotion-threshold 0.84

  monitoring:
    image: python:3.11
    depends_on: [deployment]
    script:
      - python setup_monitoring.py
        --endpoint churn-prediction-api
        --alerts data-drift,prediction-drift,latency,error-rate
        --drift-threshold 0.15
        --latency-p99-threshold 200ms
```

## When to use

- When deploying ML models to production where reliability, reproducibility, and monitoring are requirements
- When multiple data scientists work on the same models and need version control for datasets, experiments, and model artifacts
- When models need periodic retraining as new data arrives, with automated evaluation and deployment gates
- When regulatory or compliance requirements demand auditability of model versions, training data, and prediction outcomes

## When to avoid

- For one-off analysis or research experiments where the output is a report, not a deployed service
- When the team is still in the exploratory phase and has not yet identified a model worth productionizing
- When the system uses simple rule-based logic that does not involve trained models and does not benefit from ML infrastructure
- When the organization is small and deploys a single static model infrequently — the overhead of full MLOps may not be justified yet

## Trade-offs

- **Reliability vs. infrastructure complexity**: MLOps introduces numerous components (feature stores, model registries, experiment trackers, monitoring dashboards) that require setup and maintenance.
- **Reproducibility vs. speed**: Strictly versioning every dataset, parameter, and environment ensures reproducibility but slows down rapid experimentation.
- **Automation vs. oversight**: Fully automated retraining and deployment pipelines reduce toil but require careful quality gates to prevent deploying degraded models without human review.

## Common small mistakes

- Versioning models but not the datasets and preprocessing code used to produce them, making it impossible to reproduce results
- Deploying models without monitoring for data drift, so a model trained on last year's distribution silently degrades as user behavior changes
- Treating the ML pipeline as a one-time setup rather than a living system that needs maintenance as data sources, schemas, and business requirements evolve
- Not implementing a rollback mechanism, leaving no way to quickly revert to a previous model version when the new one underperforms
- Ignoring the gap between training and serving environments — a model trained in Python 3.11 with specific library versions may behave differently in a serving container with different versions
