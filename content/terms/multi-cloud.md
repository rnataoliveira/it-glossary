---
title: "Multi-Cloud"
letter: "M"
categories:
  - "cloud"
  - "devops"
shortDefinition: "A strategy that uses cloud services from two or more providers to avoid vendor lock-in, improve resilience, or leverage best-of-breed capabilities."
---

## Why does it exist?

Relying on a single cloud provider creates concentration risk: an extended outage can take down your entire platform, pricing changes can blow your budget, and proprietary APIs can trap your data and workloads. Multi-cloud emerged as a strategy to distribute workloads across providers like AWS, Azure, and Google Cloud so that organizations maintain negotiation leverage, meet data residency requirements across geographies, and pick the best service from each provider for a given use case.

Beyond risk mitigation, multi-cloud enables organizations to use specialized capabilities — for example, Google Cloud's BigQuery for analytics alongside AWS's Lambda for event processing — without being forced to choose one provider's entire ecosystem.

## Practical example of use

A financial services company runs its primary transaction processing on AWS for its mature ecosystem and global reach. At the same time, it uses Azure for its enterprise integration with Active Directory and Microsoft 365, and it runs its machine learning workloads on Google Cloud for access to TPUs and Vertex AI. Terraform modules abstract the infrastructure provisioning for each cloud, and a central platform team maintains standardized Kubernetes clusters across all three providers using a GitOps workflow. The networking team peers VPCs across clouds using dedicated interconnects for low-latency cross-cloud communication.

## When to use

- When regulatory or compliance requirements mandate data residency in regions only available from specific providers
- When you want to avoid single-provider lock-in to maintain pricing leverage and negotiation power
- When different providers offer best-in-class services for different parts of your architecture
- When business continuity requires surviving a full provider outage without downtime

## When to avoid

- When the added complexity of managing multiple providers outweighs the benefits for your organization's size and risk profile
- When your team is small and already struggles to master one cloud platform's services and billing model
- When workloads are tightly coupled to provider-specific services (e.g., DynamoDB, Cosmos DB) making portability impractical
- When the latency and cost of cross-cloud data transfer would degrade performance or exceed budget

## Trade-offs

- **Resilience vs. operational complexity**: Spreading across providers reduces blast radius but multiplies the number of dashboards, IAM systems, networking models, and billing structures your team must manage.
- **Vendor leverage vs. lowest common denominator**: Avoiding lock-in sometimes means using only generic, portable services (containers, Postgres) and forgoing powerful managed services that could accelerate development.
- **Best-of-breed services vs. data gravity**: Using specialized services across clouds means data often needs to move between them, introducing latency, egress costs, and consistency challenges.

## Common small mistakes

- Calling it "multi-cloud" when you are really just using one cloud for production and another for a few SaaS tools — that is not the same strategic commitment
- Underestimating cross-cloud networking costs, especially data egress fees that can dwarf compute costs
- Failing to standardize observability and logging across providers, creating blind spots when debugging cross-cloud issues
- Trying to abstract away all provider differences behind a universal layer, resulting in a system that uses none of the providers well
- Not investing in a dedicated platform engineering team to manage the additional complexity
