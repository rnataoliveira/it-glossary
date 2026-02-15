---
title: "Containerization"
letter: "C"
categories:
  - "explain-architecture"
  - "improve-maintainability"
  - "improve-developer-experience"
shortDefinition: "Packaging an application with its dependencies into an isolated, portable unit that runs consistently across environments."
---

## Why does it exist?

Applications often break when moved between environments because of differences in operating systems, installed libraries, or configuration. Containerization solves this by bundling the application code, runtime, libraries, and settings into a single artifact that behaves identically everywhere. It also provides lightweight isolation without the overhead of full virtual machines, making it practical to run many services on a single host.

## Practical example of use

A team builds a Python API that depends on Python 3.11, specific pip packages, and a C library for image processing. They write a Dockerfile that starts from a slim Python base image, installs the system-level library, copies the requirements file to install pip packages, and then copies the application code. Running `docker build -t api:1.0 .` produces an image that any developer can start with `docker run -p 8000:8000 api:1.0`, regardless of whether they use macOS, Linux, or Windows. The same image is pushed to a container registry and deployed to staging and production with no modifications.

## When to use

- When you need consistent behavior across development, CI, staging, and production
- When running multiple services on the same host that require different runtimes or library versions
- When your deployment pipeline benefits from immutable, versioned artifacts
- When onboarding new developers should be as simple as `docker compose up`

## When to avoid

- For simple scripts or CLI tools that have no dependency conflicts
- When the application requires direct access to host hardware (GPU, serial ports) and the container runtime adds unacceptable friction
- When the team has no experience with containers and the project deadline does not allow for the learning curve

## Trade-offs

- **Portability vs. image size**: Containers run anywhere, but poorly optimized images can reach gigabytes and slow down CI pipelines and deployments.
- **Isolation vs. performance**: Process-level isolation is lighter than VMs, but filesystem layering and network bridging introduce small overhead compared to bare-metal execution.
- **Reproducibility vs. operational complexity**: Immutable images eliminate "works on my machine" problems, but require learning image building, registry management, and container networking.

## Common small mistakes

- Using a full OS base image (e.g., `ubuntu:latest`) instead of a minimal one (e.g., `python:3.11-slim`), inflating image size unnecessarily
- Not leveraging Docker layer caching by copying dependency files before application code
- Running the container process as root, creating a security risk in production
- Storing secrets or credentials inside the image instead of injecting them at runtime through environment variables or secret managers
