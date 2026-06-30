# Audit — `feat/fv-user-item` branch

Audit of the `FVUserItem` port against four lenses: **consistency**, **re-usability**, **extendability**, and **best practices**. No code changes have been made — this is findings only.

## Scope of the branch

New/changed files (17, ~1,177 insertions):

| Area | Files |
|---|---|
| Components | `UserItem/`, `UserDisplayNameContainer/`, `UserHandleTypography/`, `ProfileOnlineStatus/` (each `.tsx` + `.stories.tsx` + `.test.tsx`) |
| Icons | `Icons/VerifiedIcon.tsx` (new), `Icons/AmbassadorIcon.tsx` (added then deleted), `Icons/Icons.test.tsx` (registration) |
| Utils | `utils/getInitials.ts` + `.test.ts` |
| Barrel | `index.ts` (exports) |

Overall the port is solid: every component is a `forwardRef` with `displayName`, JSDoc, a stories file and a test file with axe checks, one-component-per-directory, public exports wired into the root barrel. The findings below are refinements, not blockers — concentrated almost entirely in `UserDisplayNameContainer` and the icon strategy.

---

## 1. Consistency with other components

### 1.1 `UserDisplayNameContainer` props don't follow the repo's prop-type idiom — **High**
`src/components/UserDisplayNameContainer/UserDisplayNameContainer.tsx:14`

