#!/usr/bin/env bash
# Setup.sh — First-time setup for Expo Zustanded & Authed
# Usage: bash Setup.sh   or   chmod +x Setup.sh && ./Setup.sh
set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

header()   { echo -e "\n${CYAN}${BOLD}━━  $*${RESET}"; }
ok()       { echo -e "${GREEN}  ✓ $*${RESET}"; }
warn()     { echo -e "${YELLOW}  ⚠ $*${RESET}"; }
die()      { echo -e "${RED}  ✗ $*${RESET}"; exit 1; }

ask_default() {   # ask_default <VAR> "<prompt>" "<default>"
  local _d="$3"
  read -rp "  $2 [${_d}]: " _inp
  eval "$1=\"\${_inp:-\${_d}}\""
}
ask_optional() { # ask_optional <VAR> "<prompt>"
  read -rp "  $2 (optional — Enter to skip): " _inp
  eval "$1=\"\${_inp:-}\""
}

# ── Header ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
echo "╔════════════════════════════════════════════╗"
echo "║   Expo Zustanded & Authed  —  Setup       ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${RESET}"

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
header "Prerequisites"

command -v bun >/dev/null 2>&1 || die "bun not found — install from https://bun.sh"
ok "bun $(bun --version)"

if ! command -v eas >/dev/null 2>&1; then
  warn "eas-cli not found — installing globally..."
  bun add -g eas-cli
fi
ok "eas-cli $(eas --version 2>/dev/null | head -1)"

# ── 2. Install dependencies ───────────────────────────────────────────────────
header "Dependencies"
bun install
ok "Packages installed"

# ── 3. Environment file ───────────────────────────────────────────────────────
header "Environment"
if [ -f .env ]; then
  warn ".env already exists — skipping (delete it to start fresh)"
else
  cp .env.example .env
  ok ".env created from .env.example"
fi

# ── 4. App identity ───────────────────────────────────────────────────────────
header "App identity"
APP_NAME="MyApp"
APP_SLUG="my-app"
BUNDLE_ID="com.yourcompany.myapp"
PACKAGE_NAME="com.yourcompany.myapp"

ask_default APP_NAME     "Display name"          "MyApp"
ask_default APP_SLUG     "Slug (URL-friendly)"   "my-app"
ask_default BUNDLE_ID    "iOS bundle identifier" "com.yourcompany.myapp"
ask_default PACKAGE_NAME "Android package name"  "com.yourcompany.myapp"

# ── 5. Credentials ────────────────────────────────────────────────────────────
header "Credentials (all optional — edit .env later)"
ask_optional AUTH_BASE_URL         "Auth backend URL"
ask_optional GOOGLE_CLIENT_ID      "Google Client ID (web/Android)"
ask_optional GOOGLE_CLIENT_ID_IOS  "Google Client ID (iOS)"
ask_optional FACEBOOK_APP_ID       "Facebook App ID"

# ── 6. Patch app.json ─────────────────────────────────────────────────────────
header "Patching app.json"
export APP_NAME APP_SLUG BUNDLE_ID PACKAGE_NAME
bun -e "
const { readFileSync, writeFileSync } = require('fs');
const j = JSON.parse(readFileSync('app.json', 'utf8'));
j.expo.name                 = process.env.APP_NAME;
j.expo.slug                 = process.env.APP_SLUG;
j.expo.ios.bundleIdentifier = process.env.BUNDLE_ID;
j.expo.android.package      = process.env.PACKAGE_NAME;
writeFileSync('app.json', JSON.stringify(j, null, 2) + '\n');
"
ok "app.json updated"

# ── 7. Patch .env ─────────────────────────────────────────────────────────────
set_env() {
  local key="$1" val="$2"
  [ -z "$val" ] && return
  if grep -q "^${key}=" .env 2>/dev/null; then
    sed -i.bak "s|^${key}=.*|${key}=${val}|" .env && rm -f .env.bak
  else
    printf '\n%s=%s' "$key" "$val" >> .env
  fi
}

set_env "EXPO_PUBLIC_AUTH_BASE_URL"         "${AUTH_BASE_URL:-}"
set_env "EXPO_PUBLIC_GOOGLE_CLIENT_ID"      "${GOOGLE_CLIENT_ID:-}"
set_env "EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS"  "${GOOGLE_CLIENT_ID_IOS:-}"
set_env "EXPO_PUBLIC_FACEBOOK_APP_ID"       "${FACEBOOK_APP_ID:-}"
ok ".env updated"

# ── 8. EAS login + init ───────────────────────────────────────────────────────
header "EAS setup"
echo "  You will be prompted to log in and link your Expo project."
echo ""
eas login
eas init

# ── 9. Sync project ID → updates.url ─────────────────────────────────────────
header "Finalizing"
PROJECT_ID=$(bun -e "
const j = require('./app.json');
process.stdout.write(j.expo?.extra?.eas?.projectId ?? '');
" 2>/dev/null || echo "")

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "YOUR_EXPO_PROJECT_ID" ]; then
  export PROJECT_ID
  bun -e "
const { readFileSync, writeFileSync } = require('fs');
const j = JSON.parse(readFileSync('app.json', 'utf8'));
j.expo.updates.url = 'https://u.expo.dev/' + process.env.PROJECT_ID;
writeFileSync('app.json', JSON.stringify(j, null, 2) + '\n');
  "
  set_env "EXPO_PUBLIC_PROJECT_ID" "$PROJECT_ID"
  ok "updates.url → https://u.expo.dev/${PROJECT_ID}"
else
  warn "Project ID not found — set updates.url in app.json manually"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}"
echo "╔════════════════════════════════════════════╗"
echo "║           Setup complete! 🎉              ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${RESET}"
echo -e "${BOLD}Still to do manually:${RESET}"
echo "  • Add icon.png, splash.png, adaptive-icon.png → assets/images/"
echo "  • Apple Sign In → developer.apple.com"
echo "  • Wire OTP in your backend (POST /auth/otp/send + /auth/otp/verify)"
echo ""
echo -e "${BOLD}Next commands:${RESET}"
echo "  eas build --profile development   # dev client build"
echo "  bun run start                     # Expo dev server"
echo ""
