import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Term, TermMeta, TermSection } from "@/types";

const termsDirectory = path.join(process.cwd(), "content/terms");

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(termsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllTerms(): TermMeta[] {
  const slugs = getAllSlugs();
  return slugs
    .map((slug) => getTermMeta(slug))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function getTermMeta(slug: string): TermMeta {
  const filePath = path.join(termsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title,
    letter: data.letter,
    categories: data.categories || [],
    shortDefinition: data.shortDefinition,
  };
}

export async function getTermBySlug(slug: string): Promise<Term> {
  const filePath = path.join(termsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const sections = await parseSections(content);

  return {
    slug,
    title: data.title,
    letter: data.letter,
    categories: data.categories || [],
    shortDefinition: data.shortDefinition,
    sections,
  };
}

async function parseSections(markdownContent: string): Promise<TermSection[]> {
  const sections: TermSection[] = [];
  const parts = markdownContent.split(/^## /m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const newlineIndex = trimmed.indexOf("\n");
    if (newlineIndex === -1) {
      // Heading with no body
      sections.push({ heading: trimmed, content: "" });
      continue;
    }

    const heading = trimmed.slice(0, newlineIndex).trim();
    const body = trimmed.slice(newlineIndex + 1).trim();

    const result = await remark().use(html).process(body);
    sections.push({
      heading,
      content: result.toString(),
    });
  }

  return sections;
}
