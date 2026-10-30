import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveSeoConfig,
  seoHead,
  structuredData,
  breadcrumbs,
  OFFICIAL_ORIGIN,
} from "../src/site/seo.ts";

test("official production origin is indexable; dev, staging and Cloudflare previews are not", () => {
  assert.equal(resolveSeoConfig({}).site.origin, OFFICIAL_ORIGIN);
  assert.equal(resolveSeoConfig({}).indexable, true);
  assert.equal(resolveSeoConfig({}, true).indexable, false);
  assert.equal(resolveSeoConfig({ SITE_INDEXABLE: "false" }).indexable, false);
  assert.equal(
    resolveSeoConfig({ SITE_URL: "http://localhost:4321" }).indexable,
    false,
  );
  assert.equal(
    resolveSeoConfig({ SITE_URL: "https://preview.example.com" }).indexable,
    false,
  );
  assert.equal(
    resolveSeoConfig({ CF_PAGES_BRANCH: "feature/seo", SITE_INDEXABLE: "true" })
      .indexable,
    false,
  );
  assert.equal(resolveSeoConfig({ CF_PAGES_BRANCH: "main" }).indexable, true);
  assert.equal(
    resolveSeoConfig({
      CF_PAGES_BRANCH: "production",
      SITE_PRODUCTION_BRANCH: "production",
    }).indexable,
    true,
  );
});
test("canonical config rejects unsafe or ambiguous origins and indexing overrides", () => {
  for (const SITE_URL of [
    "javascript:alert(1)",
    "https://user:secret@copytygo.org",
    "https://copytygo.org/subpath",
    "https://copytygo.org/?tracking=1",
    "https://copytygo.org/#section",
  ])
    assert.throws(() => resolveSeoConfig({ SITE_URL }));
  assert.throws(() =>
    resolveSeoConfig({
      SITE_URL: "https://preview.example.com",
      SITE_INDEXABLE: "true",
    }),
  );
  assert.throws(() => resolveSeoConfig({ SITE_INDEXABLE: "yes" }));
});
test("article breadcrumbs follow visible hierarchy and JSON-LD is safe in HTML", () => {
  const page = {
    ...resolveSeoConfig({}),
    route: "/docs/v5/installation/",
    title: "Installation",
    description: "Install the Go and TypeScript framework.",
  };
  assert.deepEqual(
    breadcrumbs(page).map((item) => item.route),
    ["/", "/docs/v5/", "/docs/v5/installation/"],
  );
  const data = structuredData(page);
  const crumbs = data["@graph"].find(
    (item) => item["@type"] === "BreadcrumbList",
  );
  assert.equal(
    crumbs.itemListElement.at(-1).item,
    "https://copytygo.org/docs/v5/installation/",
  );
  const head = seoHead({
    ...page,
    title: "A </script><script>alert(1)</script>",
  });
  assert.equal((head.match(/<script/g) || []).length, 1);
  assert.ok(head.includes("\\u003c/script>"));
  assert.match(seoHead({ ...page, noindex: true }), /noindex, follow/);
  assert.match(seoHead({ ...page, indexable: false }), /noindex, follow/);
  assert.match(seoHead(page), /summary_large_image/);
});
