# Animated icons

Every `*.tsx` file in this directory is **generated** by
`scripts/import-animated-icons.mjs`. Edit the generator or
`scripts/animated-icons.map.json`, never the components.

`types.ts` and `useIconAnimation.ts` are hand-written and safe to edit.

## Where the artwork comes from

The animations and SVG paths are imported from the
[lucide-animated](https://lucide-animated.com) registry
([pqoqubbw/icons](https://github.com/pqoqubbw/icons)), which is built on
[Lucide](https://lucide.dev) and [Motion](https://motion.dev):

```
MIT License

Copyright (c) 2024-2026 pqoqubbw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Lucide itself is ISC licensed, © Lucide Contributors.

## Adding an icon

1. Find the registry slug at <https://lucide-animated.com> — the animated artwork
   must be the **same glyph** as our static icon, since the animated icon is
   published under our name and is meant to be a drop-in swap.
2. Add `"OurIconName": "registry-slug"` to `scripts/animated-icons.map.json`.
   Names with a static twin only: the generator refuses names it cannot mirror.
3. Run `pnpm icons:animated`. That regenerates the components, the barrel
   (`src/animated-icons.ts`), the manifest, the tests, and the Icons story.
4. Check the Foundations/Icons story with **animated** switched on: the animated
   icon must sit in exactly the same box as the static one at 16/24/32 px.

`node scripts/import-animated-icons.mjs --refresh` re-downloads the registry files cached under
`.icon-migration/animated-registry/` (do that to pick up upstream animation
changes).

If an import fails, the generator says why and skips that icon rather than
writing something half-transformed — the upstream component shape it did not
recognise is the thing to teach it about.
