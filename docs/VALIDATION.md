# Full-game validation

`scripts/full-game.mjs` drives release 119 using only parser commands and a test-only random seed (8). It completes the game with 350 points, reads the ending inside the barrow, and exits through the original QUIT prompt. The validated route currently contains 409 commands and 414 game moves; wait and combat semantics are owned by the original engine.

Route planning reference: [Eristic's Zork I walkthrough](http://www.eristic.net/games/infocom/zork1.html), plus the pinned original source. The repository stores executable command facts, not the third-party walkthrough prose. The full integration route covers all treasure categories, troll and thief combat, the Cyclops escape, dam/drainage, temple ritual, river/boat, coal/diamond machine, egg/canary and final barrow. Random outcomes under other seeds may differ; this is not proof that every possible path or death has been validated.

`tests/fixtures/winning-route.json` is emitted by the successful run. The browser integration test replays it through normal controls and includes a mid-game Save → Reload → Load. Its deterministic seed is injected only into the test browser, never into the distributed game. The source-build route comparison remains separate because compiled object numbering differs.

Visual coverage and parser completion are separate gates. A successful full playthrough does not mean all rooms, props and alternative states have finished artwork. Do not mark a region visually complete merely because this route passes.
