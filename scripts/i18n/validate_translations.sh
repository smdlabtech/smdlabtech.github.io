#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
source "${REPO_ROOT}/scripts/lib/common.sh"

print_help() {
  cat <<'EOF'
Usage:
  ./scripts/i18n/validate_translations.sh

Checks:
  1) All data-i18n/data-i18n-* keys used in frontend templates exist in frontend base dictionary.
  2) All data-i18n/data-i18n-* keys used in backend templates exist in backend base dictionary.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_help
  exit 0
fi

require_cmd python3

log_info "Validating i18n keys in frontend/backend templates..."
python3 - <<'PY'
import re
import sys
from pathlib import Path

repo = Path.cwd()
frontend_base = repo / "frontend/templates/base.html"
backend_base = repo / "backend/src/templates/base.html"

def extract_dict_keys(base_path: Path):
    text = base_path.read_text(encoding="utf-8")
    keys = set(re.findall(r"""['"]([^'"]+)['"]\s*:\s*['"]""", text))
    return keys

KEY_ATTR_RE = re.compile(r'data-i18n(?:-placeholder|-aria|-btn|-group-aria)?="([^"]+)"')

def collect_used_keys(root: Path):
    used = set()
    for f in root.glob("*.html"):
        content = f.read_text(encoding="utf-8")
        used.update(KEY_ATTR_RE.findall(content))
    return used

front_keys = extract_dict_keys(frontend_base)
back_keys = extract_dict_keys(backend_base)

front_used = collect_used_keys(repo / "frontend/templates")
back_used = collect_used_keys(repo / "backend/src/templates")

missing_front = sorted(k for k in front_used if k not in front_keys)
missing_back = sorted(k for k in back_used if k not in back_keys)

if missing_front or missing_back:
    print("i18n validation failed.", file=sys.stderr)
    if missing_front:
        print("Missing frontend keys:", file=sys.stderr)
        for k in missing_front:
            print(f"  - {k}", file=sys.stderr)
    if missing_back:
        print("Missing backend keys:", file=sys.stderr)
        for k in missing_back:
            print(f"  - {k}", file=sys.stderr)
    sys.exit(1)

print("i18n validation passed.")
PY
log_info "i18n validation OK."
