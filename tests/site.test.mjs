import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseDoc, slugify } from "../src/site/content.ts";
import { searchEntries } from "../src/client/search.ts";

test("Markdown route mapping preserves versioned URLs and rejects missing metadata", () => {
  const page = parseDoc(
    '---\ntitle: "Introduction"\ndescription: "Go + TypeScript"\n---\n\n## Start',
    "docs/v5/index.md",
  );
  assert.equal(page.route, "/docs/v5/");
  assert.equal(page.title, "Introduction");
  assert.equal(
    parseDoc("---\ntitle: 404\ndescription: Missing\n---\n", "404.md").route,
    "/404.html",
  );
  assert.throws(
    () => parseDoc("# No metadata", "missing.md"),
    /Missing metadata/,
  );
  assert.equal(slugify("Install CLI v5.0.0"), "install-cli-v500");
});
test("search ranks titles, is case-insensitive, and requires all query words", () => {
  const entries = [
    { title: "Queue", route: "/queue/", text: "Authentication worker" },
    {
      title: "Authentication",
      route: "/authentication/",
      text: "Browser session token",
    },
    { title: "Database", route: "/database/", text: "MySQL" },
  ];
  assert.equal(
    searchEntries(entries, "AUTHENTICATION")[0].route,
    "/authentication/",
  );
  assert.equal(searchEntries(entries, "authentication token").length, 1);
  assert.equal(searchEntries(entries, "authentication mysql").length, 0);
  assert.equal(searchEntries(entries, "  ").length, 0);
});
test("production HTML is prerendered, highlighted, version-pinned, and has canonical metadata", async () => {
  const html = await readFile("dist/docs/v5/installation/index.html", "utf8");
  assert.match(html, /<h1>Installation<\/h1>/);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /aria-label="Search documentation"/);
  assert.match(
    html.replace(/<[^>]*>/g, ""),
    /go install github.com\/arfajhf\/copytygo\/v5\/cmd\/ctg@v5\.0\.0/,
  );
  assert.match(html, /class="shiki/);
  assert.match(html, /class="copy-code"/);
  assert.match(
    html,
    /<link rel="canonical" href="https?:\/\/[^\"]+\/docs\/v5\/installation\/"/,
  );
  assert.match(html, /aria-current="page"/);
  const index = JSON.parse(await readFile("dist/search-index.json", "utf8"));
  assert.ok(
    index.some((entry) => entry.route.startsWith("/docs/v5/authentication/")),
  );
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.match(sitemap, /\/docs\/v5\/installation\//);
  assert.doesNotMatch(sitemap, /404\.html/);
  const missing = await readFile("dist/404.html", "utf8");
  assert.match(missing, /noindex/);
});
test("dependency tree and runtime requirement no longer include Astro", async () => {
  const manifest = JSON.parse(await readFile("package.json", "utf8"));
  const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
  assert.ok(manifest.scripts.dev.includes("vite"));
  assert.equal(manifest.engines.node, "^20.19.0 || >=22.12.0");
  assert.ok(!Object.keys(lock.packages).some((name) => name.includes("astro")));
});
