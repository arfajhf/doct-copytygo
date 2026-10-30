# Launch SEO: copytygo.org

The official canonical origin is **https://copytygo.org**. Production builds use it by default; page URLs, structured data, social metadata and the sitemap share one configuration in `src/site/seo.ts`.

## Production build

```bash
npm ci
npm run build
npm run seo:check
npm test
node scripts/check-links.mjs
```

`seo:check` fails if a build is not indexable for the official domain. The normal build also audits canonical URLs, unique page titles/descriptions, English language metadata, visible H1 headings, JSON-LD, sitemap membership, social image dimensions, a square 96 × 96 favicon and indexing rules. This checks the generated artifact; it does not verify DNS, TLS, HTTP headers at a deployed server, Google indexing or ranking.

## Preview builds

Local development always uses `noindex, follow`. Development HTML (`.generated/dev/`) and production HTML (`.generated/build/`) are generated separately so a running dev server cannot overwrite a launch build’s indexing metadata. For an unpublished hosting preview, set `SITE_INDEXABLE=false` when building. Non-official `SITE_URL` origins and Cloudflare branches other than `main` also default to noindex. If your Cloudflare production branch differs, set `SITE_PRODUCTION_BRANCH` accordingly. Preview sitemaps contain no URLs and robots.txt does not advertise them. Crawling remains allowed so search engines can read the noindex instruction. This is not access control for private content.

Do not publish a preview artifact to the production domain: rebuild with the production settings above. Do not add a blanket `Disallow: /` to production robots.txt or leave a noindex header on the production server.

## Cloudflare Pages

Use `npm run build` and publish `dist/`. Set the custom domain to `copytygo.org` and redirect alternate public origins to it using your Cloudflare redirect settings, preserving the path and query. Verify that the custom domain has a valid certificate. `_redirects` handles the `/docs` alias and explicit `index.html` URLs; `_headers` caches only content-hashed assets for a year.

## Nginx

Set `server_name copytygo.org` on the HTTPS server. Configure HTTP and `www.copytygo.org` to redirect permanently to the corresponding URL on `https://copytygo.org`; TLS certificates and DNS must cover any HTTPS alternate hostname. The application does not configure your server or certificates.

```nginx
location = /docs { return 301 /docs/v5/; }
location = /docs/ { return 301 /docs/v5/; }
location / { try_files $uri $uri/ =404; }
location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
error_page 404 /404.html;
```

Keep the real 404 status on missing URLs; do not rewrite missing pages to the homepage with HTTP 200. Serve HTML and the search index with revalidation rather than long immutable caching. Cloudflare `_headers` and `_redirects` files are not interpreted by Nginx.

## After the domain is live

1. Inspect `/`, a documentation page, `/robots.txt`, `/sitemap.xml` and a deliberately missing URL. Confirm HTTPS, correct response statuses, canonical URLs, and absence of noindex on real content.
2. Verify ownership of `copytygo.org` in Google Search Console using your own account/DNS access. Submit `https://copytygo.org/sitemap.xml` and inspect the homepage and installation guide. No account access or submissions are performed by this repository.
3. Validate the homepage and an article in Google's Rich Results Test and Schema.org Validator. WebSite, SoftwareSourceCode, TechArticle and BreadcrumbList describe observed content; there are no fabricated ratings, endorsements, prices, dates or authors. Structured data does not guarantee rich results.
4. Check social sharing previews against `https://copytygo.org/og-image.png` (1200 × 630). Re-scrape cached cards after changes when the sharing platform supports it.
5. Measure the deployed site using PageSpeed Insights and real mobile devices. The build does not claim a Lighthouse score or passing Core Web Vitals without live measurements.
6. Monitor crawl/indexing errors and search queries in Search Console. Improve guides and examples based on actual developer questions. Keep commands and release metadata aligned with reviewed framework source.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [site names](https://developers.google.com/search/docs/appearance/site-names), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
