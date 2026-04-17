---
title: "Exploring Data Science with Toy Projects"
subtitle: "A deep dive into personal experiments with machine learning and statistics"
date: 2026-02-18
category: Projects
abstract: "In this post, I explore a collection of toy projects aimed at learning new techniques in statistics and AI. I share my process, the challenges faced, and the potential real-world applications these simple projects can lead to."
comments: true
---

There's something deeply satisfying about building something small that *works* — a tiny model that predicts, a script that surfaces a pattern you didn't expect. That's the spirit behind these toy projects.

## Why Toy Projects?

Large-scale systems are intimidating. Toy projects strip away the noise and let you focus on a single concept:

- **Isolation** — You test one idea at a time.
- **Speed** — From idea to working code in an afternoon.
- **Curiosity** — No stakeholders, no deadlines — just learning.

## Project 1: Bayesian A/B Testing Simulator

I built a small Python simulator that compares two conversion rates using a Beta-Binomial model. The main insight: you can reach *practical* significance much faster than classical frequentist tests suggest.

```python
import numpy as np
from scipy import stats

def bayesian_ab(alpha_a, beta_a, alpha_b, beta_b, samples=50000):
    """Return P(B > A) using Monte Carlo sampling."""
    samples_a = np.random.beta(alpha_a, beta_a, samples)
    samples_b = np.random.beta(alpha_b, beta_b, samples)
    return (samples_b > samples_a).mean()

# After observing 120/1000 vs 145/1000 conversions
prob = bayesian_ab(120 + 1, 880 + 1, 145 + 1, 855 + 1)
print(f"P(B > A) = {prob:.3f}")
```

### Key Takeaways

1. The Bayesian approach naturally handles small sample sizes.
2. Posterior distributions give you a *range* of plausible values, not just a point estimate.
3. Communicating results as probabilities ("there's a 94 % chance B is better") is more intuitive for stakeholders.

## Project 2: K-Means from Scratch

Implementing K-Means without `sklearn` forced me to understand the convergence criterion at a deeper level. The most surprising lesson: **initialisation matters more than iteration count**.

### What I Learned

- Random restarts are cheap insurance against poor local optima.
- The elbow method is useful but subjective — silhouette scores provide a more principled alternative.
- Visualising cluster assignments at each iteration builds strong geometric intuition.

## What's Next?

I'm planning to explore:

- **Dimensionality reduction** — PCA and t-SNE on real-world text embeddings.
- **Anomaly detection** — Isolation forests applied to network traffic logs.
- **Causal inference** — Difference-in-differences on public policy datasets.

---

*What other applications of AI and statistics do you think can impact security? I'd love to hear your thoughts in the comments below.*
