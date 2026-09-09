# Lantern Depths

An independent illustrated edition of **Zork I**, built from the historical MIT-licensed source. A first-person point-and-click interface with the original parser, puzzles, danger and dry humour. Not an official remaster.

**[Play in your browser](https://olli0103.github.io/lantern-depths/)**

## The illustrated edition

- All **110 original rooms** have environment artwork, scene captions and defined prop surfaces. Repeated mazes and forests deliberately remain indistinguishable.
- Direct picture actions, visual satchel, readable documents, keyboard controls and a responsive mobile layout. The parser stays permanently available for unusual commands and wordplay.
- Source-driven window, mailbox, rug, trapdoor, container, treasure, encounter, light, reservoir, machine, basket and excavation states. Portable objects are separate from paintings.
- A discovery-only drawn map: actual visited places and observed routes, never hidden exit tables or automatic maze solutions.
- **Undo**, quick save/load, three named save slots, portable save import/export, journal export and command history.
- Optional restrained ambience and opening music. Music starts when browser policy allows, otherwise on the first interaction; sound can be disabled independently.
- Responsive WebP delivery, reduced motion and accessible object names. No account, AI runtime, API key or backend is needed to play.

### Original engine, source-built delivery

New games run the **reproducible ZILF build** of the pinned source through the MIT-licensed ifvms Z-machine. A build-specific symbol adapter normalises 250 object IDs, flags, properties and globals. Browser startup verifies exact story checksums. All puzzle decisions remain in the Z-machine; clicks submit parser commands, never invented outcomes.

**Existing saves are retained.** Saves from the archived release-119 build resume with that same archived engine. New-source saves resume with the new-source engine. No incompatible Quetzal bytes are converted or relabelled. Starting a new game uses the source build. [Build and compatibility details](docs/SOURCE-BUILD.md).

## Play and controls

Select an object in the painting or Nearby, then choose an ordinary action. Select a satchel item and a relationship such as **Put in…** or **Light with…**, then choose the target. These are attempts: the original parser decides whether they work.

Use the compass for movement, or type commands. **↑/↓** recalls commands without erasing an unfinished draft. **Undo** restores the previous command, journal and discovered routes. **Settings → Saved adventures** manages named saves and files. Browser storage is local to this browser/device; export a save before moving devices or clearing browser data.

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
npx playwright install chromium
npm run test:browser
npm run build
npm run build:source
npm run verify:source
```

The last two commands independently rebuild the original source twice and verify the shipped source binary and symbol adapter. ZILF is build tooling, not a browser dependency.

## Scope and fidelity

The accepted illustrated-adventure roadmap is complete for this edition: comfort, connected-region staging, remaining puzzle regions, source-build delivery and end-to-end validation. This is **not a mouse-only rewrite** or a frame-by-frame animation of every possible response. Wordplay, unusual actions and some exceptional outcomes deliberately remain in the original journal/parser. Objects use authored staging, not physics. The finale is a read-only rendering of the VM's actual ending call, not a fabricated room or AI narrative.

A seeded 350-point browser route, save/reload, both-build state comparisons, off-route parser exploration, darkness, malformed saves, combat recovery and visual-state checks protect the adaptation. Tests do not prove every possible random playthrough; report reproducible issues through GitHub. [Validation](docs/VALIDATION.md) · [Roadmap](docs/ROADMAP.md) · [Artwork prompts](docs/ART-PROMPTS.md).

## Source and licence

Original ZIL is pinned at `97b7b3d68c075dd9af7da499c3e9690ada3471fd` of [historicalsource/zork1](https://github.com/historicalsource/zork1). Original authors: Marc Blank, Dave Lebling, Bruce Daniels and Tim Anderson / Infocom. The upstream MIT notice credits Microsoft (2025); historical notices are retained.

Interface code is MIT-licensed. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [executable provenance](docs/upstream.json), and the [separate music rights notice](public/audio/README.md). The Zork name identifies the source; the project is not affiliated with or endorsed by Microsoft, Xbox, Activision or Infocom. Source licensing does not grant trademarks or rights to excluded packaging, recordings or later franchise material.
