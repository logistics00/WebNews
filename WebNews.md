# WebNews — Login Issue Analysis

**Date:** 2026-04-27
**Question:** When the app starts it expects Google login, but I want username/password login. Why, and how to fix?

---

## Short answer

The root page at `/` (`src/app/page.tsx`) **is itself a hardcoded "Login with Google" page**. It does not use NextAuth and has no username/password form. Username/password support exists in the codebase, but lives on a different route (`/login`) that the user never reaches because the navigation bar is commented out in the root layout.

On top of that, the project currently contains **two parallel NextAuth setups and two parallel login back-ends** that disagree about which provider is active. This needs to be cleaned up before the username/password flow becomes the default.

---

## Findings (evidence)

### 1. The root page is the Google login page

`src/app/page.tsx` (lines 1–19) is a client component whose entire body is a button that redirects to `https://accounts.google.com/o/oauth2/v2/auth...`. It does not import NextAuth, does not render a credentials form, and does not redirect anywhere else. So the moment you open `http://localhost:3005/` you see Google login — there is no other code path on `/`.

### 2. A working username/password page already exists at `/login`

`src/app/login/page.tsx` already contains:
- A green "Login" button that triggers Google OAuth (`handleGoogleAuth`, lines 13–21).
- A toggle "Of login als admin" that reveals an admin username/password form (lines 67–139).
- The form POSTs to `/api/admin/login` and redirects to `/admin` on success (lines 23–43).

This page is reachable only by typing `/login` manually. The `<Nav>` block in `src/app/layout.tsx` (lines 23–30) — which contains the link to `/login` — is **commented out**, so there is no UI affordance to get there.

### 3. There are TWO NextAuth configurations and they disagree

| File | Providers | Notes |
|---|---|---|
| `src/app/api/auth/[...nextauth]\route.ts` | **CredentialsProvider only** (Google block is commented out, lines 13–17) | Defines `pages.signIn = '/auth/signin'` (line 50), but the `src/app/auth/signin/` folder **does not exist** |
| `src/auth.ts` | **Google only** (no Credentials) | Exports `auth`, `handlers`, `signIn`, `signOut`. Used by `src/app/playlists/page.tsx` |

So:
- The NextAuth route handler (the one that actually serves `/api/auth/*`) is configured correctly for credentials, but it redirects to a non-existent custom sign-in page.
- The `auth()` helper imported elsewhere in the app comes from `src/auth.ts`, which only knows about Google.

### 4. There are TWO login back-ends doing the same job

| Endpoint | Mechanism | Used by |
|---|---|---|
| `src/app/api/admin/login/route.ts` | Sets a plain `admin_logged_in` cookie (24 h) | The form on `/login` (`src/app/login/page.tsx`) |
| `src/app/api/auth/[...nextauth]\route.ts` (CredentialsProvider) | Standard NextAuth session | Nothing in the UI calls `signIn('credentials', …)` today |

Both check `ADMIN_USERNAME` and `HASHED_ADMIN_PASSWORD`, hashing the password with SHA-256. The CLAUDE.md mentions `HASHED_PASSWORD` but the actual code uses `HASHED_ADMIN_PASSWORD` — minor doc drift.

### 5. Net effect

- Open `/` → hardcoded Google button (the page complained about).
- `/login` → works for username/password, but only via the cookie route, and is not linked from anywhere.
- NextAuth credentials provider exists but is unreachable from the UI.

---

## Options to fix (pick one, then I'll plan it)

**Option A — Smallest change.** Replace `src/app/page.tsx` with a `redirect('/login')`, and re-enable the `<Nav>` in `src/app/layout.tsx`. Username/password keeps working through the existing cookie route. No NextAuth cleanup.

**Option B — Make `/` the credentials login page.** Move the body of `src/app/login/page.tsx` into `src/app/page.tsx` (or delete `page.tsx` and rename), and re-enable the Nav. Same back-end as Option A.

**Option C — Consolidate on NextAuth (recommended for correctness).**
1. Delete `src/auth.ts` *or* rewrite it to import the same provider list as the route handler so `auth()` and `signIn()` are consistent.
2. Either create `src/app/auth/signin/page.tsx` to match the `pages.signIn` setting, or remove that line so NextAuth uses its default page.
3. Replace the form in `src/app/login/page.tsx` so it calls NextAuth's `signIn('credentials', { username, password })` instead of the cookie endpoint.
4. Decide whether to keep `/api/admin/login` and the `admin_logged_in` cookie at all (probably delete — duplicate of NextAuth).
5. Make `/` either redirect to `/login` or render the form directly.

**Option D — Keep Google too.** Same as C, but also re-enable `GoogleProvider` in the route handler and keep both login buttons on the page.

---

## Open questions for you

1. Do you want **only** username/password, or username/password **plus** Google as an option?
2. Should I keep the standalone cookie-based `/api/admin/login` route, or migrate everything to NextAuth?
3. Should the entry URL `/` *be* the login form, or should it redirect to `/login`?
4. Should I re-enable the navigation bar in `layout.tsx` as part of this change?

Once you answer these I'll write a plan to a file you specify, and wait for your "implement" before touching code.
