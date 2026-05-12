---
title: MLOps — from research to production
date: 2024-11-28
author: Daya SYLLA
category: Machine Learning
tags: [MLOps, DevOps, CI/CD, Model Deployment, Monitoring]
---

# MLOps — from research to production

Machine Learning Operations (MLOps) is about shipping and maintaining ML models in production. Here is how to build a solid MLOps pipeline.

## The MLOps challenge

### Common issues

- **Models that work in dev but fail in prod**
- **Data drift**
- **Lack of reproducibility**
- **Manual, risky deployments**

### Solution: automation

MLOps applies DevOps ideas to ML so the full lifecycle can be automated.

## End-to-end MLOps pipeline

### 1. Development

```python
# Version code
git init
git add .
git commit -m "Initial ML model"

# Experiment with MLflow
import mlflow
mlflow.start_run()
mlflow.log_param("learning_rate", 0.01)
mlflow.log_metric("accuracy", 0.95)
mlflow.log_model(model, "model")
```

### 2. Automated tests

```python
# Unit tests
def test_model_prediction():
    model = load_model()
    prediction = model.predict([[1, 2, 3]])
    assert prediction is not None

# Performance tests
def test_model_performance():
    model = load_model()
    accuracy = evaluate(model, test_data)
    assert accuracy > 0.9
```

### 3. CI/CD pipeline

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline
on: [push]
jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        run: python train.py
      - name: Test model
        run: pytest tests/
      - name: Deploy if tests pass
        run: ./deploy.sh
```

### 4. Deployment

**Options:**

- **Batch**: Cloud Functions, Cloud Run
- **Real-time**: Vertex AI Endpoints, SageMaker
- **Edge**: TensorFlow Lite, ONNX Runtime

### 5. Monitoring

**Watch:**

- **Performance**: latency, throughput
- **Quality**: accuracy, F1
- **Data drift**: feature distributions
- **Model drift**: prediction quality over time

```python
# Example with Evidently
from evidently import dashboard
from evidently.dashboard import Dashboard

dashboard = Dashboard(tabs=[DataDriftTab()])
dashboard.calculate(reference_data, current_data)
dashboard.save("report.html")
```

## MLOps tooling

### Orchestration

- **Kubeflow**: Kubernetes-native
- **MLflow**: tracking and registry
- **Weights & Biases**: experimentation

### Deployment

- **Vertex AI**: Google Cloud
- **SageMaker**: AWS
- **Azure ML**: Microsoft

### Monitoring

- **Evidently AI**: data drift
- **Prometheus**: metrics
- **Grafana**: dashboards

## Best practices

1. **Version** code, data, and models
2. **Test** unit, integration, and performance
3. **Automate** with CI/CD
4. **Monitor** metrics continuously
5. **Document** models and processes

## Conclusion

MLOps is key to reliable ML in production. Automate your pipeline to reduce risk and improve quality.
