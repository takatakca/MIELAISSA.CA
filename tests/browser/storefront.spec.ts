import { test, expect } from "@playwright/test";
for (const width of [390, 1440])
  test(`storefront flow, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    const errors: string[] = [];
    const external: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
        external.push(r.url());
    });
    await page.goto("/fr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "La douceur",
    );
    await page.getByRole("button", { name: "Refuser", exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/mielaissa-home-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Découvrir nos miels", exact: true })
      .click();
    await expect(page.locator(".product-card")).toHaveCount(10);
    await page.getByRole("searchbox").fill("jujubier");
    await expect(page.locator(".product-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Ajouter Miel Jujubier" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".bag-row")).toHaveCount(1);
    const mail = page.getByRole("link", {
      name: "Demander une confirmation par courriel",
    });
    await expect(mail).toHaveAttribute(
      "href",
      /^mailto:mielaissa.ca@gmail.com/,
    );
    await page.getByRole("spinbutton").fill("2");
    await page
      .getByRole("button", { name: "Fermer", exact: true })
      .first()
      .click();
    await page.reload();
    await page.getByRole("button", { name: "Ouvrir ma sélection" }).click();
    await expect(page.getByRole("spinbutton")).toHaveValue("2");
    await page.keyboard.press("Escape");
    await page.goto("/en/shop");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Small pleasures.",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(".product-card")).toHaveCount(26);
    await page.goto("/fr/business");
    await expect(page.locator(".business-grid article")).toHaveCount(3);
    await page.screenshot({
      path: `/tmp/mielaissa-business-${width}.png`,
      fullPage: true,
    });
    await page.goto("/fr/product/honey-golden-orchard");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Miel Verger doré",
    );
    await page.goto("/fr/contact");
    await expect(
      page.getByRole("main").getByRole("link", { name: "(514) 996-4247" }),
    ).toHaveAttribute("href", "tel:+15149964247");
    await page.getByRole("button", { name: "Mes choix de témoins" }).click();
    await page.getByRole("button", { name: "Accepter le facultatif" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.goto("/fr/privacy");
    await expect(page.getByRole("main")).toContainText("Aucun pixel");
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
test("backend stays closed, old locale redirects, noindex and unknown routes", async ({
  request,
}) => {
  expect((await request.get("/api/health")).status()).toBe(200);
  const payment = await request.post("/api/checkout", {
    data: { amount: 1, customer: "forged", paid: true },
  });
  expect(payment.status()).toBe(503);
  expect((await payment.json()).code).toBe("CHECKOUT_NOT_CONFIGURED");
  const redirect = await request.get("/ca-fr/home", { maxRedirects: 0 });
  expect([307, 308]).toContain(redirect.status());
  expect(redirect.headers().location).toContain("/fr/home");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/not-a-page")).status()).toBe(404);
  const response = await request.get("/fr");
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(await response.text()).toContain("noindex");
});
