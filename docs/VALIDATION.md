# Full-game validation

`scripts/full-game.mjs` drives the archived release 119 reference using only parser commands and a test-only random seed (8). It completes the game with 350 points, reads the ending inside the barrow, and exits through the original QUIT prompt. The validated route currently contains 409 commands and 414 game moves; wait and combat semantics are owned by the original engine.

Route planning reference: [Eristic's Zork I walkthrough](http://www.eristic.net/games/infocom/zork1.html), plus the pinned original source. The repository stores executable command facts, not the third-party walkthrough prose. The full integration route covers all treasure categories, troll and thief combat, the Cyclops escape, dam/drainage, temple ritual, river/boat, coal/diamond machine, egg/canary and final barrow. Random outcomes under other seeds may differ; this is not proof that every possible path or death has been validated.

`tests/fixtures/winning-route.json` is emitted by the successful run. The browser integration test replays it through normal controls and includes a mid-game Save → Reload → Load. Its deterministic seed is injected only into the test browser, never into the distributed game. The build-specific adapter now normalises compiled object numbering; both builds are compared turn by turn along the entire route.

Visual coverage and parser completion are separate gates. A successful full playthrough does not mean all rooms, props and alternative states have finished artwork. Do not mark a region visually complete merely because this route passes.

## v0.7 regression gate

38 engine/integrity tests, 20 browser tests and production build passed locally. Additional full-route assertions check temple mounting, hidden machine contents, remote basket contents, buried scarab and carried buoy contents. Browser test selects a filled basket normally (no forced clicks), checks Undo, lit-candle save/load, switch keyboard focus and mobile controls. Screenshots reviewed for altar, pedestal, shaft, drafty room, machine, beach/cave and treasure chamber.

## Illustrated edition release gate

- Both exact binaries: 250 object symbols, initial parents/flags, full-route score/moves/location/inventory/visibility/state/placement equality; 1,296 directional parser attempts covering 108 reachable rooms.
- All 110 room objects: environment present, caption nonempty, explicit safe surface profile. Shared maze/forest profiles preserve ambiguity.
- Source-fidelity states: open/closed coffin and egg, permanently open book, ivory torch, silver chalice, lit lamp, lower/raised basket and chain, excavation and collapse/restore, ending caller/PC and Undo. Alpha channels and production manifest checks cover shipped assets.
- Parser labels: 91 discovered object labels tested from isolated real states. Corrected egg, nest and ghosts labels; tests never advance the retained reference route.
- Browser: an actual retail save survives source-default startup, movement, save, reload and New game; source and retail saves are never relabelled. New artwork is decoded at rest and hover, container contents remain separately selectable, mobile controls remain usable, and final Undo restores the correct scene.
- Fresh double source build matches the shipped source image and regenerated adapter. Public release requires the complete node/browser/build CI plus live read-back.

This is a completed illustrated-adventure baseline within the accepted parser-first rules. It is not exhaustive state-space verification or animation of every prose response. No player-facing claim of mouse-only completion is made.

### Local release evidence — 2026-09-09

47 engine/integrity tests and 22 browser tests passed (69 total); production build succeeded. A fresh pair of ZILF builds produced the exact shipped source hash and the adapter registry passed regeneration checking. Stable desktop/mobile screenshots were reviewed for altar, open coffin, excavation, baskets and ending. Deployment and live evidence are recorded in the GitHub release after publication.
