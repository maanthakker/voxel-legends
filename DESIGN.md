# Voxel Realms design system

Written during an Impeccable polish pass. Keep new UI inside this system so the game, menus and login page feel like one product.

## Feel
A night-sky voxel world with warm gold accents. Menus are solid panels with a pixel bevel (a dark line along the bottom edge, a faint light line along the top), never glossy or glassy. Pixel lettering is for titles, the Play button and numbers; everything else is plain, readable text.

## Colour tokens
| Token | Value | Use |
|---|---|---|
| `--fg` | `#f4f1ff` | Main text |
| `--fg2` | `#c3c0e6` | Secondary text (never grey on colour) |
| `--ac` | `#ffc857` | Gold: primary buttons, selected tabs, icons, slider thumbs |
| `--aci` | `#2a1a00` | Text on gold |
| `--pn` | `rgba(18,20,52,.94)` | Panels and HUD chips |
| `--pn2` / `--pn3` | `#232860` / `#2d3375` | Raised controls / hover |
| `--ln` / `--ln2` | white at 16% / 30% | Borders |
| `--sky` | `#8fb4ff` | Keyboard focus ring |
| `--leaf` / `--ember` | `#5fd36f` / `#ff6b6b` | Online and success / errors and danger |

## Type
- **Silkscreen** (700): game title, panel headings, the Play button, hotbar numbers, slider values.
- **Lexend** (400 to 700): all other text. Chosen because it is easy to read for young players.
- Chat commands and hex colour fields use the system monospace, because they are code.

## Components
- **Primary button** (`.big`): gold, bevel, presses down 2px. One per screen.
- **Secondary button** (`.big.sec`, `.ib`, `.mini`): raised navy with a border.
- **Tile** (`.tile`): icon over label, used for menu shortcuts (Character, Skin editor, Multiplayer, Invite, Settings, Photo).
- **Tabs** (`#stabs`, login `.tabs`): a dark track with the active tab filled gold.
- **Toggle** (`input.sw`): squared switch, gold when on. Whole row is the click target.
- **Slider**: navy track, gold square thumb, value in Silkscreen to the right.
- **Field** (`.fld`): dark inset, gold border and glow on focus, 16px text so phones do not zoom.
- **List row** (`.li`): raised navy row with one action button at the end.

## Icons
Authored 16x16 pixel icons in one SVG sprite (`#i-gear`, `#i-chat`, `#i-grid`, `#i-users`, `#i-mail`, `#i-camera`, `#i-person`, `#i-brush`, `#i-close`, `#i-play`, plus `#i-heart` and `#i-food` for the HUD). Rendered with `shape-rendering: crispEdges` in `currentColor`. No emoji or text glyphs as icons.

## Rules
- The title screen shows only the menu: the HUD, hotbar and corner buttons hide until you press Play.
- Settings are grouped into Game, Graphics, Camera, Controls and World tabs instead of one long list.
- Every control has hover, pressed, disabled and keyboard focus states. Motion is short and respects reduced motion.
