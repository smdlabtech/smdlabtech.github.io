#!/usr/bin/env bash
# Wrapper: redirige vers scripts/dev/launch_app.sh
exec "$(dirname "$0")/dev/launch_app.sh" "$@"
