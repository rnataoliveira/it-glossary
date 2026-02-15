import Link from "next/link";
import { TermMeta } from "@/types";

interface TermCardProps {
  term: TermMeta;
}

export default function TermCard({ term }: TermCardProps) {
  return (
    <Link
      href={`/term/${term.slug}`}
      className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          {term.letter}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {term.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {term.shortDefinition}
          </p>
        </div>
      </div>
    </Link>
  );
}
