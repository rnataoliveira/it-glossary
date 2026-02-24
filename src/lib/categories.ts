import { Category, CategoryGroup } from "@/types";

export const categoryGroups: CategoryGroup[] = [
  {
    slug: "core-development",
    label: "Core Development",
    categories: [
      { slug: "backend", label: "Backend" },
      { slug: "frontend", label: "Frontend" },
      { slug: "mobile", label: "Mobile" },
      { slug: "architecture", label: "Architecture & Patterns" },
      { slug: "design-patterns", label: "Design Patterns" },
    ],
  },
  {
    slug: "infrastructure-ops",
    label: "Infrastructure & Ops",
    categories: [
      { slug: "devops", label: "DevOps & Infrastructure" },
      { slug: "cloud", label: "Cloud & Platforms" },
      { slug: "reliability", label: "Reliability & Observability" },
      { slug: "performance", label: "Performance & Scaling" },
    ],
  },
  {
    slug: "data-intelligence",
    label: "Data & Intelligence",
    categories: [
      { slug: "data", label: "Data & Storage" },
      { slug: "ai-ml", label: "AI & Machine Learning" },
    ],
  },
  {
    slug: "quality-design",
    label: "Quality & Design",
    categories: [
      { slug: "testing", label: "Testing" },
      { slug: "security", label: "Security" },
      { slug: "design-systems", label: "Design Systems" },
    ],
  },
];

export const categories: Category[] = categoryGroups.flatMap((g) => g.categories);
