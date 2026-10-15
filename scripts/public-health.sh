#!/usr/bin/env bash
# Public, read-only availability probe. Not proof of plugin installation.
set -euo pipefail
url="https://mielaissa.ca/"
body="$(mktemp)"
trap 'rm -f "$body"' EXIT

status="$(curl --silent --show-error --location --fail --retry 2 \
  --connect-timeout 10 --max-time 40 \
  --write-out '%{http_code}' --output "$body" "$url")"

if [[ "$status" != "200" ]]; then
  echo "FAIL: public homepage returned HTTP $status" >&2
  exit 1
fi
if ! grep -Eiq '<!doctype html|<html' "$body"; then
  echo "FAIL: public homepage does not contain HTML" >&2
  exit 1
fi
if ! grep -Eiq 'mielaissa|miel[[:space:]]+aissa' "$body"; then
  echo "FAIL: public homepage no longer identifies the Miel Aissa shop" >&2
  exit 1
fi
if grep -Eiq 'Error establishing a database connection|There has been a critical error on this website' "$body"; then
  echo "FAIL: WordPress reports a critical/database error" >&2
  exit 1
fi
echo "PASS: Miel Aissa homepage responds with recognizable HTML."
echo "INFO: This public probe cannot verify shortcode activation, orders, login, or checkout."
