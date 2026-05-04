# Plan — Add a New WebNews Page

This plan introduces the ability for an admin user to create a brand-new WebNews **page** (a tile on the `/admin/webnews/newspages` grid) without editing source code. It follows **Approach 1** from the brainstorming session.

## It covers:

2. the Page schema addition
3. seeding the 33 existing pages
4. the addPage server action with transactional shift-down logic
5. the new /admin/webnews/new-page form
6. the data-driven rewrite of the newspages grid
7. the side-effect updates to webNewsDeletePage
8. The side-effect to update-page
9. an 8-step implementation order
10. a manual-verification checklist
11. an explicit out-of-scope list.

## 1. Goal & Decisions Recap

| Decision                                  | Choice                                                                                                                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Page existence                            | **Option B** — pages are first-class entities, stored in their own table, exist independently of `WebNews` records.                                                                                                                                 |
| Position model                            | User picks**(column 1–5, row 1–7)** when adding a page. Insert shifts existing pages in the target column down by one row. Filler count rebalances automatically at render time.                                                                     |
| Display labels                            | **Option C** — only the internal `name` is stored and displayed. Pretty labels (e.g. `EtenDrinken` → "Eten en drinken") are dropped.                                                                                                             |
| First "type" inside a new page            | **Option B** — no placeholder record is stored. After creating the page, the user is redirected to the existing "Add WebNews" form with `page` and `type='New'` pre-filled. The "New" type only materialises when the first real record is saved. |
| Coupling between `Page` and `WebNews` | **Loose** — `WebNews.page` stays a plain string; **no foreign key**. Existing code paths keep working unchanged.                                                                                                                              |

## 2. Schema Change

Add a new model to [prisma/schema.prisma](prisma/schema.prisma):

```prisma
model Page {
  id        String   @id @default(uuid())
  name      String   @unique
  column    Int
  row       Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([column, row])
}
```

- `name` matches the string already stored in `WebNews.page` (e.g. `EtenDrinken`, `AHK_Hero_Group`).
- `@@unique([column, row])` enforces that no two pages occupy the same grid cell.
- No change is made to the existing `WebNews` model.

Apply with:

```bash
npx prisma db push
npx prisma generate
```

## 3. Seed Existing Pages

Existing pages must be inserted into the new `Page` table with the same positions they have in the current hardcoded grid in [src/app/admin/webnews/newspages/page.tsx](src/app/admin/webnews/newspages/page.tsx).

Create a one-shot seed script at `prisma/seed-pages.ts` that runs:

```text
Col 1 — row 1: DHZ, 2: DHZ-Hulp, 3: DHZ-Machine, 4: DHZ-Ruimtes, 5: Gereedschap, 6: Verhuizing
Col 2 — row 1: Hobby, 2: Wielrennen, 3: EtenDrinken, 4: Energie, 5: Metamorfose, 6: LivDobZim, 7: Linux
Col 3 — row 1: JavaScript-React, 2: NextJS, 3: Software-2, 4: Software-3, 5: Software-4, 6: Deploy-Hosting, 7: AutoHotkey
Col 4 — row 1: Packages, 2: Packages-2, 3: Databases, 4: CSS-HTML-HTTP, 5: MS, 6: Web-DB-OS-GitHub, 7: AI
Col 5 — row 1: Divers, 2: Moestuin, 3: Tuin, 4: Tuin-Inrichting, 5: AHK_Hero_Group
```

Run once with `npx tsx prisma/seed-pages.ts`.

**Inconsistency to resolve during seeding:** the current grid links to `/admin/webnews/AHK-Hero-Group/display` but the count function uses `'AHK_Hero_Group'`. The plan seeds with `AHK_Hero_Group` (the form actually present in the database). The link in the rebuilt grid will use the same name.

## 4. New Server Action — `addPage`

Add to [src/app/admin/_actions/webnews.ts](src/app/admin/_actions/webnews.ts):

```ts
const pageSchema = z.object({
  name:   z.string().trim().min(1),
  column: z.coerce.number().int().min(1).max(5),
  row:    z.coerce.number().int().min(1).max(7),
})

export async function addPage(prevState: unknown, formData: FormData) { ... }
```

### Algorithm

1. Parse and validate input (`name`, `column`, `row`).
2. Reject if a page with the same `name` already exists → return field-level error.
3. **Shift** all existing `Page` rows where `column = input.column` AND `row >= input.row` by `row += 1` (single `updateMany` is not enough because of the unique constraint — see "Implementation note" below).
4. **Insert** the new `Page` at `(input.column, input.row)`.
5. `revalidatePath('/admin/webnews/newspages')`.
6. **Redirect** to `/admin/webnews/{name},New,1/new-record` so the existing `WebNewsForm` reads the comma-separated path segment and pre-fills `page=name`, `type=New`, `column=1`.

### Implementation note — shifting under a unique constraint

Because `@@unique([column, row])` would block any intermediate state, perform the shift in a single Prisma `$transaction`:

- Fetch the affected pages ordered by `row DESC`.
- Update them one by one, **highest row first**, incrementing `row` by 1.
- Then create the new page.

This avoids transient duplicate keys.

### Two cases from the user spec — both handled by the same algorithm

- **Target column has fillers.** Shifting one or more existing rows down does not push anyone past the visible bottom; the column simply contains one more page. The render-time filler count for that column drops by 1 (one `<p></p>` "disappears"). ✅
- **Target column has no fillers** (already 7 pages). Shifting still works; the column now holds 8 pages. The grid auto-grows to 8 rows; every other column gains one extra `<p></p>` filler at render time. ✅

