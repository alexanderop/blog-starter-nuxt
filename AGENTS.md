# Agent Instructions

This project uses Nuxt 3 with Nuxt Content. Follow these guidelines when modifying the repository.

## Setup
- Install dependencies with `npm install`.
- Start the dev server via `npm run dev`.
- Run `npm run typecheck` to perform TypeScript checks.

## Coding Style
- Obey the rules in `.cursor/rules/`.
- Avoid code comments; use descriptive names instead.
- Prefer the functional-core, imperative-shell pattern.
- Do not use the `any` type in TypeScript.
- For Vue files, place the `<script setup>` block before the template and define props/events with `defineProps`/`defineEmits` directly.
- Nuxt composables and components are auto-imported; avoid explicit imports unless necessary.

## Contributing
- Commit messages should be clear and concise.
- Run `npm run typecheck` before committing. If it fails because dependencies are missing, mention this in your PR description.

## Cursor Rule Improvements
- Rule files in `.cursor/rules/` now include descriptions and corrected language.