Every other component declares an `interface XProps extends React.HTMLAttributes<HTMLElement>` (see `Badge.tsx:51`, `Pill.tsx:35`, `CreatorCard.tsx:5`). `UserDisplayNameContainer` instead uses a bare `type` that *manually re-declares* standard DOM props (`className`, `style`, `aria-label`, `children`) and spreads `...props` onto the element without a typed base. Consequences:
- No standard HTML attribute passthrough typing (e.g. `id`, `data-*`, `onClick` are accepted at runtime via `...props` but aren't in the type).
- Duplicates the React typings the repo gets for free from `HTMLAttributes`.

This is a verbatim carry-over of the original Eden/MUI-style component rather than a re-expression in the DS idiom.

### 1.2 Loose `string` types where the repo uses unions — **Medium**
`UserDisplayNameContainer.tsx:22,33` — `color?: string` and `variant?: string`.

The repo types variant-like props as unions (`BadgeVariant`, `PillVariant`, `AvatarSize`). Here `variant` is an open `string` validated at runtime against `variantClassMap`, and `color` is an open `string` of which only the literal `"white"` does anything (`color === "white"`). This is less discoverable, less type-safe, and inconsistent with the design system. A `UserDisplayNameVariant` union would match the house style.

### 1.3 Stories are missing the Figma `design` parameter — **Medium**
47 of 65 story files in the repo set `parameters.design = { type: "figma", url: ... }` (e.g. `CreatorTile.stories.tsx:15`). None of the four new stories do. If Figma references exist for these, they should be attached for parity with the rest of the catalogue.

### 1.4 `cn` import alias — **Low / informational**
The repo is split (~47 files use `@/utils/cn`, ~58 use `../../utils/cn`). The new files are internally consistent with their neighbours (the `UserItem` family uses `../../utils/cn`; `VerifiedIcon` uses `@/utils/cn` like the rest of `Icons/`), so this is acceptable — noted only so it isn't "fixed" in the wrong direction.

### 1.5 `VerifiedIcon` is a single-size legacy icon, not a prop-based one — **Medium**
`src/components/Icons/VerifiedIcon.tsx`

The dominant icon convention is prop-based via `BaseIcon` with `16/24/32` geometry and `size`/`filled` props (~130 icons; `TickCircleIcon`, `CrownIcon`, etc.). `VerifiedIcon` is a legacy `IconProps` icon (single 24px `viewBox`, sized only via `className`). That pattern does exist (`VipBadgeIcon`, `CheckIcon`), so it's not wrong — but it's the minority and was chosen because only 24px artwork was available. See §2.4 / §4.3 for the re-usability and best-practice angles.

---

## 2. Re-usability (design-system lens)

### 2.1 `VerifiedIcon` is reused to render an "ambassador" badge — **High (semantic)**
`UserDisplayNameContainer.tsx:104-111`

The ambassador branch renders `<VerifiedIcon … />` tinted green; the verified branch renders the same icon tinted `content-primary`. Functionally fine (the artwork is identical), but a consumer importing `VerifiedIcon` to mean "verified" now finds it doubling as the ambassador glyph. Two cleaner options:
- Keep one piece of artwork but export it under a neutral name (e.g. `SealCheckIcon`) and alias/semantic-wrap for both uses, or
- If product ever wants distinct ambassador vs verified art, the current single-icon coupling will need unpicking. Worth a deliberate naming decision now.

### 2.2 MUI-style layout props reduce, rather than aid, reuse — **Medium**
`UserDisplayNameContainer.tsx` — `mt`, `pt` (multiplied by 8 into inline `marginTop`/`paddingTop`), `maxWidth`, `textAlign`, `component`, `color`.

These duplicate what Tailwind + `className` already provide in this DS, and emit inline styles (which can't be overridden by utility classes and don't participate in the token system). They were ported for API-compatibility with the original, but for a fresh DS component they add surface area without adding capability. A `className`-first API (as `Badge`/`Pill`/`CreatorTile` use) is more composable.

### 2.3 `UserItem` can't surface badges or tune the name line — **Medium**
`src/components/UserItem/UserItem.tsx:85`

`UserItem` hard-renders `<UserDisplayNameContainer>{name}</UserDisplayNameContainer>` with no props. A consumer who wants a verified/ambassador badge or a different typography variant inside a `UserItem` cannot — they must drop `UserItem` and re-compose by hand (as the `WithBadgedName` story does). Re-usability would improve by forwarding a typed subset (e.g. `verified`, `ambassador`, `displayNameProps`) or accepting a render slot.

### 2.4 Icon can't be rendered crisply at non-24 sizes — **Low/Medium**
Because `VerifiedIcon` is legacy single-size, consumers get only CSS scaling of one path, not size-tuned geometry, and no `size`/`filled` props. Inside `UserDisplayNameContainer` it's forced to `size-4` via `className`. A prop-based version (`<VerifiedIcon size={16} />`) would be more reusable and match sibling icons.

### 2.5 `ProfileOnlineStatus` promoted to public API — **Low / decision to confirm**
`index.ts` now exports `ProfileOnlineStatus`. It began as an internal helper for `UserDisplayNameContainer`. Exporting it is defensible (it's a clean standalone), but it enlarges the public surface for what is essentially `OnlineBlinkingIcon` + a label. Confirm this is intended rather than incidental to the "own directory" refactor.

---

## 3. Extendability

### 3.1 Duplicated badge markup blocks clean extension — **Medium**
`UserDisplayNameContainer.tsx:104-122`

The ambassador and verified branches are near-identical `<span role="img" aria-label … className="… text-…"><VerifiedIcon/></span>` blocks differing only by label and tint. Adding a third badge type (e.g. "staff", "AI") means copying the block a third time. A small internal `Badge`-style map (`{ ambassador: {label, tint}, verified: {…} }`) rendered once would make new badge types a data change, not a markup change.

### 3.2 Badge precedence is implicit — **Low**
`ambassador` silently wins over `verified` (ternary). It's documented in the prop JSDoc (`:34`) and tested, which is good — but a single `badge?: "ambassador" | "verified"` prop would model the mutual exclusivity in the type system instead of relying on runtime precedence, and extends naturally.

### 3.3 `avatarSize: number` vs the `AvatarSize` union — **Low**
`UserItem.tsx:29` accepts any `number` and snaps to the nearest token via `getNearestAvatarSize`. This is forgiving (good for the port) but loose. Optionally accept `AvatarSize | number` so callers passing a real token get compile-time validation while arbitrary numbers still snap.

### 3.4 `getInitials` is appropriately generic — **Positive**
Placed in `utils/`, dependency-free, exported, unit-tested. Good reuse primitive — no change needed.

---

## 4. Best practices

### 4.1 New component ships `@deprecated` no-op props — **High**
`src/components/UserHandleTypography/UserHandleTypography.tsx:7-16`

`color`, `variant`, `component`, `fontSize`, `pl` are all `@deprecated` and do nothing (prefixed `_` and discarded). These were deprecated in the *original* app component; carrying them into a brand-new DS component means it's born with dead, pre-deprecated API. Best practice for a fresh component is to omit them entirely (callers use `className`). If back-compat with existing Eden call-sites is the goal, that should be an explicit, documented reason rather than an inherited default.

### 4.2 Magic-string styling: `color === "white"` — **Medium**
`UserDisplayNameContainer.tsx:91`. A `string` prop where exactly one value (`"white"`) has an effect is a code smell — undiscoverable and untyped. Prefer `className="text-white"` at the call site (the DS way) or a typed token prop.

### 4.3 `VerifiedIcon` lost the original two-tone artwork — **Medium (visual fidelity)**
The supplied SVGs were two-tone (surface disc + contrasting check, with explicit light/dark variants). The committed icon is a single `currentColor` compound path with an even-odd knockout. This is the *correct, idiomatic* DS choice (themeable via `currentColor`, matches the original Eden coloring intent of `text-content-primary`), but it is a deliberate visual simplification — worth recording so it isn't mistaken for the pixel-exact original. If design needs the exact two-tone seal, it requires a different (two-layer) icon approach.

### 4.4 Leftover `AmbassadorIcon` in git limbo — **Low / housekeeping**
`git status` shows `AD src/components/Icons/AmbassadorIcon.tsx` — staged as added, then deleted on disk. The file is correctly gone and there are no code references, but the staged-add should be cleared (`git add -A`) so the branch's staged tree matches the working tree before committing.

### 4.5 Inline `style` object allocation — **Low**
`UserDisplayNameContainer.tsx:94-100` builds a fresh `style` object every render from `mt/pt/maxWidth/textAlign`. Negligible at this scale, but it's a symptom of §2.2 — dropping the layout props removes the inline-style block altogether.

### 4.6 Positives worth keeping
- `role="img"` + `aria-label` on badge spans, axe tests on every component, `aria-hidden` icons — solid a11y.
- `forwardRef` + `displayName` + JSDoc + `@example` everywhere — matches the repo.
- Token-driven colours (`text-icons-brand-green`, `text-content-primary`, `text-success-content`) rather than hex — correct after the recent fix.
- Tests cover behaviour meaningfully (variant mapping, badge precedence, online-status gating, size snapping, deprecated-prop non-leak).

---

## Prioritised summary

| # | Finding | Lens | Severity |
|---|---|---|---|
| 1.1 | `UserDisplayNameContainer` props don't extend `HTMLAttributes` | Consistency | High |
| 4.1 | `UserHandleTypography` ships `@deprecated` no-op props | Best practice | High |
| 2.1 | `VerifiedIcon` reused as the ambassador badge (naming) | Re-usability | High |
| 1.2 | `variant`/`color` typed as open `string`, not unions | Consistency | Medium |
| 1.3 | Stories missing Figma `design` param | Consistency | Medium |
| 1.5 / 2.4 / 4.3 | Icon is legacy single-size + monochrome simplification | Consistency / Reuse / BP | Medium |
| 2.2 / 4.2 / 4.5 | MUI-style layout props + `color==="white"` magic string + inline styles | Reuse / BP | Medium |
| 2.3 | `UserItem` can't surface badges / tune name line | Extendability | Medium |
| 3.1 | Duplicated badge markup | Extendability | Medium |
| 2.5 | `ProfileOnlineStatus` now public — confirm intent | Re-usability | Low |
| 3.2 / 3.3 | Implicit badge precedence; loose `avatarSize` | Extendability | Low |
| 4.4 | `AmbassadorIcon` staged-add/deleted git limbo | Best practice | Low |

**Themes:** the highest-value cleanups all trace back to two roots — (a) `UserDisplayNameContainer` and `UserHandleTypography` were ported *faithfully from a legacy MUI-style app component* and still wear that API (loose strings, layout props, deprecated no-ops, non-`HTMLAttributes` base); and (b) the **icon strategy** (single shared, single-size, monochrome icon) was constrained by the artwork that was available. Neither is a functional defect — the components work, are tested, and look correct — but tightening (a) and deciding (b) deliberately would bring this in line with the rest of the design system.
