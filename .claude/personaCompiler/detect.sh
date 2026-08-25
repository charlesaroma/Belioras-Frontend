#!/usr/bin/env bash
# detect.sh — AST-free AI slop detection for belioras-frontend
# Usage: ./detect.sh [--json] [--severity critical|high|medium|low] [--file path]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/config.json"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/drafts"

mkdir -p "$OUTPUT_DIR"

# --- Parse args ---
OUTPUT_JSON=false
SEVERITY_FILTER=""
SINGLE_FILE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --json) OUTPUT_JSON=true; shift ;;
    --severity) SEVERITY_FILTER="$2"; shift 2 ;;
    --file) SINGLE_FILE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# --- Find files ---
if [[ -n "$SINGLE_FILE" ]]; then
  FILES=("$PROJECT_ROOT/$SINGLE_FILE")
else
  mapfile -t FILES < <(cd "$PROJECT_ROOT" && find src -type f \( -name "*.jsx" -o -name "*.js" \) ! -path "*/node_modules/*" ! -path "*/dist/*" 2>/dev/null || true)
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No target files found."
  exit 0
fi

# --- Severity config ---
declare -A SEV_WEIGHT=( ["critical"]=3 ["high"]=2 ["medium"]=1 ["low"]=0.5 )

# --- Detection functions ---
detect_verbose_vars() {
  local file="$1"
  # AI-generated verbose variable names
  rg -n '\b(fetched|retrieved|transformed|normalized|aggregated|sanitized|processed|compiled|computed|derived|hydrated|materialized)[A-Z]\w+\b' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|verbose-vars|${line}|${content}"
  done
}

detect_useless_comments() {
  local file="$1"
  # Comments that explain obvious code
  rg -n '//\s*(Function|Component)\s+(that|to)?\s*(handles?|manages?|renders?|displays?|processes?)' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
  rg -n '//\s*(Set up|Initialize|Configure|Create|Define)\s+(the|a)\s' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
  rg -n '//\s*(Check|Verify|Validate|Ensure)\s+(if|that|whether)' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
  rg -n '//\s*(Update|Set|Get|Fetch|Load)\s+(the|data|state|result)' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
  rg -n '//\s*Helper\s+(function|method|utility)' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
  rg -n '//\s*(Returns?|Yields?)\s+(the|a)\s' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "critical|useless-comments|${line}|${content}"
  done
}

detect_foreach() {
  local file="$1"
  rg -n '\.forEach\s*\(' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "high|for-each-in-react|${line}|${content}"
  done
}

detect_unnecessary_index() {
  local file="$1"
  rg -n '\(\s*\w+\s*,\s*index\s*(,\s*\w+)?\s*\)\s*=>' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "high|unnecessary-index|${line}|${content}"
  done
}

