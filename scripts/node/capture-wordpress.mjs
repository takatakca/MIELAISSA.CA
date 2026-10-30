/** Codex — assistant OpenAI, 2026-10-30. Read-only public preservation tool.
 * Run only from a network authorized for mielaissa.ca. Never use credentials.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import { resolve, join } from "node:path";
const ORIGIN = "https://mielaissa.ca";
export function allowedPage(input) {
  try {
    const u = new URL(input, ORIGIN);
    return (
      u.origin === ORIGIN &&
      !u.search &&
      !u.hash &&
      !/\/(?:wp-admin|wp-login|wp-json|my-account|account|cart|checkout|panier|commande|mon-compte|login|logout)(?:\/|\.|$)/i.test(
        u.pathname,
      ) &&
      !u.pathname.includes("/wp-content/")
    );
  } catch {
    return false;
  }
}
export function allowedMedia(input) {
  try {
    const u = new URL(input, ORIGIN);
    return (
      u.origin === ORIGIN &&
      u.pathname.startsWith("/wp-content/uploads/") &&
      /\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname) &&
      !u.search
    );
  } catch {
    return false;
  }
}
async function get(url, maxBytes) {
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
    headers: {
      "User-Agent": "MIELAISSA-Migration/1.0 (owner-authorized public archive)",
    },
  });
  if (response.status >= 300 && response.status < 400) {
    const target = new URL(response.headers.get("location") || "", url);
    if (target.origin !== ORIGIN) throw Error("External redirect refused");
    if (target.href !== url)
      throw Error("Redirect requires explicit inventory: " + target.pathname);
  }
  if (!response.ok) throw Error("HTTP " + response.status);
  const chunks = [];
  let n = 0;
  for await (const chunk of response.body) {
    n += chunk.length;
    if (n > maxBytes) {
      await response.body.cancel().catch(() => {});
      throw Error("Response too large");
    }
    chunks.push(chunk);
  }
  return {
    bytes: Buffer.concat(chunks),
    type: response.headers.get("content-type") || "",
  };
}
async function main() {
  const output = resolve(
    "migration-private",
    new Date().toISOString().replaceAll(":", "-"),
  );
  await mkdir(join(output, "pages"), { recursive: true });
  await mkdir(join(output, "media"), { recursive: true });
  const queue = [ORIGIN + "/"];
  const seen = new Set(),
    media = new Set(),
    manifest = {
      createdAt: new Date().toISOString(),
      source: ORIGIN,
      pages: [],
      media: [],
      errors: [],
      complete: false,
    };
  while (queue.length && seen.size < 500) {
    const url = queue.shift();
    if (seen.has(url) || !allowedPage(url)) continue;
    seen.add(url);
    try {
      const { bytes, type } = await get(url, 8 * 1024 * 1024);
      if (!type.includes("text/html")) continue;
      const hash = createHash("sha256").update(bytes).digest("hex");
      const file = "pages/" + hash + ".html";
      await writeFile(join(output, file), bytes);
      const $ = load(bytes.toString("utf8"));
      manifest.pages.push({
        url,
        file,
        sha256: hash,
        title: $("title").text(),
      });
      $("a[href]").each((_, e) => {
        const u = new URL($(e).attr("href"), url);
        u.hash = "";
        if (allowedPage(u.href) && !seen.has(u.href)) queue.push(u.href);
      });
      $("img").each((_, e) => {
        for (const key of ["src", "data-src", "data-lazy-src"]) {
          const src = $(e).attr(key);
          if (src && allowedMedia(new URL(src, url).href))
            media.add(new URL(src, url).href);
        }
        for (const part of ($(e).attr("srcset") || "").split(",")) {
          const src = part.trim().split(/\s+/)[0];
          if (src && allowedMedia(new URL(src, url).href))
            media.add(new URL(src, url).href);
        }
      });
      for (const match of bytes
        .toString("utf8")
        .matchAll(
          /https:\/\/mielaissa\.ca\/wp-content\/uploads\/[^\s"'<>\\)]+\.(?:png|jpe?g|webp|gif|avif|svg)/gi,
        ))
        if (allowedMedia(match[0])) media.add(match[0]);
    } catch (error) {
      manifest.errors.push({ url, error: String(error.message) });
    }
    await new Promise((r) => setTimeout(r, 200));
    await writeFile(
      join(output, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
  }
  for (const url of media) {
    try {
      const { bytes, type } = await get(url, 12 * 1024 * 1024);
      if (!type.startsWith("image/")) throw Error("Non-image response");
      const hash = createHash("sha256").update(bytes).digest("hex"),
        extension = new URL(url).pathname.split(".").pop().toLowerCase(),
        file = "media/" + hash + "." + extension;
      await writeFile(join(output, file), bytes);
      manifest.media.push({
        url,
        file,
        bytes: bytes.length,
        mime: type,
        sha256: hash,
        usage: "original-unedited-review-before-publication",
      });
    } catch (error) {
      manifest.errors.push({ url, error: String(error.message) });
    }
    await writeFile(
      join(output, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
  }
  manifest.complete = queue.length === 0 && manifest.errors.length === 0;
  manifest.remaining = queue.length;
  await writeFile(
    join(output, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    JSON.stringify({
      output,
      pages: manifest.pages.length,
      media: manifest.media.length,
      errors: manifest.errors.length,
      complete: manifest.complete,
    }),
  );
  if (!manifest.pages.length || !manifest.complete) process.exitCode = 1;
}
if (
  process.argv[1] &&
  import.meta.url === new URL("file://" + resolve(process.argv[1])).href
)
  await main();
