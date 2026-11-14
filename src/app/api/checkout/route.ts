// Fail closed until the merchant's real variations, stock, taxes, shipping,
// identity scope and signed payment lifecycle are reconciled. Never take a price from a browser.
export function POST() {
  return Response.json(
    {
      ok: false,
      code: "CHECKOUT_NOT_CONFIGURED",
      message:
        "Le paiement sera disponible après validation de la migration commerciale.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
