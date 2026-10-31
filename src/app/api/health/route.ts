export function GET() {
  return Response.json(
    {
      ok: true,
      application: "mielaissa-node",
      revision: process.env.RELEASE_SHA || "local",
      mode: "migration-preview",
      checkout: "not_configured",
      identity: "not_configured",
      catalogue: "public-observation-not-stock",
      wordpressRequiredAtRuntime: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
