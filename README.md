<div align="center">

# Lantern Depths

### An illustrated journey into the Great Underground Empire.

**Zork I, reimagined as a visual adventure. Original puzzles. Original parser. Bring a lantern.**

[**Play now →**](https://olli0103.github.io/lantern-depths/) · [Contribute](CONTRIBUTING.md) · [Report a bug](https://github.com/Olli0103/lantern-depths/issues) · [Releases](https://github.com/Olli0103/lantern-depths/releases)

[![Verification](https://github.com/Olli0103/lantern-depths/actions/workflows/ci.yml/badge.svg)](https://github.com/Olli0103/lantern-depths/actions)
[![License: MIT](https://img.shields.io/badge/code-MIT-a89a61)](LICENSE)

<img width="1500" alt="Lantern Depths: illustrated room, visual inventory and the original adventure journal" src="https://github.com/user-attachments/assets/4e1b0774-884c-43b1-b0c1-2713c671234d" />

**Free to play in your browser. No account, installation or API key.**

</div>

## A familiar white house. A different way inside.

Explore hand-staged scenes, select objects in the painting, and carry your discoveries in a visual satchel. Underneath the illustrations runs the real Zork I game, reproducibly built from its historical MIT-licensed source. Every click becomes a parser command; the original engine decides what happens next.

Lantern Depths is an independent illustrated edition, **not an official remaster**. The danger, wordplay and dry humour are still here. So is the possibility of being eaten by a grue.

## What awaits

| | |
| --- | --- |
| **An illustrated world** | Artwork, captions and authored prop surfaces for all 110 original room objects. Shared forests and mazes intentionally retain their ambiguity. |
| **Objects you can act on** | Direct picture actions, a visual satchel and readable documents. Movable props are separate from the scenery; supported picture states follow the engine. |
| **The original adventure** | Original writing, puzzles and parser, with a permanently available command line for unusual actions and wordplay. |
| **Room to experiment** | Undo, quick save/load, three named save slots, save-file import/export and journal export. |
| **A map you earn** | A drawn discovery map of visited places and actually travelled routes—not hidden exits or automatic maze solutions. |
| **Desktop and mobile** | Responsive images and layout, keyboard controls, reduced-motion support, optional ambience and opening music. |

No runtime AI invents story outcomes. No backend is required to play.

## Your first few moves

1. **[Open the game](https://olli0103.github.io/lantern-depths/).** Select an object in the painting or the **Nearby** list, then choose an action.
2. **Explore.** Use the compass, or type commands such as `look`, `inventory` or `examine mailbox`.
3. **Use what you carry.** Select a satchel item, choose a relationship such as **Put in…** or **Light with…**, then select a target. These are attempts, not guaranteed solutions.
4. **Try things.** Undo restores the previous command, journal and discovered routes. **↑ / ↓** recalls command history while preserving an unfinished draft.

**Saving:** Quick save/load stays close at hand. **Settings → Saved adventures** manages named slots and portable save files. Storage belongs to this browser and device; export a save before switching devices or clearing browser data.

**Sound:** Music starts when browser policy allows, otherwise on the first interaction. Music and ambience can be disabled independently in Settings.

> This is a parser-first illustrated adventure, not a mouse-only rewrite. Some unusual actions and wordplay still need typed commands. The journal remains the authoritative account of what happened.

## Make it better with us

**Contributions are welcome—code is only one way to help.**

- **Playtest:** report a reproducible visual glitch, confusing interaction or mobile/accessibility issue.
- **Improve a scene:** refine object placement, a hotspot or a state-correct illustration.
- **Improve the interface:** make controls, keyboard navigation or reading more comfortable without changing puzzle rules.
- **Help fellow explorers:** clarify documentation and local setup instructions.

Start with the **[contribution guide](CONTRIBUTING.md)** for setup, project structure, artwork requirements and the pull-request checklist. Browse [open issues](https://github.com/Olli0103/lantern-depths/issues), or open one with your proposed change. For a larger feature, discuss its scope before investing in the implementation.

## Run locally

Requires **Node.js 24** and **Git**.

```sh
git clone --recurse-submodules https://github.com/Olli0103/lantern-depths.git
cd lantern-depths
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm ci` also prepares the story, interpreter and optimized artwork. If you cloned without submodules, run `git submodule update --init --recursive` before installing dependencies.

### Check your changes

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

On Linux, Playwright may need `npx playwright install --with-deps chromium`. Run the browser suite and build sequentially; rebuilding assets while a browser test is running can invalidate the test session.

To independently reproduce the source build and verify its adapter:

```sh
npm run build:source
npm run verify:source
```

The source build downloads hash-verified ZILF tooling and compiles twice in isolation. ZILF is build tooling, not a browser dependency. See [source-build details](docs/SOURCE-BUILD.md).

## Faithful underneath, tested end to end

The interface reads VM state rather than scraping narration. A checksum-bound adapter maps objects, flags, properties and globals for each supported build. Invisible objects, darkness and closed containers must not leak information through the picture or controls.

**Old saves keep their original engine.** New games use the reproducible source build; archived release-119 saves resume with the archived engine. Incompatible save bytes are never converted or relabelled.

Regression coverage includes a seeded **350-point full-game route**, real object clicks, save/reload and Undo, both-build state comparisons, 108 parser-reachable room identities, slow image transitions and responsive layouts. These checks are not proof of every possible command or random outcome. Objects use authored staging, not physics, and not every narrated response has its own animation.

| Learn more | |
| --- | --- |
| [Validation](docs/VALIDATION.md) | Test scope, evidence and known limits |
| [Adaptation contract](docs/ADAPTATION.md) | How the interface preserves the original game |
| [Source build & saves](docs/SOURCE-BUILD.md) | Reproducibility, adapters and compatibility |
| [Roadmap](docs/ROADMAP.md) | Accepted scope and completed milestones |
| [Artwork & prompts](docs/ART-PROMPTS.md) | Illustration provenance and generation records |

## Credits & licence

Original Zork I by **Marc Blank, Dave Lebling, Bruce Daniels and Tim Anderson / Infocom**. Historical ZIL source is pinned to [`97b7b3d`](https://github.com/historicalsource/zork1/tree/97b7b3d68c075dd9af7da499c3e9690ada3471fd) of [historicalsource/zork1](https://github.com/historicalsource/zork1). The upstream MIT notice credits Microsoft (2025); historical notices are retained. The game runs through the MIT-licensed [ifvms](https://github.com/curiousdannii/ifvms.js) Z-machine interpreter.

Interface code is [MIT-licensed](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md), [executable provenance](docs/upstream.json) and the [separate music rights notice](public/audio/README.md).

The Zork name identifies the source. Lantern Depths is not affiliated with or endorsed by Microsoft, Xbox, Activision or Infocom. Source licensing does not grant trademarks or rights to excluded packaging, recordings or later franchise material.
