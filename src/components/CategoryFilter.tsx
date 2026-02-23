"use client";

import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onToggle,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {categories.map((cat) => {
        const active = selected.has(cat.slug);
        return (
          <button
            key={cat.slug}
            onClick={() => onToggle(cat.slug)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
              ${active
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
