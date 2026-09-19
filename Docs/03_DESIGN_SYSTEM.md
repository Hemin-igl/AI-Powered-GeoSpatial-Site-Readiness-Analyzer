# 03_DESIGN_SYSTEM.md

# GeoReady Design System

## Brand

Product name: GeoReady

Tone:
- analytical
- modern
- trustworthy
- calm
- professional
- data-focused

Do not use cartoon illustrations or gaming-style UI.

## Color tokens

Primary:
- `--color-primary-50`
- `--color-primary-100`
- `--color-primary-500`
- `--color-primary-600`
- `--color-primary-700`

Neutral:
- `--color-bg`
- `--color-surface`
- `--color-surface-muted`
- `--color-border`
- `--color-text`
- `--color-text-muted`

Semantic:
- success
- warning
- danger
- info

Map colors must be defined separately from UI colors.

## Typography

Use Inter or another modern sans-serif.

- Page title: 24–32px, semibold
- Section title: 16–20px, semibold
- Body: 14–16px
- Metadata: 12–13px
- KPI number: 28–36px, semibold/bold

## Spacing

Use a consistent 4px base scale:
4, 8, 12, 16, 20, 24, 32, 40, 48.

## Radius

- Small controls: 8px
- Cards: 12–16px
- Modals: 16px
- Pills: 999px

## Shadows

Use subtle elevation. Avoid heavy shadows.

## Layout

Desktop:
- Sidebar: 240–264px
- Top navigation: 64px
- Content max width: 1600px
- Main page padding: 24px

## Cards

Every card should have:
- title
- optional description
- optional action
- content
- consistent padding

## Buttons

Primary:
- filled primary color
- white text

Secondary:
- neutral surface
- border

Danger:
- reserved for destructive operations

## States

Every interactive component must define:
- default
- hover
- focus
- active
- disabled
- loading
- error

## Map UI

Map controls must not obscure critical map content.
Legends must use consistent scales.
Selected features use a clear selected state.

## Accessibility

- keyboard navigation
- visible focus state
- semantic buttons
- labels for controls
- sufficient contrast
- charts require textual summaries
