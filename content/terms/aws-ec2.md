---
title: "AWS EC2"
letter: "A"
categories:
  - "cloud"
  - "devops"
shortDefinition: "Amazon Elastic Compute Cloud (EC2) is a service that provides resizable virtual servers in the cloud, giving you full control over the operating system and software stack."
---

## Why does it exist?

Before EC2, obtaining compute capacity meant purchasing physical servers, waiting weeks for delivery, and managing hardware in data centers. EC2 launched in 2006 as one of AWS's foundational services, letting developers provision virtual machines in minutes with pay-by-the-hour pricing. It gives you root-level access to a virtual server where you control the OS, installed software, networking, and storage — essentially a remote computer that you configure however you need.

EC2 remains the backbone of AWS infrastructure. Even higher-level services like ECS, EKS, and Lambda often run on EC2 instances under the hood. It is the IaaS foundation for workloads that need full control over the compute environment.

## Practical example of use

A mid-size company runs its Java-based backend on EC2. They use an Auto Scaling Group with a launch template that specifies an Amazon Linux 2 AMI, instance type (c6i.xlarge for compute-intensive workloads), security groups, and a user data script that installs the JDK and starts the application. An Application Load Balancer distributes traffic across instances in multiple availability zones. Spot instances handle background batch processing at a 70% discount, with the understanding that AWS may reclaim them with two minutes' notice.

## When to use

- When you need full control over the operating system, kernel settings, or installed software that managed services do not support
- For long-running, stateful workloads like databases, game servers, or legacy applications that cannot be containerized easily
- When you need specific hardware capabilities like GPU instances for ML training or high-memory instances for in-memory databases
- When you want to run your own orchestration layer (Kubernetes, Nomad) on infrastructure you fully control

## When to avoid

- For short-lived, event-driven workloads where Lambda or Fargate eliminates all server management
- When a managed service exists for your use case (RDS for databases, ElastiCache for caching) and you do not need OS-level access
- When your team is small and the operational burden of patching, monitoring, and scaling VMs diverts time from product development
- For static websites or simple APIs that can run on higher-level services at lower cost and complexity

## Trade-offs

- **Full control vs. operational overhead**: You can customize everything from the kernel to the network stack, but you are responsible for patching, security hardening, monitoring, and backup.
- **Pricing flexibility vs. commitment complexity**: EC2 offers On-Demand, Reserved Instances, Savings Plans, and Spot pricing. Optimizing cost requires understanding and managing a mix of these, which is non-trivial.
- **Availability vs. configuration responsibility**: EC2 instances run in a single AZ by default. High availability requires you to architect across multiple AZs with Auto Scaling Groups and load balancers.

## Common small mistakes

- Running a single instance without an Auto Scaling Group, creating a single point of failure with no automated recovery
- Not right-sizing instances — over-provisioning wastes money, while under-provisioning causes performance issues; use AWS Compute Optimizer
- Leaving default security groups open (0.0.0.0/0 on all ports) instead of restricting access to necessary ports and source IPs
- Storing application state on instance ephemeral storage, which is lost when the instance stops or terminates
- Forgetting to tag instances with cost allocation tags, making it impossible to track spend by team or project
