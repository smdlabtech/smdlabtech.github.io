#!/usr/bin/env bash
# Wrapper: redirige vers scripts/dev/generate_env.sh
exec "$(dirname "$0")/dev/generate_env.sh" "$@"
