# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Expo Zustanded & Authed** is a reusable Expo (React Native) app template written in TypeScript, using Bun.js as the primary runtime (Node.js also supported). It ships with a fully wired auth system (email/password, phone/OTP, Google, Apple, Facebook), an interfaced adapter pattern so developers can swap auth backends in one line, persistent sessions, push notifications, and OTA updates via `expo-updates` — ready to fork and customize.

## Commands

```bash
# Install dependencies
bun install

# Start Expo dev server
bun run start          # or: npx expo start

# Platform-specific
bun run ios
bun run android
bun run web

# Lint
bun run lint

# Type check
bun run tsc

# Run tests (once configured)
bun test
bun test path/to/file.test.ts   # single file

# EAS (requires eas-cli: bun add -g eas-cli)
eas login                                         # authenticate once
eas init                                          # link project (run after fork)
eas build --profile development                   # native dev build
eas build --profile production                    # production build
eas update --channel production --message "..."   # push OTA update
```

## Architecture

### Routing — `/app`

File-based routing via Expo Router. Auth guards live in layout files:

- `(auth)/_layout.tsx` — redirects authenticated users to `(tabs)/`
- `(tabs)/_layout.tsx` — redirects unauthenticated users to `(auth)/login`
- Root `_layout.tsx` initializes auth hydration, notifications, and OTA check on mount

### Auth System — `/store` + `/utils/auth` + `/storage`

Auth state lives in a **Zustand** store (`store/authStore.ts`). All auth actions flow through a swappable `AuthAdapter` interface:

```text
Screen → authStore action → AuthAdapter (REST/Supabase/etc.) → sessionStorage (SecureStore)
```

- **Adapter interface**: `utils/auth/adapters/types.ts`
- **Default adapter**: `utils/auth/adapters/RestApiAdapter.ts` — fetch-based, points at `EXPO_PUBLIC_AUTH_BASE_URL`
- **Supabase stub**: `utils/auth/adapters/SupabaseAdapter.ts` — swap in one line in `utils/auth/index.ts`
- **Strategies**: `utils/auth/strategies/` — one file per provider (emailPassword, phoneOtp, google, apple, facebook)
- **Session storage**: `storage/session.ts` — SecureStore wrappers for `accessToken`, `refreshToken`, `user`

To swap the backend, edit `utils/auth/index.ts → getAuthAdapter()`.

### Notifications — `/utils/notifications`

- `setup.ts` — requests permissions and registers the Expo push token; stores token in `notificationStore`
- `handlers.ts` — sets up `addNotificationReceivedListener` / `addNotificationResponseReceivedListener`

Both are called from root `_layout.tsx` on mount.

### OTA Updates — `/utils/updates`

- `checkForUpdate.ts` — wraps `expo-updates`: checks, fetches, and reloads. No-ops when `Updates.isEnabled === false` (Expo Go / dev builds).
- `useOtaUpdate.ts` — hook for manual update checks in settings screens: `{ isChecking, isUpdateAvailable, applyUpdate }`

OTA check runs automatically on cold launch via root `_layout.tsx`. Ship updates with:

```bash
eas update --channel production --message "what changed"
```

A new native build is required when adding/removing native packages or changing `app.json` plugins.

### Internationalization — `/locales` + `/i18n` + `/store/i18nStore.ts`

Multi-language support via `i18next` + `react-i18next` + `expo-localization`. The template ships English and Spanish.

- **Translation files**: `locales/en/` and `locales/es/` — 5 namespaces: `common`, `auth`, `errors`, `home`, `profile`
- **i18n singleton**: `i18n/index.ts` — initialized with static resources; `compatibilityJSON: 'v4'` for Hermes
- **Supported languages**: `i18n/config.ts` → `SUPPORTED_LANGUAGES` array and `LanguageCode` type
- **Store**: `store/i18nStore.ts` — `_initialize` (reads AsyncStorage → device locale → `'en'`), `setLanguage` (persists + calls `i18n.changeLanguage`)
- **Type safety**: `types/i18n.ts` — module augmentation so every `t()` call is checked against JSON keys at compile time
- **Language picker**: `components/ui/LanguageSelector.tsx` — shown in the Profile screen
- **OS-level locale declaration**: declared in `app.json` via the `expo-localization` config plugin (enables per-app language in iOS/Android system settings)

**To add a new language:**

1. Create `locales/{code}/` with the same 5 JSON files as `en/`
2. Add the locale to the `resources` object in `locales/index.ts`
3. Add an entry to `SUPPORTED_LANGUAGES` in `i18n/config.ts`
4. Add the locale code to `supportedLocales.ios` and `supportedLocales.android` in `app.json`
5. Trigger a new native build (the `app.json` plugin change requires it)

### Key directories

| Path                   | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `/app`                 | Expo Router screens and layouts                                         |
| `/components`          | Shared UI components (NativeWind-styled)                                |
| `/styles`              | Global theme tokens (colors, spacing, font sizes)                       |
| `/assets`              | Images, fonts, splash assets                                            |
| `/utils/auth`          | Auth adapter interface, concrete adapters, per-provider strategies      |
| `/utils/notifications` | Push notification setup and handlers                                    |
| `/utils/updates`       | OTA update logic and hook                                               |
| `/types`               | Shared TypeScript types (User, AuthResult, OtpChannel, route params)    |
| `/storage`             | SecureStore (session.ts) and AsyncStorage (preferences.ts) abstractions |
| `/constants`           | Routes, config values (reads `EXPO_PUBLIC_*` env vars)                  |
| `/store`               | Zustand stores: authStore, notificationStore                            |

### Data flow

```text
Screen → Zustand store action → AuthAdapter → backend API
                               ↓
                         sessionStorage (SecureStore)
```

Components read auth state from `useAuthStore`; they never call storage or auth APIs directly.

## Environment variables

All runtime config is read from `EXPO_PUBLIC_*` variables (see `.env.example`). Key ones:

| Variable                           | Used in                                            |
| ---------------------------------- | -------------------------------------------------- |
| `EXPO_PUBLIC_AUTH_BASE_URL`        | `RestApiAdapter` — base URL for all auth endpoints |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID`     | Google Sign-In (web/Android)                       |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` | Google Sign-In (iOS)                               |
| `EXPO_PUBLIC_FACEBOOK_APP_ID`      | Facebook SDK init                                  |
| `EXPO_PUBLIC_PROJECT_ID`           | Expo push token registration                       |

## Styling

NativeWind v4 (Tailwind CSS). All components use `className` props. Global CSS entry is `global.css` — imported first in `app/_layout.tsx`. Theme tokens are also available as JS in `styles/theme.ts` for use in StyleSheet or inline style props.
