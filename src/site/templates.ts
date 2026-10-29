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
};
const github = "https://github.com/arfajhf/copytygo";
const link = (name: string, url: string, current: string) =>
  `<a href="${url}"${url === current ? ' aria-current="page"' : ""}>${e(name)}</a>`;
export function shell(view: View) {
  const canonical = new URL(view.route, view.site).href;
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
      : `<nav class="pager" aria-label="Halaman dokumentasi">${previous ? `<a href="${previous[1]}"><small>Sebelumnya</small>${e(previous[0])} ←</a>` : "<span></span>"}${next ? `<a href="${next[1]}"><small>Selanjutnya</small>${e(next[0])} →</a>` : ""}</nav>`;
  return `<!doctype html><html lang="id" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(view.title)} | CopyTyGo</title><meta name="description" content="${e(view.description)}"><link rel="canonical" href="${e(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${e(view.title)} | CopyTyGo"><meta property="og:description" content="${e(view.description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${new URL("/logo.png", view.site).href}"><meta name="twitter:card" content="summary"><link rel="icon" href="/logo.png">${view.noindex ? '<meta name="robots" content="noindex">' : ""}<script>try{const t=localStorage.getItem('ctg-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}catch{}</script><script type="module" src="/client.ts"></script></head>
<body class="${view.home ? "home" : "documentation"}"><a class="skip-link" href="#main">Lewati ke konten</a>
<header class="site-header"><a class="brand" href="/"><img src="/logo.png" alt="" width="36" height="36"><span>CopyTyGo</span></a><nav class="top-nav" aria-label="Navigasi utama">${link("Dokumentasi", "/docs/v5/", view.route)}${link("Examples", "/examples/", view.route)}${link("Releases", "/releases/", view.route)}</nav><div class="header-actions"><button class="search-trigger" data-search-open aria-label="Cari dokumentasi"><span aria-hidden="true">⌕</span><span class="search-label">Cari dokumentasi</span><kbd>Ctrl K</kbd></button><details class="versions"><summary aria-label="Pilih versi dokumentasi">${e(releases.recommended || "v5")} <span aria-hidden="true">⌄</span></summary><div class="version-panel"><strong>Versi dokumentasi</strong><a href="/docs/v5/">v5 · v5.0.0</a><a href="/releases/">Semua rilis ↗</a><small>Rekomendasi GitHub: ${e(releases.recommended || "belum tersedia")}</small></div></details><button class="theme-toggle" aria-label="Ganti tema" title="Ganti tema">◐</button>${view.home ? "" : `<button class="menu-toggle" aria-label="Buka menu dokumentasi" aria-expanded="false" aria-controls="sidebar">☰</button>`}</div></header>
${view.home ? `<main id="main" class="landing" tabindex="-1">${view.body}</main>` : `<div class="docs-layout"><aside class="sidebar" id="sidebar" aria-label="Navigasi dokumentasi">${sidebar}<a class="sidebar-github" href="${github}">GitHub ↗</a></aside><main id="main" class="article-wrap" tabindex="-1"><div class="breadcrumb"><a href="/docs/v5/">CopyTyGo v5</a><span aria-hidden="true"> / </span>${e(view.title)}</div><article class="prose"><h1>${e(view.title)}</h1>${view.body}</article>${pager}</main><aside class="toc" aria-label="Di halaman ini"><h2>Di halaman ini</h2>${toc || '<a href="#main">Ringkasan</a>'}</aside></div>`}
<footer class="site-footer"><a class="brand" href="/"><img src="/logo.png" alt="" width="26" height="26">CopyTyGo</a><p>Go + TypeScript. Dokumentasi v5.0.0.</p><nav aria-label="Tautan footer"><a href="/docs/v5/installation/">Getting Started</a><a href="/changelog/">Changelog</a><a href="${github}">GitHub ↗</a></nav></footer>
<dialog class="search-dialog" aria-labelledby="search-title"><div class="search-dialog-head"><h2 id="search-title">Cari dokumentasi</h2><button data-search-close aria-label="Tutup pencarian">✕</button></div><label class="sr-only" for="search-input">Kata pencarian</label><input id="search-input" type="search" placeholder="Cari CLI, authentication, database…" autocomplete="off"><p id="search-status" role="status" aria-live="polite">Ketik untuk mencari dokumentasi.</p><ul id="search-results" aria-label="Hasil pencarian"></ul></dialog></body></html>`;
}
export function releaseContent() {
  return `<p>Versi rekomendasi: <strong>${e(releases.recommended || "Belum tersedia")}</strong>. Snapshot GitHub diperiksa pada <time>${e(releases.checkedAt)}</time>.</p><p>Versi draft, prerelease, dan milestone internal v4 tidak dijadikan rekomendasi publik. Metadata disimpan saat build agar halaman dapat digunakan tanpa request GitHub dari browser.</p><h2 id="riwayat-rilis">Riwayat rilis</h2><div class="table-scroll"><table><thead><tr><th>Versi</th><th>Status</th><th>Publikasi (UTC)</th><th>Sumber</th></tr></thead><tbody>${releases.releases.map((r) => `<tr><td>${e(r.tag)}</td><td>${r.prerelease ? "Prerelease" : r.tag.startsWith("v4.") ? "Historis / prapeluncuran" : "Published"}</td><td>${e(r.publishedAt?.slice(0, 10) || "—")}</td><td><a href="${e(r.url)}">GitHub Release ↗</a></td></tr>`).join("")}</tbody></table></div><h2 id="dokumentasi-versi">Dokumentasi versi</h2><p><a href="/docs/v5/">v5 · Dokumentasi</a> · <a href="/changelog/">Changelog upstream</a></p><p>Konten dan command instalasi dipin ke v5.0.0. Metadata rekomendasi dapat diperbarui melalui <code>npm run releases:sync</code>; konten harus direview terhadap tag baru sebelum instalasi default diubah. Belum ada dokumentasi v4 di website ini.</p>`;
}
export function landingContent(
  code: (text: string, lang: string, label: string) => string,
) {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">FULL-STACK FRAMEWORK · V5.0.0</p><h1>Go further.<br><span>Build together.</span></h1><p class="hero-description">Backend Go. Frontend TypeScript. Satu alur kerja untuk mengubah ide menjadi aplikasi.</p><div class="hero-buttons"><a class="button primary" href="/docs/v5/installation/">Mulai membangun <span aria-hidden="true">→</span></a><a class="button secondary" href="${github}">Jelajahi GitHub ↗</a></div><p class="requirements">Go 1.27.1+ <span>·</span> Node.js 22+ untuk frontend</p></div><div class="hero-art"><div class="logo-orbit"><img src="/logo.png" alt="Logo asli CopyTyGo" width="350" height="328"></div><span class="art-label">GO + TYPESCRIPT / BUILT TO CONNECT</span></div></section>
<section class="workflow"><div><p class="eyebrow">DARI TERMINAL KE APLIKASI</p><h2>Mulai sederhana.<br>Terus kembangkan.</h2><p>CLI <code>ctg</code> menghubungkan backend, frontend, dan tooling pengembangan. Pilih stack Anda, lalu mulai menulis fitur.</p><a class="text-link" href="/docs/v5/getting-started/">Ikuti Getting Started →</a></div><div>${code("go install github.com/arfajhf/copytygo/v5/cmd/ctg@v5.0.0\nctg new toko-online\ncd toko-online\nctg dev", "bash", "Terminal · quick start")}</div></section>
<section class="capabilities" aria-labelledby="features-title"><p class="eyebrow">SATU FRAMEWORK. BAGIAN YANG TERHUBUNG.</p><h2 id="features-title">Fokus ke aplikasi Anda.</h2><div class="feature-grid"><article><span class="number">01 / FOUNDATION</span><h3>Go di pusat aplikasi.</h3><p>Routing, middleware, service container, serta MySQL dan PostgreSQL. Backend yang bisa Anda telusuri.</p><a href="/docs/v5/database/">Jelajahi backend ↗</a></article><article><span class="number">02 / WORKFLOW</span><h3>Kurangi pekerjaan berulang.</h3><p>Generator untuk resource, migration, model, dan job. Pilih TypeScript, React, Vue, atau API-only.</p><a href="/docs/v5/cli/">Kenali CLI ↗</a></article><article><span class="number">03 / VISIBILITY</span><h3>Lihat dari dalam Studio.</h3><p>Inspeksi routes, database, queue, scheduler, dan health dari workspace pengembangan lokal.</p><a href="/docs/v5/studio/">Jelajahi Studio ↗</a></article></div></section>
<section class="workflow resource-workflow"><div><p class="eyebrow">DIBUAT UNTUK ALUR KERJA NYATA</p><h2>Definisikan data.<br>Bangun fiturnya.</h2><p>Hasilkan model, controller, migration, validation, dan REST routes. Resource privat secara default, dengan aturan akses eksplisit.</p><a class="text-link" href="/docs/v5/resource-generator/">Pelajari resource generator →</a></div><div>${code("ctg make:resource Product name:string price:decimal stock:integer active:boolean\nctg migrate\nctg route:list", "bash", "CLI · resource generator")}${code('scheduler.Default.Hourly("reports", func(ctx context.Context) error {\n    return nil\n})', "go", "Go · registrasi scheduler (cuplikan)")}</div></section>
<section class="closing"><p class="eyebrow">DOKUMENTASI V5</p><h2>Langkah berikutnya ada di sini.</h2><p>Dari instalasi pertama hingga auth, background jobs, dan deployment aplikasi.</p><div><a class="button primary" href="/docs/v5/getting-started/">Getting Started →</a><a class="text-link" href="/examples/">Lihat Examples ↗</a></div></section>`;
}
