# MIELAISSA — migration Node.js / TAKATAK-V1

**2026-10-30 — Codex — assistant OpenAI.** Owner explicitly requested replacing WordPress in this conversation. This supersedes the old plugin-only development scope, but is not evidence of a completed production cutover. Target is **mielaissa.ca**, grounded in the named repository; “Mireille.ca” in the dictated request is treated as a transcription variant, not an instruction to copy a different business.

## Before

- Existing main: `b122567cdaa8eeeac75caf679462c19d25c582ba`.
- Open PR #2: KLEAN’s documentation-only deployment map, branch `klean/deploy-map-2026-10-29`. Preserved, not merged or overwritten.
- Existing issue #1: WordPress plugin rollout, now historical scope pending owner-authorized replacement.
- Most recent inspected legacy CI: 40957488156 succeeded for PR #2; public health 40931507609 succeeded for main. Neither proves the plugin active.
- Read AGENTS, AGENT_HANDOFF, PROJECT_STATUS, TASK_QUEUE, DEPLOYMENT, DECISIONS; TAKATAK-V1 AGENTS, WORKLOG, master API scope and integration documentation; Drive ROBOTS, live journal, registry, coordination master and KLEAN’s deployment note.

## Preserved public information — partial inventory

Public source: https://mielaissa.ca/ and linked pages, read 2026-10-30 through web tooling. Some responses are cached; they are **observations**, not a live authoritative export. Source text files in `content/source-audit/` retain readable extracted responses including errors and cache-age markers. They are not original HTML/database backups.

- Footer contact: `(514)996-4247`, `mielaissa.ca@gmail.com`, `5837 Rue Jean-Talon E, Saint-Léonard, QC H1S 1M4`. Do not substitute other TAKATAK brands’ addresses/phones.
- Four public families: Honeys, Care, Groceries, Home. Business navigation: Restaurant, Point of Sale, Corporate Gifts.
- 26 public product references: 10 honeys ($50–$150), 10 oils ($10–$110), 6 candles ($20). These are public price observations in CAD, **not verified sellable variants or stock**. Original English names preserved alongside new French presentation. Internal slugs are new application slugs; only Golden Orchard’s individual source URL was directly inspected, other entries cite homepage observation.
- Original logo located at `https://mielaissa.ca/wp-content/uploads/2025/11/Mielaissa-Logo.png`; image viewed via web tool. Original binary **not downloaded**. No other original product media bytes captured in this session.
- Existing public offers recorded separately: MIELAISSA120 (eligible Quebec delivery from CA$120 before tax, remote regions excluded); FIRSTORDER15 (first eligible order, signed-in new customer, once); verified business/student 15% offer. Not automatically activated and no discount engine invented.
- Prior repository notes record loyalty `[mielaissa_points]`, `_miel_diamonds`, `/en-ca/games/`. Balances, earning rules and mappings remain unknown and must be preserved in private export.
- Newsletter, cart, account and Tidio entry points inventoried, not claimed working in replacement.

### Observed content defects

Homepage repeats desktop/mobile menus, hero and newsletter blocks in readable extraction. French link redirected to `/ca-en/home/`. Restaurant, Corporate Gifts, Point of Sale and Contact contain ALKA-O water content and unrelated contacts. These are retained in the audit text but not promoted as Miel Aissa facts. Home also contains legacy water/health copy. No new medical claims, invented origin, certification, guarantees or delivery promises added.

## Implemented Node slice

- Same core application family as TAKATAK-V1: Next.js 16.2.10 / React 19.2.4 / TypeScript, Node 22+; separate merchant application, no dashboard copy or shared tenant database access.
- Premium amber/cream editorial layout, original CSS collection illustrations clearly labelled as illustrations, new preview wordmark. These **are not photographs of the real packaging or the merchant’s original logo**. Original product imagery/logo must replace the preview art after capture and review. No real photo altered.
- FR/EN routes, mobile menu, catalogue search/filter/sort, 26 product pages, product selection drawer, bounded browser persistence, email confirmation request, business/restaurant/gifting/retail sections, genuine tel/mailto and user-clicked directions links.
- No duplicated navigation, no incorrect ALKAO copy in the new product UI; no speculative social profiles, star ratings or fake live reviews.
- Consent default optional-off, accept/reject/customize, 180-day versioned choice, withdrawal via footer. No pixel, analytics or external widget loads regardless of choice. No newsletter auto-enrolment.
- `GET /api/health`: actual process health, revision and explicitly unconfigured commerce/auth. `POST /api/checkout`: 503, fails closed even on forged paid/price payload. Selection is a request, never an order/payment.
- Noindex/robots blocked by default. Public metadata and hreflang prepared; do not enable indexation before merchant acceptance and redirect parity.
- Docker/standalone Node runtime and GitHub Node build/browser artifact workflow. No Node production auto-deploy invented or connected to the historical plugin deploy workflow.

