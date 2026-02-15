---
title: "Configuration Management"
letter: "C"
categories:
  - "devops"
shortDefinition: "The practice of systematically defining, tracking, and enforcing the desired state of infrastructure and application settings using automated tools, ensuring consistency and repeatability across environments."
---

## Why does it exist?

As organizations grow from managing a handful of servers to hundreds or thousands, manually configuring each machine becomes error-prone and unsustainable. Administrators forget steps, apply changes inconsistently, or lose track of what was modified and when. The result is configuration drift, where machines that should be identical gradually diverge, causing mysterious bugs that only appear on certain servers.

Configuration management tools solve this by letting teams declare the desired state of their infrastructure in code. The tool then computes the difference between the current state and the desired state and applies only the necessary changes. This declarative approach ensures that running the same configuration multiple times produces the same result (idempotency), makes infrastructure reproducible, and provides a version-controlled audit trail of every change.

## Practical example of use

A team uses Ansible to ensure all web servers have nginx installed with a consistent configuration. They define a playbook that targets all machines in the `webservers` inventory group, installs the package, deploys a templated configuration file, and restarts the service only when the configuration changes.

```yaml
- name: Configure web servers
  hosts: webservers
  become: true
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
    - name: Copy config
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

Running this playbook against 50 servers ensures every one of them ends up with the same nginx version and configuration. If a server was already in the desired state, Ansible skips it, making re-runs safe and fast. The playbook is stored in version control, so any configuration change goes through code review before being applied.

## When to use

- When managing multiple servers or environments that must maintain consistent configurations.
- When you need an auditable history of infrastructure changes for compliance or debugging purposes.
- When onboarding new servers or rebuilding after failures and you need a reliable way to restore the full configuration.
- When coordinating changes across teams that manage different parts of the infrastructure stack.

## When to avoid

- When working with fully immutable infrastructure where servers are replaced rather than modified, making in-place configuration changes unnecessary.
- When managing a single server or a very small environment where the overhead of maintaining configuration code exceeds the manual effort.
- When the infrastructure is entirely managed through container images and orchestration platforms that handle configuration through different mechanisms.
- When rapid experimentation is needed and the feedback loop of writing, testing, and applying configuration code slows down the process significantly.

## Trade-offs

- **Consistency vs. initial investment**: You gain reproducible infrastructure but must invest time upfront to codify all configurations and build testing pipelines.
- **Idempotency vs. complexity**: Declarative tools handle most cases cleanly, but complex stateful operations (like database migrations) can be difficult to express idempotently.
- **Centralized control vs. team autonomy**: A shared configuration repository enforces standards but can become a bottleneck if teams need to move at different speeds.

## Common small mistakes

- Writing configuration code that is not idempotent, causing unintended side effects when the tool runs multiple times.
- Hardcoding environment-specific values instead of using variables and templates, making the same playbook unusable across different environments.
- Not testing configuration changes in a staging environment before applying them to production.
- Storing secrets in plain text within configuration files instead of using a secrets management tool or encrypted vault.
- Neglecting to run the configuration tool regularly, allowing drift to accumulate between scheduled runs.
