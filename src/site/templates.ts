import { seoHead, breadcrumbHTML } from "./seo.ts";
import { escapeHTML as e, navigation, type Heading } from "./content.ts";
import releases from "../data/releases.json" with { type: "json" };

type View = {
  title: string;
  description: string;
  route: string;
  body: string;
  headings?: Heading[];
  home?: boolean;
  noindex?: boolean;
  site: URL;
  indexable: boolean;
};
const github = "https://github.com/arfajhf/copytygo";
const link = (name: string, url: string, current: string) =>
  `<a href="${url}"${url === current ? ' aria-current="page"' : ""}>${e(name)}</a>`;
export function shell(view: View) {
  const sidebar = navigation
    .map(
      (group) =>
        `<section><h2>${group.title}</h2>${group.pages.map(([name, url]) => link(name, url, view.route)).join("")}</section>`,
    )
    .join("");
  const toc = (view.headings ?? [])
    .filter((h) => h.depth === 2)
    .map((h) => `<a href="#${h.id}">${e(h.text)}</a>`)
    .join("");
  const order = navigation.flatMap((g) => g.pages);
  const index = order.findIndex((p) => p[1] === view.route);
  const previous = order[index - 1],
    next = order[index + 1];
  const pager =
    index < 0
      ? ""
      : `<nav class="pager" aria-label="Documentation pages">${previous ? `<a href="${previous[1]}"><small>Previous</small>${e(previous[0])} ←</a>` : "<span></span>"}${next ? `<a href="${next[1]}"><small>Next</small>${e(next[0])} →</a>` : ""}</nav>`;
  return `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${seoHead(view)}<script>try{const t=localStorage.getItem('ctg-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}catch{}</script><script type="module" src="/client.ts"></script></head>
<body class="${view.home ? "home" : "documentation"}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand" href="/"><img src="/logo.png" alt="" width="36" height="36"><span>CopyTyGo</span></a><nav class="top-nav" aria-label="Main navigation">${link("Documentation", "/docs/v5/", view.route)}${link("Examples", "/examples/", view.route)}${link("Releases", "/releases/", view.route)}</nav><div class="header-actions"><button class="search-trigger" data-search-open aria-label="Search documentation"><span aria-hidden="true">⌕</span><span class="search-label">Search documentation</span><kbd>Ctrl K</kbd></button><details class="versions"><summary aria-label="Select documentation version">${e(releases.recommended || "v5")} <span aria-hidden="true">⌄</span></summary><div class="version-panel"><strong>Documentation version</strong><a href="/docs/v5/">v5 · v5.0.0</a><a href="/releases/">All releases ↗</a><small>GitHub recommendation: ${e(releases.recommended || "not available")}</small></div></details><button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">◐</button>${view.home ? "" : `<button class="menu-toggle" aria-label="Open documentation menu" aria-expanded="false" aria-controls="sidebar">☰</button>`}</div></header>
${view.home ? `<main id="main" class="landing" tabindex="-1">${view.body}</main>` : `<div class="docs-layout"><aside class="sidebar" id="sidebar" aria-label="Documentation navigation">${sidebar}<a class="sidebar-github" href="${github}">GitHub ↗</a></aside><main id="main" class="article-wrap" tabindex="-1">${breadcrumbHTML(view)}<article class="prose"><h1>${e(view.title)}</h1>${view.body}</article>${pager}</main><aside class="toc" aria-label="On this page"><h2>On this page</h2>${toc || '<a href="#main">Overview</a>'}</aside></div>`}
<footer class="site-footer"><a class="brand" href="/"><img src="/logo.png" alt="" width="26" height="26">CopyTyGo</a><p>Go + TypeScript. Documentation v5.0.0.</p><nav aria-label="Footer links"><a href="/docs/v5/installation/">Getting Started</a><a href="/changelog/">Changelog</a><a href="${github}">GitHub ↗</a></nav></footer>
<dialog class="search-dialog" aria-labelledby="search-title"><div class="search-dialog-head"><h2 id="search-title">Search documentation</h2><button data-search-close aria-label="Close search">✕</button></div><label class="sr-only" for="search-input">Search terms</label><input id="search-input" type="search" placeholder="Search CLI, authentication, database…" autocomplete="off"><p id="search-status" role="status" aria-live="polite">Type to search the documentation.</p><ul id="search-results" aria-label="Search results"></ul></dialog></body></html>`;
}
export function releaseContent() {
  return `<p>Recommended version: <strong>${e(releases.recommended || "Not available")}</strong>. GitHub snapshot checked on <time>${e(releases.checkedAt)}</time>.</p><p>Drafts, prereleases, and internal v4 milestones are excluded from public recommendations. Metadata is saved at build time, so visitors do not need to make GitHub requests.</p><h2 id="release-history">Release history</h2><div class="table-scroll"><table><thead><tr><th>Version</th><th>Status</th><th>Published (UTC)</th><th>Source</th></tr></thead><tbody>${releases.releases.map((r) => `<tr><td>${e(r.tag)}</td><td>${r.prerelease ? "Prerelease" : r.tag.startsWith("v4.") ? "Historical / prelaunch" : "Published"}</td><td>${e(r.publishedAt?.slice(0, 10) || "—")}</td><td><a href="${e(r.url)}">GitHub Release ↗</a></td></tr>`).join("")}</tbody></table></div><h2 id="versioned-documentation">Versioned documentation</h2><p><a href="/docs/v5/">v5 · Documentation</a> · <a href="/changelog/">Upstream changelog</a></p><p>Content and installation commands are pinned to v5.0.0. Update recommendation metadata with <code>npm run releases:sync</code>; review the content against the new tag before changing the default installation instructions. This website does not yet include v4 documentation.</p>`;
}
export function landingContent(
  code: (text: string, lang: string, label: string) => string,
) {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">GO + TYPESCRIPT FRAMEWORK · V5.0.0</p><h1>Go further.<br><span>Build together.</span></h1><p class="hero-description">CopyTyGo brings your Go backend and TypeScript frontend together with a CLI, authentication, database tools, and a local development Studio.</p><div class="hero-buttons"><a class="button primary" href="/docs/v5/installation/">Start building <span aria-hidden="true">→</span></a><a class="button secondary" href="${github}">Explore GitHub ↗</a></div><p class="requirements">Go 1.27.1+ <span>·</span> Node.js 22+ for frontend development</p></div><div class="hero-art"><div class="logo-orbit"><img src="/logo.png" alt="Original CopyTyGo logo" width="350" height="328" fetchpriority="high" decoding="async"></div><span class="art-label">GO + TYPESCRIPT / BUILT TO CONNECT</span></div></section>
<section class="workflow"><div><p class="eyebrow">FROM TERMINAL TO APPLICATION</p><h2>Start simple.<br>Keep building.</h2><p>The <code>ctg</code> CLI connects your backend, frontend, and development tools. Choose your stack and start building features.</p><a class="text-link" href="/docs/v5/getting-started/">Follow Getting Started →</a></div><div>${code("go install github.com/arfajhf/copytygo/v5/cmd/ctg@v5.0.0\nctg new online-store\ncd online-store\nctg dev", "bash", "Terminal · quick start")}</div></section>
<section class="capabilities" aria-labelledby="features-title"><p class="eyebrow">ONE FRAMEWORK. CONNECTED PARTS.</p><h2 id="features-title">Focus on your application.</h2><div class="feature-grid"><article><span class="number">01 / FOUNDATION</span><h3>Go at the core.</h3><p>Routing, middleware, a service container, MySQL, and PostgreSQL. A backend you can understand.</p><a href="/docs/v5/database/">Explore the backend ↗</a></article><article><span class="number">02 / WORKFLOW</span><h3>Less repetitive work.</h3><p>Generators for resources, migrations, models, and jobs. Choose TypeScript, React, Vue, or API-only.</p><a href="/docs/v5/cli/">Meet the CLI ↗</a></article><article><span class="number">03 / VISIBILITY</span><h3>See inside with Studio.</h3><p>Inspect routes, databases, queues, schedules, and health from your local development workspace.</p><a href="/docs/v5/studio/">Explore Studio ↗</a></article></div></section>
<section class="workflow resource-workflow"><div><p class="eyebrow">BUILT FOR REAL WORKFLOWS</p><h2>Define your data.<br>Build your features.</h2><p>Generate models, controllers, migrations, validation, and REST routes. Resources are private by default, with explicit access rules.</p><a class="text-link" href="/docs/v5/resource-generator/">Explore the resource generator →</a></div><div>${code("ctg make:resource Product name:string price:decimal stock:integer active:boolean\nctg migrate\nctg route:list", "bash", "CLI · resource generator")}${code('scheduler.Default.Hourly("reports", func(ctx context.Context) error {\n    return nil\n})', "go", "Go · scheduler registration (excerpt)")}</div></section>
<section class="closing"><p class="eyebrow">V5 DOCUMENTATION</p><h2>Your next step starts here.</h2><p>From your first installation to authentication, background jobs, and application deployment.</p><div><a class="button primary" href="/docs/v5/getting-started/">Getting Started →</a><a class="text-link" href="/examples/">Browse examples ↗</a></div></section>`;
}
