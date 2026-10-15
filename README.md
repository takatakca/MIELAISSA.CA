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
