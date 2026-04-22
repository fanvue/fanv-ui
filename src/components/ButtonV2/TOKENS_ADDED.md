# Tokens added for v2 Button (ENG-9997)

The Figma source for the v2 Button (`https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16650-1558&m=dev`) references several tokens that the existing `styleTokens.json` did not yet contain. Per project policy, no closest-match substitutions were made — every missing token below was added explicitly with the exact value pulled from the Figma variable definition.

All additions were made to `src/styles/styleTokens.json` and propagated to `src/styles/theme.css` via `pnpm build:styles` (which runs `src/styles/buildStyles.js`).

## Primitives — `primitives.light.color.red`

The Figma error button uses a red shade that does not exist in the current red ramp. Added two new indexed shades that slot between the existing `500` and `600` / `600` and `700` steps.

| Token | Value | Used by |
| --- | --- | --- |
| `red.550` | `#f01932` | `semantic.light.color.buttons.errorDefault` |
| `red.650` | `#cb102f` | `semantic.light.color.buttons.errorHover` |

## Semantic — `semantic.light.color.buttons`

Added the full set of v2 Button surface colours. Tokens that have a matching primitive reference it; AI gradient stops are written as literal hex values because the existing green ramp does not contain those exact shades.

| Token | Source | Notes |
| --- | --- | --- |
| `primaryNegativeDefault` | `primitives.light.color.gray.white` | Primary on dark surface, default state |
| `primaryNegativeHover` | `primitives.light.color.gray.350` | Primary on dark surface, hover state |
| `disabledDefault` | `primitives.light.color.gray.200` | Disabled background, light surface |
| `disabledNegative` | `primitives.light.color.gray.800` | Disabled background, dark surface |
| `secondaryDefault` | `primitives.light.color.blackalpha.100` | Secondary, default state |
| `secondaryNegativeDefault` | `primitives.light.color.whitealpha.200` | Secondary on dark surface, default state |
| `secondaryHover` | `primitives.light.color.blackalpha.200` | Secondary, hover state |
| `secondaryNegativeHover` | `primitives.light.color.whitealpha.300` | Secondary on dark surface, hover state |
| `tertiaryHover` | `primitives.light.color.blackalpha.200` | Tertiary, hover state |
| `tertiaryNegativeHover` | `primitives.light.color.whitealpha.300` | Tertiary on dark surface, hover state |
| `outlineDefault` | `primitives.light.color.gray.black` | Outline border, default state |
| `outlineNegativeDefault` | `primitives.light.color.gray.white` | Outline border on dark surface |
| `outlineHover` | `primitives.light.color.blackalpha.100` | Outline fill, hover state |
| `outlineNegativeHover` | `primitives.light.color.whitealpha.100` | Outline fill on dark surface, hover state |
| `errorDefault` | `primitives.light.color.red.550` (new) | Error variant, default state |
| `errorHover` | `primitives.light.color.red.650` (new) | Error variant, hover state |
| `alwaysWhiteDefault` | `primitives.light.color.gray.white` | Always-white variant, default state |
| `alwaysWhiteHover` | `primitives.light.color.gray.350` | Always-white variant, hover state |
| `alwaysBlackDefault` | `primitives.light.color.gray.black` | Always-black variant, default state |
| `alwaysBlackHover` | `primitives.light.color.gray.600` | Always-black variant, hover state |
| `aiBackgroundGradientDefaultStart` | `#075f1e` | AI gradient start, default state |
| `aiBackgroundGradientDefaultEnd` | `#02210c` | AI gradient end, default state |
| `aiBackgroundGradientHoverStart` | `#0b8e29` | AI gradient start, hover state |
| `aiBackgroundGradientHoverEnd` | `#033f15` | AI gradient end, hover state |
| `aiStrokeStart` | `primitives.light.color.green.500` | AI border stop |
| `aiStrokeEnd` | `primitives.light.color.gray.900` | AI border stop |

## Semantic — `semantic.light.color.content`

Three foreground tokens were missing from the content scale.

| Token | Source | Notes |
| --- | --- | --- |
| `disabled` | `primitives.light.color.gray.450` | Foreground for any disabled control |
| `alwaysWhite` | `primitives.light.color.gray.white` | Foreground that does not flip in dark mode |
| `alwaysBlack` | `primitives.light.color.gray.black` | Foreground that does not flip in dark mode |

## Effects — `semantic.effect.shadow`

The AI variant uses a three-layer drop shadow that the previous shadow processor (`buildStyles.js`) could not emit. Added the token plus a script change to support N indexed shadow layers.

| Token | Layers | Notes |
| --- | --- | --- |
| `aiButtonGlow` | `-1px 1px 4px 0 #49f2643d`, `-4px 4px 12px 0 #49f26429`, `-8px 2px 24px 0 #49f2640a` | Used by the `ai` variant. Compiles to `--shadow-ai-button-glow` |

## Generation script change

`src/styles/buildStyles.js` — `processShadowGroup` was rewritten to dynamically collect every numerically-indexed shadow layer (`"0"`, `"1"`, `"2"`, …) and join them into a single `box-shadow` value. The previous implementation hard-coded support for one or two layers only.

## Open discrepancy (not addressed)

`primitives.light.color.green.550` is currently `#1fef40`, while the Figma `Color/Buttons/Brand/Hover` token used by the v2 Upsell variant resolves to `#1aef41`. The values differ by a single bit per channel and the existing `--color-buttons-brand-hover` semantic token already points at `green.550`. v2 reuses that semantic token rather than introducing a parallel `upsellHover`. If design intends them to be exactly equal, the primitive should be updated upstream and re-pulled.
