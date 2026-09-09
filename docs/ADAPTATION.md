# Adaptation contract

**Current edition:** source-built gameplay and dual-engine old-save support are now shipped. All 110 rooms have captions and authored surfaces; the later sections below are historical milestone notes, not current missing-feature claims. See SOURCE-BUILD.md, ROADMAP.md and VALIDATION.md for current guarantees.

## Current architecture

`src/main.js` (DOM interface) → `src/engine.js` (Glk presentation adapter and read-only state access) → ifvms ZVM → pinned Zork story.

All interactions are parser commands. The UI never sets game-object attributes, inventory parents, score or puzzle flags. We read the V3 status globals and object tables directly. Known object IDs/attribute bits are release-specific and must be revalidated for any replacement executable.

Each Engine owns an independent copy of the story bytes. Save files contain Quetzal state plus the pending input buffer and story signature; UI history is separate. A restored game is constructed before replacing the current session.

New games use the reproducible source build. Archived release 119 is retained for old saves, using a separate checksum-bound adapter. See SOURCE-BUILD.md.

## Art and puzzle rules

- Never expose invisible objects in hotspots, labels or accessible controls before the engine reveals them.
- Darkness hides the environment and room objects. A lantern elsewhere does not illuminate the current room.
- A closed opaque container must not expose its contents.
- UI selection does not advance game turns. Sending a command delegates turn behaviour to the game.
- Keep movable objects separate from environment plates. The generated sprite atlas supplies the opening objects, including separate trapdoor states. Known dropped objects return to the floor, not their original furniture placement.
- Mailbox and window flags select generated scene variants. Rug discovery controls both its movement and trapdoor visibility. Sack, bottle, coffin, egg, buoy and lamp variants follow their own VM state; the black book is always open, as required by its original action routine.
- Keep original writing and humour. Do not ask a model to improvise puzzle truth at runtime.

## Validation milestone

Test route (spoilers): open mailbox; take leaflet; north; east; open window; west; west; take lamp; turn on lamp; move rug; open trap door; down. Expected room Cellar, score 35. Save/load must preserve pending parser state and inventory along this route.

The whole original world remains accessible by parser. That is not evidence that every puzzle or VM opcode is fully supported by the current presentation adapter. Keep an honest full-game validation backlog.

## Living-house milestone (v0.2)

`interactions.js` derives ordinary verbs from object flags and translates item-to-target choices into existing parser syntax. It does not suggest special solutions. Selection and cancellation are UI-only. Sounds are triggered by confirmed before/after VM changes, not by the command string, so a refused attempt does not play a success effect.

`layers.js` renders cells from one unchanged generated transparent sprite atlas. CSS positioning/perspective integrates the objects with the paintings; hidden objects are not present in the DOM. Reduced-motion preferences disable movement and dust effects. Darkness removes object layers entirely.

`audio.js` uses Web Audio noise buffers and oscillators for a deliberately restrained prototype soundscape. It is off until explicitly enabled, suspends in hidden tabs, and never controls game timing. No external audio files, AI endpoints or paid services are involved.

## Underground expedition (v0.3)

Three new plates extend the cellar into The Troll Room (127), East of Chasm (247), and East-West Passage (130). They are grounded in the pinned source's descriptions and exits. The gallery, studio, maze and remaining map still use the explicit unillustrated view.

The troll is not baked into a background: `encounters.js` reads object 150's signed STRENGTH property 7 (negative means unconscious) and axe 36's parent. Separate armed, disarmed and unconscious atlas cells follow those values; absent/hidden trolls and darkness have no sprite. A dropped axe is rendered separately. The original combat, randomness, timing and narrator remain unchanged. This is state illustration, not animated combat or a complete injury model.

Acoustic profiles distinguish cellar, stone chamber, narrow passage and chasm, including restrained stereo reflections. Darkness does not change the geography of the sound. Ambient events imply neither hidden actors nor puzzle solutions. Transitions are presentation-only, respect reduced motion, and never delay commands. Darkness removes the image source and all scene objects immediately. Save format and VM bytes are unchanged.

Regression checks cover the chasm route, signed knockout state, defeated-troll removal, dropped axe, passage access, save continuation, and browser concealment. Deterministic seeds are used only in tests, not in the shipped game.

## Gallery and discovery milestone (v0.4)

The gallery/studio branch has separate painting/manual sprites. Release 119 painting property 12 (TVALUE) distinguishes intact versus ruined canvas; destroyed/removed objects are not rendered. Taken then dropped props appear on the floor instead of remounting on the wall. Read/examine actions open an accessible text-and-art dialog using the actual parser response, including its implicit take behaviour. The chimney's original inventory restrictions are unchanged.

The first passage atlas covers Round Room, North-South Passage, Chasm and Engravings Cave. Its 2×2 cells are clipped with CSS; world logic is unchanged. Discovery notes store only observed lit distinct rooms and successful explicit direction changes, never the source exit table or inferred reverse edges. Ambiguous names (maze, forest, coal mine, mirrored/duplicate rooms) are intentionally not individually mapped. Old saves without notes remain supported; only the loaded current room can be recovered into a fresh map, not its unknown past route.

Source building is now reproducible in isolation; see SOURCE-BUILD.md. The public executable is unchanged.

### Whole-world illustration pass

The region registry now maps all 110 original room objects to generated plates. Shared maze, forest, repeated cave and river artwork intentionally preserves ambiguity. `world-state.js` is a read-only release-119 adapter: reservoir LANDBIT, mirror breakage, Cyclops passage, rope attachment and rainbow flags select supported variants. Four transparent atlases add treasures, equipment, damaged objects and encounters. Generic visible-object controls are still filtered by the engine, including hidden ancestors and closed containers. No original puzzle state is written.

Coverage is not an exhaustive cinematic remake: container opening/contents may retain an iconic rather than literal illustration; excavation and every destructive response are not individually animated. The original narration and controls remain authoritative. The old opening atlas remains separate from `world-objects-atlas.png` to preserve its seven established sprite coordinates.

## Comfort and delivery milestone (v0.5)

See COMFORT.md for bounded Undo, stock-distribution random replay, compatible save envelopes and WebP delivery. This is an interpreter/presentation checkpoint facility, not a new story opcode. Original object/puzzle state remains VM-owned. ROADMAP.md records the accepted region-first production goal.
