#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

echo "🔍 Checking for private keys and secrets..."

FOUND_SECRETS=0

# Patterns to check for
declare -A PATTERNS=(
  ["RSA Private Key"]="-----BEGIN (RSA |OPENSSH |DSA |EC |PGP )?PRIVATE KEY"
  ["AWS Access Key"]="(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}"
  ["AWS Secret Key"]="aws_secret_access_key.*['\"][0-9a-zA-Z/+]{40}['\"]"
  ["Generic API Key"]="(api[_-]?key|apikey|api[_-]?secret)['\"]?\s*[:=]\s*['\"][0-9a-zA-Z\-_]{20,}['\"]"
  ["Generic Secret"]="(secret|password|passwd|pwd)['\"]?\s*[:=]\s*['\"][^'\"]{8,}['\"]"
  ["JWT Token"]="eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"
  ["Database URL"]="(postgres|mysql|mongodb|redis)://[^'\"\s]+"
  ["Ethereum Private Key"]="(0x)?[0-9a-fA-F]{64}"
  ["Google API Key"]="AIza[0-9A-Za-z\\-_]{35}"
  ["GitHub Token"]="gh[pousr]_[0-9a-zA-Z]{36}"
  ["Slack Token"]="xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[0-9a-zA-Z]{24,32}"
  ["Stripe Key"]="(sk|pk)_(test|live)_[0-9a-zA-Z]{24,}"
)

# Files to always check (even if not in allowlist)
CRITICAL_FILES=(
  ".env"
  ".env.local"
  ".env.production"
  "config.json"
  "credentials.json"
  "secrets.json"
)

# Check each staged file
for FILE in $STAGED_FILES; do
  # Skip if file doesn't exist (e.g., deleted files)
  if [ ! -f "$FILE" ]; then
    continue
  fi

  # Check if it's a critical file
  BASENAME=$(basename "$FILE")
  IS_CRITICAL=0
  for CRITICAL in "${CRITICAL_FILES[@]}"; do
    if [ "$BASENAME" = "$CRITICAL" ]; then
      IS_CRITICAL=1
      break
    fi
  done

  # Check each pattern
  for PATTERN_NAME in "${!PATTERNS[@]}"; do
    PATTERN="${PATTERNS[$PATTERN_NAME]}"

    # Use grep with Perl regex
    MATCHES=$(grep -nHE "$PATTERN" "$FILE" 2>/dev/null)

    if [ -n "$MATCHES" ]; then
      if [ $FOUND_SECRETS -eq 0 ]; then
        echo ""
        echo -e "${RED}❌ POTENTIAL SECRETS DETECTED!${NC}"
        echo ""
      fi

      FOUND_SECRETS=1
      echo -e "${YELLOW}$PATTERN_NAME found in $FILE:${NC}"
      echo "$MATCHES" | while read -r line; do
        LINE_NUM=$(echo "$line" | cut -d: -f2)
        echo "  Line $LINE_NUM"
      done
      echo ""
    fi
  done

  # Warn about critical files
  if [ $IS_CRITICAL -eq 1 ]; then
    echo -e "${YELLOW}⚠️  Warning: Attempting to commit critical file: $FILE${NC}"
    echo "   Make sure this file doesn't contain real secrets."
    echo ""
  fi
done

if [ $FOUND_SECRETS -eq 1 ]; then
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}Commit blocked to protect sensitive information!${NC}"
  echo ""
  echo "If this is a false positive, you can:"
  echo "  1. Remove the sensitive data and commit again"
  echo "  2. Use git commit --no-verify to skip this check (not recommended)"
  echo ""
  echo "For .env files, consider:"
  echo "  - Adding them to .gitignore"
  echo "  - Creating a .env.example with placeholder values instead"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi

echo "✅ No secrets detected"
exit 0
