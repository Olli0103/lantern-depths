# Goal: a fully authored illustrated adventure

Accepted direction, 2026-09-09. The environment is the game, not a decorative header above a list of nouns. Remove interface friction, not mystery. Finish connected regions before widening scope. This roadmap is a delivery goal, not a claim of completed work or a fixed-date promise.

## 1 — Reliability, comfort and delivery (v0.5 implemented)

- [x] Bounded Undo restores the VM, journal and discovered routes together, including repeatable random draws; works after death. Selection and audio do not advance turns.
- [x] Quick save/load remain compatible; add named slots and bounded, validated save import/export with story/build identity; failed import never replaces the current session.
- [x] Parser history with up/down and preserved unfinished draft; no dictionary-wide autocomplete.
- [x] Encode existing source PNGs to WebP for delivery; preserve originals, alpha and geometry. Responsive environment sizes and measured transferred bytes. No unrelated art regeneration.
- [ ] Keep the archived story public until rebuilt-story object IDs, flags, globals and saves have a verified build-specific adapter. Do not infer stable symbols from nonunique display names.

Acceptance: original opening and complete 350-point browser route pass; save/Undo recovery and malformed imports tested; desktop/mobile screenshots and actual image delivery inspected.

## 2 — One complete authored region

House → Cellar → Troll → Chasm → Gallery/Studio, including return routes.

- [ ] Audit scenery, prop positions, scale and source semantics room by room.
- [ ] All puzzle-relevant states visible and consistent with the VM, including closed/open, taken/dropped, concealed/revealed, combat and light.
- [x] Direct image interaction plus accessible keyboard/touch actions; sidebar remains a fallback. Do not suggest puzzle solutions.
- [ ] Evaluate an existing lightweight visual placement tool before making a small local coordinate editor. Do not build a general-purpose editor.
- [x] One compact art-direction contract for existing and future materials. See `REGION-STAGING.md`.

Acceptance: the connected region feels deliberately staged; every known unsupported state is recorded, not silently treated as complete. Inspect decoded artwork at rest, on hover/selection and on mobile.

## 3 — Carry this quality through the game

- [ ] Work through Dam/Reservoir, Temple, River, Mine and endgame as connected puzzle regions.
- [ ] Improve resolution selectively for puzzle-critical scenes; favour state correctness and coherent object lighting over bulk imagery.
- [ ] Discovery-only drawn map, sparse ambient/audio cues, no inferred exits or maze solving.
- [ ] Validate a source-built release adapter and explicitly resolve old-save compatibility before changing the public story.

Do not start a universal Z-machine platform, PWA/service-worker caching, AI runtime, auto-solving or speculative performance refactors. Revisit platform extraction only with a real second game and individually verified licences.

## Delivery log

- 2026-09-09: goal accepted. Existing source build, whole-world illustrations and full-game tests are foundations, not proof of a fully authored cinematic adaptation. Starting the comfort/delivery increment.

- v0.5 implementation: bounded Undo, command history, three save slots plus legacy quick slot, import/export and WebP derivatives. Source-build migration remains a separate gated task. Next production focus: connected-region staging, not more bulk illustrations.

- v0.5.1: direct scene actions, local container contents, eleven-room placement rules and open trophy-case artwork. The region is not declared complete: unsupported container sprites and crowded placement states are recorded in `REGION-STAGING.md`.

- v0.5.2: real-alpha container atlas; open sack and all bottle water/open states follow VM state in room, inventory and detail. Closing a reused node clears stale atlas styling. Packed shelves and crowded floor staging remain open regional work.

- v0.6: reviewed packed trophy shelves, bounded crowded surface placements; seven-room Dam/Reservoir staging with four gate/water combinations, visible control buttons, maintenance light/leak states and distinct dry-shore perspectives. Discovery sketch uses only saved observed routes, with keyboard-accessible notes and no travel/inferred links. Existing coordinate data and browser inspection remain sufficient for this targeted authoring; a custom editor is deferred. Temple, River, Mine, endgame refinement and source-adapter migration remain open.

- v0.7: Temple/River/Mine/endgame receive explicit captions, hotspot fixtures, authored props and local-container positions; remote basket distinguished, machine switch selectable, candles have actual lit/unlit artwork, region-specific ambience. Full-route tests cover the new presentation. See `EXPEDITION-STAGING.md` for the remaining art corrections and unsupported variants; the entire cinematic art milestone is not marked complete.
