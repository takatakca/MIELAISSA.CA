import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  allowedPage,
  allowedAsset,
  discoverHtml,
  discoverCss,
  fetchPublic,
  captureReference,
} from "../../scripts/node/reference-assets.mjs";
const base = "https://mielaissa.ca";
test("theme discovery keeps styles, lazy pictures, srcsets, fonts and background URLs", () => {
  const found = discoverHtml(
    `<html><head><link rel="stylesheet" href="/wp-content/themes/shop/main.css?ver=1.2"><link rel="preload" as="font" href="/wp-content/fonts/shop.woff2"><link rel="canonical" href="https://example.test/"></head><body style="background:url('/wp-content/uploads/hero.jpg')"><a href="/ca-en/honeys/">shop</a><a href="/cart/?add-to-cart=3">no</a><script src="/wp-includes/js/jquery.js?ver=3.7"></script><img src="/wp-content/uploads/logo.png" data-src="/wp-content/uploads/large.webp" srcset="/wp-content/uploads/small.jpg 400w, /wp-content/uploads/large.jpg 1200w"><picture><source data-srcset="/wp-content/uploads/fallback.avif 800w"></picture><style>@import '/wp-content/themes/shop/extra.css';</style></body></html>`,
    base + "/",
  );
  assert.deepEqual(found.pages, [base + "/ca-en/honeys/"]);
  assert.equal(found.assets.length, 10);
  assert.equal(found.unresolved.length, 0);
  assert.ok(found.assets.includes(base + "/wp-content/uploads/hero.jpg"));
  assert.ok(found.assets.includes(base + "/wp-content/themes/shop/extra.css"));
});
test("CSS import and relative font/image dependencies are found with fragments stripped", () => {
  const found = discoverCss(
    `@import url("./parts.css") screen; @import '../shared.css'; @font-face{src:url('../fonts/brand.woff2?#iefix') format('woff2')} .x{background: url(../img/bg.webp),url(data:image/png;base64,AAAA)}`,
    base + "/wp-content/themes/shop/css/main.css?ver=1",
  );
  assert.equal(found.length, 4);
  assert.ok(found.includes(base + "/wp-content/themes/shop/fonts/brand.woff2"));
  assert.ok(found.includes(base + "/wp-content/themes/shop/css/parts.css"));
  assert.ok(found.includes(base + "/wp-content/themes/shop/shared.css"));
});
test("asset authorization refuses credentials, foreign hosts, private routes and unrecognized query keys", () => {
  for (const url of [
    "https://user:secret@mielaissa.ca/wp-content/a.css",
    base + "/wp-content/a.css?token=abc",
    base + "/wp-content/a.css?ver=1&nonce=x",
    base + "/wp-admin/a.css",
    "https://foreign.test/wp-content/a.css",
  ])
    assert.equal(allowedAsset(url), false, url);
  assert.equal(allowedAsset(base + "/wp-content/a.css?ver=6.0"), true);
  assert.equal(allowedPage(base + "/wp%2dadmin/"), false);
  assert.equal(allowedPage(base + "/wp-content/a.css"), false);
  const found = discoverHtml(
    '<link rel="stylesheet" href="https://foreign.test/a.css?token=DO-NOT-LOG">',
    base,
  );
  assert.deepEqual(found.unresolved, ["https://foreign.test/a.css"]);
});
test("transport rejects an external redirect before issuing a second request", async () => {
  let calls = 0;
  await assert.rejects(
    fetchPublic(base + "/", {
      fetchImpl: async () => {
        calls++;
        return new Response("", {
          status: 302,
          headers: { location: "https://foreign.test/" },
        });
      },
    }),
    /redirect refused/,
  );
  assert.equal(calls, 1);
  const result = await fetchPublic(base + "/", {
    fetchImpl: async () =>
      new Response("original bytes", {
        headers: { "content-type": "text/html" },
      }),
  });
  assert.equal(result.bytes.toString(), "original bytes");
  await assert.rejects(
    fetchPublic(base + "/", {
      maxBytes: 2,
      fetchImpl: async () =>
        new Response("too large", { headers: { "content-type": "text/html" } }),
    }),
    /size limit/,
  );
});
test("private fixture archive recursively preserves exact CSS/font bytes, hashes and bounded incompleteness", async () => {
  const output = await mkdtemp(join(tmpdir(), "mielaissa-reference-"));
  const fixtures = new Map([
    [
      base + "/",
      {
        type: "text/html",
        body: '<title>Original</title><link rel="stylesheet" href="/wp-content/themes/a.css">',
      },
    ],
    [
      base + "/wp-content/themes/a.css",
      {
        type: "text/css",
        body: '@import "b.css"; @font-face{src:url(font.woff2)}',
      },
    ],
    [
      base + "/wp-content/themes/b.css",
      { type: "text/css", body: "/* preserved */ .x{color:#123}" },
    ],
    [
      base + "/wp-content/themes/font.woff2",
      { type: "font/woff2", body: Buffer.from([0, 1, 2, 255]) },
    ],
  ]);
  const transport = async (url) => {
    const f = fixtures.get(url);
    if (!f) throw Error("unexpected fixture URL");
    return {
      bytes: Buffer.from(f.body),
      type: f.type,
      finalUrl: url,
      redirects: [],
    };
  };
  try {
    const manifest = await captureReference({ output, transport, delayMs: 0 });
    assert.equal(manifest.complete, true);
    assert.equal(manifest.transactionalMigrationComplete, false);
    assert.equal(manifest.assets.length, 3);
    for (const entry of [...manifest.pages, ...manifest.assets]) {
      const bytes = await readFile(join(output, entry.file));
      assert.deepEqual(bytes, Buffer.from(fixtures.get(entry.url).body));
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        entry.sha256,
      );
    }
    const bounded = await captureReference({
      output: join(output, "bounded"),
      transport,
      delayMs: 0,
      maxAssets: 1,
    });
    assert.equal(bounded.complete, false);
    assert.equal(bounded.remaining.assets, 2);
    const missingTransport = async (url) =>
      url === base + "/"
        ? {
            bytes: Buffer.from(
              '<link rel="stylesheet" href="https://foreign.test/style.css">',
            ),
            type: "text/html",
            finalUrl: url,
            redirects: [],
          }
        : transport(url);
    const missing = await captureReference({
      output: join(output, "missing"),
      transport: missingTransport,
      delayMs: 0,
    });
    assert.equal(missing.complete, false);
    assert.equal(missing.unresolved.length, 1);
    const broken = await captureReference({
      output: join(output, "broken"),
      transport: async () => {
        throw Error("offline fixture");
      },
      delayMs: 0,
    });
    assert.equal(broken.complete, false);
    assert.equal(broken.errors.length, 1);
    assert.equal(broken.pages.length, 0);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("archive audit detects changed source bytes and refuses a traversal entry", async () => {
  const { auditReference } =
    await import("../../scripts/node/audit-reference.mjs");
  const { writeFile } = await import("node:fs/promises");
  const output = await mkdtemp(join(tmpdir(), "mielaissa-audit-"));
  try {
    const manifest = await captureReference({
      output,
      delayMs: 0,
      transport: async (url) => ({
        bytes: Buffer.from("<title>Original</title>"),
        type: "text/html",
        finalUrl: url,
        redirects: [],
      }),
    });
    let audit = await auditReference(output);
    assert.equal(audit.originalFilesVerified, true);
    assert.equal(audit.visualParityVerified, false);
    await writeFile(join(output, manifest.pages[0].file), "altered");
    audit = await auditReference(output);
    assert.equal(audit.originalFilesVerified, false);
    assert.equal(audit.discoveredSourceCaptureComplete, false);
    manifest.pages[0].file = "../outside.html";
    await writeFile(join(output, "manifest.json"), JSON.stringify(manifest));
    audit = await auditReference(output);
    assert.deepEqual(audit.hashFailures, ["Unsafe archive entry"]);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
