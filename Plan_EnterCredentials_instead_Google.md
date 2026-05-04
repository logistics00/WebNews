## Questions:

1. Do you have access to the MP100? If yes, please copy the .env file from there to this folder — that will solve a big part of the problem in one step. Without it, we can regenerate the hash from
   scratch, but you'll need to tell me the username/password you want.
2. Where do you want to land first when you run npm run dev?
   - (a) The customerFacing home page (product catalog), with /login available when you click "Login"; OR
   - (b) Directly on the username/password login screen at /?
3. Google entirely gone, or kept as a secondary option?
4. Are src/app/login/page copy.tsx and src/app/login/page_Real_Old.tsx safe to delete as part of cleanup? (Both are identical Google-only stubs — Next.js will not route to them, but they clutter the
   folder.)

## Answers

❯ Ad 1: No, so regenerate.
  Ad 2: b
  Ad 3: Gone
  Ad ❯ Ad 1: No, so regenerate.

## Extra questions

1. What username and password do you want for the admin login? I need both values so I can compute the SHA-256 base64 hash and put it in .env. (You can change either later by re-hashing.)
2. Where do you want me to write the plan file? Suggestion: C:\Sync\JavaScript\Prog\NextJS\courses\WDS\WebNews\Login_Plan.md — but tell me if you'd prefer a different path or filename.
3. What about /login? You want / to show the username/password form. Should /login (a) become the same form (kept as a synonym for /), (b) redirect to /, or (c) be deleted entirely? I'd recommend (a) —
4. keeps any old bookmarks working — but say the word.

## Answers

Ad 1: Niek, 642642 (I will rehash the password)

Ad 2: Ad The plan to the end of this file.
Ad 3: a

---

## Plan — Make `/` the username/password login and remove Google

### Goal

- Visiting `http://localhost:3005/` opens a username/password login screen. No Google references anywhere.
- `/login` shows the same form (synonym for `/`).
- After successful login the user lands on `/admin`, with `admin_logged_in=true` cookie set (already implemented in `/api/admin/login`).

## Quick summary of the plan

