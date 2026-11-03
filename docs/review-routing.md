# Review routing

Who reviews a pull request in `@fanvue/ui`, by the area it touches. The Claude
review bot in `#hackers-support` reads this file to pick the human reviewer,
and `.github/CODEOWNERS` mirrors the path rules so GitHub requests the same
people.

Simon Staton built this library and is its DRI. Every row below is a
delegation from him for an area someone else knows well; anything not listed
is his. Only engineers review: designers open PRs here but are never
requested.

Last reviewed: 2026-11-03. Built from commits and reviews since August 2026.
Re-check it each quarter or whenever someone joins, leaves or changes team.

## How to pick the reviewer

1. Match every changed file against the **Paths** column, top to bottom, taking
   the first row that matches. The row with the most files is the PR's area.
2. Request the row's **primary**. If the primary wrote the PR, is out of office
   or already reviewed it, request the **secondary**. If both are unavailable,
   request the DRI, or when the DRI is the author, @alfonsovo-fv.
3. A breaking change (a `feat(X)!:` or `fix(X)!:` title, or a removed or renamed
   export) always gets the DRI plus one more engineer, because every consumer
   rebuilds.
4. If no row matches, use the DRI row.
5. Never request the PR author, a bot, or anyone missing from the people table.

## Areas

| Area | Paths | Primary | Secondary | Why |
| --- | --- | --- | --- | --- |
| DRI (default) | everything not listed below: tokens and theme (`src/styles/`, `postcss.config.ts`), buttons, forms, dialogs, navigation, tables, tabs, charts, feedback components, `.github/`, `package.json`, `release-please-config.json`, `vite.config.ts`, `biome.json`, `src/index.ts`, tests and Storybook config | @simonstaton | @alfonsovo-fv | Simon built the library, its token pipeline, charts and release tooling and is the DRI. Alfonso is the engineering manager and the second pair of eyes. When Simon is the author, Alfonso reviews, with @morrid0 or @simon-fanvue as the alternate. |
| Icons, animated icons and flags | `src/components/{Icons,AnimatedIcons,CountryFlag}/`, `src/flags.ts`, `src/animated-icons.ts`, `scripts/generate-icons*`, `scripts/extract-icons-from-figma.mjs`, `scripts/generate-flags.mjs`, `scripts/import-animated-icons.mjs`, `scripts/svgo.config.mjs` | @simon-fanvue | @simonstaton | Simon Madine owns the icon set and its Figma import scripts. |
| Segmented control | `src/components/SegmentedControl/` | @simon-fanvue | @simonstaton | Simon Madine wrote the current SegmentedControl. |
| Audio, media and chat primitives | `src/components/{AudioPlayer,AudioRecordButton,AudioUpload,VoiceNote,ChatInput,ChatMessage,ChatEmbed,MediaStatusIndicator,DropdownMenu,AiButton}/`, the audio hooks in `src/utils/` | @morrid0 | @simonstaton | Luiz is Chats Lead and wrote the audio player, voice note, dropdown and AI button work this quarter. |
| Creator cards and profile status | `src/components/{CreatorCard,CreatorTile,ReviewCard,RatingSummary,Demographics,FanFollowerCount,ProfileStatus,ProfileOnlineStatus,LiveStatus,OnlineBlinkingIcon}/` | @hronchetti | @simonstaton | Harry built the creator card family for the growth pages. |
| Docs site | `docs/`, `scripts/docs-generator/`, `scripts/generate-docs.mjs` | @simonstaton | @hronchetti | Simon owns the Mintlify docs and the generator. Harry has reviewed recent docs changes. |

## People

| Handle | Name | Owns here |
| --- | --- | --- |
| @alfonsovo-fv | Alfonso Olmedo | Engineering manager, second pair of eyes on the DRI's own PRs. |
| @hronchetti | Harry Ronchetti | Creator cards, docs secondary. |
| @morrid0 | Luiz Cavalcanti | Audio, media and chat primitives. |
| @simon-fanvue | Simon Madine | Icons, flags, SegmentedControl. |
| @simonstaton | Simon Staton | DRI. Everything not delegated above. |

Designers who open PRs here but are not reviewers: Lorenzo Perniciaro (tables, V2 styles), Jackson George (Tabs, Logo), Caspian Reynolds.

## Keeping this file right

- Change `.github/CODEOWNERS` in the same PR whenever a row changes.
- A handle must have write access to the repo or GitHub ignores it. Check with
  `gh api repos/fanvue/fanv-ui/collaborators/<handle>/permission`.
- To regenerate the evidence for a row, run
  `git log --since=90.days --no-merges --format=%an -- <paths> | sort | uniq -c | sort -rn`.
