# Changelog

## [1.2.0](https://github.com/fanvue/fanv-ui/compare/ui-v1.1.1...ui-v1.2.0) (2026-02-12)


### Features

* add motion-safe transitions to interactive components ([#108](https://github.com/fanvue/fanv-ui/issues/108)) ([facdd2f](https://github.com/fanvue/fanv-ui/commit/facdd2fb00c14f800cd2de3ef6e0a19cbcc11c39))
* add Tooltip component and replace temporary tooltips ([5034d9a](https://github.com/fanvue/fanv-ui/commit/5034d9af60cb9453b392b800b4bd6c7f7faea13e))
* temporary Tooltip component to fix a bug in Switch ([#112](https://github.com/fanvue/fanv-ui/issues/112)) ([5034d9a](https://github.com/fanvue/fanv-ui/commit/5034d9af60cb9453b392b800b4bd6c7f7faea13e))
* Text Field Component ([#103](https://github.com/fanvue/fanv-ui/issues/103)) ([0ec032d](https://github.com/fanvue/fanv-ui/commit/0ec032d261829dba37b9c0a625eaa87082e3480a))


### Bug Fixes

* **a11y,seo:** resolve Lighthouse accessibility and SEO audit failures ([#115](https://github.com/fanvue/fanv-ui/issues/115)) ([05255ce](https://github.com/fanvue/fanv-ui/commit/05255cec7301098a109e1d995c6bc947926eeba3))
* correct focus ring tokens and improve keyboard/touch accessibility ([#109](https://github.com/fanvue/fanv-ui/issues/109)) ([8ca2671](https://github.com/fanvue/fanv-ui/commit/8ca2671e3274c190332c388b5b1ee7532210b9b3))
* **DatePicker:** prevent focus ring clipping on calendar day cells ([#114](https://github.com/fanvue/fanv-ui/issues/114)) ([211b07f](https://github.com/fanvue/fanv-ui/commit/211b07f5b8895226f89c1f759bf27c81849f9a7f))
* make close button aria-labels configurable for i18n ([#110](https://github.com/fanvue/fanv-ui/issues/110)) ([94ae6fa](https://github.com/fanvue/fanv-ui/commit/94ae6fab05fe02b231d548355442d976ae8f607a))
* position toast viewport at bottom on all screen sizes ([#111](https://github.com/fanvue/fanv-ui/issues/111)) ([33f2119](https://github.com/fanvue/fanv-ui/commit/33f2119f504f2a5ed6a83adf77ed356c72d39ab7))
* resolve TextField visual bugs, improve accessibility, and add EyeIcon ([ac4e1fa](https://github.com/fanvue/fanv-ui/commit/ac4e1fab3eeec1502450104d6fc9b575c3f02709))
* storybook css import ([#101](https://github.com/fanvue/fanv-ui/issues/101)) ([608ad1e](https://github.com/fanvue/fanv-ui/commit/608ad1efb6794f230851f4480e0f740bd4e07e06))
* target svg via tailwind + add disabled control to icon button stories ([#116](https://github.com/fanvue/fanv-ui/issues/116)) ([4e2dc78](https://github.com/fanvue/fanv-ui/commit/4e2dc7826dcb00f86e29954eb864d5ed266ae7c3))
* TextField shift on focus and improve composability/a11y ([#105](https://github.com/fanvue/fanv-ui/issues/105)) ([ac4e1fa](https://github.com/fanvue/fanv-ui/commit/ac4e1fab3eeec1502450104d6fc9b575c3f02709))
* **ui:** make snackbar close button square for circular focus/hover state ([#107](https://github.com/fanvue/fanv-ui/issues/107)) ([69b4e02](https://github.com/fanvue/fanv-ui/commit/69b4e02f7e1f7d698f418a4781f0f30ed7634056))

## [1.1.1](https://github.com/fanvue/fanv-ui/compare/ui-v1.1.0...ui-v1.1.1) (2026-02-11)


### Bug Fixes

* **Alert:** close button style for variants ([#92](https://github.com/fanvue/fanv-ui/issues/92)) ([d6615ca](https://github.com/fanvue/fanv-ui/commit/d6615ca1e6a76c7be4734cabc9f00e652a89f671))
* **release:** remove release-as override blocking new releases ([#96](https://github.com/fanvue/fanv-ui/issues/96)) ([1f7dca2](https://github.com/fanvue/fanv-ui/commit/1f7dca2a7d066186e638e6ea8fea6261258ba240))
* **showcase:** restoring tailwind styles to showcase ([#94](https://github.com/fanvue/fanv-ui/issues/94)) ([341f637](https://github.com/fanvue/fanv-ui/commit/341f637b5954f38f5d8ac6c710471f80e7392099))
* use [@utility](https://github.com/utility) for typography classes to support Tailwind modifiers ([#98](https://github.com/fanvue/fanv-ui/issues/98)) ([9d6275e](https://github.com/fanvue/fanv-ui/commit/9d6275e91605113165b61f83dbddc7a681743d8a))

## [1.1.0](https://github.com/fanvue/fanv-ui/compare/ui-v1.1.0...ui-v1.1.0) (2026-02-11)


### Bug Fixes

* **Alert:** close button style for variants ([#92](https://github.com/fanvue/fanv-ui/issues/92)) ([d6615ca](https://github.com/fanvue/fanv-ui/commit/d6615ca1e6a76c7be4734cabc9f00e652a89f671))
* **showcase:** restoring tailwind styles to showcase ([#94](https://github.com/fanvue/fanv-ui/issues/94)) ([341f637](https://github.com/fanvue/fanv-ui/commit/341f637b5954f38f5d8ac6c710471f80e7392099))

## [1.1.0](https://github.com/fanvue/fanv-ui/compare/ui-v1.0.0...ui-v1.1.0) (2026-02-11)


### ⚠ BREAKING CHANGES

* Variant types for Badge, Pill, Count, Logo, and Toast now use lowercase camelCase string unions instead of mixed casing or enums.

### Features

* normalize component variant APIs to consistent casing ([#87](https://github.com/fanvue/fanv-ui/issues/87)) ([d3d3e7d](https://github.com/fanvue/fanv-ui/commit/d3d3e7de18185d47849185bd91a29ef332ccb61e))


### Bug Fixes

* resolve documentation and component bugs ([#86](https://github.com/fanvue/fanv-ui/issues/86)) ([f386dfd](https://github.com/fanvue/fanv-ui/commit/f386dfd7f4bedc59a619b68c025a79c62fc7e08b))

## [1.0.0](https://github.com/fanvue/fanv-ui/compare/ui-v0.1.0-alpha.3...ui-v1.0.0) (2026-02-11)


### ⚠ BREAKING CHANGES

* ESLint is replaced with Biome. Run `pnpm install` to install new dependencies.

### Features

* add Alert component ([#32](https://github.com/fanvue/fanv-ui/issues/32)) ([b8e2b35](https://github.com/fanvue/fanv-ui/commit/b8e2b351ffc633b5bafb0c8c260603e949fe8641))
* add Badge and Pill components from Figma design system ([#16](https://github.com/fanvue/fanv-ui/issues/16)) ([e3254ae](https://github.com/fanvue/fanv-ui/commit/e3254ae933a650406261a12b4daffb265e96d9d1))
* add Button component with variants, sizes, and states ([3c98623](https://github.com/fanvue/fanv-ui/commit/3c986238df3a3b2221a28bccb8e2557bfa6123c1))
* add Button component with variants, sizes, and states ([c699942](https://github.com/fanvue/fanv-ui/commit/c699942dffb57685418e7dc8bf619b97aacdc451))
* add Button component with variants, sizes, loading state, and Figma integration ([eeec17a](https://github.com/fanvue/fanv-ui/commit/eeec17abc1342476b00645cb24185c0ccce4058b))
* add Checkbox component with Radix UI integration ([f8eab19](https://github.com/fanvue/fanv-ui/commit/f8eab192fe560257ad401d201be6d6edc9e8d32e))
* add Count notification badge component with variants, sizes, and accessibility support ([ce86b5e](https://github.com/fanvue/fanv-ui/commit/ce86b5e24095a20e99d46c766da7146db19ba6a7))
* add Git hooks with Husky and commitlint ([f593220](https://github.com/fanvue/fanv-ui/commit/f59322036529c6fe368f859a77bb9921c0945fb1))
* add Git hooks with Husky and commitlint ([cbd0e8a](https://github.com/fanvue/fanv-ui/commit/cbd0e8adf46e0b7605b0bccf6ff35e406fd03717))
* add GitHub CI/CD workflows ([c185584](https://github.com/fanvue/fanv-ui/commit/c185584af6754e00259ac6476552eaf12e954d05))
* add GitHub CI/CD workflows ([dd57b08](https://github.com/fanvue/fanv-ui/commit/dd57b08a952091584b713ee6706052aff3220236))
* add globals.css from tokens generation script ([#15](https://github.com/fanvue/fanv-ui/issues/15)) ([73bd434](https://github.com/fanvue/fanv-ui/commit/73bd434b2283e417f6b3a403a6a25769827ad4d1))
* Add Icon Button component ([#50](https://github.com/fanvue/fanv-ui/issues/50)) ([5db5e31](https://github.com/fanvue/fanv-ui/commit/5db5e31dd60242b539675f00efd728b2a012f8ef))
* add icon component system ([#40](https://github.com/fanvue/fanv-ui/issues/40)) ([72031fe](https://github.com/fanvue/fanv-ui/commit/72031fe96d45c7d73a9ed40e36b0affda4d98ac7))
* add Playwright E2E testing infrastructure ([0741b5a](https://github.com/fanvue/fanv-ui/commit/0741b5aedac2adb118607b93da7334cbf15937a3))
* add Playwright E2E testing infrastructure ([f604043](https://github.com/fanvue/fanv-ui/commit/f6040437562e822bd57a139f7adb9e209381b94c))
* add Radio component ([17a343a](https://github.com/fanvue/fanv-ui/commit/17a343a99d4ac3576bffe16b8ed94bc745aada80))
* add Storybook configuration for component development ([81493f2](https://github.com/fanvue/fanv-ui/commit/81493f23cee692e0344e698475cd1644347e557c))
* add Storybook configuration for component development ([17c7110](https://github.com/fanvue/fanv-ui/commit/17c7110e2e32831b27461e683a98c7671e678124))
* add Tailwind CSS v4 theming system ([4c1eb4b](https://github.com/fanvue/fanv-ui/commit/4c1eb4b6efec58599d937cd3c2483675df966100))
* add Tailwind CSS v4 theming system ([1335a00](https://github.com/fanvue/fanv-ui/commit/1335a00da42a408a1dc8dad66252b4d11f3dadd7))
* add Vitest testing infrastructure ([3a7850d](https://github.com/fanvue/fanv-ui/commit/3a7850db8bd9687a9bb8913186cc69c0f1e5d78a))
* add Vitest testing infrastructure ([3b9ab1f](https://github.com/fanvue/fanv-ui/commit/3b9ab1f57a7a932e5afa6bba1ee993a4f479b685))
* **build:** enable preserveModules for proper tree shaking ([#84](https://github.com/fanvue/fanv-ui/issues/84)) ([c3e2f58](https://github.com/fanvue/fanv-ui/commit/c3e2f58e8b9406272b051922420475e6629a0063))
* Button component ([#30](https://github.com/fanvue/fanv-ui/issues/30)) ([eeec17a](https://github.com/fanvue/fanv-ui/commit/eeec17abc1342476b00645cb24185c0ccce4058b))
* Checkbox component ([#29](https://github.com/fanvue/fanv-ui/issues/29)) ([f8eab19](https://github.com/fanvue/fanv-ui/commit/f8eab192fe560257ad401d201be6d6edc9e8d32e))
* **components:** add Badge and Pill components ([e3254ae](https://github.com/fanvue/fanv-ui/commit/e3254ae933a650406261a12b4daffb265e96d9d1))
* configure stable 1.0.0 release ([#83](https://github.com/fanvue/fanv-ui/issues/83)) ([5ad6e97](https://github.com/fanvue/fanv-ui/commit/5ad6e97112d474c936223f810ae9d7c4e65c32b8))
* configure Vite for library mode with proper exports ([0c14491](https://github.com/fanvue/fanv-ui/commit/0c14491bb2d8b1c5a2cc62690093fa29631a8e8d))
* configure Vite for library mode with proper exports ([13b2b54](https://github.com/fanvue/fanv-ui/commit/13b2b5418e4371b515f4266d87df8fc5d0a4b3ad))
* Count component ([#31](https://github.com/fanvue/fanv-ui/issues/31)) ([ce86b5e](https://github.com/fanvue/fanv-ui/commit/ce86b5e24095a20e99d46c766da7146db19ba6a7))
* divider component ([#60](https://github.com/fanvue/fanv-ui/issues/60)) ([b22fa84](https://github.com/fanvue/fanv-ui/commit/b22fa84ed66372c5723932a060a9751cf32ee888))
* radio component ([#20](https://github.com/fanvue/fanv-ui/issues/20)) ([17a343a](https://github.com/fanvue/fanv-ui/commit/17a343a99d4ac3576bffe16b8ed94bc745aada80))
* replace ESLint with Biome for linting and formatting ([cb8a6aa](https://github.com/fanvue/fanv-ui/commit/cb8a6aa1e67665ce6ba88ac9738b64dfa28b8d65))
* replace ESLint with Biome for linting and formatting ([7197e97](https://github.com/fanvue/fanv-ui/commit/7197e978ccfcc632a68e658d0b1d1730d96bfe14))
* set up project tooling ([12a234c](https://github.com/fanvue/fanv-ui/commit/12a234c99a9e092c62c3ff4ee4fee33e347341ff))
* **showcase:** adding GitHub action to publish showcase ([#46](https://github.com/fanvue/fanv-ui/issues/46)) ([311f0ff](https://github.com/fanvue/fanv-ui/commit/311f0ff329a9c36b172e9a345c213cd3ae0f46b2))
* **storybook:** add Chromatic addon and Figma integration docs ([#21](https://github.com/fanvue/fanv-ui/issues/21)) ([d143f91](https://github.com/fanvue/fanv-ui/commit/d143f916552c70d732cb5c095951a62bfba0e14a))
* **storybook:** add custom Fanvue brand theme ([#23](https://github.com/fanvue/fanv-ui/issues/23)) ([c91afd4](https://github.com/fanvue/fanv-ui/commit/c91afd426f4bfab4b0c3a0ba5d74e24358859a66))
* Toast component ([#37](https://github.com/fanvue/fanv-ui/issues/37)) ([29a707d](https://github.com/fanvue/fanv-ui/commit/29a707d886f635aa76901a543d3ccd68c83073a7))
* **ui:** adding ProgressBar component ([#59](https://github.com/fanvue/fanv-ui/issues/59)) ([9936d61](https://github.com/fanvue/fanv-ui/commit/9936d6154e1c64b8496afe47051a124356250ab1))
* **ui:** adding Tabs component ([#55](https://github.com/fanvue/fanv-ui/issues/55)) ([9b11de7](https://github.com/fanvue/fanv-ui/commit/9b11de76f7ae15ac6ee6825b06e43e3ce0f4ba06))
* **ui:** alert component ([b8e2b35](https://github.com/fanvue/fanv-ui/commit/b8e2b351ffc633b5bafb0c8c260603e949fe8641))
* **ui:** avatar component ([#28](https://github.com/fanvue/fanv-ui/issues/28)) ([a2a8891](https://github.com/fanvue/fanv-ui/commit/a2a8891ae762df82a6a14e03ee062253ee39e70a))
* **ui:** Chip component ([#64](https://github.com/fanvue/fanv-ui/issues/64)) ([00173b0](https://github.com/fanvue/fanv-ui/commit/00173b0364781326b25e8baa43212c478eb2b608))
* **ui:** DatePicker component ([#51](https://github.com/fanvue/fanv-ui/issues/51)) ([cebdb80](https://github.com/fanvue/fanv-ui/commit/cebdb8021060371252b70c1846eac7ac399a166e))
* **ui:** logo component ([4b06713](https://github.com/fanvue/fanv-ui/commit/4b067134d16179e5c7e8b74db9755e32dad46214))
* **ui:** logo component ([#27](https://github.com/fanvue/fanv-ui/issues/27)) ([4b06713](https://github.com/fanvue/fanv-ui/commit/4b067134d16179e5c7e8b74db9755e32dad46214))
* **ui:** Pagination component ([#56](https://github.com/fanvue/fanv-ui/issues/56)) ([47016b0](https://github.com/fanvue/fanv-ui/commit/47016b0fdb414ab0c75177ed7239f67a44bd6ddf))
* **ui:** remove icon barrel file ([#67](https://github.com/fanvue/fanv-ui/issues/67)) ([3d7f70b](https://github.com/fanvue/fanv-ui/commit/3d7f70bdade16f4f25cddef07774820e6c81c0d8))
* **ui:** slider component ([#54](https://github.com/fanvue/fanv-ui/issues/54)) ([818cb21](https://github.com/fanvue/fanv-ui/commit/818cb2190c404f5a01e43b293bb52b3d760c9282))
* **ui:** Switch and Toggle components ([#53](https://github.com/fanvue/fanv-ui/issues/53)) ([0f5aa3b](https://github.com/fanvue/fanv-ui/commit/0f5aa3b73990ef31c4fac75aa4f23f9ea62e9ffb))
* update script + theme to include typography tokens ([#24](https://github.com/fanvue/fanv-ui/issues/24)) ([673b818](https://github.com/fanvue/fanv-ui/commit/673b818e93d8e938f772a65a3379e02b1dcd0419))
* update script to build theme.css with color tokens ([#19](https://github.com/fanvue/fanv-ui/issues/19)) ([a7b13b6](https://github.com/fanvue/fanv-ui/commit/a7b13b6a16e397bc52d145d4f226a10b65d847d1))


### Bug Fixes

* **checkbox:** content shifting on select ([#35](https://github.com/fanvue/fanv-ui/issues/35)) ([7a2b55a](https://github.com/fanvue/fanv-ui/commit/7a2b55ae6671e0c09c901ceb2ac233a4571f2ce1))
* **checkbox:** styling bug with tick not visible in dark mode ([#38](https://github.com/fanvue/fanv-ui/issues/38)) ([bec1c5c](https://github.com/fanvue/fanv-ui/commit/bec1c5c26b257c1339f3a7d0577247a42b3341f1))
* **ci:** defining npm registry ([#76](https://github.com/fanvue/fanv-ui/issues/76)) ([e9ed8c1](https://github.com/fanvue/fanv-ui/commit/e9ed8c15236cdb3fc725a5d814aca21188a09b0a))
* **colors:** fixing bug with design token generation ([#25](https://github.com/fanvue/fanv-ui/issues/25)) ([f6de19f](https://github.com/fanvue/fanv-ui/commit/f6de19f194fedd400aeed1f2e45b0bf36cc63823))
* Fix broken typography ([#52](https://github.com/fanvue/fanv-ui/issues/52)) ([ccc0be7](https://github.com/fanvue/fanv-ui/commit/ccc0be7b89f602ab100a58392835b15b769302e2))
* release please ([#71](https://github.com/fanvue/fanv-ui/issues/71)) ([e6e1efe](https://github.com/fanvue/fanv-ui/commit/e6e1efe293d837a68ae99fea0715156ee8ea6ace))
* release please ([#73](https://github.com/fanvue/fanv-ui/issues/73)) ([e9ed5b1](https://github.com/fanvue/fanv-ui/commit/e9ed5b1408d2ea20a2e6f9de6bea9086e6d36301))
* resolve critical vulnerability in @isaacs/brace-expansion ([#33](https://github.com/fanvue/fanv-ui/issues/33)) ([26c5894](https://github.com/fanvue/fanv-ui/commit/26c5894fe17a5446090661cbbc0cb2272dd3f904))
* **storybook:** theme tokens for refactored styleTokens ([#34](https://github.com/fanvue/fanv-ui/issues/34)) ([b6d8335](https://github.com/fanvue/fanv-ui/commit/b6d8335a471c5c0d52649dcd1e569b7b0a72c41a))
* **ui:** badge text color in dark mode ([#44](https://github.com/fanvue/fanv-ui/issues/44)) ([0fee7cf](https://github.com/fanvue/fanv-ui/commit/0fee7cf69a66fc5069b8e99a59358b0e2188e713))
* **ui:** button text variant hover ([#45](https://github.com/fanvue/fanv-ui/issues/45)) ([a853093](https://github.com/fanvue/fanv-ui/commit/a8530933cf9abd8595c68bedc03adc6e441293b0))
* **ui:** crown icon svg path broken ([#48](https://github.com/fanvue/fanv-ui/issues/48)) ([173112f](https://github.com/fanvue/fanv-ui/commit/173112f057d490ade1fc44c6a4e19912ba69b653))

## Changelog
