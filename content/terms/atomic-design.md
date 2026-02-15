---
title: "Atomic Design"
letter: "A"
categories:
  - "design-systems"
  - "frontend"
shortDefinition: "A methodology created by Brad Frost that organizes UI components into five hierarchical levels: atoms, molecules, organisms, templates, and pages."
---

## Why does it exist?

Building user interfaces without a clear organizational model leads to a flat, chaotic collection of components where it is unclear how pieces relate to one another. Brad Frost introduced Atomic Design to give teams a mental model borrowed from chemistry: small, fundamental elements (atoms) combine into more complex groups (molecules), which combine into larger sections (organisms), which are arranged into layouts (templates), and finally filled with real content (pages).

This hierarchy helps teams reason about component granularity. Instead of debating whether a search bar is "simple enough" to be a base component, the methodology provides clear criteria. An input field is an atom. An input field combined with a label and a submit button is a molecule. A full search bar with autocomplete suggestions and filters is an organism. This shared vocabulary reduces ambiguity in design reviews and pull requests.

## Practical example of use

A team building an e-commerce site applies Atomic Design to organize their component library. At the atom level, they define elements like Button, Input, Label, Icon, and Avatar. At the molecule level, they combine these into SearchField (Input + Button), ProductPrice (text + currency formatting), and UserBadge (Avatar + Name label).

At the organism level, they assemble molecules into larger sections: ProductCard (image + ProductPrice + Button), NavigationBar (Logo + SearchField + UserBadge), and ProductGrid (a collection of ProductCards). Templates define the page layout, placing NavigationBar at the top, a sidebar with filters, and a ProductGrid in the main content area. Finally, pages fill templates with real data, such as the "Running Shoes" category page with actual product listings.

## When to use

- When building a design system from scratch and you need a clear model for organizing dozens or hundreds of components.
- When teams struggle to agree on component granularity and need a shared vocabulary for design reviews.
- When documentation needs to reflect the compositional nature of the interface so new team members can understand the hierarchy quickly.
- When you want to encourage composition over monolithic components, guiding developers to build small, reusable pieces first.

## When to avoid

- When the project is small enough that a flat list of components is perfectly manageable and adding hierarchy would be over-engineering.
- When the team is already using a different organizational model that works well for them and switching would cause unnecessary churn.
- When strict adherence to the five levels creates forced categorizations that confuse more than they clarify.
- When the methodology is being applied dogmatically rather than pragmatically, with teams spending more time debating whether something is a molecule or an organism than shipping features.

## Trade-offs

- **Clear hierarchy vs. categorization debates**: The five levels provide structure, but edge cases inevitably arise where a component does not fit neatly into one level, causing unproductive discussions.
- **Composition encouragement vs. over-fragmentation**: Pushing toward small atoms can lead to components so granular that assembling a simple UI requires importing and composing many pieces.
- **Universal vocabulary vs. learning curve**: The chemistry metaphor gives the team a shared language, but new members need time to internalize what each level means in practice.

## Common small mistakes

- Obsessing over whether a component is a molecule or an organism instead of focusing on whether it is reusable and well-designed.
- Creating atoms that are too thin, wrapping native HTML elements without adding meaningful behavior, styling, or accessibility.
- Skipping the template level and jumping straight from organisms to pages, losing the benefit of separating layout structure from content.
- Applying the methodology only in the component library but not in the Figma design files, creating a disconnect between design and code organization.
- Treating the five levels as rigid rules rather than a flexible mental model, which leads to awkward component hierarchies.
