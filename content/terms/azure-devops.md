---
title: "Azure DevOps"
letter: "A"
categories:
  - "cloud"
  - "devops"
shortDefinition: "A Microsoft cloud platform that provides a suite of development tools including version control, CI/CD pipelines, artifact management, project boards, and test plans."
---

## Why does it exist?

Software teams need more than just a place to store code. They need to plan work, review changes, run automated builds and tests, manage releases, and track artifacts, all in a coordinated workflow. Before integrated platforms, teams stitched together separate tools for each concern, leading to fragmented visibility and brittle integrations. Azure DevOps consolidates these capabilities into a single platform: Azure Repos for Git hosting, Azure Pipelines for CI/CD, Azure Boards for work tracking, Azure Artifacts for package management, and Azure Test Plans for manual and exploratory testing.

Because it is a Microsoft product, Azure DevOps integrates deeply with the Azure cloud, Visual Studio, and GitHub. However, it is not limited to Azure deployments; pipelines can deploy to AWS, GCP, on-premises servers, or any target reachable over the network. This makes it a practical choice for organizations already invested in the Microsoft ecosystem that want a single pane of glass for the entire software delivery lifecycle.

## Practical example of use

A team maintains a Node.js API hosted on Azure App Service. Every push to the main branch triggers a pipeline that installs dependencies, runs tests, builds the project, and can later be extended to deploy automatically. The pipeline is defined as YAML checked into the repository, so changes to the build process go through the same code review workflow as application code.

```yaml
trigger:
  branches:
    include: [main]

pool:
  vmImage: "ubuntu-latest"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
  - script: npm ci && npm test
    displayName: "Install and test"
  - script: npm run build
    displayName: "Build"
```

This YAML pipeline triggers on commits to main, provisions an Ubuntu agent, installs Node.js 20, runs tests, and builds the project. Additional stages for deployment, approval gates, and environment-specific variables can be appended as the project matures.

## When to use

- Your organization is already in the Microsoft ecosystem and wants tight integration with Azure resources, Active Directory, and Visual Studio.
- You need an all-in-one platform covering project management, source control, CI/CD, artifact feeds, and test management without managing multiple third-party tools.
- Your compliance or governance requirements benefit from Azure DevOps' built-in audit logs, branch policies, and approval gates.
- You want YAML-based pipelines that are version-controlled alongside your application code.

## When to avoid

- Your team is deeply invested in GitHub and its ecosystem (Actions, Issues, Projects); duplicating workflows in Azure DevOps adds friction without clear benefit.
- You only need CI/CD and prefer a lighter-weight, open-source solution such as GitHub Actions, GitLab CI, or Jenkins.
- The organization operates primarily on AWS or GCP and has no existing Microsoft tooling; native CI/CD services on those clouds may integrate more naturally.
- Your project is a small open-source effort where GitHub's free tier and community features are more appropriate.

## Trade-offs

- **Breadth vs. depth**: Azure DevOps covers many concerns (boards, repos, pipelines, artifacts, test plans), but each individual feature may lack the depth of a best-in-class specialized tool, leading teams to adopt hybrid setups anyway.
- **Flexibility vs. learning curve**: YAML pipelines are powerful and version-controlled, but their syntax and task library have a steep learning curve compared to simpler CI configurations, especially for teams new to the platform.
- **Integration vs. lock-in**: Deep Azure integration accelerates Azure-centric workflows, but pipeline templates, service connections, and variable groups become harder to migrate if the organization later moves to a different platform.

## Common small mistakes

- Using the classic (GUI-based) pipeline editor for new projects instead of YAML pipelines, making build definitions harder to review, version, and share across repositories.
- Storing secrets directly in pipeline YAML or variable groups without linking them to Azure Key Vault, increasing the risk of credential exposure.
- Not setting up branch policies (required reviewers, build validation) on the main branch, allowing untested code to be merged.
- Creating overly broad service connections with contributor-level access to entire Azure subscriptions instead of scoping permissions to specific resource groups.
- Ignoring pipeline caching for dependencies like `node_modules` or NuGet packages, causing unnecessarily long build times on every run.
