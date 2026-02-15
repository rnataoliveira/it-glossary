---
title: "Machine Learning"
letter: "M"
categories:
  - "ai-ml"
shortDefinition: "A branch of artificial intelligence where systems learn patterns from data to make predictions or decisions without being explicitly programmed for each case."
---

## Why does it exist?

Some problems cannot be solved by writing explicit rules. Detecting spam, recognizing faces, recommending products, translating languages — these tasks involve patterns so complex and numerous that hand-coding rules for every case is impractical or impossible. Machine learning exists to let systems discover these patterns automatically by learning from examples. Instead of telling a program "if the email contains these words, it is spam," you show it thousands of labeled emails and let it figure out the distinguishing patterns itself.

This approach scales where traditional programming cannot. As more data becomes available, ML models improve — whereas rule-based systems require manual updates for every new pattern. This makes ML particularly valuable in domains where the rules are fuzzy, constantly evolving, or too numerous to enumerate.

## Practical example of use

A company wants to predict whether a customer will cancel their subscription based on usage patterns. Using scikit-learn, they train a classification model on historical data.

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load customer data with features and churn labels
data = pd.read_csv('customer_data.csv')
features = ['monthly_usage_hours', 'support_tickets', 'months_subscribed', 'plan_tier']
X = data[features]
y = data['churned']  # 1 = cancelled, 0 = still active

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a random forest classifier
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate on the test set
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))

# Predict churn probability for a specific customer
new_customer = [[15.5, 3, 8, 2]]  # usage, tickets, months, tier
churn_probability = model.predict_proba(new_customer)[0][1]
print(f"Churn probability: {churn_probability:.2%}")
```

## When to use

- When the problem involves recognizing patterns in data that are too complex for hand-written rules (classification, regression, clustering)
- When you have a sufficient volume of quality labeled data to train a model that generalizes beyond the training examples
- When the decision boundary is fuzzy and a probabilistic answer ("75% likely to churn") is more useful than a binary rule
- When you need the system to improve over time as more data becomes available without rewriting logic

## When to avoid

- When the problem can be solved with straightforward business rules or SQL queries — ML adds unnecessary complexity
- When you lack sufficient quality data to train a reliable model, which leads to overfitting or meaningless predictions
- When the cost of a wrong prediction is extremely high and the model cannot be validated thoroughly (e.g., life-safety decisions without human oversight)
- When explainability is a strict regulatory requirement and the chosen model is a black box that cannot justify its decisions

## Trade-offs

- **Accuracy vs. interpretability**: Complex models (deep learning, ensemble methods) often achieve higher accuracy but are harder to explain than simpler models (linear regression, decision trees).
- **Automation vs. data dependency**: ML automates pattern recognition but requires clean, representative, and sufficiently large datasets — garbage in, garbage out.
- **Adaptability vs. operational overhead**: ML models need ongoing monitoring, retraining, and data pipeline maintenance, creating operational complexity that traditional code does not have.

## Common small mistakes

- Training and evaluating on the same data, producing misleadingly high accuracy that does not reflect real-world performance
- Ignoring class imbalance — if 95% of customers do not churn, a model that always predicts "no churn" gets 95% accuracy but is useless
- Treating feature engineering as an afterthought when it often has more impact on model performance than the choice of algorithm
- Deploying a model without monitoring for data drift, where the real-world data distribution changes over time and the model's accuracy degrades silently
- Confusing correlation with causation — a model may find patterns that are statistically useful for prediction but do not represent causal relationships
