import { cp, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { createHighlighter } from "shiki";
import {
  escapeHTML as e,
  loadDocs,
  slugify,
  type Heading,
} from "../src/site/content.ts";
import {
  shell,
  landingContent,
  releaseContent,
} from "../src/site/templates.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, ".generated");
export async function generateSite() {
  const site = new URL(process.env.SITE_URL || "http://localhost:4321");
  if (!["http:", "https:"].includes(site.protocol))
    throw new Error("SITE_URL must use http or https");
  const highlighter = await createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: [
      "bash",
      "powershell",
      "go",
      "typescript",
      "json",
      "dotenv",
      "text",
      "nginx",
    ],
  });
  const languageAliases: Record<string, string> = {
    env: "dotenv",
    shell: "bash",
    sh: "bash",
    ts: "typescript",
    txt: "text",
    plaintext: "text",
  };
  function code(text: string, lang: string, label: string) {
    const language = languageAliases[lang] || lang;
    const html = highlighter.codeToHtml(text, {
      lang: highlighter.getLoadedLanguages().includes(language)
        ? language
        : "text",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    });
    return `<div class="code-block"><div class="code-toolbar"><span>${e(label)}</span><button class="copy-code" type="button" aria-label="Salin kode ${e(label)}">Salin</button></div>${html}</div>`;
  }
  const pages = await loadDocs(path.join(root, "src/content/docs"));
  await mkdir(path.join(output, "public"), { recursive: true });
  await cp(path.join(root, "public"), path.join(output, "public"), {
    recursive: true,
  });
  const search: { title: string; route: string; text: string }[] = [];
  const routes = ["/", "/releases/"];
  for (const page of pages) {
    const headings: Heading[] = [];
    const ids = new Map<string, number>();
    const markdown = new Marked({ gfm: true });
    markdown.use({
      renderer: {
        code(token: Tokens.Code) {
          return code(
            token.text,
            (token.lang || "text").split(/\s/)[0],
            (token.lang || "text").toUpperCase(),
          );
        },
        heading(token: Tokens.Heading) {
          const title = token.text
            .replace(/<[^>]*>/g, "")
            .replace(/[`*_]/g, "");
          const slug = slugify(title) || "section",
            count = ids.get(slug) || 0;
          ids.set(slug, count + 1);
          const id = count ? `${slug}-${count}` : slug;
          headings.push({ id, text: title, depth: token.depth });
          return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}<a class="heading-anchor" href="#${id}" aria-label="Tautan bagian ${e(title)}">#</a></h${token.depth}>`;
        },
        table(token: Tokens.Table) {
          return `<div class="table-scroll">${renderTable(token)}</div>`;
        },
      },
    });
    function renderTable(token: Tokens.Table) {
      const cell = (text: string) => new Marked().parseInline(text) as string;
      return `<table><thead><tr>${token.header.map((c) => `<th>${cell(c.text)}</th>`).join("")}</tr></thead><tbody>${token.rows.map((row) => `<tr>${row.map((c) => `<td>${cell(c.text)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    const body = await markdown.parse(page.markdown);
    const html = shell({
      ...page,
      body,
      headings,
      site,
      noindex: page.route === "/404.html",
    });
    const filename =
      page.route === "/404.html"
        ? "404.html"
        : `${page.route.slice(1)}index.html`;
    await write(path.join(output, filename), html);
    if (page.route !== "/404.html") {
      routes.push(page.route);
      // Section-level search entries link to real server-rendered headings.
      const chunks = body.split(/(?=<h[23] id=")/);
      for (const chunk of chunks) {
        const heading = chunk.match(/^<h[23] id="([^"]+)">([\s\S]*?)<a /);
        const text = stripHTML(chunk);
        search.push({
          title: heading
            ? `${page.title} · ${stripHTML(heading[2])}`
            : page.title,
          route: page.route + (heading ? `#${heading[1]}` : ""),
          text: text.slice(0, 12000),
        });
      }
    }
  }
  const home = shell({
    title: "Go further. Build together.",
    description:
      "CopyTyGo, framework full-stack Go dan TypeScript. Dokumentasi, CLI, authentication, database, background jobs, dan Studio.",
    route: "/",
    body: landingContent(code),
    home: true,
    site,
  });
  await write(path.join(output, "index.html"), home);
  const releases = releaseContent();
  await write(
    path.join(output, "releases/index.html"),
    shell({
      title: "Releases",
      description:
        "Versi stabil dan riwayat rilis CopyTyGo dari GitHub Releases.",
      route: "/releases/",
      body: releases,
      site,
      headings: [
        { id: "riwayat-rilis", text: "Riwayat rilis", depth: 2 },
        { id: "dokumentasi-versi", text: "Dokumentasi versi", depth: 2 },
      ],
    }),
  );
  search.push({
    title: "Releases",
    route: "/releases/",
    text: stripHTML(releases),
  });
  await write(
    path.join(output, "docs/index.html"),
    `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/docs/v5/"><meta name="robots" content="noindex"><title>Dokumentasi CopyTyGo</title><link rel="canonical" href="${new URL("/docs/v5/", site)}"></head><body><a href="/docs/v5/">Buka dokumentasi v5</a></body></html>`,
  );
  await write(
    path.join(output, "client.ts"),
    "import '../src/client/main.ts';\n",
  );
  await write(
    path.join(output, "public/search-index.json"),
    JSON.stringify(search),
  );
  await write(
    path.join(output, "public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${e(new URL(route, site).href)}</loc></url>`).join("")}</urlset>`,
  );
  await write(
    path.join(output, "public/robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", site)}\n`,
  );
  highlighter.dispose();
  console.log(
    `Generated ${routes.length + 2} HTML pages and ${search.length} searchable sections. Node ${process.versions.node}.`,
  );
}
function stripHTML(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(
      /&(?:amp|lt|gt|quot|#39);/g,
      (s) =>
        ({
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'",
        })[s]!,
    )
    .replace(/\s+/g, " ")
    .trim();
}
async function write(filename: string, content: string) {
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, content);
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await generateSite();
