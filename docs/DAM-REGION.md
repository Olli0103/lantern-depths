# Dam / Reservoir — v0.6

Seven connected release-119 rooms are authored: Dam (178), Lobby (120), Maintenance (224), Dam Base (111), Reservoir South (123), Reservoir (95), Reservoir North (191). The adapter reads VM flags/globals; it never changes them. Generated artwork, prompts and reference paths are recorded in DAM-ART-PROMPTS.md and art-manifest.json.

## State, not illustration-driven rules

| Sluices | Reservoir | Painting |
|---|---|---|
| Closed | High | closed-high |
| Open | High / draining | open-high |
| Open | Low | open-low |
| Closed | Low / filling | closed-low |

Global 56 supplies gates, room 95 flag 6 supplies low water. The original delayed drain/refill interrupt remains authoritative. Global 88 enables the green indicator/interlock. Global 94 supplies maintenance flooding; room 224 flag 19 supplies light. Leak object 49 remains hidden until discovered. The leak overlay is a restrained visual indication, not new fluid simulation. Trunk visibility and removal of tool chests follow original object flags.

The four wall buttons share a touch-sized panel target, exposing only visible actual objects and their ordinary Examine/Push actions. Opening the panel consumes no turn. The generic inventory Turn with action does not name a puzzle solution. Portable tools/chests are separate layers, never baked into the background. Dry reservoir views preserve south/north/bed perspectives.

## Discovery sketch

The schematic consumes only saved Discovery rooms/routes. It does not read exits, invent reverse links, distinguish intentionally ambiguous maze rooms, or enable fast travel. Collision offsets mean it is not a geographic survey. Arrows carry observed direction labels. Zoom, current-position highlighting, keyboard-operable nodes and the original notes list remain available. Clicking a node locates its notes and does not advance the game. Undo and save/load retain existing knowledge semantics.

## Verification / boundaries

36 engine/integrity tests and 19 browser tests cover the full 350-point route, drainage/refilling, gate interlock, leakage, darkness, old save/load, grouped mobile controls and discovery/Undo. Decoded dam states, dry shores, mobile controls and the fully stocked trophy case were visually inspected. The source-built story is still separately verified, not substituted into public saves.

This is a regional increment, not a claim that all rare props/animations throughout Zork are finished. Temple, River/boat, Mine and endgame visual authoring remain on the roadmap. No universal editor or platform was introduced: existing data and browser coordinate inspection were sufficient for this increment.
