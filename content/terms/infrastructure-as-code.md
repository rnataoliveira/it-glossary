---
title: "Infrastructure as Code"
letter: "I"
categories:
  - "devops"
  - "cloud"
shortDefinition: "Managing and provisioning infrastructure through machine-readable configuration files instead of manual processes."
---

## Why does it exist?

Manually configuring servers, networks, and cloud resources through web consoles is slow, error-prone, and impossible to reproduce reliably. Infrastructure as Code (IaC) treats infrastructure the same way as application code: it is versioned, reviewed, tested, and applied automatically. This makes environments reproducible, auditable, and recoverable, eliminating configuration drift between staging and production.

## Practical example of use

A platform team uses Terraform to define their AWS infrastructure. A `main.tf` file declares a VPC, subnets, an RDS PostgreSQL instance, an ECS cluster, and an Application Load Balancer. When a new developer joins and needs a personal staging environment, they run `terraform workspace new dev-maria` and `terraform apply`. In under 10 minutes, an identical copy of the production infrastructure is running. When a security audit asks what changed last quarter, the team points to the Git history of the Terraform repository.

```hcl
resource "aws_db_instance" "postgres" {
  identifier        = "app-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.medium"
  allocated_storage = 50
  db_name           = "appdb"
  username          = var.db_username
  password          = var.db_password

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  skip_final_snapshot     = false
}
```

## When to use

- When managing cloud infrastructure that needs to be consistent across multiple environments (dev, staging, production)
- When infrastructure changes should go through code review and approval workflows
- When disaster recovery requires the ability to recreate environments quickly and reliably
- When compliance or auditing demands a clear history of every infrastructure change

## When to avoid

- For one-off experiments or throwaway prototypes where the overhead of writing configuration files slows down exploration
- When the infrastructure is trivial (a single VM or a static site on a CDN) and manual setup takes less time than learning an IaC tool
- When the team has no version control discipline and would end up with unreviewed, untested configuration files

## Trade-offs

- **Reproducibility vs. learning curve**: Environments can be created and destroyed reliably, but tools like Terraform, Pulumi, or CloudFormation each have their own DSL, state management, and debugging quirks.
- **Auditability vs. speed**: Every change is tracked in Git, but a quick fix that takes 30 seconds in a console now requires a commit, review, and pipeline run.
- **Consistency vs. state management complexity**: Declarative configuration prevents drift, but managing Terraform state files (locking, remote backends, import of existing resources) introduces its own category of problems.

## Common small mistakes

- Storing state files locally instead of in a remote backend with locking, risking corruption when multiple people apply changes simultaneously
- Hardcoding environment-specific values (account IDs, region names) instead of using variables, making the code non-reusable
- Not modularizing configurations, resulting in a single massive file that is hard to understand and modify
- Applying changes directly in production without running `plan` first to review the exact diff of what will change