- Resolves the duplicate-/ route by moving the catalog home page to /home.
- Rewrites src/app/page.tsx and src/app/login/page.tsx as identical clean username/password forms (no Google, no toggle).
- Deletes Google-only code: src/auth.ts, the [...nextauth] route, and the two stale login/page backups.
- Fixes the broken auth() call in src/app/playlists/page.tsx by replacing it with a cookie check.
- Creates .env with ADMIN_USERNAME=Niek and the SHA-256(base64) hash of 642642 (1vndeamKA11tHm6gBKSVpeIi6Cs74rRyUFKN5eQ1jYo=), plus the one-liner to rehash later.
- Calls out three things explicitly not done (Stripe/Resend/YouTube env vars, /admin middleware protection, the npm run email script's questionable .env copy).

## Step 1 — Resolve the `/` route conflict

Currently two files both map to `/`:

- `src/app/page.tsx`
- `src/app/(customerFacing)/page.tsx` (the "Most Popular / Newest" catalog homepage)

Action: move the catalog homepage out of the way so `/` is unambiguously the login.

- Move `src/app/(customerFacing)/page.tsx` → `src/app/(customerFacing)/home/page.tsx`.
- Result: catalog homepage becomes reachable at `/home`. (If you'd rather delete it outright, say so before I implement.)

Created feature branch feature/username-password-login (per CLAUDE.md "always work on feature branches")

Moved src/app/(customerFacing)/page.tsx → src/app/(customerFacing)/home/page.tsx using git mv (preserves history as a rename)

The catalog homepage will be reachable at /home; / is now unambiguously controlled by src/app/page.tsx

### Step 2 — Replace `src/app/page.tsx` with a username/password form

Rewrite the file as a clean username/password login form:

- Two fields: username (text), password (password). Error message area. Submit button.
- POST to `/api/admin/login` with `{ username, password }`.
- On `response.ok`: `router.push('/admin')`.
- On failure: show "Ongeldige gebruikersnaam of wachtwoord".
- No Google references, no toggles.


- src/app/page.tsx rewritten as a username/password form
- Two fields (username text, password password), error area, submit button
- POST to /api/admin/login with { username, password }; on response.ok → router.push('/admin'); on failure → "Ongeldige gebruikersnaam of wachtwoord"
- All Google references removed; no toggle

### Step 3 — Make `/login` mirror `/`

Replace `src/app/login/page.tsx` with the same form as Step 2 (no Google, no `showAdminLogin` toggle). Keeps any old bookmarks to `/login` working.

src/app/login/page.tsx now contains the same clean username/password form as src/app/page.tsx — no Google, no showAdminLogin toggle. Old /login bookmarks will continue to work and show identical behavior to /.

### Step 4 — Delete obsolete Google-only files

- `src/app/login/page copy.tsx` — delete.
- `src/app/login/page_Real_Old.tsx` — delete.

### Step 5 — Remove Google + redundant NextAuth code

- Delete `src/auth.ts` (Google-only; also written in NextAuth v5 syntax while the project has v4 installed — it cannot have been working).
- Delete `src/app/api/auth/[...nextauth]/route.ts` (the v4 NextAuth Credentials route — unused once we rely on the simpler `/api/admin/login` cookie route).
- Delete the now-empty `src/app/api/auth/[...nextauth]/` and `src/app/api/auth/` directories.
- Update `src/app/playlists/page.tsx`:
  - Remove `import { auth } from "@/auth"`.
  - Replace `const session = await auth()` with a cookie check using `cookies()` from `next/headers`:
    ```typescript
    import { cookies } from "next/headers"
    const cookieStore = await cookies()
    const isLoggedIn = cookieStore.get("admin_logged_in")?.value === "true"
    ```
  - Replace the "ingelogd met Google" message and `session.user?.name` reference with a neutral "Welkom" (the cookie carries no user name).


- Deleted src/auth.ts (Google-only NextAuth v5 file — staged)
- Deleted src/app/api/auth/[...nextauth]/route.ts (staged); the empty [...nextauth]/ and auth/ parent dirs were cleaned up by git rm
- Modified src/app/playlists/page.tsx:
  - Removed import { auth } from "@/auth"
  - Replaced await auth() with cookies() check on admin_logged_in
  - Replaced "ingelogd met Google" / session.user?.name with neutral "Welkom"

### Step 6 — Create `.env`

Create `C:\Sync\JavaScript\Prog\NextJS\courses\WDS\WebNews\.env` with:

```
ADMIN_USERNAME=Niek
HASHED_ADMIN_PASSWORD=1vndeamKA11tHm6gBKSVpeIi6Cs74rRyUFKN5eQ1jYo=
```

The hash above is SHA-256(base64) of `642642`, matching the `hashPassword()` function in `src/app/api/admin/login/route.ts`.

To rehash later with a different password:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('NEW_PASSWORD').digest('base64'))"
```

Paste the output into `HASHED_ADMIN_PASSWORD`.

### Step 7 — Verify

- `npm run dev`
- Open `http://localhost:3005/` → username/password form appears. No Google anywhere on the page.
- Submit `Niek` / `642642` → browser navigates to `/admin`, devtools shows `admin_logged_in=true` cookie.
- Open `http://localhost:3005/login` → same form, same behavior.
- `npm run lint` passes.

### Out of scope (intentionally not touched)

- **Stripe / Resend / YouTube / `NEXT_PUBLIC_SERVER_URL` env vars.** Missing values only break their own code paths; not relevant to the login fix. Add them back if/when you need those features.
- **`/admin` access protection.** There is no middleware checking the `admin_logged_in` cookie before serving `/admin/*` — anyone who knows the URL can visit it directly. Hardening this needs a separate `middleware.ts` and is a follow-up plan, not part of this fix.
- **`npm run email` script.** Its `cp .env ./node_modules/react-email` step will now succeed once `.env` exists, but it copies admin credentials into `node_modules` — questionable hygiene. Not addressed here.

### Files that will change (summary)

| Action  | Path                                                                                |
| ------- | ----------------------------------------------------------------------------------- |
| Move    | `src/app/(customerFacing)/page.tsx` → `src/app/(customerFacing)/home/page.tsx` |
| Rewrite | `src/app/page.tsx`                                                                |
| Rewrite | `src/app/login/page.tsx`                                                          |
| Modify  | `src/app/playlists/page.tsx`                                                      |
| Delete  | `src/app/login/page copy.tsx`                                                     |
| Delete  | `src/app/login/page_Real_Old.tsx`                                                 |
| Delete  | `src/auth.ts`                                                                     |
| Delete  | `src/app/api/auth/[...nextauth]/route.ts` (and empty parent dirs)                 |
| Create  | `.env`                                                                            |

Awaiting your "implement" before any of this is executed.

## Step 8: Still ToDo


● Three separate things, each one a known issue the plan deliberately did not touch:

1. Middleware-level /admin protection
   The login form sets a cookie admin_logged_in=true, and pages like playlists/page.tsx check that cookie themselves. But /admin and /admin/* pages currently do not check it — anyone who types
   http://localhost:3005/admin straight into the address bar lands inside the admin dashboard without ever logging in. Closing that hole needs a middleware.ts file at the project root that intercepts
   every request to /admin/*, checks the cookie, and redirects to / if it's missing. That's a small but separate piece of work.
2. Stripe / Resend / YouTube env vars
   The codebase still talks to three external services:

- Stripe — payment checkout (needs STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.)
- Resend — sends transactional emails (needs RESEND_API_KEY)
- YouTube Data API — fetches video metadata (needs YOUTUBE_API_KEY or similar)

  If any of those keys are missing or wrong, only the feature that uses them breaks (checkout fails, email doesn't send, YouTube lookup throws). The login flow we just fixed is unaffected. Since you
  copied the original .env from MP100, they're probably already there — but if any of those features later misbehave, that .env is the first place to check.

3. The npm run email script copying .env into node_modules
   Look at package.json — the email script is something like cp .env ./node_modules/react-email && email dev …. It physically copies your .env file (which now contains your admin password hash, Stripe
   keys, etc.) into the node_modules/react-email/ folder so the React Email dev server can read those vars. That's poor hygiene because:

- node_modules/ gets blown away and reinstalled regularly — your secrets get written there each time.
- If you ever zip up node_modules or share it, the secrets travel with it.
- Most other tooling expects .env only to live at the project root.

  Fixing it would mean either passing env vars to React Email a different way, or limiting what's copied. Not urgent, just worth knowing.
