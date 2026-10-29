import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type DocPage = {
  title: string;
  description: string;
  route: string;
  markdown: string;
  source: string;
};
export type Heading = { id: string; text: string; depth: number };
export const escapeHTML = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

// Frontmatter intentionally supports the simple string metadata used by this project.
// Content is Markdown, never executable MDX or arbitrary JavaScript.
export function parseDoc(raw: string, filename: string): DocPage {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`Missing metadata: ${filename}`);
  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^(title|description):\s*(.*)$/);
    if (field)
      fields[field[1]] = field[2].startsWith('"')
        ? JSON.parse(field[2])
        : field[2];
  }
  if (!fields.title || !fields.description)
    throw new Error(`Missing title/description: ${filename}`);
  const slug = filename
    .replaceAll(path.sep, "/")
    .replace(/\.md$/, "")
    .replace(/(?:^|\/)index$/, "");
  return {
    title: fields.title,
    description: fields.description,
    route: filename === "404.md" ? "/404.html" : `/${slug.replace(/\/$/, "")}/`,
    markdown: raw.slice(match[0].length),
    source: filename,
  };
}
export async function loadDocs(dir: string): Promise<DocPage[]> {
  const result: DocPage[] = [];
  async function walk(folder: string) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else if (entry.name.endsWith(".md"))
        result.push(
          parseDoc(
            await readFile(filename, "utf8"),
            path.relative(dir, filename),
          ),
        );
    }
  }
  await walk(dir);
  return result.sort((a, b) => a.route.localeCompare(b.route));
}
export const navigation = [
  {
    title: "Start here",
    pages: [
      ["Introduction", "/docs/v5/"],
      ["Installation", "/docs/v5/installation/"],
      ["Getting Started", "/docs/v5/getting-started/"],
    ],
  },
  {
    title: "Framework",
    pages: [
      ["CLI", "/docs/v5/cli/"],
      ["Authentication", "/docs/v5/authentication/"],
      ["Database", "/docs/v5/database/"],
      ["Migration", "/docs/v5/migration/"],
      ["Resource generator", "/docs/v5/resource-generator/"],
      ["Frontend", "/docs/v5/frontend/"],
      ["Queue", "/docs/v5/queue/"],
      ["Scheduler", "/docs/v5/scheduler/"],
      ["Studio", "/docs/v5/studio/"],
      ["Deployment", "/docs/v5/deployment/"],
    ],
  },
  {
    title: "Ecosystem",
    pages: [
      ["Examples", "/examples/"],
      ["Releases", "/releases/"],
      ["Changelog", "/changelog/"],
    ],
  },
];
