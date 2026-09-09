# Lantern Depths

An independent, illustrated browser interface to **Zork I**, built on the historical source released under MIT. Early working prototype, not an official remaster.

**[Play in your browser](https://olli0103.github.io/lantern-depths/)**

## v0.5.1 — Actions in the scene

Scene-object clicks now open nearby action controls; keyboard and sidebar controls remain available. Eleven opening-region rooms have authored floor/surface placements, the trophy case visibly opens, and accessible container contents follow actual possession and visibility. [Scope and remaining art work](docs/REGION-STAGING.md). Original puzzles, binary and saves remain unchanged.

## Direction and v0.5 — Room to experiment

The [accepted roadmap](docs/ROADMAP.md) prioritises a fully authored adventure over a universal engine platform: comfort and delivery first, then the connected house/cellar/troll/gallery region, then the remaining puzzle regions. Whole-world illustration is not the same as finished point-and-click staging.

- **Undo** beside the parser restores up to 20 recent commands (bounded to 8 MB), including journal, discovered routes and replayable random draws. Available even after the session ends. Undo history lasts for this page session and is cleared by Load/New game.
- **Settings → Saved adventures** provides three named slots in addition to existing quick Save/Load, portable JSON import/export and journal text export. Old quick saves remain supported; new files identify the exact story bytes and adapter. Loading another story's file is rejected before replacing the current session.
- **Up/Down** in the parser recalls recent commands and preserves an unfinished draft. No global dictionary autocomplete or solution suggestions.
- **Smaller artwork downloads:** generated WebP derivatives total 19.3 MB at full resolution versus 115.6 MB for source PNGs (83% reduction). Individual environments also have 768-pixel variants; the browser selects one for its viewport/density. This is aggregate derivative size, not a claim that all images download on opening. Original PNGs remain in the repo and deployment as sources/fallbacks, so the deployed archive itself is not 83% smaller. Transparent sprites use lossless WebP. No artwork was regenerated in this pass.

The story binary and puzzle rules are unchanged. [Implementation and limitations](docs/COMFORT.md).

## v0.4.1 — Optional opening music

The owner-supplied Suno track is available under **Settings → Play opening music**. It automatically starts a quiet, fading 60-second excerpt on opening the game (or on the first click/key press if browser autoplay policy blocks it); no looping or room-triggered restarts. Hidden tabs pause playback. The audio level controls both music and separately enabled ambient sound. Original game rules and saves are unchanged. The MP3 has a [separate rights notice](public/audio/README.md), not the code’s MIT licence.

## v0.4 — The wider Great Underground Empire

Environment artwork now covers all 110 original room objects, with shared paintings for intentionally indistinguishable maze/forest locations. Generated props, treasure icons, encounter states, readable close-ups and saved discovery notes extend the opening prototype. Reservoir and mirror variants follow the original state. A deterministic full parser route reaches 350/350 and the ending, including a mid-game browser save/reload. The original source also builds reproducibly in isolation with ZILF 1.9; see [build evidence](docs/SOURCE-BUILD.md). The public story and existing saves are unchanged.

## v0.3 — Beneath the white house

Three new underground paintings, a state-driven troll encounter (armed, disarmed, unconscious or absent), a dropped axe layer, room-specific stereo ambience, and reduced-motion-aware entrance fades. The engine still decides every combat outcome. Existing saves remain compatible.

## What works

- The actual archived Zork I executable runs locally in the browser through the MIT-licensed **ifvms** Z-machine interpreter.
- Room, inventory, object visibility and score come from VM state, not narration matching or an AI simulation.
- Point-and-click object actions, compass navigation and the original text parser.
- Browser-local save/load, including interpreter state and the journal.
- Opening-area object layers: take/drop items, slide the rug, uncover and open the trapdoor. Mailbox and window scene variants reflect the engine's state.
- Contextual physical actions and inventory-to-target commands: choose an item, select an action such as **Put in…**, then click the target. Escape cancels; selecting does not consume a turn.
- Optional quiet procedural ambience and interaction sounds, initially off. Volume, journal text size and reduced-motion controls are in Settings.
- Generated environment artwork throughout the original room map; state-backed inventory illustrations and world props. This is broad illustration coverage, not an exhaustive animation of every possible original response.
- Automated checks for the opening route, hidden objects, darkness, and save continuation.

No AI service, account, API key or backend is required to play.

## Run locally

Requires Node.js 24 and Git.

```sh
git clone --recurse-submodules https://github.com/Olli0103/lantern-depths.git
cd lantern-depths
npm ci
npm run dev
```

If cloned without submodules: `git submodule update --init --recursive`.

```sh
npm test
npm run build
npm run preview
```

For browser checks: `npx playwright install chromium` then `npm run test:browser`.

## Source and licence

The original ZIL source is pinned as the `vendor/zork1` submodule at commit `97b7b3d68c075dd9af7da499c3e9690ada3471fd` of [historicalsource/zork1](https://github.com/historicalsource/zork1).

**This prototype currently runs the archived `COMPILED/zork1.z3` included in that repository (release 119, serial 880429). A separate, reproducible build from the ZIL source snapshot now exists, but has different object IDs and is not yet the public gameplay executable.** The source archive is not guaranteed to reproduce that retail executable. [Provenance and executable checksum](docs/upstream.json) record this distinction.

Original authors: Marc Blank, Dave Lebling, Bruce Daniels and Tim Anderson / Infocom. The current upstream MIT notice credits Microsoft (2025); historical notices are preserved. Our interface code is MIT-licensed; upstream and interpreter notices are retained separately. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The Zork name is used to identify the source. This project is not affiliated with or endorsed by Microsoft, Xbox, Activision or Infocom. The source licence does not grant trademarks or rights to excluded packaging, recordings or later franchise material.

## Current limitations

- This is an illustrated interface milestone, **not a complete point-and-click adaptation**. Some original commands require typing.
- Many world objects now have artwork, but not every state has a bespoke illustration. Sack opening, bottle contents, nested-container placement, sand excavation stages and some destruction/burning responses still rely on named controls and the original journal. Portable objects use staged positions rather than a physics simulation.
- Map notes record only observed movements in distinct locations; deliberately ambiguous mazes, repeated caves and river stretches are not disambiguated by hidden IDs. No automatic travel or revealed solutions.
- The adapter is bound to the exact release in `docs/upstream.json`; do not swap story files without updating and testing the object map.
- Save slots are local to the browser and origin. There is no cloud save or downloadable save. Existing v0.1 saves remain compatible. Sound is locally synthesized with Web Audio, not recorded samples or voice acting.
- The original game's deaths, resource limits and unusual parser behaviour remain. A test-seeded full parser playthrough reaches all 350 points and the final ending; alternate routes and random outcomes are not exhaustively validated.

## Next milestones

1. Validate a separate graphical mapping for the reproducibly rebuilt source; preserve retail save compatibility.
2. Extend object-state coverage to container contents, destruction and the remaining world objects.
3. Add reviewed ambient recordings and sparse musical cues using the user's authorised audio services; retain user-controlled playback and document redistribution rights separately.
4. Audit parser-dependent puzzles before attempting a mouse-only mode.

See [docs/ADAPTATION.md](docs/ADAPTATION.md) and [asset provenance](public/art/README.md).
