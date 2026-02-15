"use client";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetNavProps {
  activeLetter: string | null;
  availableLetters: Set<string>;
  onSelect: (letter: string | null) => void;
}

export default function AlphabetNav({
  activeLetter,
  availableLetters,
  onSelect,
}: AlphabetNavProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {ALPHABET.map((letter) => {
        const available = availableLetters.has(letter);
        const active = activeLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => onSelect(active ? null : letter)}
            disabled={!available && !active}
            className={`w-8 h-8 rounded text-sm font-medium transition-all
              ${active
                ? "bg-blue-600 text-white shadow-sm"
                : available
                  ? "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                  : "bg-gray-100 text-gray-300 cursor-default border border-gray-100"
              }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
