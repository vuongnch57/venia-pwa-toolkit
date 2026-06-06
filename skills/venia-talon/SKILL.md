---
name: venia-talon
description: Add a new talon plus co-located GraphQL for Venia behavior that is not a drop-in Peregrine override. Use when building new data/logic hooks for a feature (not replacing a core Peregrine talon).
---

# Add a talon (+ GraphQL)

Use for **new** behavior. To **replace** a core Peregrine talon, use `venia-override`
(mirror under `src/overrides/peregrine/...`) instead.

**Why talons exist:** business logic, queries, callbacks, and non-trivial state belong
in a `use*` hook, not the component. When a component starts accumulating those, extract
them here and keep the JSX presentational.

> **Syntax gotcha:** files under `src/talons/**` (and `src/overrides/**`) are processed
> by the buildbus babel loader, which **rejects `??` and `?.`** (`Module parse failed:
> Unexpected token`). Use explicit checks and `||` instead.

## Steps

1. **Create `src/talons/<Feature>/use<Feature>.js`** — the hook.
2. **Co-locate GraphQL** in `src/talons/<Feature>/<feature>.gql.js` (queries/mutations
   + a default export of operation objects the talon consumes).
3. **Wire UI** from a component in `src/components/<Feature>/` (one component per
   file; split sub-components out).
4. **Import via aliases** — `@/talons/...`, `@/components/...`.
5. **Copy through react-intl** — any user-facing strings the talon returns for
   display should be `{ id, defaultMessage }` shaped (and rendered with
   `formatMessage`), especially validator messages (see `venia-i18n`).

## Decision guide

| Situation | Skill |
|---|---|
| New hook/logic, no core file replaced | `venia-talon` (this) |
| Replace a core Peregrine talon's behavior | `venia-override` |
| Replace a whole module export | `venia-targetable-splice` |

## Verify

Lint/build; exercise the hook in the consuming component and confirm GraphQL
operations resolve against the running backend.
