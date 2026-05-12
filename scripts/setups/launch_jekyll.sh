#!/usr/bin/env bash
# Wrapper: redirige vers scripts/build/launch_jekyll.sh
exec "$(dirname "$0")/build/launch_jekyll.sh" "$@"
