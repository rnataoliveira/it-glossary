---
title: "Zero Trust"
letter: "Z"
categories:
  - "security"
  - "architecture"
shortDefinition: "A security model that assumes no implicit trust for any user, device, or network segment, requiring continuous verification and least-privilege access for every request regardless of its origin."
---

## Why does it exist?

Traditional network security follows a perimeter-based model: everything inside the corporate network is trusted, and everything outside is not. This approach made sense when employees worked from offices and applications ran in on-premises data centers. However, the shift to cloud computing, remote work, microservices, and third-party SaaS integrations dissolved the clear network boundary. Attackers who breach the perimeter through phishing, compromised VPN credentials, or a vulnerable edge service gain lateral movement across the entire internal network.

Zero Trust addresses this by eliminating the concept of a trusted internal network. Every access request, whether it originates from a corporate office, a home network, or an internal microservice, must be authenticated, authorized, and encrypted. Policies are based on identity, device health, resource sensitivity, and real-time risk signals rather than network location. This dramatically reduces the blast radius of a breach because compromising one component does not automatically grant access to others.

## Practical example of use

A company migrates from a VPN-based access model to a Zero Trust architecture. Previously, any employee connected to the VPN could reach all internal applications. Under the new model, each application is fronted by an identity-aware proxy that verifies the user's identity through SSO, checks that their device meets security posture requirements (disk encryption enabled, OS up to date, endpoint protection running), and evaluates the request context (location, time, risk score). Access is granted per-application and per-session. An engineer who is authorized to access the deployment dashboard cannot automatically reach the HR system, even though both run on the same internal network. If the engineer's device fails a posture check, access is denied until the issue is remediated.

## When to use

- When operating in cloud or hybrid environments where the traditional network perimeter does not exist or is insufficient.
- When supporting remote or distributed workforces that access corporate resources from untrusted networks.
- When running microservices that communicate over shared infrastructure and need mutual authentication between services.
- When compliance frameworks (such as NIST 800-207 or executive orders on cybersecurity) require Zero Trust adoption.

## When to avoid

- When operating completely isolated, air-gapped systems where the overhead of continuous verification provides no meaningful security benefit over physical access controls.
- When the organization lacks the identity infrastructure (SSO, MFA, device management) needed to implement Zero Trust, and rushing adoption would create a fragile, half-implemented solution.
- When dealing with legacy systems that cannot support modern authentication protocols and wrapping them in Zero Trust proxies would introduce unacceptable latency or complexity.
- When the team is very small and all members share physical space, making the operational burden of full Zero Trust disproportionate to the threat model.

## Trade-offs

- **Security vs. user experience**: Continuous verification adds friction. Users may face more authentication prompts, device checks, and access denials that require remediation, which can reduce productivity if not carefully designed.
- **Granularity vs. management overhead**: Fine-grained per-resource policies provide excellent security but require significant effort to define, maintain, and troubleshoot across hundreds of services.
- **Visibility vs. privacy**: Zero Trust demands extensive logging and monitoring of user behavior and device state, which raises privacy concerns that must be balanced with organizational policies and regulations.

## Common small mistakes

- Treating Zero Trust as a product you can buy rather than an architectural strategy that requires changes to identity management, network design, and access policies.
- Implementing Zero Trust at the perimeter (replacing VPN with an identity-aware proxy) but leaving service-to-service communication unauthenticated inside the network.
- Not investing in a robust identity provider and multi-factor authentication before attempting Zero Trust, since identity is the foundation of the entire model.
- Creating overly permissive policies to reduce friction during rollout and never revisiting them, which recreates the implicit trust problem under a new name.
- Forgetting to monitor and respond to access logs, which means threats go undetected even though the data to identify them is being collected.
