#!/usr/bin/env bash
# Cron-friendly refresh trigger for sqrl backend
# Requires: curl, backend listening on localhost:4000, optional API_KEY

API_BASE=${API_BASE:-http://127.0.0.1:4000}
API_KEY=${API_KEY:-}

headers=(-H "Content-Type: application/json")
if [ -n "$API_KEY" ]; then
  headers+=( -H "X-API-Key: $API_KEY" )
fi

curl -s -X POST "${API_BASE}/refresh" "${headers[@]}" -d '{}' | jq '.' 2>/dev/null || curl -s -X POST "${API_BASE}/refresh" "${headers[@]}" -d '{}'
