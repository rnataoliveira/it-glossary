import { getAllSlugs, getTermBySlug } from "@/lib/terms";
import { categories } from "@/lib/categories";
import TermSection from "@/components/TermSection";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);
  return {
    title: `${term.title} — IT Glossary`,
    description: term.shortDefinition,
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  const categoryLabels = term.categories
    .map((slug) => categories.find((c) => c.slug === slug)?.label)
    .filter(Boolean);

  return (
    <article>
      <Link
        href="/"
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors mb-6 inline-block"
      >
        &larr; Back to all terms
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center">
            {term.letter}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{term.title}</h1>
            <p className="text-gray-500 mt-1">{term.shortDefinition}</p>
          </div>
        </div>

        {categoryLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryLabels.map((label) => (
              <span
                key={label}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {term.sections.map((section, i) => (
          <TermSection key={i} section={section} />
        ))}
      </div>
    </article>
  );
}
