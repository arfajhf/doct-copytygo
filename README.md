# CopyTyGo documentation website

The **Vite + TypeScript** documentation website, maintained separately from the CopyTyGo framework. Markdown is rendered into static HTML before Vite bundles CSS and JavaScript. No Astro, Starlight, or Go server is required.

All public content, navigation, metadata, accessibility labels, and interaction messages are in **English**. Keep new contributions in English for the international developer audience.

## Requirements

- Node.js **20.19+ or 22.12+**. Node **22.23.1** is supported and tested in CI.
- npm; use `npm ci` to install the versions recorded in the lockfile.

## Development

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:4321`. Changes to Markdown, release metadata, and public assets regenerate HTML and reload the page. Restart the development server after editing the generator or configuration.

```bash
npm run build
npm test
node scripts/check-links.mjs
npm run preview
```

Production output is written to **`dist/`**. Articles, navigation, headings, and metadata are present in the HTML and remain readable without JavaScript. JavaScript adds local search, code copying, theme switching, and mobile navigation.

## Project structure

```text
src/content/docs/       Markdown articles with title/description metadata
src/data/releases.json GitHub Releases snapshot
src/site/               HTML layouts, landing page, navigation, metadata
src/client/             TypeScript interactions and search ranking
src/styles/site.css     Themes and responsive layouts
scripts/generate.ts     Markdown → HTML, highlighting, search index, SEO
vite.config.ts          Multipage build and content reload
public/                 Original logo and static assets
.generated/             Generated pages (ignored by Git)
dist/                   Production output (ignored by Git)
```

`npm run dev` and `npm run build` run the generator automatically. No additional setup command is needed. Articles use `.md`, not MDX. Add articles under `src/content/docs/` and navigation entries in `src/site/content.ts`. Headings generate permalinks, and Go/TypeScript code blocks use Shiki with copy buttons. Search runs locally in both development and production without an external service.

## Production URL and SEO

Set **`SITE_URL`** to the official HTTPS origin when building, for example through your hosting environment variables. The development default is `http://localhost:4321`; change it before publication. The generator creates canonical URLs, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, and `404.html`. HTML documents declare `lang="en"`.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `22.23.1` or a newer compatible version
- Environment: `SITE_URL` = the official origin

No adapter or server runtime is required. `/docs/` contains an HTML redirect to `/docs/v5/`.

## VPS / Nginx

Copy the contents of `dist/` to the document root. Use directory URLs for documentation pages:

```nginx
location = /docs { return 301 /docs/v5/; }
location = /docs/ { return 301 /docs/v5/; }
location / { try_files $uri $uri/ =404; }
error_page 404 /404.html;
```

Do not add an SPA fallback to `/index.html`: this is a multipage website with an HTML file for each route.

## Releases and content sources

Framework baseline: `arfajhf/copytygo`, tag **v5.0.0**, commit `203ce2554bb99fe41000c368a0213c22ec587711`. The original logo comes from `branding/logo.png`. Authentication, resource security, deployment, and changelog pages preserve upstream text. Other guides are English summaries with references pinned to the source.

```bash
npm run releases:sync
```

This command fetches GitHub Releases, excluding drafts, prereleases, and internal v4 milestones from recommendations. The optional `GITHUB_TOKEN` is used only by the Node script; never place it in `VITE_*` environment variables. Review and commit the snapshot. Visitors do not need a token or GitHub access.

Recommendation metadata may change independently of pinned installation commands. Review new release content before updating commands and the `/docs/` alias. Preserve older major-version URLs when adding `/docs/vN/`.

Framework examples have not been executed against Go and a database by this website. Website changes do not modify framework source or expand the documented v5 capabilities.
