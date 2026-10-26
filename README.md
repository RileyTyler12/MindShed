MindShed is a self-help/productivity/fun app focused on helping the user make the most out of their time and day using various tools.
Everything is fully offline and saved to your browser's localStorage.
This project will evolve over time.

## Features
- **Todo list** — add and complete tasks; each completed task earns 10 me-points.
- **Journal** — write entries; each entry earns 25 me-points.
- **Me-points & streak** — point totals and a daily streak, shown in the header.
- **Themes** — light, retro, mint, cute, starry, icy, fire (dark is the default).
- **Onboarding** — first-run setup that unlocks the todo/journal/settings nav.

## Running
1. Install dependencies: `npm install`
2. Run in development: `npm start`

## Testing
- `npm test` — run all tests (vitest, jsdom)
- `npm run test:watch` — vitest in watch mode
- Single file: `npx vitest run tests/userSettings.test.js`

## Building
To build the production executable for Windows:
1. `npm install`
2. `npm run build` — generates an installer in the `dist/` directory.
