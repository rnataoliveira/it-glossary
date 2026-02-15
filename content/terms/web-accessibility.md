---
title: "Web Accessibility"
letter: "W"
categories:
  - "frontend"
shortDefinition: "Designing and building websites so that people with disabilities can perceive, understand, navigate, and interact with them."
---

## Why does it exist?

Over one billion people worldwide live with some form of disability, including visual, auditory, motor, and cognitive impairments. Without deliberate effort, websites create barriers that exclude these users — images without descriptions, forms without labels, navigation that only works with a mouse, and color schemes that are invisible to people with color blindness. Web accessibility exists as both a moral imperative and, in many jurisdictions, a legal requirement to ensure the web is usable by everyone, not just people who interact with it in the default way.

## Practical example of use

A banking application implements accessibility throughout its interface. All form fields have associated `<label>` elements so screen readers announce "Account number" when the input is focused. Error messages are linked to their fields using `aria-describedby`, so a blind user hears "Invalid account number — must be 10 digits" in context. The transfer confirmation modal traps focus so keyboard users cannot accidentally tab into the background. Color is never the only indicator of status — successful transactions show a green banner with a checkmark icon and the text "Transfer complete," so color-blind users get the same information.

```html
<form>
  <label for="account-number">Account number</label>
  <input
    id="account-number"
    type="text"
    aria-describedby="account-error"
    aria-invalid="true"
  />
  <span id="account-error" role="alert">
    Invalid account number — must be 10 digits
  </span>
</form>

<!-- Status banner — not color-only -->
<div role="status" class="banner success">
  <svg aria-hidden="true"><!-- checkmark icon --></svg>
  Transfer complete
</div>
```

## When to use

- Every public-facing website and web application — accessibility is not a feature toggle, it is a baseline quality standard
- When your organization must comply with laws like the ADA, Section 508, or the European Accessibility Act
- Applications in healthcare, government, education, and finance where excluding users with disabilities creates serious legal and ethical risks
- When you want to improve usability for all users, since accessible design benefits people using small screens, slow connections, or temporary impairments like a broken arm

## When to avoid

- There is no valid reason to avoid accessibility entirely. Even internal tools benefit from accessible design
- The only realistic trade-off is prioritization — you may defer complex ARIA widget patterns for a rapid prototype, but you should plan to address them before production
- Automated testing tools catch only about 30% of accessibility issues, so do not assume passing an automated audit means the site is accessible

## Trade-offs

- **Inclusive reach vs. development effort**: Making an application accessible to all users requires additional design thinking, semantic markup, and testing, but it expands your audience and reduces legal risk
- **Semantic HTML vs. custom component flexibility**: Using native elements like `<button>`, `<select>`, and `<nav>` provides built-in accessibility, but custom-designed components require manual ARIA attributes, keyboard handling, and focus management
- **Robust for assistive tech vs. testing complexity**: Ensuring compatibility with screen readers, voice controls, and switch devices requires manual testing with real assistive technology, which is time-consuming and requires specialized knowledge

## Common small mistakes

- Using `<div>` and `<span>` with click handlers instead of `<button>` elements, which are not keyboard-focusable or announced as interactive by screen readers
- Adding alt text to every image, including decorative ones — decorative images should use `alt=""` so screen readers skip them
- Relying on color alone to communicate meaning, such as red text for errors without an accompanying icon or message
- Hiding content visually with `display: none` when it should be available to screen readers, or making it visible to screen readers when it should be hidden from everyone
