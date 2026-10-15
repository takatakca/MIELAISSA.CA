# Agent handoff — MIELAISSA.CA (2026-10-14)

## Observed starting point
- GitHub repository takatakca/MIELAISSA.CA main had only a 14-byte README, one initial commit, no open issues or pull requests.
- Public https://mielaissa.ca/ already offers products, a WooCommerce shop, coupons, a phone number and contact email; it is not safe to replace the live site's files blindly.
- Public storefront indicated coupons MIELAISSA120 (free shipping for eligible orders) and FIRSTORDER15 (first order 15%); plugin independently checks WooCommerce coupon objects before display.
- Contact email mielaissa.ca@gmail.com and telephone (514) 996-4247 observed on public site, not independently verified with operator.

## Implemented
- Non-destructive PHP WordPress plugin, bilingual, shortcode-driven, uses current WooCommerce product catalogue.
- Coupon guards; no guarantee of actual coupon eligibility, which WooCommerce evaluates at checkout.
- Responsive isolated styles and optional clipboard script.
- PHP smoke tests, GitHub CI ZIP artifact and opt-in SSH deployment solely to plugin directory.

## Important next tasks
1. Inventory actual WordPress hosting/theme/plugins/PHP version, active DNS and backup method with authorized access.
2. Run plugin in a WordPress + WooCommerce staging environment and test mobile, variations, stock, coupons, localization, keyboard and checkout.
3. Confirm contact details, store offers and copy with the merchant.
4. Confirm production path and SSH host key; configure GitHub Actions variables and secrets; enable deployment only after backup and rollback verification.
5. Add integration tests against supported WooCommerce versions and security monitoring.
6. Plan tenant-scoped GROUPE TAKATAK identity/events only with proper authorizations and data isolation; never create a competing customer data master.

## No false-completion claims
There is no verified SSH or WordPress-admin access in this repository. A successful push and CI run is not evidence that the plugin has been activated on mielaissa.ca.



> Historique de la reprise initiale (2026-10-14). Pour la dernière session et la tâche exacte en cours, consulter le document canonique docs/AGENT_HANDOFF.md, puis docs/TASK_QUEUE.md.
