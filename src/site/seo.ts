import { escapeHTML as e } from "./content.ts";

export const OFFICIAL_ORIGIN = "https://copytygo.org";
export type SeoConfig = { site: URL; indexable: boolean };
export type SeoPage = SeoConfig & {
  title: string;
  description: string;
  route: string;
  home?: boolean;
  noindex?: boolean;
};
export function resolveSeoConfig(
  env: Record<string, string | undefined> = process.env,
  development = false,
): SeoConfig {
  const site = new URL(env.SITE_URL || OFFICIAL_ORIGIN);
  if (
    !["http:", "https:"].includes(site.protocol) ||
    site.username ||
    site.password ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  )
    throw new Error(
      "SITE_URL must be an HTTP(S) origin without credentials, paths, queries or fragments.",
    );
  if (env.SITE_INDEXABLE && !["true", "false"].includes(env.SITE_INDEXABLE))
    throw new Error("SITE_INDEXABLE must be true or false.");
  if (env.SITE_INDEXABLE === "true" && site.origin !== OFFICIAL_ORIGIN)
    throw new Error(`Indexable builds must use ${OFFICIAL_ORIGIN}.`);
  const cloudflarePreview = Boolean(
    env.CF_PAGES_BRANCH &&
    env.CF_PAGES_BRANCH !== (env.SITE_PRODUCTION_BRANCH || "main"),
  );
  return {
    site,
    indexable:
      !development &&
      !cloudflarePreview &&
      env.SITE_INDEXABLE !== "false" &&
      site.origin === OFFICIAL_ORIGIN,
  };
}
export function breadcrumbs(page: Pick<SeoPage, "route" | "title">) {
  const items = [{ name: "Home", route: "/" }];
  if (page.route === "/") return items;
  if (page.route.startsWith("/docs/v5/"))
    items.push({ name: "CopyTyGo v5 Documentation", route: "/docs/v5/" });
  if (page.route !== "/docs/v5/")
    items.push({ name: page.title, route: page.route });
  return items;
}
export function breadcrumbHTML(page: Pick<SeoPage, "route" | "title">) {
  const items = breadcrumbs(page);
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items.map((item, index) => (index === items.length - 1 ? `<span aria-current="page">${e(item.name)}</span>` : `<a href="${item.route}">${e(item.name)}</a><span aria-hidden="true"> / </span>`)).join("")}</nav>`;
}
export function pageTitle(page: Pick<SeoPage, "title" | "route" | "home">) {
  return page.home
    ? "CopyTyGo — Full-Stack Go & TypeScript Framework"
    : `${page.title} | CopyTyGo${page.route.startsWith("/docs/v5/") ? " Docs" : ""}`;
}
export function structuredData(page: SeoPage) {
  const origin = page.site.origin,
    canonical = new URL(page.route, page.site).href;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: "CopyTyGo",
      alternateName: "CopyTyGo Framework",
      url: `${origin}/`,
      inLanguage: "en",
    },
    {
      "@type": page.route.startsWith("/docs/v5/") ? "TechArticle" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      headline: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
    },
  ];
  if (page.home)
    graph.push({
      "@type": "SoftwareSourceCode",
      "@id": `${origin}/#framework`,
      name: "CopyTyGo",
      description:
        "A full-stack framework combining Go backend development with TypeScript frontend workflows.",
      url: `${origin}/`,
      codeRepository: "https://github.com/arfajhf/copytygo",
      programmingLanguage: ["Go", "TypeScript"],
      version: "5.0.0",
    });
  else if (!page.noindex)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumbs`,
      itemListElement: breadcrumbs(page).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: new URL(item.route, page.site).href,
      })),
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
export function seoHead(page: SeoPage) {
  const title = pageTitle(page),
    canonical = new URL(page.route, page.site).href,
    image = new URL("/og-image.png", page.site).href;
  const robots =
    !page.indexable || page.noindex
      ? "noindex, follow"
      : "index, follow, max-image-preview:large";
  const json = JSON.stringify(structuredData(page)).replace(/</g, "\\u003c");
  return `<title>${e(title)}</title>
<meta name="description" content="${e(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${e(canonical)}">
<meta name="theme-color" content="#101517">
<meta property="og:site_name" content="CopyTyGo">
<meta property="og:type" content="${page.route.startsWith("/docs/v5/") ? "article" : "website"}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(page.description)}">
<meta property="og:url" content="${e(canonical)}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="CopyTyGo — full-stack Go and TypeScript framework">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(page.description)}">
<meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="CopyTyGo — full-stack Go and TypeScript framework">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png"><script type="application/ld+json">${json}</script>`;
}
