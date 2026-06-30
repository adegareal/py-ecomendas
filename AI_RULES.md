# AI Rules

## Tech Stack
- React + TypeScript for the frontend application.
- React Router for client-side routing.
- Keep route definitions in `src/App.tsx`.
- Put all application source code inside `src/`.
- Put pages in `src/pages/`.
- Put reusable components in `src/components/`.
- Use `src/pages/Index.tsx` as the default landing page.
- Use Tailwind CSS for styling and layout.
- Use shadcn/ui as the primary component library.
- Use `lucide-react` for icons.

## Library Usage Rules
- Use **shadcn/ui** first for UI primitives such as buttons, cards, dialogs, forms, inputs, tabs, tables, sheets, and dropdowns.
- Do **not** edit the generated shadcn/ui component files directly; create wrapper or feature components in `src/components/` when customization is needed.
- Use **Tailwind CSS** for all visual styling, spacing, typography, responsive behavior, and layout.
- Use **React Router** for navigation, page composition, and route-based views.
- Keep page-level screens in **`src/pages/`** and shared UI building blocks in **`src/components/`**.
- Use **lucide-react** for icons instead of introducing a different icon set unless explicitly requested.
- When adding new visible features, make sure they are rendered from the appropriate page, especially `src/pages/Index.tsx` for the main page.
- Prefer small, focused React components and avoid adding new libraries when the existing stack already covers the use case.
