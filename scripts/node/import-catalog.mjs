/** Offline review only. Never imports identities, orders, medical copy or secrets. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
export function normalizeCatalogue(input) {
  if (!Array.isArray(input) || input.length > 10000)
    throw Error("Expected <=10000 public product records");
  const ids = new Set();
  return input.map((p) => {
    if (!Number.isInteger(p.id) || p.id < 1 || ids.has(p.id))
      throw Error("Duplicate or invalid product ID");
    ids.add(p.id);
    if (
      typeof p.name !== "string" ||
      !p.name.trim() ||
      typeof p.slug !== "string" ||
      !/^[a-z0-9-]+$/.test(p.slug)
    )
      throw Error("Invalid public product name/slug");
    if (p.status && p.status !== "publish")
      throw Error("Non-public product refused");
    if (p.catalog_visibility === "hidden")
      throw Error("Hidden product refused");
    const urls = (p.images || []).map((i) => {
      const u = new URL(i.src);
      if (
        u.protocol !== "https:" ||
        u.hostname !== "mielaissa.ca" ||
        !u.pathname.startsWith("/wp-content/uploads/")
      )
        throw Error("Unapproved media URL");
      return { source: u.href, alt: String(i.alt || "").slice(0, 500) };
    });
    const rawPrice = p.price ?? null;
    if (
      rawPrice !== null &&
      (typeof rawPrice !== "string" || !/^\d+(\.\d{1,2})?$/.test(rawPrice))
    )
      throw Error("Invalid exact decimal price");
    return {
      sourceId: p.id,
      slug: p.slug,
      name: p.name.slice(0, 500),
      type: p.type || "unknown",
      currency: "UNCONFIRMED",
      priceDecimal: rawPrice,
      stockStatus: ["instock", "outofstock", "onbackorder"].includes(
        p.stock_status,
      )
        ? p.stock_status
        : "unconfirmed",
      variationIds: Array.isArray(p.variations)
        ? p.variations.filter(Number.isInteger)
        : [],
      attributes: (p.attributes || []).map((a) => ({
        name: String(a.name || "").slice(0, 100),
        options: Array.isArray(a.options) ? a.options.map(String) : [],
      })),
      images: urls,
      publishReady: false,
      requires: [
        "merchant currency confirmation",
        "variation-level stock and prices",
        "shipping/tax/promotion reconciliation",
        "approved descriptions and translations",
      ],
    };
  });
}
async function main() {
  if (!process.argv[2])
    throw Error(
      "Usage: npm run import:catalog -- /private/public-products.json",
    );
  const data = normalizeCatalogue(
    JSON.parse(await readFile(process.argv[2], "utf8")),
  );
  await mkdir("migration-private", { recursive: true });
  const target = resolve("migration-private/catalogue-review.json");
  await writeFile(
    target,
    JSON.stringify(
      { importedAt: new Date().toISOString(), records: data },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ target, products: data.length, published: false }),
  );
}
if (
  process.argv[1] &&
  import.meta.url === new URL("file://" + resolve(process.argv[1])).href
)
  await main();
