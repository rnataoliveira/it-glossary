"use client";

import { useState, useMemo } from "react";
import { TermMeta } from "@/types";
import { categoryGroups } from "@/lib/categories";
import SearchBar from "./SearchBar";
import AlphabetNav from "./AlphabetNav";
import CategorySidebar from "./CategorySidebar";
import TermList from "./TermList";

interface HomeClientProps {
  terms: TermMeta[];
}

export default function HomeClient({ terms }: HomeClientProps) {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const availableLetters = useMemo(
    () => new Set(terms.map((t) => t.letter)),
    [terms]
  );

  const filtered = useMemo(() => {
    let result = terms;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortDefinition.toLowerCase().includes(q)
      );
    }

    // Letter filter
    if (activeLetter) {
      result = result.filter((t) => t.letter === activeLetter);
    }

    // Category filter (OR logic)
    if (selectedCategories.size > 0) {
      result = result.filter((t) =>
        t.categories.some((c) => selectedCategories.has(c))
      );
    }

    return result;
  }, [terms, search, activeLetter, selectedCategories]);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  return (
    <div className="flex gap-8 items-start">
      <CategorySidebar
        groups={categoryGroups}
        selected={selectedCategories}
        onToggle={toggleCategory}
        onClearAll={() => setSelectedCategories(new Set())}
      />

      <div className="flex-1 min-w-0 space-y-6">
        <SearchBar value={search} onChange={setSearch} />
        <AlphabetNav
          activeLetter={activeLetter}
          availableLetters={availableLetters}
          onSelect={setActiveLetter}
        />
        <div className="pt-2">
          <p className="text-sm text-gray-400 mb-3" aria-live="polite" aria-atomic="true">
            {filtered.length} {filtered.length === 1 ? "term" : "terms"}
          </p>
          <TermList terms={filtered} />
        </div>
      </div>
    </div>
  );
}