detect_over_abstraction() {
  local file="$1"
  # Short helper functions (under ~80 chars body)
  rg -n '(function\s+(get|handle|process|format)\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>)' "$file" 2>/dev/null | while IFS=: read -r line content; do
    # Only flag if the function body is very short
    local next_line=$((line + 1))
    local body
    body=$(sed -n "${next_line}p" "$file" 2>/dev/null || echo "")
    if [[ ${#body} -lt 60 ]]; then
      echo "high|over-abstraction|${line}|${content}"
    fi
  done
}

detect_ts_in_jsx() {
  local file="$1"
  # Only check .jsx files
  if [[ "$file" != *.jsx ]]; then return; fi
  rg -n '(:\s*(string|number|boolean|any|void|never|object|\w+\[\]))\s*[=,)]' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "high|ts-in-jsx|${line}|${content}"
  done
}

detect_missing_consolelog() {
  local file="$1"
  local has_fetch has_log
  has_fetch=$(rg -c '(fetch|axios|useEffect|useState)' "$file" 2>/dev/null || echo "0")
  has_log=$(rg -c 'console\.' "$file" 2>/dev/null || echo "0")
  if [[ "$has_fetch" -gt 0 && "$has_log" -eq 0 ]]; then
    echo "medium|missing-consolelog|1|File uses API/state but has no console.log"
  fi
}

detect_premature_memo() {
  local file="$1"
  rg -n '(useMemo|useCallback)\s*\(' "$file" 2>/dev/null | while IFS=: read -r line content; do
    echo "medium|premature-memo|${line}|${content}"
  done
}

detect_wrapper_component() {
  local file="$1"
  # Very rough heuristic: function that just returns children
  rg -n 'function\s+\w+.*\{' "$file" 2>/dev/null | while IFS=: read -r line content; do
    local next_lines
    next_lines=$(sed -n "$((line+1)),$((line+3))p" "$file" 2>/dev/null || echo "")
    if echo "$next_lines" | rg -q 'return\s+\(?[\s]*<[a-z]+\{children\}' 2>/dev/null; then
      echo "medium|wrapper-component|${line}|${content}"
    fi
  done
}

# --- Run detection on all files ---
RESULTS_FILE=$(mktemp)
trap 'rm -f "$RESULTS_FILE"' EXIT

for file in "${FILES[@]}"; do
  [[ ! -f "$file" ]] && continue
  rel_path="${file#$PROJECT_ROOT/}"

  detect_verbose_vars "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_useless_comments "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_foreach "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_unnecessary_index "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_over_abstraction "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_ts_in_jsx "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_missing_consolelog "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
  detect_premature_memo "$file" | while IFS='|' read -r sev id line content; do
    echo "${sev}|${id}|${rel_path}|${line}|${content}" >> "$RESULTS_FILE"
  done
done

# --- Filter by severity ---
if [[ -n "$SEVERITY_FILTER" ]]; then
  grep "^${SEVERITY_FILTER}|" "$RESULTS_FILE" > "${RESULTS_FILE}.filtered" 2>/dev/null || true
  mv "${RESULTS_FILE}.filtered" "$RESULTS_FILE"
fi

# --- Output ---
TOTAL=$(wc -l < "$RESULTS_FILE" | tr -d ' ')
CRITICAL=$(grep -c '^critical|' "$RESULTS_FILE" 2>/dev/null || echo "0")
HIGH=$(grep -c '^high|' "$RESULTS_FILE" 2>/dev/null || echo "0")
MEDIUM=$(grep -c '^medium|' "$RESULTS_FILE" 2>/dev/null || echo "0")

if [[ "$OUTPUT_JSON" == "true" ]]; then
  echo "{"
  echo "  \"summary\": {"
  echo "    \"total\": $TOTAL,"
  echo "    \"critical\": $CRITICAL,"
  echo "    \"high\": $HIGH,"
  echo "    \"medium\": $MEDIUM"
  echo "  },"
  echo "  \"findings\": ["
  FIRST=true
  while IFS='|' read -r sev id file line content; do
    [[ -z "$sev" ]] && continue
    [[ "$FIRST" == "true" ]] && FIRST=false || echo ","
    # Escape quotes in content for JSON
    safe_content=$(echo "$content" | sed 's/"/\\"/g' | sed 's/^[[:space:]]*//')
    printf '    {"severity":"%s","pattern":"%s","file":"%s","line":%s,"content":"%s"}' \
      "$sev" "$id" "$file" "$line" "$safe_content"
  done < "$RESULTS_FILE"
  echo ""
  echo "  ]"
  echo "}"
else
  echo "=== AI Slop Detection Report ==="
  echo "Project: $PROJECT_ROOT"
  echo "Files scanned: ${#FILES[@]}"
  echo "Total findings: $TOTAL (critical: $CRITICAL, high: $HIGH, medium: $MEDIUM)"
  echo ""
  if [[ $TOTAL -gt 0 ]]; then
    echo "Findings:"
    echo "---"
    while IFS='|' read -r sev id file line content; do
      [[ -z "$sev" ]] && continue
      safe_content=$(echo "$content" | sed 's/^[[:space:]]*//')
      printf "[%s] %s:%s — %s\n" "$sev" "$file" "$line" "$id"
      echo "         $safe_content"
    done < "$RESULTS_FILE"
  else
    echo "No AI slop detected! Code looks human."
  fi
fi

# --- Save report ---
REPORT="$OUTPUT_DIR/ai-slop-report.txt"
cp "$RESULTS_FILE" "$REPORT" 2>/dev/null || true
echo ""
echo "Report saved to: $REPORT"
