"use client";

import { useState } from "react";
import { CategoryGroup } from "@/types";

interface CategorySidebarProps {
  groups: CategoryGroup[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
  onClearAll: () => void;
}

export default function CategorySidebar({
  groups,
  selected,
  onToggle,
  onClearAll,
}: CategorySidebarProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(groups.map((g) => g.slug))
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleGroup(slug: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const sidebarContent = (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Categories
        </span>
        {selected.size > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {groups.map((group) => {
        const isOpen = openGroups.has(group.slug);
        const activeInGroup = group.categories.filter((c) =>
          selected.has(c.slug)
        ).length;

        return (
          <div key={group.slug}>
            <button
              onClick={() => toggleGroup(group.slug)}
              className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 transition-colors group"
              aria-expanded={isOpen}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-700">
                {group.label}
              </span>
              <div className="flex items-center gap-1.5">
                {activeInGroup > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 font-medium leading-none">
                    {activeInGroup}
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="pl-2 mt-0.5 mb-2 space-y-0.5">
                {group.categories.map((cat) => {
                  const active = selected.has(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => onToggle(cat.slug)}
                      aria-pressed={active}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                        ${
                          active
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          aria-expanded={mobileOpen}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
          </svg>
          Categories
          {selected.size > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none font-semibold">
              {selected.size}
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 ml-auto text-gray-400 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-white">
            {sidebarContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block w-52 shrink-0 sticky top-6 self-start"
        aria-label="Filter by category"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
