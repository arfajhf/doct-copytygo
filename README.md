# CopyTyGo documentation website

Standalone Astro + TypeScript + Starlight project. Framework source is not modified.

## Development

Node.js 22.23.4+ required (Astro 7 runtime requirement).

```bash
npm ci
npm run dev
npm test
npm run build
node scripts/check-links.mjs
```

## Production URL and SEO

Set `SITE_URL` to the real HTTPS origin before building. Without it the project intentionally uses localhost and is not ready for public indexing. Astro generates canonical URLs, Open Graph metadata and the sitemap. Starlight provides static Pagefind search, mobile navigation, theme selection, accessible landmarks, syntax highlighting and copy buttons.

## Cloudflare Pages

Build command: `npm run build`; output: `dist`; Node version: 22. Set `SITE_URL` to the production origin. No adapter or server runtime required.

## VPS / Nginx

Build locally or in CI and copy the contents of `dist/` to the web root. Example server location:

```nginx
location / {
    try_files $uri $uri/ =404;
}
error_page 404 /404.html;
```

Astro's `/docs` redirect includes a static redirect page; on Nginx optionally add `location = /docs { return 301 /docs/v5/; }` and `location = /docs/ { return 301 /docs/v5/; }`.

## Content and release maintenance

Source baseline: `arfajhf/copytygo` tag `v5.0.0`, commit `203ce2554bb99fe41000c368a0213c22ec587711`. Original logo copied byte-for-byte from `branding/logo.png`. Authentication, resource security, production guide, and changelog retain upstream wording; other guides are Indonesian summaries with pinned source references. Confirm upstream permissions/licensing before public distribution; no license is invented here.

Run `npm run releases:sync` to fetch GitHub Releases. Optional `GITHUB_TOKEN` increases API rate limits; never expose it to client bundles. Review updated metadata and source changes before committing. No scheduler is installed. Drafts, prereleases and internal v4 releases are excluded from public recommendations. The metadata recommendation is independent of version-pinned installation examples: update and review those examples intentionally when documenting another release. Future major docs must have their own `/docs/vN/` content and selector links before changing `/docs`.

The default docs alias is currently `/docs/v5/`. Search runs on production builds (`npm run preview`), not the Astro dev server. The website has not executed framework Go/database examples; those require the stated Go toolchain and database.

## Repository

This folder is intended as a separate Git repository. Create a remote repository such as `copytygo-docs`, push this project, and open a PR only after checks pass. Do not push these files to the framework repository.
