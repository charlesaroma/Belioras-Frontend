#!/usr/bin/env bash
# rewrite.sh — Automated AI slop rewriter with safeguards
# Usage: ./rewrite.sh [--dry-run] [--file path] [--pattern verbose-vars] [--yes]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DRAFTS="$SCRIPT_DIR/drafts"
REPORT="$DRAFTS/ai-slop-report.txt"

mkdir -p "$DRAFTS"

# --- Parse args ---
DRY_RUN=false
SINGLE_FILE=""
PATTERN_FILTER=""
AUTO_YES=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --file) SINGLE_FILE="$2"; shift 2 ;;
    --pattern) PATTERN_FILTER="$2"; shift 2 ;;
    --yes|-y) AUTO_YES=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# --- Safety checks ---
if [[ ! -f "$REPORT" ]]; then
  echo "No detection report found. Run detect.sh first."
  echo "  ./detect.sh"
  exit 1
fi

TOTAL=$(wc -l < "$REPORT" | tr -d ' ')
if [[ "$TOTAL" -eq 0 ]]; then
  echo "No findings to rewrite. Code looks clean!"
  exit 0
fi

echo "=== AI Slop Rewriter ==="
echo "Project: $PROJECT_ROOT"
echo "Findings to process: $TOTAL"
[[ "$DRY_RUN" == "true" ]] && echo "Mode: DRY RUN (no files will be modified)"
echo ""

# --- Rewrite rules ---
# Each rule: pattern_id | search | replace
apply_rewrites() {
  local file="$1"
  local pattern_id="$2"
  local rel_path="${file#$PROJECT_ROOT/}"

  case "$pattern_id" in
    verbose-vars)
      # Rename verbose AI variable names to short ones
      # This is conservative — only renames obvious AI patterns in local scope
      sed -i '' \
        -e 's/\bfetchedUserData\b/userData/g' \
        -e 's/\bfetchedProducts\b/products/g' \
        -e 's/\bfetchedCategories\b/categories/g' \
        -e 's/\bfetchedData\b/data/g' \
        -e 's/\bretrievedItems\b/items/g' \
        -e 's/\btransformedResult\b/result/g' \
        -e 's/\bnormalizedResponse\b/res/g' \
        -e 's/\baggregatedData\b/data/g' \
        -e 's/\bsanitizedInput\b/input/g' \
        -e 's/\bprocessedItems\b/items/g' \
        -e 's/\bcompiledOutput\b/output/g' \
        -e 's/\bcomputedValue\b/value/g' \
        -e 's/\bderivedState\b/state/g' \
        -e 's/\bhydratedResponse\b/res/g' \
        -e 's/\bmaterializedView\b/view/g' \
        "$file"
      echo "  ✓ Renamed verbose variables in $rel_path"
      ;;

    useless-comments)
      # Remove comments that explain what the code obviously does
      # Preserve comments that explain WHY (strategy, caveat, TODO)
      local tmpfile
      tmpfile=$(mktemp)
      while IFS= read -r line; do
        # Skip lines that are obvious AI comments
        if echo "$line" | rg -q '//\s*(Function|Component)\s+(that|to)?\s*(handles?|manages?|renders?|displays?|processes?)' 2>/dev/null; then
          continue
        fi
        if echo "$line" | rg -q '//\s*(Set up|Initialize|Configure|Create|Define)\s+(the|a)\s' 2>/dev/null; then
          continue
        fi
        if echo "$line" | rg -q '//\s*(Check|Verify|Validate|Ensure)\s+(if|that|whether)' 2>/dev/null; then
          continue
        fi
        if echo "$line" | rg -q '//\s*(Update|Set|Get|Fetch|Load)\s+(the|data|state|result)' 2>/dev/null; then
          continue
        fi
        if echo "$line" | rg -q '//\s*Helper\s+(function|method|utility)' 2>/dev/null; then
          continue
        fi
        if echo "$line" | rg -q '//\s*(Returns?|Yields?)\s+(the|a)\s' 2>/dev/null; then
          continue
        fi
        echo "$line" >> "$tmpfile"
      done < "$file"
      mv "$tmpfile" "$file"
      echo "  ✓ Removed useless comments in $rel_path"
      ;;

    for-each-in-react)
      # Flag but don't auto-rewrite — needs human judgment
      echo "  ⚠ forEach found in $rel_path — manual rewrite needed (use for...of or map)"
      ;;

    unnecessary-index)
      # Remove unused index parameter
      sed -i '' \
        -e 's/(\(\w\+\), index)/(\1)/g' \
        -e 's/(\(\w\+\), index, \(\w\+\))/(\1, \2)/g' \
        "$file"
      echo "  ✓ Removed unnecessary index param in $rel_path"
      ;;

    ts-in-jsx)
      # Remove TypeScript annotations from JSX files
      # Conservative: only removes obvious type annotations
      sed -i '' \
        -e 's/: string\b//g' \
        -e 's/: number\b//g' \
        -e 's/: boolean\b//g' \
        -e 's/: any\b//g' \
        -e 's/: void\b//g' \
        -e 's/: never\b//g' \
        "$file"
      echo "  ✓ Removed TS annotations from $rel_path"
      ;;

    missing-consolelog)
      # Add console.log after API calls or state changes
      # Only adds if there's a fetch or axios call without logging
      if ! rg -q 'console\.' "$file" 2>/dev/null; then
        if rg -q 'fetch\(' "$file" 2>/dev/null; then
          # Add console.log after fetch calls — conservative, just flag it
          echo "  ⚠ $rel_path uses fetch() but has no console.log — add manually"
        fi
      fi
      ;;

    premature-memo)
      # Flag for manual review — memoization might be intentional
      echo "  ⚠ useMemo/useCallback in $rel_path — check if actually needed"
      ;;

    *)
      echo "  ? Unknown pattern: $pattern_id in $rel_path — skipping"
      ;;
  esac
}

# --- Process findings ---
PROCESSED=0
SKIPPED=0

while IFS='|' read -r sev id file line content; do
  [[ -z "$sev" ]] && continue

  # Filter by pattern if specified
  if [[ -n "$PATTERN_FILTER" && "$id" != "$PATTERN_FILTER" ]]; then
    continue
  fi

  # Filter by single file if specified
  if [[ -n "$SINGLE_FILE" && "$file" != "$SINGLE_FILE" ]]; then
    continue
  fi

  full_path="$PROJECT_ROOT/$file"
  [[ ! -f "$full_path" ]] && continue

  # Skip files outside src/
  if [[ "$file" != src/* ]]; then
    continue
  fi

  echo "[$sev] $file:$line — $id"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  → Would apply: $id"
    ((PROCESSED++)) || true
  else
    if [[ "$AUTO_YES" == "false" ]]; then
      read -rp "  Apply rewrite? [y/N] " confirm
      if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "  Skipped."
        ((SKIPPED++)) || true
        continue
      fi
    fi
    apply_rewrites "$full_path" "$id"
    ((PROCESSED++)) || true
  fi
done < "$REPORT"

echo ""
echo "=== Done ==="
echo "Processed: $PROCESSED"
echo "Skipped: $SKIPPED"
[[ "$DRY_RUN" == "true" ]] && echo "(Dry run — no files were modified)"
