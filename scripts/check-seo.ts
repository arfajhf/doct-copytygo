import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { resolveSeoConfig, OFFICIAL_ORIGIN } from "../src/site/seo.ts";
import { loadDocs } from "../src/site/content.ts";
const config = resolveSeoConfig();
if (process.argv.includes("--production"))
  assert.ok(
    config.indexable,
    "Launch audit requires an indexable build for https://copytygo.org.",
  );
const root = path.resolve("dist");
async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((item) =>
        item.isDirectory()
          ? htmlFiles(path.join(dir, item.name))
          : item.name.endsWith(".html")
            ? [path.join(dir, item.name)]
            : [],
      ),
    )
  ).flat();
}
const decode = (s: string) =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
const titles = new Set<string>(),
  descriptions = new Set<string>();
const documents = await loadDocs(path.resolve("src/content/docs"));
const routes = [
  "/",
  "/releases/",
  ...documents
    .filter((page) => page.route !== "/404.html")
    .map((page) => page.route),
];
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const route =
    relative === "index.html"
      ? "/"
      : relative === "404.html"
        ? "/404.html"
        : `/${relative.replace(/index\.html$/, "")}`;
  assert.match(
    html,
    /<html lang="en"/,
    `${route}: missing English language declaration`,
  );
  const canonicals = [
    ...html.matchAll(/<link rel="canonical" href="([^"]+)"/g),
  ];
  assert.equal(canonicals.length, 1, `${route}: expected one canonical URL`);
  const target = route === "/docs/" ? "/docs/v5/" : route;
  assert.equal(
    decode(canonicals[0][1]),
    new URL(target, config.site).href,
    `${route}: incorrect canonical`,
  );
  const noindex =
    route === "/404.html" || route === "/docs/" || !config.indexable;
  assert.match(
    html,
    noindex
      ? /<meta name="robots" content="noindex(?:, follow)?">/
      : /<meta name="robots" content="index, follow, max-image-preview:large">/,
    `${route}: incorrect index policy`,
  );
  if (route === "/docs/") continue;
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || "");
  assert.ok(
    title && !titles.has(title),
    `${route}: missing or duplicate title`,
  );
  titles.add(title);
  const description = decode(
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "",
  );
  assert.ok(
    description.length >= 40 && !descriptions.has(description),
    `${route}: missing, generic or duplicate description`,
  );
  descriptions.add(description);
  assert.equal(
    [...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length,
    1,
    `${route}: expected one visible main heading`,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https?:\/\/[^\"]+\/og-image\.png">/,
  );
  assert.match(
    html,
    /<meta name="twitter:card" content="summary_large_image">/,
  );
  const json = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];
  assert.ok(json, `${route}: missing structured data`);
  const schema = JSON.parse(json);
  assert.equal(schema["@context"], "https://schema.org");
  assert.ok(
    schema["@graph"].some(
      (node: Record<string, unknown>) => node["@type"] === "WebSite",
    ),
  );
  if (route.startsWith("/docs/v5/")) {
    assert.ok(
      schema["@graph"].some(
        (node: Record<string, unknown>) => node["@type"] === "TechArticle",
      ),
    );
    const crumb = schema["@graph"].find(
      (node: Record<string, unknown>) => node["@type"] === "BreadcrumbList",
    );
    assert.equal(
      crumb.itemListElement.at(-1).item,
      new URL(route, config.site).href,
    );
    assert.match(html, /aria-label="Breadcrumb"/);
  }
  if (route === "/")
    assert.ok(
      schema["@graph"].some(
        (node: Record<string, unknown>) =>
          node["@type"] === "SoftwareSourceCode",
      ),
    );
}
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
  decode(match[1]),
);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URL");
assert.deepEqual(
  urls.sort(),
  (config.indexable
    ? routes.map((route) => new URL(route, config.site).href)
    : []
  ).sort(),
  "Sitemap must contain exactly the indexable canonical pages",
);
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
assert.ok(
  !/^Disallow:\s*\/\s*$/m.test(robots),
  "Do not prevent crawlers from reading page-level indexing rules",
);
assert.equal(
  robots.includes(`Sitemap: ${config.site.origin}/sitemap.xml`),
  config.indexable,
);
const redirects = await readFile(path.join(root, "_redirects"), "utf8");
assert.match(redirects, /\/docs\/\s+\/docs\/v5\/\s+301/);
const image = await readFile(path.join(root, "og-image.png"));
assert.equal(image.subarray(1, 4).toString(), "PNG");
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);

const favicon = await readFile(path.join(root, "favicon.png"));
assert.equal(favicon.readUInt32BE(16), 96);
assert.equal(favicon.readUInt32BE(20), 96);

console.log(
  `SEO audit passed: ${titles.size} content pages; ${urls.length} canonical sitemap URLs; ${config.indexable ? "indexable production" : "noindex preview"} (${config.site.origin}).`,
);
