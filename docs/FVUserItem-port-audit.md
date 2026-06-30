# Code-standard cleanups — `feat/fv-user-item`

Scope of this document: **only** changes that improve coding standards **and** are guaranteed to produce **byte-identical rendered UI and identical runtime behaviour** for every current usage. Each item below is type-only, a no-op removal, a pure refactor with identical DOM output, or VCS hygiene. Nothing here changes a class name, an element, a prop's effect, the public component API in a way a consumer or end-user can observe, or the icon artwork.

Findings from the original audit that would change UI, behaviour, the public API surface, Storybook output, or that require new design assets are intentionally **not** included — see "Out of scope" at the end.

---

## 1. Type-only: `UserDisplayNameContainer` props should extend `HTMLAttributes`

`src/components/UserDisplayNameContainer/UserDisplayNameContainer.tsx:14`

The props are a bare `type` that manually re-declares `className`, `style`, `aria-label`, and `children`. Every other component extends `React.HTMLAttributes<…>` (`Badge.tsx:51`, `Pill.tsx:35`, `CreatorCard.tsx:5`).

- **Change:** convert to `interface UserDisplayNameContainerProps extends React.HTMLAttributes<HTMLElement>`, dropping the hand-rolled `className`/`style`/`aria-label`/`children` declarations (they come from the base) and keeping the component-specific props (`ambassador`, `verified`, `variant`, `component`, `mt`, etc.).
- **Why output-identical:** purely a compile-time type change. The runtime already spreads `...props`; `HTMLElement` is the correct base for a polymorphic element. No rendered attribute, class, or element changes.
- **Verify:** `pnpm typecheck` + existing tests unchanged.

## 2. Type-only: replace open `string` props with unions

`UserDisplayNameContainer.tsx:22` (`color?: string`), `:33` (`variant?: string`)

The repo types variant/enum-like props as unions (`BadgeVariant`, `PillVariant`, `AvatarSize`).

- **Change:** `variant?: "body2SemiBold" | "body1SemiBold" | "subtitle1" | "heading4" | "captionRegular"` (a named `UserDisplayNameVariant` type), and narrow `color?: "white"` (the only value the runtime acts on).
- **Why output-identical:** the runtime logic (`variantClassMap[variant ?? "body2SemiBold"] ?? fallback` and `color === "white"`) is untouched; every value used today (incl. the `OnWhiteText` story's `color="white"`) still resolves identically. This only tightens the accepted type at compile time.
- **Verify:** `pnpm typecheck`; the Storybook `argTypes` options already match the union.

## 3. Refactor: de-duplicate the badge `<span>` blocks (identical DOM)

`UserDisplayNameContainer.tsx:104-122`

The ambassador and verified branches are near-identical `<span role="img" aria-label … className="…relative -top-[25%] ml-2 inline-flex h-full translate-y-[25%] items-center …"><VerifiedIcon className="size-4" /></span>` blocks differing only by the tint class and the label.

- **Change:** render one span from a tiny local lookup, e.g. `const badge = ambassador ? { label: ambassadorLabel, tint: "text-icons-brand-green" } : verified ? { label: verifiedLabel, tint: "text-content-primary" } : null;` and emit a single span when `badge` is set. Preserve the `ambassador`-wins-over-`verified` precedence exactly.
- **Why output-identical:** the emitted markup must be the **same class string (same order), same `role="img"`, same `aria-label`, same `<VerifiedIcon className="size-4" />`** — so the DOM is byte-for-byte identical for all three states (ambassador / verified / neither). This is a readability/DRY change only.
- **Verify:** existing `UserDisplayNameContainer` badge tests (precedence, labels, `role="img"`) pass without edits.

## 4. Remove the `@deprecated` no-op props from `UserHandleTypography`

`src/components/UserHandleTypography/UserHandleTypography.tsx:7-16` (type) and `:33-37` (destructure)

`color`, `variant`, `component`, `fontSize`, `pl` are all `@deprecated` and discarded (destructured into `_`-prefixed throwaways). They were deprecated in the *original app* component; a brand-new DS component shouldn't ship pre-deprecated dead API.

- **Change:** delete these five props from both the interface and the destructure (props **and** their behaviour go together — but note the behaviour is already nil). Remove the now-obsolete "deprecated props" test case in `UserHandleTypography.test.tsx`.
- **Not an exception to the "no observable difference" rule:** these props have **no functionality to remove** — all five are destructured into `_`-prefixed throwaways and never referenced; the `<span>`'s classes are hardcoded. So there is nothing behavioural to strip out.
- **Why output-identical:** they are inert no-ops today (explicitly destructured out, so they never reach the DOM), they are **new in this PR** (zero existing consumers), and the only internal caller (`UserItem`) passes none of them. Rendered output and runtime behaviour are unchanged for every real usage. The sole effect of removal is type-level: an accidental future use is caught at compile time instead of being silently ignored — not something an end-user or current consumer can observe.
- **Verify:** `pnpm typecheck`; `UserHandleTypography` + `UserItem` render tests pass; handle still renders `@{children}` with the same classes.

## 5. VCS hygiene: clear the staged `AmbassadorIcon`

`src/components/Icons/AmbassadorIcon.tsx`

`git status` shows `AD` — staged as added, then deleted on disk. The file is correctly gone with no code references, but the staged tree doesn't match the working tree.

- **Change:** `git add -A` (or `git rm --cached`) so the deletion is reflected in the index before committing.
- **Why output-identical:** affects only the git index, not source or build output. Nothing is imported from it.
- **Verify:** `git status` clean for that path; `grep -r AmbassadorIcon src` returns nothing.

---

## Suggested order

1, 2, 4 (type/no-op, lowest risk) → 3 (refactor, verify DOM identical via tests) → 5 (commit hygiene). Run `pnpm typecheck && pnpm test` after each; all suites should stay green with no test output assertions changed (except deleting the obsolete deprecated-props test in §4).

## Out of scope (would change UI, behaviour, public API, Storybook, or need new assets)

| Original finding | Why excluded under the "no observable difference" rule |
|---|---|
| Convert `VerifiedIcon` to prop-based `BaseIcon` (`size`/`filled`, 16/24/32) | Needs 16/32 artwork we don't have; changes icon geometry/API and rendered output. |
| Restore the two-tone icon artwork | Current monochrome `currentColor` icon is what ships; reverting changes the visuals. |
| Rename `VerifiedIcon` (used for ambassador too) | Renaming a public export is a breaking API change for consumers. |
| Remove MUI-style layout props (`mt`/`pt`/`maxWidth`/`textAlign`/`component`/`color`) and the inline-`style` block | Removes props / element polymorphism that callers and the `OnWhiteText` story rely on; changes API and output. |
| Replace `color==="white"` with a call-site `className` | Requires removing the `color` prop → API/output change (the story uses it). |
| Add `verified`/`ambassador`/slot props to `UserItem` | Additive new functionality, not an output-neutral refactor. |
| `badge?: "ambassador" \| "verified"` single prop | Removes the existing boolean props → API change. |
| Un-export / keep-internal `ProfileOnlineStatus` | Changes the public export surface. |
| Add Figma `design` param to stories | Needs Figma URLs; adds a visible Storybook "Design" panel (a difference) and is content, not a refactor. |
| `avatarSize: AvatarSize \| number` | `AvatarSize \| number` collapses to `number` in TS — no real safety gain. |
| `cn` import-alias normalisation | New files already match their folder's local convention; changing risks churn for no behavioural gain. |
