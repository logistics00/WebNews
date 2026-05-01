# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3005
npm run build        # Production build
npm run lint         # ESLint
npm run email        # React Email dev server on port 3011
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Push schema changes to SQLite database
npx prisma studio    # Open Prisma database browser
```

## Architecture

### Route Groups (App Router)
- `(customerFacing)/` - Public routes (home, products, orders, Stripe checkout)
- `admin/` - Protected admin dashboard with product/user/order management
- `api/` - REST endpoints for auth, file upload, YouTube integration

### Key Directories
- `src/actions/` - Server actions for email operations
- `src/app/admin/_actions/` - Server actions for admin CRUD (products, webnews, users, orders)
- `src/components/ui/` - shadcn/ui components
- `src/db/db.ts` - Prisma singleton client
- `src/email/` - React Email templates
- `src/lib/cache.ts` - Hybrid caching (React cache + Next.js unstable_cache)

### Database (Prisma + SQLite)
Models: Product, User, Order, DownloadVerification, WebNews

The WebNews model stores hierarchical content (page → type → column) with core1-core8 metadata fields.

### Authentication
NextAuth v4 with credentials provider. Admin credentials validated against `ADMIN_USERNAME` and hashed `HASHED_PASSWORD` env vars. Password hashing uses SHA-256.

### Patterns
- Server actions use Zod validation and return field-level errors
- Forms use `useFormState`/`useFormStatus` for progressive enhancement
- Cache revalidation via `revalidatePath()` after mutations
- Suspense boundaries with skeleton loaders for async data
- Custom `logging()` function writes to `/logging/logging.json` for debugging
- Dutch (nl-NL) locale for currency/number formatting in `src/lib/formatters.ts`

### File Storage
- Product files: `/products/`
- Images: `/public/images/`
- Files use UUID-based names

### External Services
- Stripe for payments
- Resend for transactional emails
- YouTube Data API for video metadata
