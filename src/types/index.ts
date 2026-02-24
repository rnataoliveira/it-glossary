export interface Category {
  slug: string;
  label: string;
}

export interface CategoryGroup {
  slug: string;
  label: string;
  categories: Category[];
}

export interface TermMeta {
  slug: string;
  title: string;
  letter: string;
  categories: string[];
  shortDefinition: string;
}

export interface TermSection {
  heading: string;
  content: string; // HTML string
}

export interface Term extends TermMeta {
  sections: TermSection[];
}
