#!/usr/bin/env bash
# Sorted SHA-256 hashes for every file in one WordPress plugin directory.
set -euo pipefail
if [ "$#" -ne 1 ]; then echo "Expected one plugin directory" >&2; exit 1; fi
directory="$1"
cd "$directory"
for expected in mielaissa-storefront.php assets/storefront.css assets/storefront.js; do
  test -s "$expected" || { echo "Missing plugin file: $expected" >&2; exit 1; }
done
find . -type f -print0 | LC_ALL=C sort -z | xargs -0 -r sha256sum
