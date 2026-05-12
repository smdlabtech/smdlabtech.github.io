#!/usr/bin/env bash
# Wrapper: redirige vers scripts/quality/test_endpoints.sh
exec "$(dirname "$0")/quality/test_endpoints.sh" "$@"
