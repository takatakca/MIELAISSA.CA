## Relève courante — 2026-11-07 11:00 UTC — Codex — ChatGPT Work

- Reprise exclusive et séquentielle depuis main `b122567cdaa8eeeac75caf679462c19d25c582ba` : PR #2 historique puis branche complète PR #5 `c910f8d80468a1622cd52051374bba0de33500b1` (incluant les deux commits Apache/diagnostic absents du snapshot PR). Les anciennes notes ci-dessous sont conservées comme historique.
- Source préparée : notice optionnelle PHP 1.0.1 limitée à GET/HEAD de l'accueil canonique sans query ; POST/actions panier/AJAX, pagination, administration, preview et feed traversent WordPress. HEAD sans corps. Snippet Apache limité GET/HEAD et query vide. Aucun changement au HTML statique ni au plugin WooCommerce existant.
- Validation : test comportemental de 21 requêtes PHP isolées ajouté au contrôle existant ; matrice GitHub PHP 7.4/8.2/8.3, JavaScript et ZIP attendue avant fusion. PHP absent de cet exécuteur local : aucun succès PHP local inventé. Résultats et SHA final seront consignés dans le reçu de PR et le journal Drive sans boucle de commits documentaires.
- Production observée AVANT intervention : `https://mielaissa.ca/` et `https://www.mielaissa.ca/`, HTTP 200, 2565 octets, SHA256 `0537fb3877623e231686385c46cb2278602636f055f4353ab116664cbb769844`, exactement le HTML `deploy/legacy-notice/index.html`. La notice était déjà en ligne ; cette session ne l'a pas déployée. CTA transfert observé sur le formulaire public TAKATAK, sans soumission ni preuve de réception d'un lead.
- Aucun accès WordPress/cPanel/SSH, WP_ROOT, staging ou backup restaurable actuellement vérifié pour cette cible. Aucune application Coolify associée trouvée sur les deux contrôleurs consultés. DNS observé `209.42.24.127`. Ne pas traiter cette page statique comme preuve de santé MySQL, commandes, plugin activé ou checkout. Aucun déploiement WordPress/MU-plugin/Apache, aucune activation de flag, aucun changement DNS/mail/données/identité effectué.
- PR #3 reste draft : prototype Node rejeté, fidélité et migration commerciale non acceptées (#4). L'autorisation de poursuivre existe ; les originaux, l'accès à l'installation et les validations techniques manquent. Préserver source, fidélité `[mielaissa_points]`, `_miel_diamonds` et `/en-ca/games/`. Aucun remplacement visuel inventé.
- Prochaine action : vérifier CI candidate, fusionner la source examinée, vérifier main CI et health public, puis reçu signé. Reprendre #1/#4 uniquement avec preuve des dépendances techniques ; ne pas déclarer la migration ou les paiements terminés.

Signature : Codex — ChatGPT Work.

---

# Miel Aissa → TAKATAK legacy migration notice

**Source prepared 2026-11-05. Public static notice independently verified 2026-11-07; deployment operator/access not verified by this session.** Uses the public transfer form delivered by [TAKATAK PR #254](https://github.com/takatakca/takatak-v1/pull/254).

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
4. The snippet rewrites **only** GET/HEAD requests without query strings to the domain homepage path `/` (for both apex and www), and only when the static HTML exists. It does not invoke WordPress/MySQL for the landing page, does not change DNS, and leaves wp-admin, product, cart, checkout and mail paths intact. Those paths may **still fail** until the underlying database issue is fixed.
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
   Default is disabled. Only GET/HEAD to the canonical homepage without query strings is intercepted; POST, query actions and non-home paths remain with WordPress; do not change DNS, product/customer tables, checkout routes, email or admin.
6. Verify homepage, customer login, cart, checkout and product pages. The homepage intentionally sets `X-Robots-Tag: noindex` during the transition; assess SEO implications before activation.

## Rollback
Remove the `TAKATAK_MIELAISSA_NOTICE_HOME` constant or set it to `false`; refresh WordPress caches and recheck the homepage. Delete the MU-plugin file if needed. Restore backed-up site files/database only if an unrelated issue requires it.

**Never infer deployment from GitHub.** The repository has no confirmed, authorized WordPress server access. A PR merge does not upload/activate this file.
