# Miel Aissa → TAKATAK legacy migration notice

**Prepared 2026-11-05. Not deployed to mielaissa.ca.** Uses the public transfer form delivered by [TAKATAK PR #254](https://github.com/takatakca/takatak-v1/pull/254).

The live site is a WordPress/WooCommerce store. This repository is **not** the full WordPress installation. Never overwrite its `index.php`, theme, customers, loyalty data, products, orders or checkout.

## Urgent: WordPress database connection failure (reported 2026-11-05)

**Important design correction:** A WordPress MU-plugin and a shortcode require WordPress to boot, so they **cannot** reliably show the notice when MySQL is unavailable. Do not attempt to "fix" the database by changing DNS, overwriting `wp-config.php`, creating an empty database, or restoring an unverified backup.

**Read-only diagnosis before changing live data**
1. Verify the exact URL and HTTP response for apex/www, and check whether the failure is limited to WordPress or all sites sharing the MySQL instance. Avoid relying on cached HTML.
2. On an authorized cPanel account, identify the **confirmed** document root for `mielaissa.ca`. Check MySQL availability, disk quota, database/user assignment, and server error logs. Compare `DB_NAME`, `DB_USER`, `DB_HOST` from the existing `wp-config.php` against cPanel **without copying secrets into Git or chat**.
3. Back up WordPress files and the existing SQL database before any password, user privilege, repair, or service restart. Do not run bulk updates or drop/recreate a database.
4. If credentials are valid and MySQL is unavailable, escalate to hosting/service status; if tables are damaged, restore/repair only after a backup. Verify storefront, product detail, cart, checkout, login, order history, email, and loyalty before declaring recovery.

**Database-independent public transition notice**, if the owner wants a customer-facing notice during the outage:
1. After verifying the real Apache/cPanel document root, back up its current `.htaccess` and upload `deploy/legacy-notice/index.html` to `transition/index.html` **inside that verified root**.
2. Verify `https://mielaissa.ca/transition/index.html` loads the branded HTML and points to a verified working `https://takatak.ca/transfert`. Test that form with a controlled lead in the authorized inbox; do not route real customers to an untested form.
3. **Copy only the snippet** in `deploy/legacy-notice/apache-home-only.htaccess.snippet` above the existing `# BEGIN WordPress` block in the live root `.htaccess`. Never replace or upload this snippet as the entire `.htaccess`.
4. The snippet rewrites **only** GETs to the domain homepage path `/` (for both apex and www), and only when the static HTML exists. It does not invoke WordPress/MySQL for the landing page, does not change DNS, and leaves wp-admin, product, cart, checkout and mail paths intact. Those paths may **still fail** until the underlying database issue is fixed.
5. Test `/`, `/transition/index.html`, `/wp-admin/`, `/cart/`, `/checkout/`, HTTP-to-HTTPS and both hostnames. If root returns 500, immediately remove **only** the new block and re-test. Do not remove the original WordPress rules.
6. The static notice is a communication measure **not a database repair**. Once database access is restored, decide whether to keep the notice or restore the original homepage.

This procedure is not auto-deployed by a GitHub merge and must not be applied to an unverified hosting root or Nginx-only deployment. For Nginx, configure an equivalent narrowly scoped route after a tested backup instead of assuming Apache rules will work.

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
