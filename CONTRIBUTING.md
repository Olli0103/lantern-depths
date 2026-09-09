# Contributing to Lantern Depths

Thanks for helping make the Great Underground Empire a little easier to explore—and just as dangerous.

We welcome bug reports, playtesting, documentation, accessibility improvements, interface fixes and state-correct artwork. You do not need to know ZIL or write code to contribute.

## Start here

- Browse [open issues](https://github.com/Olli0103/lantern-depths/issues) for existing reports before opening a new one.
- Good first contributions include a clearer setup instruction, a reproducible layout fix, or an object-placement correction in one room.
- For a larger feature or a new art direction, open an issue describing the problem and proposed scope first. Check the [roadmap](docs/ROADMAP.md) and [adaptation contract](docs/ADAPTATION.md).
- Keep a pull request focused on one change. Screenshots and a short reproduction are often more useful than a large rewrite.

## Report a bug

[Open an issue](https://github.com/Olli0103/lantern-depths/issues/new) and include:

- **Where:** room name, game version or URL, browser, operating system and approximate screen size.
- **Steps:** exact commands or clicks from a new game, or from an attached exported save.
- **Expected / actual:** what you expected and what the game did instead.
- **Evidence:** a screenshot or short recording; for flicker, mention whether it happens on a cold load or slow connection.
- **Persistence:** whether reload, Undo or Save → Load changes the result.

Save export is under **Menu → Saved adventures**. A save or journal can contain your typed commands and play history; inspect it before posting publicly. Never attach credentials or unrelated personal files. Mark puzzle solutions and late-game screenshots as spoilers.

## Set up a development copy

Fork the repository on GitHub, then clone your fork (replace `YOUR-USERNAME`):

```sh
git clone --recurse-submodules https://github.com/YOUR-USERNAME/lantern-depths.git
cd lantern-depths
git switch -c fix/describe-your-change
npm ci
npm run dev
```

Use **Node.js 24**. Open the URL Vite prints. Installation prepares the interpreter, archived story and optimized art automatically. If the submodule is missing, run `git submodule update --init --recursive` and repeat `npm ci`.

### Find the right place

| Area | Starting points |
| --- | --- |
| Interface and layout | `src/main.js`, `src/style.css`, `src/ui.css` |
| Object actions and picture menus | `src/interactions.js`, `src/scene-menu.js` |
| Room art and object placement | `src/regions.js`, `src/scenes.js`, `src/staging.js`, `src/layers.js`, regional modules |
| Image loading | `src/painting.js`, `src/art.js` |
| Engine and build adapter | `src/engine.js`, `scripts/story-adapter.mjs`, `docs/story-symbols.json` |
| Saves and Undo | `src/saves.js`, `src/checkpoints.js` |
| Discovery map | `src/discovery.js`, `src/route-sketch.js` |
| Artwork | `public/art/`, `docs/ART-PROMPTS.md`, `docs/art-manifest.json` |
| Automated checks | `tests/`, `tests/browser/`, `playwright.config.js` |

Read [AGENTS.md](AGENTS.md) for repository-specific instructions, including when working with a coding assistant.

## Preserve the adventure

These are the core constraints for every contribution:

1. **The original engine decides.** Actions submit parser commands. Do not directly rewrite puzzle flags, inventory parents, score or outcomes from the UI, or add runtime AI story logic.
2. **Do not reveal hidden information.** Conceal invisible objects, closed opaque-container contents and unlit scenery in both visuals and accessible controls. Discovery maps record observed travel, not hidden exits.
3. **Illustrate the actual state.** A moved object should move; a taken object should leave the scene. Keep movable props separate from background paintings and handle refused actions without showing success.
4. **Preserve saves and provenance.** Do not relabel incompatible story bytes or remove source pins, checksums, attribution or third-party notices. Engine/adapter changes need explicit compatibility evidence.
5. **Keep it usable.** Retain the parser and accessible control alternatives. Consider touch, keyboard navigation, reduced motion and narrow screens.
6. **Keep play self-contained.** No paid runtime services, credentials or backend requirements.

## Contribute artwork or staging

For a placement fix, start with the smallest relevant room or regional module. Check the original description and the actual picture geometry—not just a plausible coordinate.

For new generated paintings or sprites:

- Use raster artwork consistent with the existing scenes. Record the prompt, generation provenance and intended state in [ART-PROMPTS.md](docs/ART-PROMPTS.md), preserving existing entries.
- Use distinct descriptive asset names in `public/art/` and update the art manifest using the repository's existing tooling and format. Do not silently replace another asset or hand-edit generated WebP derivatives.
- Verify decoded pixels: a painted checkerboard is not transparency. Inspect sprites on both light and dark backgrounds and in the actual room, satchel and detail views where applicable.
- Check open/closed, present/absent, moved/taken/dropped and lit/unlit variants where relevant. Inspect hover and selection too; DOM presence alone is not visual verification.
- Only submit material you have the right to contribute. Record its source and applicable licence; do not assume game-source licensing covers unrelated recordings or franchise art.

Include before/after screenshots and the commands needed to reach the state. Do not spoil an undiscovered item by baking it into a background.

## Verify your change

For **gameplay or rendering changes**, run these sequentially:

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

On Linux, use `npx playwright install --with-deps chromium` if system dependencies are missing. Playwright starts its own local server unless `LANTERN_TEST_URL` is set. Do not run a build that rewrites assets while testing against the development server.

Add a focused regression test for the behavior you fix. Use real commands and ordinary clicks; do not hide an obstructed target behind a forced click. For visual changes, also inspect the actual rendered result on desktop and mobile. Check Save/Load and Undo when your change affects state-dependent presentation.

For **source or adapter changes**, additionally run:

```sh
npm run build:source
npm run verify:source
```

See [SOURCE-BUILD.md](docs/SOURCE-BUILD.md) for the hash-verified compiler download, generated adapter and dual-engine compatibility contract. Never edit a compiled story or generated adapter as a shortcut.

For **documentation-only changes**, check Markdown, local links and the accuracy of commands; a gameplay-suite rerun is not required. Avoid fixed test counts or exhaustive-correctness claims that will become stale.

## Open a pull request

Push your branch to your fork and open a pull request against `main` here. Include:

- A short explanation of the problem and the change; link a related issue if one exists.
- Reproduction steps, plus before/after screenshots for visible changes.
- Checks you actually ran and their results; explicitly note anything not verified.
- Any effect on saves, story adapters, asset provenance or existing controls.

Before submitting, check `git diff --check` and `git status`. Leave out `node_modules`, build output, local test artifacts, private saves and unrelated files. Preserve concurrent changes rather than overwriting them.

CI runs engine tests, the reproducible source build, adapter verification, browser tests and the production build. Passing CI supports review; it does not replace a visual check or prove every possible playthrough.

Contributed interface code is covered by the repository's [MIT licence](LICENSE). Preserve [third-party notices](THIRD_PARTY_NOTICES.md) and any separate asset terms. Be constructive in issues and reviews, and keep the focus on making the adventure better.
