#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source_plugin="wordpress/wp-content/plugins/mielaissa-storefront"
workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT
mkdir -p "$workdir/clone"
cp -R "$source_plugin/." "$workdir/clone/"
original="$(bash scripts/plugin-manifest.sh "$source_plugin")"
cloned="$(bash scripts/plugin-manifest.sh "$workdir/clone")"
test "$original" = "$cloned" || { echo "FAIL: identical plugin files have different hashes" >&2; exit 1; }
printf '\nmodified\n' >> "$workdir/clone/assets/storefront.js"
changed="$(bash scripts/plugin-manifest.sh "$workdir/clone")"
test "$original" != "$changed" || { echo "FAIL: changed JS file went undetected" >&2; exit 1; }
rm "$workdir/clone/assets/storefront.css"
if bash scripts/plugin-manifest.sh "$workdir/clone" >/dev/null 2>&1; then
  echo "FAIL: missing required CSS went undetected" >&2
  exit 1
fi
echo "PASS: all-file plugin manifest detects modification and missing assets."
