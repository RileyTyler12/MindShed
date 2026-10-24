# MindShed Test Suite — Plan

## Context & Key Constraints

The app has a **two-tier script architecture** (per AGENTS.md):
- **ES modules**: `contentSwitcher.js`, `dashboard_*.js` — importable, `"use strict"`.
- **Plain injected scripts (helpers)**: `userSettings.js`, `todoList.js`, `journal.js` — NOT modules. They are injected as `<script src>` tags, rely on **implicit globals** (`userInfo`, `todoList`, `journal`), and call each other across files (e.g. `awardPointsAndUpdateStreak` is defined in `userSettings.js` but called from `todoList.js`/`journal.js`).

Because helpers are plain scripts with implicit globals and cross-file coupling, they **cannot be `import`ed** directly. The faithful way to test them is to execute them in a real browser-like global scope, exactly as the app does.

## Testing Strategy: Vitest + jsdom

- **Runner**: `vitest` (fast, ESM-native, first-class `jsdom` environment).
- **Environment**: `jsdom` — provides `window`, `document`, `localStorage`, `fetch` mocks.
- **Loading plain scripts**: Use `window.eval(readFileSync(...))`. This executes the script in the **window global scope**, so `function` declarations and undeclared assignments become globals on `window` — identical to how the app injects them.
- **Load order** (matches the app): `userSettings.js` first (defines `awardPointsAndUpdateStreak`), then `todoList.js`, then `journal.js`.
- **DOM setup**: A shared helper creates every element the helpers reference (`#html-element`, `#streak`, `#me-points`, `#version`, `#todo-input`, `#list-incomplete`, `#list-complete`, `#journal-input`, `#journal-main-container`, `#theme-button`, `#theme-dropdown-container`, `#onboarding`, `#dashboard`).
- **API mocks**: `fetch`, `alert`, `confirm`, `location.reload` are stubbed per test to avoid side effects.

## Files to Create

1. **`vitest.config.js`** — configure Vitest with `jsdom` environment.
2. **`tests/setup.js`** — shared setup: DOM element creation, API mocks, `loadScript()` helper.
3. **`tests/userSettings.test.js`** — tests for `awardPointsAndUpdateStreak`, `migrateDataIfNeeded`, `setTheme`.
4. **`tests/todoList.test.js`** — tests for `addTodoListItem`.
5. **`tests/journal.test.js`** — tests for `addJournalItem`.

## Planned Tests (~6)

| # | Function | Test | Expected |
|---|----------|------|----------|
| 1 | `awardPointsAndUpdateStreak` | First action (no prior date), 10 pts | `streakDays === 1`, `points += 10`, `lastActionDate` set to today |
| 2 | `awardPointsAndUpdateStreak` | Consecutive day (last = yesterday), 10 pts | `streakDays` increments by 1 |
| 3 | `awardPointsAndUpdateStreak` | Gap (last = 2 days ago), 10 pts | `streakDays === 1` (reset) |
| 4 | `migrateDataIfNeeded` | Stored version differs from current | `mindshed-version` updated to current |
| 5 | `setTheme` | Apply `light` theme | `#html-element` gets `theme-light`, `mindshed-theme === 'light'` |
| 6 | `addTodoListItem` | Add a todo | `todoList.itemStrings` includes it, saved to `mindshed-todoList` |
| 7 | `addJournalItem` | Add a journal entry | entry added, `points += 25`, saved to `mindshed-journal` |

## package.json Changes

Add to `devDependencies`: `vitest`, `jsdom`.
Add scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

## Verification

Run `npm test` — all tests should pass. Confirm the test files execute the real helper code (not re-implementations) and that load order + DOM setup produce no uncaught errors.
