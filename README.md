# MIELAISSA.CA — Node.js / TAKATAK-V1 migration

Owner direction, 2026-10-30: replace WordPress while preserving the merchant’s content and commercial records. **The new application is a working migration preview, not a transactional production release.**

- Node 22+, Next.js 16.2.10, React 19.2.4, TypeScript; same application family as TAKATAK-V1.
- Premium FR/EN storefront, 26 observed public references, product discovery/search/filter/sort, product pages, local selection, business/contact/privacy/offers pages.
- No WordPress runtime dependency. No fake checkout, account migration, marketing subscription or live TAKATAK integration.
- Original plugin files stay available as a rollback/reference until actual cutover.

```bash
npm ci --ignore-scripts
npm run dev -- --port 4180
npm test
npm run typecheck
npm run build
npm run test:browser
```

Use the compiled standalone server for release checks: copy `.next/static` to `.next/standalone/.next/`, copy `public` to `.next/standalone/`, then `PORT=4180 node .next/standalone/server.js`. Dockerfile packages the same server. `/api/health` reports preview status honestly. No production host or deploy credentials are configured.

Read [migration inventory and cutover](docs/NODE_MIGRATION.md). Read [agent handoff](docs/AGENT_HANDOFF.md) before editing. The following section describes the historical plugin only.

---

# MIELAISSA.CA

Version-controlled enhancements for the existing **Miel Aissa** WordPress and WooCommerce shop at https://mielaissa.ca/.

**Production safeguard:** this repository initially contained only a one-line README. The public store is already live and is not represented by the contents of this repository. Never upload this repository as the entire WordPress root, replace the active theme, change DNS, or replace WooCommerce orders/customers.

## What was built

The standalone, non-destructive plugin lives at wordpress/wp-content/plugins/mielaissa-storefront.

- [mielaissa_storefront] renders a bilingual FR/EN landing section with WooCommerce categories, live products, prices and product links.
- [mielaissa_offers] displays coupon copy controls only when the coupon exists, is unexpired and has the expected mechanics. Checkout determines eligibility.
- Responsive design, reduced motion, accessible focus indicators and scoped CSS.
- Does not modify orders, checkout, customers, product records or current pages.

## Local validation

Run: bash scripts/check.sh

The CI workflow performs PHP syntax checks, shortcode smoke tests and packages the plugin ZIP artifact.

## Manual staging install

1. Download the latest successful CI artifact named mielaissa-storefront-plugin.
2. Extract it; upload the ZIP as a WordPress plugin in wp-admin, or copy the plugin directory to wp-content/plugins/.
3. Activate the plugin on a staging environment first.
4. Create a staging page with shortcode [mielaissa_storefront] or [mielaissa_storefront lang="fr" limit="8"].
5. Optionally add [mielaissa_offers] to display verified coupons.
6. Test products, variable products, mobile, translation, checkout, coupon eligibility and conflicts with the active theme.
7. After approval, publish the page or apply the shortcodes to the desired live page.

Activation alone **does not change public page content**.

## Optional automatic SSH deployment

.github/workflows/deploy.yml only runs its deploy job when GitHub Actions variable MIELAISSA_DEPLOY_ENABLED equals true. It updates only the dedicated plugin directory.

Configure GitHub Actions variables: MIELAISSA_DEPLOY_ENABLED, MIELAISSA_SSH_HOST, MIELAISSA_SSH_PORT, MIELAISSA_SSH_USER, MIELAISSA_WP_ROOT (absolute path to the existing WordPress root).

Configure GitHub Actions secrets: MIELAISSA_SSH_PRIVATE_KEY (dedicated key), MIELAISSA_SSH_KNOWN_HOSTS (verified server host key).

Do not enable automated production deployment until staging validation, backups, rollback process and confirmed server paths exist.

See AGENTS.md and docs/AGENT_HANDOFF.md for the exact next step, docs/PROJECT_STATUS.md for verified state, docs/TASK_QUEUE.md for outstanding work, docs/DEPLOYMENT.md for the guarded rollout process, and docs/DECISIONS.md for architecture decisions.

## Real WordPress integration smoke (read-only)

On an authorized staging WordPress server with WP-CLI and WooCommerce active, run:

    wp --path=/verified/wordpress/root eval-file /path/to/repository/scripts/wordpress-smoke.php

This checks real shortcodes, plugin activation, a live WooCommerce catalogue query, and FR/EN rendering. It neither submits orders nor touches the existing loyalty/points workflow. Do not run against a guessed WordPress path.


## Graceful degradation

If WooCommerce is inactive, the storefront shortcode presents an availability message and the offers shortcode suppresses unverified coupon codes. CI checks this with tests/no-woocommerce.php, in addition to the standard mocked WooCommerce contract checks and the optional real-install WP-CLI verification.


## Public availability monitoring and deploy identity

A dedicated GitHub Actions workflow (`.github/workflows/public-health.yml`) checks the existing public homepage daily. It confirms HTTP/HTML accessibility, **not** deployment or plugin activation.

Automated deployment now validates domain-named WordPress paths and refuses an incorrect WordPress installation: WP-CLI must be present on the actual target and its `home` must match `mielaissa.ca` or `www.mielaissa.ca`. The production deployment remains opt-in and is not yet enabled.


## Deployment integrity and public health

The opt-in SSH workflow now compares full, deterministic SHA-256 manifests of the complete WordPress plugin directory **before** switching directories and **after** deployment. Run `bash scripts/test-plugin-manifest.sh` to test missing files and unexpected modifications. It still requires a confirmed WordPress installation and never activates a shortcode automatically.

The read-only public health workflow also runs on pushes to main, in addition to daily scheduling. A successful homepage probe is not evidence that the new extension is active or that checkout has been tested.
