#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
plugin="wordpress/wp-content/plugins/mielaissa-storefront"
test -s "$plugin/mielaissa-storefront.php"
test -s "$plugin/assets/storefront.css"
test -s "$plugin/assets/storefront.js"
php -l "$plugin/mielaissa-storefront.php"
php -l tests/smoke.php
php -l scripts/wordpress-smoke.php
php -l tests/no-woocommerce.php
php tests/smoke.php
php tests/no-woocommerce.php
bash scripts/test-deployment-config.sh
bash scripts/test-plugin-manifest.sh
bash -n scripts/plugin-manifest.sh
bash -n scripts/test-plugin-manifest.sh
bash -n scripts/public-health.sh
bash -n scripts/validate-wordpress-root.sh
bash -n scripts/test-deployment-config.sh
if grep -RInE 'StrictHostKeyChecking=no|password\s*=' .github "$plugin" --exclude='*.md'; then
  echo "Unsafe deployment configuration detected" >&2
  exit 1
fi
echo "Source checks passed."
