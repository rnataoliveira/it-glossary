import { TermMeta } from "@/types";
import TermCard from "./TermCard";

interface TermListProps {
  terms: TermMeta[];
}

export default function TermList({ terms }: TermListProps) {
  if (terms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No terms found.</p>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {terms.map((term) => (
        <TermCard key={term.slug} term={term} />
      ))}
    </div>
  );
}
