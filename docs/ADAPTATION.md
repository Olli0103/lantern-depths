# Adaptation contract

## Current architecture

`src/main.js` (DOM interface) → `src/engine.js` (Glk presentation adapter and read-only state access) → ifvms ZVM → pinned Zork story.

All interactions are parser commands. The UI never sets game-object attributes, inventory parents, score or puzzle flags. We read the V3 status globals and object tables directly. Known object IDs/attribute bits are release-specific and must be revalidated for any replacement executable.

Each Engine owns an independent copy of the story bytes. Save files contain Quetzal state plus the pending input buffer and story signature; UI history is separate. A restored game is constructed before replacing the current session.

The input is the archived executable bundled with the MIT source repository. A fresh-source compiler pipeline is an outstanding task, not a completed claim.

## Art and puzzle rules

- Never expose invisible objects in hotspots, labels or accessible controls before the engine reveals them.
- Darkness hides the environment and room objects. A lantern elsewhere does not illuminate the current room.
- A closed opaque container must not expose its contents.
- UI selection does not advance game turns. Sending a command delegates turn behaviour to the game.
- Keep movable objects separate from environment plates. The generated sprite atlas supplies the opening objects, including separate trapdoor states. Known dropped objects return to the floor, not their original furniture placement.
- Mailbox and window flags select generated scene variants. Rug discovery controls both its movement and trapdoor visibility. Unrepresented states (including sack opening and bottle contents) remain explicit visual limitations.
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
