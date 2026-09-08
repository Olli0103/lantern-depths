# Lantern Depths

An independent, illustrated browser interface to **Zork I**, built on the historical source released under MIT. Early working prototype, not an official remaster.

## What works

- The actual archived Zork I executable runs locally in the browser through the MIT-licensed **ifvms** Z-machine interpreter.
- Room, inventory, object visibility and score come from VM state, not narration matching or an AI simulation.
- Point-and-click object actions, compass navigation and the original text parser.
- Browser-local save/load, including interpreter state and the journal.
- Original AI-generated opening-area background paintings. The rest of the game remains accessible through the parser with an explicit unillustrated view.
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

**This prototype currently runs the archived `COMPILED/zork1.z3` included in that repository (release 119, serial 880429). It has not yet been rebuilt from the ZIL source snapshot.** The source archive is not guaranteed to reproduce that retail executable. [Provenance and executable checksum](docs/upstream.json) record this distinction.

Original authors: Marc Blank, Dave Lebling, Bruce Daniels and Tim Anderson / Infocom. The current upstream MIT notice credits Microsoft (2025); historical notices are preserved. Our interface code is MIT-licensed; upstream and interpreter notices are retained separately. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The Zork name is used to identify the source. This project is not affiliated with or endorsed by Microsoft, Xbox, Activision or Infocom. The source licence does not grant trademarks or rights to excluded packaging, recordings or later franchise material.

## Current limitations

- This is an illustrated interface milestone, **not a complete point-and-click adaptation**. Some original commands require typing.
- Paintings are initial environment plates. Most movable objects currently use named controls rather than separate illustrated layers. Open/closed state is labelled; matching painted state variants are still to come.
- Only the opening region has artwork. South of House, the attic and the wider underground map are not yet illustrated.
- The adapter is bound to the exact release in `docs/upstream.json`; do not swap story files without updating and testing the object map.
- Save slots are local to the browser and origin. There is no cloud save, downloadable save or audio yet.
- The original game's deaths, resource limits and unusual parser behaviour remain. Full-game completion has not been validated through this interface.

## Next milestones

1. Rebuild the ZIL source with pinned tooling and compare behaviour with the archived executable.
2. Add state-correct illustrated object layers (mailbox, window, rug, trapdoor, lamp, sword, bottle and sack).
3. Extend the room art, improve item-to-target interactions and add optional audio.
4. Audit parser-dependent puzzles before attempting a mouse-only mode.

See [docs/ADAPTATION.md](docs/ADAPTATION.md) and [asset provenance](public/art/README.md).