## TAKATAK-V1 contract finding

Inspected `src/lib/integrations/master-api/scope.ts` and `docs/ON2GO_MASTER_API.md` in the real V1 checkout. Allowed scopes are 1lv, on2go, foodhub; no MIELAISSA scope exists. Never borrow those keys or label a generic bearer request “connected.” Next integration step is a dedicated approved MIELAISSA scope, merchant/tenant mapping and one-time identity exchange in V1’s coordinated release process. Historical WooCommerce customer email is not sufficient proof to take over a TAKATAK identity. Order projection/loyalty ledger mapping and private consent transfer require explicit contracts and idempotency. No V1 files, schemas or production identities changed in this slice.

## Preservation tooling

`npm run capture` runs a bounded, read-only crawler (same HTTPS origin only, <=500 pages) into **gitignored** `migration-private/TIMESTAMP/`. It preserves raw HTML plus original same-host upload image bytes, hashes every file, records failures and refuses account/login/cart/checkout, mutations, offsite URLs and signed image URLs. Redirects requiring review are recorded as incomplete. It reads image src/srcset/lazy attributes and explicit upload URLs; embedded CSS/fonts/video/PDF inventories and extensionless media need additional capture. It **does not claim complete** when pages fail/limits remain. Do not pass credentials or run against another merchant. Crawl authorized public routes before cutover, then compare sitemap and admin export; public crawl never substitutes for a full file/SQL backup.

`npm run import:catalog -- /private/public-products.json` validates a read-only WooCommerce public-product JSON export, keeps exact decimal prices/source IDs/variation IDs, refuses hidden/draft records and offsite media, discards unrelated/private fields and HTML descriptions. Outputs review-only gitignored JSON with `publishReady:false`, unconfirmed currency and required reconciliation. Does not publish, write to WooCommerce, import customers or claim prices per variation. Store API shapes and CSV require a separate explicit adapter; do not feed arbitrary exports blindly.

### Actual access limitations

Executor network policy only allows package/GitHub hosts, not mielaissa.ca; no permitted network configuration tool is exposed here. Do not bypass it. Connected web reads recovered part of public text and one logo view; raw WP REST/sitemap requests failed. Connected Opera browser requires reauthentication, so no further Opera actions attempted. No SSH/wp-admin/cPanel runtime identity, real WP_ROOT, file/SQL backup, Woo export, Node host or deployment credentials verified. These are technical dependencies, **not pending permission to begin work**.

## Required before removing WordPress

1. Identify existing host and isolated Node release target; get a complete restorable WordPress files+SQL backup in private storage. Test restoration. Preserve email/DNS records; no guessed cPanel path.
2. Capture every public URL, language, redirect, original logo/photo/media; compare counts/hashes with sitemap and admin export. Current 26-reference sample is not proof of the complete catalogue.
3. Export exact product/variation/SKU/stock/tax/shipping/coupon rules privately. Reconcile totals and per-variation prices. Merchant confirms health/legal descriptions and imagery; retain original texts in archive.
4. Reconcile customer identities, orders, refunds, consents, gift balances and `_miel_diamonds` ledger privately, without exposing private data to GitHub or matching accounts from email alone.
5. Implement the dedicated MIELAISSA TAKATAK scope/SSO, merchant access rules and signed idempotent events through the V1 coordinator. No second universal CRM.
6. Add real commerce server, tax/shipping, inventory reservations and payment provider/webhook reconciliation. Test approved sandbox orders/refunds/stock/coupons and two-tenant isolation. No fake card form.
7. Confirm current product/SEO URLs, permanent redirects, title/canonical/language parity, original photo alt text, structured data and accessibility. Public staging must remain noindex.
8. Freeze legacy writes for final delta, verify balances/counts, then switch the verified app target with rollback ready. Check actual live `/api/health` revision and browser checkout/order/recovery; monitor. Retire WordPress only after acceptance and retention requirements, keeping private rollback backup.

## Verification

See AGENT_HANDOFF and PR for exact latest checks. Local legacy PHP check could not run (`php: command not found`); unchanged legacy suite remains in its original GitHub multi-PHP CI. Node importer/crawler safety tests and browser checks distinguish observed public data from live commerce. No email sent, payment collected, migration applied, DNS changed or production install removed.
