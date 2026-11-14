/** Codex — assistant OpenAI. Preserve original public theme assets; never execute them. */
import { load } from "cheerio";
import postcss from "postcss";
import valueParser from "postcss-value-parser";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
export const ORIGIN = "https://mielaissa.ca";
const EXT =
  /\.(css|js|mjs|png|jpe?g|webp|gif|avif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|ogg|pdf)$/i;
function parsed(input, base = ORIGIN) {
  try {
    const u = new URL(input, base);
    if (u.username || u.password) return null;
    decodeURIComponent(u.pathname);
    return u;
  } catch {
    return null;
  }
}
export function allowedPage(input) {
  const u = parsed(input);
  if (!u) return false;
  const path = decodeURIComponent(u.pathname);
  return (
    u.origin === ORIGIN &&
    !u.search &&
    !u.hash &&
    !/\/(?:wp-admin|wp-login|wp-json|my-account|account|cart|checkout|panier|commande|mon-compte|login|logout)(?:\/|\.|$)/i.test(
      path,
    ) &&
    !/^\/(?:wp-content|wp-includes)(?:\/|$)/i.test(path) &&
    !EXT.test(path)
  );
}
export function allowedAsset(input) {
  const u = parsed(input);
  if (!u) return false;
  return (
    u.origin === ORIGIN &&
    /^\/(?:wp-content|wp-includes)\//.test(decodeURIComponent(u.pathname)) &&
    EXT.test(u.pathname) &&
    [...u.searchParams].every(
      ([key, value]) =>
        ["ver", "v"].includes(key) && /^[a-zA-Z0-9._-]{1,80}$/.test(value),
    )
  );
}
export function allowedMedia(input) {
  const u = parsed(input);
  return (
    !!u &&
    allowedAsset(input) &&
    u.pathname.startsWith("/wp-content/uploads/") &&
    /\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname)
  );
}
function publicReference(input, base) {
  const u = parsed(input, base);
  if (!u || !["http:", "https:"].includes(u.protocol)) return null;
  u.hash = "";
  if (!u.searchParams.size) u.search = "";
  return u.href;
}
function safeMissing(input, base) {
  const u = parsed(input, base);
  if (!u) return "(unreadable resource URL)";
  u.search = "";
  u.hash = "";
  if (!u.searchParams.size) u.search = "";
  return u.href;
}
export function discoverCss(css, base) {
  const refs = new Set();
  const root = postcss.parse(css);
  function collect(value, imports = false) {
    const ast = valueParser(value);
    if (imports && ast.nodes[0]?.type === "string")
      refs.add(ast.nodes[0].value);
    ast.walk((node) => {
      if (node.type === "function" && node.value.toLowerCase() === "url") {
        const value = valueParser
          .stringify(node.nodes)
          .trim()
          .replace(/^(['"])(.*)\1$/, "$2");
        if (value && !value.startsWith("#") && !value.startsWith("data:"))
          refs.add(value);
        return false;
      }
    });
  }
  root.walkDecls((decl) => collect(decl.value));
  root.walkAtRules(/^import$/i, (rule) => collect(rule.params, true));
  return [...refs].map((x) => publicReference(x, base)).filter(Boolean);
}
export function discoverHtml(html, base) {
  const $ = load(html);
  const pages = new Set(),
    assets = new Set(),
    unresolved = new Set();
  function resource(value) {
    if (!value || value.startsWith("data:") || value.startsWith("#")) return;
    const url = publicReference(value, base);
    if (url && allowedAsset(url)) assets.add(url);
    else unresolved.add(safeMissing(value, base));
  }
  function css(value) {
    for (const url of discoverCss(value, base)) resource(url);
  }
  $("a[href]").each((_, el) => {
    const u = publicReference($(el).attr("href"), base);
    if (u && allowedPage(u)) pages.add(u);
    else if (u && EXT.test(new URL(u).pathname)) resource(u);
  });
  $("link[href]").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase().split(/\s+/);
    if (
      rel.some((x) =>
        ["stylesheet", "icon", "preload", "modulepreload"].includes(x),
      )
    )
      resource($(el).attr("href"));
  });
  $("script[src],img,source,video,audio").each((_, el) => {
    for (const key of ["src", "data-src", "data-lazy-src", "poster"])
      resource($(el).attr(key));
    for (const key of ["srcset", "data-srcset"]) {
      const raw = $(el).attr(key);
      if (raw && !raw.trim().startsWith("data:"))
        for (const part of raw.split(","))
          resource(part.trim().split(/\s+/)[0]);
    }
  });
  $("[style]").each((_, el) => css("x{" + $(el).attr("style") + "}"));
  $("style").each((_, el) => css($(el).html() || ""));
  return {
    pages: [...pages],
    assets: [...assets],
    unresolved: [...unresolved],
  };
}
export async function fetchPublic(
  url,
  { kind = "page", fetchImpl = fetch, maxBytes = 8 * 1024 * 1024 } = {},
) {
  const valid = kind === "page" ? allowedPage : allowedAsset;
  const redirects = [];
  let current = url;
  for (let hop = 0; hop <= 5; hop++) {
    if (!valid(current)) throw Error("Unapproved public resource");
    const response = await fetchImpl(current, {
      redirect: "manual",
      credentials: "omit",
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent":
          "MIELAISSA-Migration/2.0 (owner-authorized public archive)",
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const target = publicReference(
        response.headers.get("location") || "",
        current,
      );
      if (!target || !valid(target)) throw Error("Unapproved redirect refused");
      redirects.push({ from: current, to: target, status: response.status });
      current = target;
      continue;
    }
    if (!response.ok) throw Error("HTTP " + response.status);
    if (!response.body) throw Error("Empty response body");
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > maxBytes) throw Error("Response size limit exceeded");
      chunks.push(chunk);
    }
    return {
      bytes: Buffer.concat(chunks),
      type: response.headers.get("content-type") || "",
      finalUrl: current,
      redirects,
    };
  }
  throw Error("Redirect limit exceeded");
}
export async function captureReference({
  output,
  transport = fetchPublic,
  maxPages = 500,
  maxAssets = 5000,
  maxTotalBytes = 512 * 1024 * 1024,
  delayMs = 200,
} = {}) {
  if (!output) throw Error("A private output directory is required");
  await mkdir(join(output, "pages"), { recursive: true });
  await mkdir(join(output, "assets"), { recursive: true });
  const manifest = {
    version: 2,
    createdAt: new Date().toISOString(),
    source: ORIGIN,
    pages: [],
    assets: [],
    redirects: [],
    unresolved: [],
    errors: [],
    capturedBytes: 0,
    complete: false,
    scope: "public-html-and-discovered-static-assets-only",
    transactionalMigrationComplete: false,
  };
  const pages = [ORIGIN + "/"],
    assets = [],
    pageSeen = new Set(),
    assetSeen = new Set(),
    pageQueued = new Set(pages),
    assetQueued = new Set(),
    missing = new Set();
  const save = () =>
    writeFile(
      join(output, "manifest.json"),
      JSON.stringify(manifest, null, 2) + "\n",
    );
  const pause = () =>
    delayMs ? new Promise((r) => setTimeout(r, delayMs)) : Promise.resolve();
  function addAssets(urls) {
    for (const url of urls) {
      if (allowedAsset(url)) {
        if (!assetQueued.has(url)) {
          assetQueued.add(url);
          assets.push(url);
        }
      } else missing.add(safeMissing(url, ORIGIN));
    }
  }
  async function record(url, kind) {
    const result = await transport(url, {
      kind,
      maxBytes: kind === "page" ? 8 * 1024 * 1024 : 32 * 1024 * 1024,
    });
    if (
      !(kind === "page"
        ? allowedPage(result.finalUrl)
        : allowedAsset(result.finalUrl))
    )
      throw Error("Unapproved final resource");
    if (manifest.capturedBytes + result.bytes.length > maxTotalBytes)
      throw Error("Total archive size limit exceeded");
    if (kind === "page" && !result.type.includes("text/html"))
      throw Error("Expected HTML");
    const extension =
      kind === "page"
        ? "html"
        : new URL(result.finalUrl).pathname.split(".").pop().toLowerCase();
    if (kind === "asset" && result.type.includes("text/html"))
      throw Error("HTML returned instead of asset");
    const hash = createHash("sha256").update(result.bytes).digest("hex"),
      file = (kind === "page" ? "pages/" : "assets/") + hash + "." + extension;
    await writeFile(join(output, file), result.bytes);
    manifest.capturedBytes += result.bytes.length;
    manifest.redirects.push(...result.redirects);
    const entry = {
      url,
      finalUrl: result.finalUrl,
      file,
      sha256: hash,
      bytes: result.bytes.length,
      mime: result.type,
      originalUnmodified: true,
    };
    if (kind === "page") {
      const found = discoverHtml(
        result.bytes.toString("utf8"),
        result.finalUrl,
      );
      entry.title = load(result.bytes.toString("utf8"))("title").text();
      manifest.pages.push(entry);
      for (const next of found.pages)
        if (!pageQueued.has(next)) {
          pageQueued.add(next);
          pages.push(next);
        }
      addAssets(found.assets);
      for (const item of found.unresolved) missing.add(item);
    } else {
      manifest.assets.push(entry);
      if (extension === "css")
        addAssets(discoverCss(result.bytes.toString("utf8"), result.finalUrl));
    }
  }
  while (
    pages.length &&
    pageSeen.size < maxPages &&
    manifest.capturedBytes < maxTotalBytes
  ) {
    const url = pages.shift();
    if (pageSeen.has(url)) continue;
    pageSeen.add(url);
    try {
      await record(url, "page");
    } catch (e) {
      manifest.errors.push({ url, error: e.message });
    }
    await save();
    await pause();
  }
  while (
    assets.length &&
    assetSeen.size < maxAssets &&
    manifest.capturedBytes < maxTotalBytes
  ) {
    const url = assets.shift();
    if (assetSeen.has(url)) continue;
    assetSeen.add(url);
    try {
      await record(url, "asset");
    } catch (e) {
      manifest.errors.push({ url, error: e.message });
    }
    await save();
    await pause();
  }
  manifest.unresolved = [...missing].sort();
  manifest.remaining = { pages: pages.length, assets: assets.length };
  manifest.complete =
    manifest.pages.length > 0 &&
    !pages.length &&
    !assets.length &&
    !manifest.errors.length &&
    !manifest.unresolved.length;
  manifest.finishedAt = new Date().toISOString();
  await save();
  return manifest;
}
