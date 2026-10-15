# AGENTS — MIELAISSA.CA

Read this document, docs/AGENT_HANDOFF.md and docs/TASK_QUEUE.md **before** changing files.

## Repository authority

- GitHub: takatakca/MIELAISSA.CA, production branch main.
- Do not start a new site: this repository contains an additive WordPress / WooCommerce plugin for the separate, existing live site mielaissa.ca.
- The merchant's real WordPress installation (not checked into Git) is the system of record for products, orders, customer accounts, payments, inventory and coupons.
- Do not replace WordPress, the theme, the live domain or DNS using this repository.
- Never read, commit or copy production secrets or customer data.
- TAKATAK is the master identity/customer authority only for approved cross-product integrations. No shared tenant data or ad-hoc second CRM. Do not expose Miel Aissa data to unrelated merchants.

## On each activation

1. Read this file and docs/AGENT_HANDOFF.md (then docs/PROJECT_STATUS.md, TASK_QUEUE.md, DEPLOYMENT.md, DECISIONS.md).
2. Query the live main SHA, open pull requests, issues, last CI runs and deployment results.
3. Compare the live GitHub state with the written handoff; keep newer work from other agents.
4. Work the first feasible queued item; make one coherent change at a time.
5. Run bash scripts/check.sh and validate JavaScript with node --check wordpress/wp-content/plugins/mielaissa-storefront/assets/storefront.js.
6. Push authorized changes to main without force and inspect their GitHub Actions result.
7. Update the five documentation files as decisions/state change; report verified status and blockers.
8. If interrupted, a future authorized session resumes from the handoff. No prompt can autonomously restart this session.

## Production safety gate

Deployment is opt-in; the deploy workflow must only run after main CI succeeds and when MIELAISSA_DEPLOY_ENABLED=true.
Do not enable this flag without production SSH settings, confirmed WordPress root, restore/rollback capability and hosting operator authorization.
Never claim “deployed” from a successful repository commit or skipped deploy job. When actual installation is possible, separately verify plugin files, WordPress activation, shortcode placement, storefront rendering, cart and checkout.

## Quality bar

PHP 7.4+ compatibility per plugin metadata, supported WordPress/WooCommerce APIs, responsive mobile-first UI, clear French/English presentation, output escaping, no fake product data, accessible controls, no health claims, no secrets.
Prefer small reversible changes, PHP smoke checks and real staging integration tests before live publication.

## Compatibilité de la boutique existante

Des personnalisations historiques utilisent le shortcode de fidélité [mielaissa_points], les points WooCommerce utilisateur _miel_diamonds et une page de jeux /en-ca/games/. Ce code source n'en est pas propriétaire : ne jamais écraser leurs fonctions, leurs données ou leurs droits sans avoir inventorié l'installation WordPress réelle.
