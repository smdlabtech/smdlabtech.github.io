#!/usr/bin/env bash
# Wrapper: redirige vers scripts/dev/setup_complete.sh
exec "$(dirname "$0")/dev/setup_complete.sh" "$@"
