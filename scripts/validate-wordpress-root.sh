#!/usr/bin/env bash
set -euo pipefail
root="$1"; port="$2"; host="$3"; user="$4"
if [[ ! "$root" =~ ^/[A-Za-z0-9._/-]+$ ]] ||
   [[ "$root" == "/" || "$root" == *"//"* ]] ||
   [[ "$root" =~ (^|/)\.\.?(/|$) ]]; then
  echo "Invalid MIELAISSA_WP_ROOT" >&2; exit 1
fi
if [[ ! "$port" =~ ^[0-9]{1,5}$ ]] ||
   ((10#$port < 1 || 10#$port > 65535)); then
  echo "Invalid MIELAISSA_SSH_PORT" >&2; exit 1
fi
if [[ ! "$host" =~ ^[A-Za-z0-9.-]+$ ]] ||
   [[ "$host" == -* || "$host" == .* || "$host" == *..* ]]; then
  echo "Invalid MIELAISSA_SSH_HOST" >&2; exit 1
fi
if [[ ! "$user" =~ ^[A-Za-z0-9_-]+$ ]] || [[ "$user" == -* ]]; then
  echo "Invalid MIELAISSA_SSH_USER" >&2; exit 1
fi
echo "Deployment target syntax validated."
