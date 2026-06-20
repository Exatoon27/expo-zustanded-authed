# Expo Zustanded & Authed

A production-ready [Expo](https://expo.dev) (React Native) template with a fully wired authentication system, push notifications, and OTA updates. Fork it, configure your providers, and start building — without setting up auth from scratch.

## What's included

- **Auth system** — email/password, phone/OTP (SMS + WhatsApp), Google, Apple, and Facebook, all built as an interfaced adapter pattern so you can swap backends in two lines
- **Persistent sessions** — sessions survive app restarts via `expo-secure-store`
- **Zustand store** — global auth state, no prop drilling
- **Push notifications** — permissions, token registration, and foreground/background handlers wired at startup
- **OTA updates** — `expo-updates` configured with `useOtaUpdate` hook; updates are checked on every cold launch
- **NativeWind** — Tailwind CSS utility classes for React Native
- **File-based routing** — Expo Router with auth-guarded layouts
- **TypeScript** throughout

---

## Quick setup

Run the interactive setup script — it installs dependencies, patches `app.json`, fills `.env`, and runs `eas login` + `eas init` for you:

```bash
# macOS / Linux
bash Setup.sh

# Windows (PowerShell 7+)
pwsh Setup.ps1
```

Or follow the manual checklist below.

---

## Setup checklist

Complete every step below after forking. The app will not fully work until all items are checked.

| #   | Step                                                                                            | Where                                                    |
| --- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | `bun install`                                                                                   | terminal                                                 |
| 2   | Copy `.env.example` → `.env` and fill in all values                                             | root                                                     |
| 3   | `eas login` then `eas init` (links your Expo account)                                           | terminal                                                 |
| 4   | Replace `YOUR_EXPO_PROJECT_ID` in `app.json` with your real project ID                          | `app.json`                                               |
| 5   | Set your app `name`, `slug`, `bundleIdentifier` (iOS), `package` (Android)                      | `app.json`                                               |
| 7   | Add splash / icon images to `assets/images/`                                                    | `assets/images/`                                         |
| 8   | Point `EXPO_PUBLIC_AUTH_BASE_URL` at your backend                                               | `.env`                                                   |
| 9   | Create Google OAuth credentials (Web + iOS + Android client IDs)                                | [Google Cloud Console](https://console.cloud.google.com) |
| 10  | Configure Apple Sign In (Service ID + key)                                                      | [Apple Developer](https://developer.apple.com)           |
| 11  | Create a Facebook App and enable Facebook Login                                                 | [Meta for Developers](https://developers.facebook.com)   |
| 12  | Configure your backend for Phone/OTP — expose `POST /auth/otp/send` and `POST /auth/otp/verify` | your backend                                             |
| 13  | `eas build --profile development` to create a dev build on device                               | terminal                                                 |
| 14  | `eas update --channel production` to push your first OTA update                                 | terminal                                                 |

---

## Auth adapter pattern

All auth calls go through a single `AuthAdapter` interface (`utils/auth/adapters/types.ts`). The default implementation is `RestApiAdapter`, which calls your backend REST endpoints. To swap:

```ts
// utils/auth/index.ts — change one line
import { SupabaseAdapter } from './adapters/SupabaseAdapter';

export function getAuthAdapter(): AuthAdapter {
  return new SupabaseAdapter({
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseAnonKey: 'your-anon-key',
  });
}
```

The `SupabaseAdapter` stub lives at `utils/auth/adapters/SupabaseAdapter.ts` with TODO comments guiding the implementation.

### Expected REST endpoints (default adapter)

| Method | Path                    | Body                         | Returns      |
| ------ | ----------------------- | ---------------------------- | ------------ |
| POST   | `/auth/login`           | `{ email, password }`        | `AuthResult` |
| POST   | `/auth/register`        | `{ email, password, name? }` | `AuthResult` |
| POST   | `/auth/otp/send`        | `{ phone, channel }`         | `204`        |
| POST   | `/auth/otp/verify`      | `{ phone, code }`            | `AuthResult` |
| POST   | `/auth/google`          | `{ idToken }`                | `AuthResult` |
| POST   | `/auth/apple`           | `{ identityToken }`          | `AuthResult` |
| POST   | `/auth/facebook`        | `{ accessToken }`            | `AuthResult` |
| POST   | `/auth/logout`          | —                            | `204`        |
| POST   | `/auth/refresh`         | `{ refreshToken }`           | `AuthResult` |
| GET    | `/auth/me`              | —                            | `User`       |
| POST   | `/auth/forgot-password` | `{ email }`                  | `204`        |

`AuthResult` shape: `{ user: User, accessToken: string, refreshToken: string }`

---

## OTA updates

This template uses `expo-updates` to deliver JavaScript bundle updates without going through the app store.

**How it works:**

- On every cold launch, `checkForUpdate()` runs in `app/_layout.tsx`. If an update is available it downloads and reloads automatically.
- In Expo Go / development builds, `Updates.isEnabled` is `false` and the check is skipped silently.

**Shipping an update:**

```bash
eas update --channel production --message "describe what changed"
```

**When you need a new native build** (store submission required):

- Adding or removing a native package
- Changing `app.json` plugins
- Bumping `runtimeVersion` in `app.json`

**Using the hook in a settings screen:**

```tsx
import { useOtaUpdate } from '@/utils/updates/useOtaUpdate';

const { isChecking, isUpdateAvailable, applyUpdate } = useOtaUpdate();
```

---

## Push notifications

The push token is registered on launch and stored in `notificationStore`. To send it to your backend:

```ts
// After the user is authenticated, read from the store:
import { useNotificationStore } from '@/store/notificationStore';

const token = useNotificationStore.getState().pushToken;
// POST to your backend: { userId: user.id, pushToken: token }
```

---

## Project structure

```text
/app
  _layout.tsx              ← Root layout; initializes auth, notifications, OTA
  (auth)/                  ← Unauthenticated screens (login, register, otp, etc.)
  (tabs)/                  ← Authenticated screens (home, profile)

/components
  ui/                      ← Button, Input, LoadingOverlay
  auth/                    ← EmailPasswordForm, PhoneOtpForm, OtpInput, SocialAuthButtons

/utils
  auth/
    adapters/              ← AuthAdapter interface + RestApiAdapter + SupabaseAdapter stub
    strategies/            ← Per-provider helpers (google.ts, apple.ts, facebook.ts, ...)
    index.ts               ← getAuthAdapter() factory — swap your backend here
  notifications/           ← setup.ts (token registration) + handlers.ts (listeners)
  updates/                 ← checkForUpdate.ts + useOtaUpdate hook

/store
  authStore.ts             ← Zustand: user, token, status, all auth actions
  notificationStore.ts     ← Zustand: push token, unread count

/storage
  session.ts               ← SecureStore wrappers for tokens + user
  preferences.ts           ← AsyncStorage wrappers for non-sensitive prefs

/types                     ← User, AuthResult, AuthStatus, OtpChannel, route params
/constants                 ← routes.ts, config.ts (reads EXPO_PUBLIC_* env vars)
/styles                    ← theme.ts (color, spacing, font tokens)
/assets/images             ← icon.png, splash.png, adaptive-icon.png, favicon.png
```

---

## Auth flow

```text
Screen → Zustand store action → AuthAdapter → REST API / Supabase / etc.
                               ↓
                         sessionStorage (SecureStore)
```

On app launch, `authStore._initialize()` reads tokens from SecureStore and calls `adapter.getCurrentUser()` to validate the session. If valid → `authenticated`, if not → `unauthenticated`. Screens never call storage APIs directly.

---

## Scripts

```bash
bun install              # Install dependencies
bun run start            # Start Expo dev server
bun run ios              # iOS simulator
bun run android          # Android emulator
bun run web              # Web browser
bun run lint             # Lint
bun run tsc              # Type check (--noEmit)
eas build --profile development   # Build dev client
eas update --channel production   # Push OTA update
```

---

## Tech stack

| Tool                                                                           | Role                          |
| ------------------------------------------------------------------------------ | ----------------------------- |
| [Expo](https://expo.dev)                                                       | React Native framework        |
| [Expo Router](https://expo.github.io/router)                                   | File-based navigation         |
| [Zustand](https://github.com/pmndrs/zustand)                                   | State management              |
| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)    | Encrypted session storage     |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Push notifications            |
| [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/)             | Over-the-air updates          |
| [NativeWind](https://www.nativewind.dev)                                       | Tailwind CSS for React Native |
| [EAS](https://expo.dev/eas)                                                    | Cloud builds + OTA delivery   |
| TypeScript                                                                     | Type safety                   |
| Bun.js                                                                         | Runtime & package manager     |

## License

MIT
