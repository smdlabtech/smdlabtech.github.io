#!/usr/bin/env bash
# Wrapper: redirige vers scripts/build/setup_jekyll.sh
exec "$(dirname "$0")/build/setup_jekyll.sh" "$@"
