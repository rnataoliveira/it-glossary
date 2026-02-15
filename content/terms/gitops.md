---
title: "GitOps"
letter: "G"
categories:
  - "devops"
shortDefinition: "An operational framework that uses Git repositories as the single source of truth for declarative infrastructure and application configuration, with automated agents ensuring the live system matches the desired state."
---

## Why does it exist?

Infrastructure and application deployments have historically relied on imperative scripts, manual kubectl commands, or CI/CD pipelines that push changes directly to production. These approaches work, but they make it difficult to audit what changed, when, and why. Rollbacks require remembering the previous state or re-running a pipeline with different parameters. Drift between the declared configuration and the actual system state goes undetected until something breaks.

GitOps flips the model by making a Git repository the single source of truth for the desired state of infrastructure and applications. An automated agent (such as Argo CD or Flux) continuously watches the repository and compares it to the live cluster. When it detects a difference, whether from a new commit or from someone manually changing the cluster, it reconciles the live state to match the repository. This provides a full audit trail via Git history, enables rollbacks through git revert, and enforces the principle that no change should happen outside the reviewed, version-controlled workflow.

## Practical example of use

A platform team manages Kubernetes deployments for multiple services. All Kubernetes manifests live in a dedicated Git repository organized by environment. When a developer merges a pull request that updates the container image tag for a service, Argo CD detects the change and automatically applies the updated manifests to the production cluster. If the deployment causes issues, reverting the Git commit immediately rolls back the cluster to the previous state.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/k8s-manifests.git
    targetRevision: main
    path: envs/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

This Argo CD Application resource points to a Git repository containing Kubernetes manifests for the production environment. The `automated` sync policy ensures that any commit to the main branch is applied to the cluster automatically, `prune` removes resources that are no longer in Git, and `selfHeal` reverts any manual changes made directly to the cluster.

## When to use

- Your infrastructure is declarative and managed through Kubernetes manifests, Terraform configurations, or similar declarative tools that can be stored in Git.
- You want a complete audit trail of every infrastructure and deployment change with the ability to rollback by reverting a commit.
- Multiple teams contribute to infrastructure and you need pull request reviews, approvals, and automated checks before changes reach production.
- You want to detect and automatically correct configuration drift where the live system diverges from the declared state.

## When to avoid

- Your infrastructure is primarily imperative or procedural (bash scripts, ad-hoc CLI commands) and cannot be expressed declaratively in files that Git can track meaningfully.
- The team is very small and deployments are infrequent; the overhead of maintaining a GitOps agent, repository structure, and sync policies may not be justified.
- Secrets management is not yet solved; storing unencrypted secrets in Git is a security risk, and GitOps requires tooling like Sealed Secrets or External Secrets Operator to handle credentials safely.
- The deployment target does not support declarative reconciliation (e.g., legacy on-premises servers without a configuration management layer).

## Trade-offs

- **Auditability vs. workflow overhead**: Every change goes through a Git commit and often a pull request review, providing excellent traceability, but this process can slow down urgent changes compared to a direct kubectl apply.
- **Drift correction vs. intentional manual changes**: Self-healing agents revert any manual cluster modifications, which prevents drift but can be frustrating during debugging when an engineer temporarily changes a resource and the agent immediately reverts it.
- **Repository as source of truth vs. repository sprawl**: Keeping all manifests in Git is clean in principle, but large organizations can end up with complex repository structures, branch strategies, and promotion workflows that require their own tooling and conventions.

## Common small mistakes

- Storing plain-text secrets in the Git repository, defeating the security benefits of GitOps and exposing credentials in version history even after deletion.
- Using a single repository and branch for all environments (dev, staging, production) without a clear promotion strategy, making it unclear which state corresponds to which environment.
- Disabling self-heal and prune in production out of caution but then never enabling them, leaving the cluster to drift from the declared state without reconciliation.
- Not setting up notifications for sync failures, so the team does not notice when a deployment fails to apply and the cluster is stuck on an old version.
- Mixing application code and infrastructure manifests in the same repository, causing unnecessary CI/CD triggers and making it harder to manage access controls.
