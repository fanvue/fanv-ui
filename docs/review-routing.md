# Review routing

Who reviews a pull request in `@fanvue/ui`, by the area it touches. The Claude
review bot in `#hackers-support` reads this file to pick the human reviewer,
and `.github/CODEOWNERS` mirrors the path rules so GitHub requests the same
people.

Last reviewed: 2026-11-03. Built from commits and reviews since August 2026.
Re-check it each quarter or whenever someone joins, leaves or changes team.

## How to pick the reviewer

1. Match every changed file against the **Paths** column, top to bottom, taking
   the first row that matches. The row with the most files is the PR's area.
2. Request the row's **primary**. If the primary wrote the PR, is out of office
   or already reviewed it, request the **secondary**. If both are unavailable,
   request a kit maintainer who did not write the PR.
3. A breaking change (a `feat(X)!:` or `fix(X)!:` title, or a removed or renamed
   export) always gets both kit maintainers, because every consumer rebuilds.
4. If no row matches, use the kit maintainers row.
5. Never request the PR author, a bot, or anyone missing from the people table.

## Areas

| Area | Paths | Primary | Secondary | Why |
| --- | --- | --- | --- | --- |
| Kit maintainers (default) | everything not listed below, `.github/`, `package.json`, `release-please-config.json`, `vite.config.ts`, `biome.json`, `src/index.ts`, tests and Storybook config | @simonstaton | @alfonsovo-fv | Simon maintains the kit and its release tooling. Alfonso is the engineering manager and the other long-standing maintainer. When Simon is the author, Alfonso reviews, with @morrid0 or @jacksonford-07 as the alternate. |
| Design tokens, theme and Tailwind | `src/styles/`, `postcss.config.ts`, `.storybook/FanvueTheme.ts`, token docs under `src/docs/` | @simonstaton | @lorenzoperniciaro-collab | Simon built the token pipeline. Lorenzo is the active author on the V2 styles. |
| Icons, animated icons and flags | `src/components/{Icons,AnimatedIcons,CountryFlag}/`, `src/flags.ts`, `src/animated-icons.ts`, `scripts/generate-icons*`, `scripts/extract-icons-from-figma.mjs`, `scripts/generate-flags.mjs`, `scripts/import-animated-icons.mjs`, `scripts/svgo.config.mjs` | @simon-fanvue | @simonstaton | Simon Madine owns the icon set and its Figma import scripts. |
| Tables and pagination | `src/components/{Table,Pagination,PageSelector}/` | @lorenzoperniciaro-collab | @simonstaton | Lorenzo is building the compact table and its pieces. |
| Tabs, segmented control and logo | `src/components/{Tabs,SegmentedControl,Logo}/` | Tabs and Logo @jacksonford-07, SegmentedControl @simon-fanvue | the other one | Jackson owns Tabs and the new logo. Simon Madine owns SegmentedControl. |
| Audio, media and chat primitives | `src/components/{AudioPlayer,AudioRecordButton,AudioUpload,VoiceNote,ChatInput,ChatMessage,ChatEmbed,MediaStatusIndicator,DropdownMenu,AiButton}/`, the audio hooks in `src/utils/` | @morrid0 | @simonstaton | Luiz is Chats Lead and wrote the audio player, voice note, dropdown and AI button work this quarter. |
| Creator cards and profile status | `src/components/{CreatorCard,CreatorTile,ReviewCard,RatingSummary,Demographics,FanFollowerCount,ProfileStatus,ProfileOnlineStatus,LiveStatus,OnlineBlinkingIcon}/` | @hronchetti | @simonstaton | Harry built the creator card family for the growth pages. |
| Charts | `src/components/Chart/`, `src/charts.ts` | @simonstaton | @jacksonford-07 | Simon wrote the charts V2 migration. Jackson uses them in Insights. |
| Buttons, forms, dialogs, navigation and feedback | `src/components/{Button*,IconButton,TextField,TextArea,Select,Autocomplete,Checkbox,Radio*,Switch*,Slider,DatePicker,Dialog,Drawer,Snackbar,Toast,Tooltip,BottomNavigation,Breadcrumb,Stepper,Alert,Banner,EmptyState,Loader,Skeleton}/` and the rest | @simonstaton | @alfonsovo-fv | No single specialist. Falls to the kit maintainers; @morrid0 knows the Dialog and Drawer bottom-sheet drag. |
| Docs site | `docs/`, `scripts/docs-generator/`, `scripts/generate-docs.mjs` | @simonstaton | @hronchetti | Simon owns the Mintlify docs and the generator. Harry has reviewed recent docs changes. |

## People

| Handle | Name | Owns here |
| --- | --- | --- |
| @alfonsovo-fv | Alfonso Olmedo | Kit maintainer, engineering manager. |
| @hronchetti | Harry Ronchetti | Creator cards, docs secondary. |
| @jacksonford-07 | Jackson George | Tabs, Logo, charts secondary. |
| @lorenzoperniciaro-collab | Lorenzo Perniciaro | Tables, V2 styles. |
| @morrid0 | Luiz Cavalcanti | Audio, media and chat primitives. |
| @simon-fanvue | Simon Madine | Icons, flags, SegmentedControl. |
| @simonstaton | Simon Staton | Kit maintainer, tokens, charts, docs, release tooling. |

## Keeping this file right

- Change `.github/CODEOWNERS` in the same PR whenever a row changes.
- A handle must have write access to the repo or GitHub ignores it. Check with
  `gh api repos/fanvue/fanv-ui/collaborators/<handle>/permission`.
- To regenerate the evidence for a row, run
  `git log --since=90.days --no-merges --format=%an -- <paths> | sort | uniq -c | sort -rn`.
