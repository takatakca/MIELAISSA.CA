# Miel Aissa → TAKATAK legacy migration notice

**Prepared 2026-11-05. Not deployed to mielaissa.ca.** Uses the public transfer form delivered by [TAKATAK PR #254](https://github.com/takatakca/takatak-v1/pull/254).

The live site is a WordPress/WooCommerce store. This repository is **not** the full WordPress installation. Never overwrite its `index.php`, theme, customers, loyalty data, products, orders or checkout.

## Deliverables
- `wordpress/wp-content/mu-plugins/takatak-migration-notice.php`: opt-in must-use plugin, no dependencies or WooCommerce mutations. Includes shortcode `[takatak_mielaissa_moved_notice]`.
- `deploy/legacy-notice/index.html`: independent static notice for a **separate approved legacy landing directory**. Preview by uploading to e.g. `/transition/index.html` (do not replace the WordPress root).
- CTA always points to `https://takatak.ca/transfert`, no MochaHost login or checkout.

## Safe activation
1. Identify the actual WordPress root for mielaissa.ca in authorized cPanel/SSH; verify WordPress `home` option matches the domain. This repository's existing SSH workflow deploys **only** the separate storefront plugin, not this must-use plugin.
2. Back up files + SQL; verify restoration, stage a matching WP/WooCommerce installation and document plugin/theme conflicts.
3. Verify TAKATAK `/transfert` accepts an authorized test lead and that it appears in the right lead inbox; no password, EPP key or payment is collected.
4. On **staging only**, copy the PHP file into `wp-content/mu-plugins/` (create directory if needed), activate a private staging page with `[takatak_mielaissa_moved_notice]` and test FR/mobile/accessibility.
5. After explicit go-live approval and backup, install on verified WordPress production. To show the notice at **https://mielaissa.ca/**, set in that WordPress installation's `wp-config.php`:
   ```php
   define('TAKATAK_MIELAISSA_NOTICE_HOME', true);
   ```
   Default is disabled. Only the front page is intercepted; do not change DNS, product/customer tables, checkout routes, email or admin.
6. Verify homepage, customer login, cart, checkout and product pages. The homepage intentionally sets `X-Robots-Tag: noindex` during the transition; assess SEO implications before activation.

## Rollback
Remove the `TAKATAK_MIELAISSA_NOTICE_HOME` constant or set it to `false`; refresh WordPress caches and recheck the homepage. Delete the MU-plugin file if needed. Restore backed-up site files/database only if an unrelated issue requires it.

**Never infer deployment from GitHub.** The repository has no confirmed, authorized WordPress server access. A PR merge does not upload/activate this file.
