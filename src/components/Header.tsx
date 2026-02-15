import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          IT Glossary
        </Link>
        <p className="text-sm text-gray-500 mt-0.5">
          A developer&apos;s dictionary of technology terms
        </p>
      </div>
    </header>
  );
}
