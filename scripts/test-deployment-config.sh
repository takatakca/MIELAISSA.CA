#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
validator="scripts/validate-wordpress-root.sh"
for path in "/home/bolonca/mielaissa.ca" "/home/bolonca/public_html" "/var/www/mielaissa.ca/public_html"; do
  bash "$validator" "$path" 22 example.test exampleuser >/dev/null
done
for path in "/" "../public_html" "/home/../other" "/home/./mielaissa" "/home//bolonca" "/home/bolonca;touch" "/home/miel aissa"; do
  if bash "$validator" "$path" 22 example.test exampleuser >/dev/null 2>&1; then
    echo "FAIL invalid path accepted: $path" >&2; exit 1
  fi
done
for port in 0 65536 abc 999999; do
  if bash "$validator" "/home/a/site.ca" "$port" example.test exampleuser >/dev/null 2>&1; then
    echo "FAIL invalid port accepted: $port" >&2; exit 1
  fi
done
for host in "-attacker" "host..test" "bad;host"; do
  if bash "$validator" "/home/a/site.ca" 22 "$host" exampleuser >/dev/null 2>&1; then
    echo "FAIL invalid host accepted: $host" >&2; exit 1
  fi
done
echo "PASS: deployment target validation."
