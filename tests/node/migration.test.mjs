import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCatalogue } from "../../scripts/node/import-catalog.mjs";
import {
  allowedPage,
  allowedMedia,
} from "../../scripts/node/capture-wordpress.mjs";
test("public capture refuses personal and mutation routes, offsite URLs, signed images", () => {
  for (const url of [
    "/checkout/",
    "/my-account/",
    "/cart/?add-to-cart=12",
    "https://other.example/",
    "/wp-admin/",
    "/wp-json/wp/v2/users",
    "/ca-en/login/",
  ])
    assert.equal(allowedPage(url), false, url);
  assert.equal(allowedPage("/product/honey-jujube/"), true);
  assert.equal(
    allowedMedia(
      "https://mielaissa.ca/wp-content/uploads/2025/11/Mielaissa-Logo.png",
    ),
    true,
  );
  assert.equal(allowedMedia("https://evil.example/a.png"), false);
  assert.equal(allowedMedia("/wp-content/uploads/a.png?token=secret"), false);
});
const product = {
  id: 12,
  slug: "honey-jujube",
  name: "Honey Jujube",
  status: "publish",
  price: "50.00",
  type: "variable",
  stock_status: "instock",
  variations: [13, 14],
  images: [{ src: "https://mielaissa.ca/wp-content/uploads/honey.jpg" }],
};
test("offline import keeps source identity and exact decimal, never declares migration ready", () => {
  const result = normalizeCatalogue([
    {
      ...product,
      email: "PRIVATE",
      customer: { name: "PRIVATE" },
      description: "<script>bad</script>",
    },
  ])[0];
  assert.equal(result.priceDecimal, "50.00");
  assert.deepEqual(result.variationIds, [13, 14]);
  assert.equal(result.publishReady, false);
  assert.equal(JSON.stringify(result).includes("PRIVATE"), false);
  assert.equal(JSON.stringify(result).includes("<script>"), false);
  assert.equal(result.currency, "UNCONFIRMED");
});
test("import refuses duplicates, private products and unapproved media", () => {
  assert.throws(() => normalizeCatalogue([product, product]));
  assert.throws(() => normalizeCatalogue([{ ...product, status: "draft" }]));
  assert.throws(() =>
    normalizeCatalogue([{ ...product, catalog_visibility: "hidden" }]),
  );
  assert.throws(() => normalizeCatalogue([{ ...product, price: "-1" }]));
  assert.throws(() =>
    normalizeCatalogue([
      { ...product, images: [{ src: "https://evil.example/x.jpg" }] },
    ]),
  );
});