## 5. New Route — Add Page Form

New file: `src/app/admin/webnews/new-page/page.tsx`

- Server component renders an `AddPageForm` client component.
- `AddPageForm` uses `useFormState` against `addPage` from the actions file.
- Three inputs: `name` (text), `column` (number 1–5), `row` (number 1–7).
- Submit button labelled **Add Page**.
- Field-level error messages rendered below each input (matches the pattern used in [WebNewsForm.tsx](src/app/admin/webnews/_components/WebNewsForm.tsx)).
- Cancel link back to `/admin/webnews/newspages`.

## 6. Refactor Newspages Grid

Rewrite [src/app/admin/webnews/newspages/page.tsx](src/app/admin/webnews/newspages/page.tsx) so it is fully data-driven:

1. Query `Page` and `WebNews.type` in parallel:
   ```ts
   const [pages, webnews] = await Promise.all([
     db.page.findMany({ orderBy: [{ column: 'asc' }, { row: 'asc' }] }),
     db.webNews.findMany({ select: { page: true, type: true } }),
   ])
   ```
2. Compute `maxRow = max(p.row for p in pages)` (default 7 if no pages).
3. Build a 2-D lookup `cells[col][row] = Page | null`.
4. Render an `<a>` tile when `cells[col][row]` is a Page, otherwise a `<p></p>` filler.
5. Tile shows `page.name` and the comma-separated list of types for that page (computed via the existing `getTypesPerPage` helper, which can stay as-is).
6. Apply `grid-cols-5 grid-flow-col` and a dynamic `grid-rows-{maxRow}` (or inline style `gridTemplateRows: repeat(${maxRow}, minmax(0, 1fr))`).
7. Add a clearly-visible **"Add Page"** button (e.g. shadcn `Button asChild` linking to `/admin/webnews/new-page`) at the top of the section.

The existing `getTypesPerPage` helper remains useful and is reused.

## 7. Side Effects on `webNewsDeletePage`

The current `webNewsDeletePage` (in [_actions/webnews.ts](src/app/admin/_actions/webnews.ts)) only deletes `WebNews` rows. Once a `Page` row exists, deleting all WebNews records for that page should also delete the `Page` row, otherwise an empty tile remains on the grid.

Update `webNewsDeletePage(page: string)`:

1. Delete `WebNews` rows where `page = page` (existing behaviour).
2. **Also** `db.page.delete({ where: { name: page } })` if a row exists.
3. Revalidate `/admin/webnews/newspages`.

(Cells in the column where the page was placed compact at next render, because pages with higher `row` are *not* shifted up — the gap simply renders as a `<p></p>`. If automatic compaction is desired later, add a follow-up shift; out of scope for this plan.)

## 8. Side Effects on `update-page` (Page Rename)

The existing [update-page](src/app/admin/webnews/[id]/update-page/page.tsx) flow renames a page across all `WebNews` records but does not touch a `Page` row. Update its inline server action so that, after updating WebNews records, it also runs:

```ts
await db.page.update({
  where: { name: id },                  // old name from URL param
  data:  { name: updatePageData.page }, // new name from form
})
```

Wrap both updates in a `$transaction` so they succeed or fail together.

## 9. Step-by-Step Implementation Order

1. Update `prisma/schema.prisma`, run `npx prisma db push` and `npx prisma generate`.
2. Write and run `prisma/seed-pages.ts` (one-shot — verify in `npx prisma studio` that all 33 existing pages are present with the listed coordinates).
3. Add `addPage` server action in [src/app/admin/_actions/webnews.ts](src/app/admin/_actions/webnews.ts) including the transactional shift-down logic.
4. Create `src/app/admin/webnews/new-page/page.tsx` and the client `AddPageForm`.
5. Refactor [src/app/admin/webnews/newspages/page.tsx](src/app/admin/webnews/newspages/page.tsx) to be data-driven and add the "Add Page" button.
6. Update `webNewsDeletePage` to also delete the `Page` row.
7. Update the inline action in [admin/webnews/[id]/update-page/page.tsx](src/app/admin/webnews/[id]/update-page/page.tsx) to also rename the `Page` row in the same transaction.
8. Manual verification (see §10).

## 10. Manual Verification Checklist

- [ ] Existing grid renders identically in shape after seeding (33 tiles in their original cells, fillers in the right places).
- [ ] `/admin/webnews/new-page` renders the form. Submitting valid data creates the page and redirects to the prefilled "Add WebNews" form with `page=<name>`, `type=New`, `column=1`.
- [ ] Inserting at a position currently occupied by a page shifts that page (and any below it in the same column) down by one row. The column's filler count decreases by one.
- [ ] Inserting into a column already at 7 entries grows the grid to 8 rows for everyone; other columns gain one `<p></p>` filler.
- [ ] Inserting at a position that is already a `<p></p>` filler simply fills that cell — no other page moves.
- [ ] Submitting a duplicate `name` returns a field-level error and does not mutate the database.
- [ ] Submitting `column` outside 1–5 or `row` outside 1–7 returns a field-level error.
- [ ] Renaming a page via `update-page` updates both the `Page` row and all related `WebNews` rows.
- [ ] Deleting a page via `delete-page` removes both the `WebNews` rows and the `Page` row; the tile disappears from the grid.

## 11. Out of Scope

- DB-level foreign key from `WebNews.page` → `Page.name` (could be added later if referential integrity is desired).
- Drag-and-drop reordering of pages on the grid.
- Compacting columns automatically after deletion.
- Restoring the prettier display labels (`Eten en drinken` etc.) — explicitly dropped per Option C.
