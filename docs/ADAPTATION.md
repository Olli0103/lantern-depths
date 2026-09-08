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
- Use named controls for movable objects until actual state-correct artwork exists. Do not bake a sword or lantern permanently into an environment plate.
- Backgrounds are currently static plates; open/closed environmental variants are explicitly incomplete.
- Keep original writing and humour. Do not ask a model to improvise puzzle truth at runtime.

## Validation milestone

Test route (spoilers): open mailbox; take leaflet; north; east; open window; west; west; take lamp; turn on lamp; move rug; open trap door; down. Expected room Cellar, score 35. Save/load must preserve pending parser state and inventory along this route.

The whole original world remains accessible by parser. That is not evidence that every puzzle or VM opcode is fully supported by the current presentation adapter. Keep an honest full-game validation backlog.
