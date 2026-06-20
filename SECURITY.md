# Security Policy

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report them through [GitHub's private security advisory system](https://github.com/Exatoon27/expo-zustanded-authed/security/advisories/new). This keeps the details confidential until a fix is available.

Include in your report:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- The affected file(s) or component (e.g., `RestApiAdapter`, `storage/session.ts`)

**Response timeline:** This is a solo-maintained project. I will acknowledge reports within 7 days and aim to release a fix or advisory within 30 days, depending on severity.

## Supported Versions

This template tracks the **latest stable Expo SDK** only. Older SDK versions are not backported. Update to the latest version before reporting a vulnerability.

## Scope

### In scope (this template is responsible for)

- Secure token storage — access and refresh tokens stored via `expo-secure-store`, never `AsyncStorage`
- OAuth flow integrity — PKCE, state parameter, and nonce handling in `expo-auth-session`
- Session lifecycle — token refresh, logout, and clearing stored credentials on sign-out
- Sensitive data in transit — no secrets logged to the console in production code

### Out of scope (your responsibility after forking)

- **Backend security** — endpoint authentication, rate limiting, CORS, and SQL injection on your API
- **Key management** — protecting `EXPO_PUBLIC_*` variables and client secrets in your deployment
- **App Store / Play Store** — binary security, code obfuscation, certificate pinning
- **Third-party SDKs** — vulnerabilities in Google, Apple, Facebook, or Supabase SDKs themselves

## Security Considerations for Forks

When you fork this template:

1. **Never commit `.env`** — the `.gitignore` excludes it, but double-check before pushing
2. **Rotate secrets immediately** if you accidentally expose them in a commit
3. **Review `RestApiAdapter.ts`** before connecting it to a real backend — the template ships with a generic implementation that assumes a standard REST API shape
4. **Enable Dependabot** — the `.github/dependabot.yml` in this repo keeps dependencies current; make sure it is active on your fork
