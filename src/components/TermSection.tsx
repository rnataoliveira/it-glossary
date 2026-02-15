import { TermSection as TermSectionType } from "@/types";

interface TermSectionProps {
  section: TermSectionType;
}

export default function TermSection({ section }: TermSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
        {section.heading}
      </h2>
      <div
        className="prose prose-gray prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </section>
  );
}
