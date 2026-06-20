# Contributing

Thanks for your interest in improving this template. A few things to know before you start:

**This is a starter template, not an app.** Contributions should make it a better foundation for others to build on — new auth strategies, improved adapter patterns, better DX tooling, documentation fixes. App-specific features that only one project would want are out of scope.

## Setup

```sh
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/Exatoon27/expo-zustanded-authed.git
cd expo-zustanded-authed

# 2. Install dependencies
bun install

# 3. Copy the environment template and fill in your values
cp .env.example .env

# 4. Start the dev server
bun run start
```

## Architecture to understand before contributing

Auth changes almost always touch the adapter layer. The data flow is:

```text
Screen → useAuthStore (Zustand) → AuthAdapter interface → backend / SDK
                                          ↓
                                  sessionStorage (SecureStore)
```

- **`utils/auth/adapters/types.ts`** — the `AuthAdapter` interface. Any new auth method must be added here first.
- **`utils/auth/adapters/RestApiAdapter.ts`** — the default adapter. Changes here affect all users of the template.
- **`utils/auth/strategies/`** — one file per provider (email, phone, Google, Apple, Facebook). New providers go here.
- **`store/authStore.ts`** — Zustand store that calls the adapter. Keep this thin; logic belongs in strategies.

## Commit convention

Commits follow the format `type(app-zone):short-desc`.

| Part         | Description                      | Examples                                                |
| ------------ | -------------------------------- | ------------------------------------------------------- |
| `type`       | Kind of change                   | `feat`, `fix`, `chore`, `docs`, `refactor`, `test`      |
| `app-zone`   | Area of the codebase             | `auth`, `notifications`, `updates`, `store`, `ui`, `ci` |
| `short-desc` | Imperative, lowercase, no period | `add google refresh token logic`                        |

```text
feat(auth):add biometric login strategy
fix(store):clear tokens on session expiry
chore(ci):pin setup-bun to v2
docs(auth):document supabase adapter swap
```

## Before opening a PR

Run all three checks locally — CI will enforce them anyway:

```sh
bun run lint         # ESLint
bun run tsc          # TypeScript type-check
bun run format:check # Prettier
```

Auto-fix everything that can be fixed automatically:

```sh
bun run lint:fix
bun run format
```

## Submitting

1. Push your branch to your fork
2. Open a PR against `main` in this repo
3. Fill out the PR template — especially the breaking changes section if your change affects the adapter interface or session storage shape
