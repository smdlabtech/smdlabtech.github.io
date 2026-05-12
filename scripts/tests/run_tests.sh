#!/usr/bin/env bash
# Wrapper: redirige vers scripts/quality/run_tests.sh
exec "$(dirname "$0")/quality/run_tests.sh" "$@"
