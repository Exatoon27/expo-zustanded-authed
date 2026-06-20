# Setup.ps1 — First-time setup for Expo Zustanded & Authed
# Usage: pwsh Setup.ps1
#Requires -Version 7

$ErrorActionPreference = 'Stop'

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Header ($msg) { Write-Host "`n━━  $msg" -ForegroundColor Cyan }
function Write-Ok     ($msg) { Write-Host "  v $msg"  -ForegroundColor Green }
function Write-Warn   ($msg) { Write-Host "  ! $msg"  -ForegroundColor Yellow }
function Write-Fail   ($msg) { Write-Host "  x $msg"  -ForegroundColor Red; exit 1 }

function Read-WithDefault {
    param([string]$Prompt, [string]$Default)
    $inp = Read-Host "  $Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($inp)) { $Default } else { $inp }
}
function Read-Optional {
    param([string]$Prompt)
    Read-Host "  $Prompt (optional — Enter to skip)"
}

function Set-EnvValue {
    param([string]$Key, [string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) { return }
    $raw = Get-Content .env -Raw
    if ($raw -match "(?m)^$([regex]::Escape($Key))=") {
        $raw = $raw -replace "(?m)^$([regex]::Escape($Key))=.*", "$Key=$Value"
    } else {
        $raw = $raw.TrimEnd() + "`n$Key=$Value`n"
    }
    [System.IO.File]::WriteAllText((Resolve-Path .env).Path, $raw, [System.Text.Encoding]::UTF8)
}

# ── Header ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Expo Zustanded & Authed  —  Setup       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
Write-Header "Prerequisites"

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Fail "bun not found — install from https://bun.sh"
}
Write-Ok "bun $(bun --version)"

if (-not (Get-Command eas -ErrorAction SilentlyContinue)) {
    Write-Warn "eas-cli not found — installing globally..."
    bun add -g eas-cli
}
Write-Ok "eas-cli found"

# ── 2. Install dependencies ───────────────────────────────────────────────────
Write-Header "Dependencies"
bun install
Write-Ok "Packages installed"

# ── 3. Environment file ───────────────────────────────────────────────────────
Write-Header "Environment"
if (Test-Path .env) {
    Write-Warn ".env already exists — skipping (delete it to start fresh)"
} else {
    Copy-Item .env.example .env
    Write-Ok ".env created from .env.example"
}

# ── 4. App identity ───────────────────────────────────────────────────────────
Write-Header "App identity"
$appName     = Read-WithDefault "Display name"          "MyApp"
$appSlug     = Read-WithDefault "Slug (URL-friendly)"   "my-app"
$bundleId    = Read-WithDefault "iOS bundle identifier" "com.yourcompany.myapp"
$packageName = Read-WithDefault "Android package name"  "com.yourcompany.myapp"

# ── 5. Credentials ────────────────────────────────────────────────────────────
Write-Header "Credentials (all optional — edit .env later)"
$authBaseUrl       = Read-Optional "Auth backend URL"
$googleClientId    = Read-Optional "Google Client ID (web/Android)"
$googleClientIdIos = Read-Optional "Google Client ID (iOS)"
$facebookAppId     = Read-Optional "Facebook App ID"

# ── 6. Patch app.json ─────────────────────────────────────────────────────────
Write-Header "Patching app.json"
$env:APP_NAME     = $appName
$env:APP_SLUG     = $appSlug
$env:BUNDLE_ID    = $bundleId
$env:PACKAGE_NAME = $packageName

bun -e @"
const { readFileSync, writeFileSync } = require('fs');
const j = JSON.parse(readFileSync('app.json', 'utf8'));
j.expo.name                 = process.env.APP_NAME;
j.expo.slug                 = process.env.APP_SLUG;
j.expo.ios.bundleIdentifier = process.env.BUNDLE_ID;
j.expo.android.package      = process.env.PACKAGE_NAME;
writeFileSync('app.json', JSON.stringify(j, null, 2) + '\n');
"@
Write-Ok "app.json updated"

# ── 7. Patch .env ─────────────────────────────────────────────────────────────
Set-EnvValue "EXPO_PUBLIC_AUTH_BASE_URL"        $authBaseUrl
Set-EnvValue "EXPO_PUBLIC_GOOGLE_CLIENT_ID"     $googleClientId
Set-EnvValue "EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS" $googleClientIdIos
Set-EnvValue "EXPO_PUBLIC_FACEBOOK_APP_ID"      $facebookAppId
Write-Ok ".env updated"

# ── 8. EAS login + init ───────────────────────────────────────────────────────
Write-Header "EAS setup"
Write-Host "  You will be prompted to log in and link your Expo project."
Write-Host ""
eas login
eas init

# ── 9. Sync project ID → updates.url ─────────────────────────────────────────
Write-Header "Finalizing"
$projectId = bun -e @"
const j = require('./app.json');
process.stdout.write(j.expo?.extra?.eas?.projectId ?? '');
"@ 2>$null

if ($projectId -and $projectId -ne 'YOUR_EXPO_PROJECT_ID') {
    $env:PROJECT_ID = $projectId
    bun -e @"
const { readFileSync, writeFileSync } = require('fs');
const j = JSON.parse(readFileSync('app.json', 'utf8'));
j.expo.updates.url = 'https://u.expo.dev/' + process.env.PROJECT_ID;
writeFileSync('app.json', JSON.stringify(j, null, 2) + '\n');
"@
    Set-EnvValue "EXPO_PUBLIC_PROJECT_ID" $projectId
    Write-Ok "updates.url -> https://u.expo.dev/$projectId"
} else {
    Write-Warn "Project ID not found — set updates.url in app.json manually"
}

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           Setup complete!                  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Still to do manually:" -ForegroundColor White
Write-Host "  * Add icon.png, splash.png, adaptive-icon.png -> assets/images/"
Write-Host "  * Apple Sign In -> developer.apple.com"
Write-Host "  * Wire OTP in your backend (POST /auth/otp/send + /auth/otp/verify)"
Write-Host ""
Write-Host "Next commands:" -ForegroundColor White
Write-Host "  eas build --profile development   # dev client build"
Write-Host "  bun run start                     # Expo dev server"
Write-Host ""
