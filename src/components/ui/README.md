Design primitives (Material You)

Usage

- `Button` (variants: `filled`, `tonal`, `outlined`, `text`, `fab`)
  - Props: standard button props plus `variant` and `size` (`sm|md|lg`).
  - Example: `<Button variant="filled">Primary</Button>`

- `Card` (variant: `default|glass`)
  - Use as container: `<Card>...</Card>`

- `Input` (label prop)
  - Use for filled text fields with top-rounded corners and bottom border.

Accessibility notes

- Buttons include `focus-visible:ring-2` for keyboard focus.
- `Input` exposes native input semantics and visible focus state.
- Decorative images/shapes should use `aria-hidden` where appropriate.

Tokens

- Colors and radii are driven by CSS variables in `src/app/globals.css`.
- Tailwind config maps utility color names (e.g., `primary`) to these variables.

Next steps

- Replace remaining site buttons/cards with these primitives.
- Add Storybook or a playground page for interactive testing.
