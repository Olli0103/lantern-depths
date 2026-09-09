# Reproducible source build and save compatibility

`npm run build:source` downloads **ZILF 1.9** from its official release, checks pinned archive hashes and compiles the pinned ZIL in two isolated directories without source edits. Release 0 and serial 000000 remove date dependence. Both outputs must match. The same output was also verified on the GitHub Linux runner.

Source binary SHA-256: **e21b4e04a078349e9bbcc8d6a324c5d01ffc3f16db1e8c9c0f32294c01794b58**.

## Shipped engines

- `public/story-source.z3`: source-built default for new games.
- `public/story.z3`: archived release 119, serial 880429, SHA-256 **37084966477dff679282de42974b2077156b1bd68fad92a65d4ea94d8eb64d79**, retained for existing saves.
- Browser startup verifies full SHA-256 before accepting either story. Unsupported story files are not accepted through save import.

## Symbol adapter

`docs/story-symbols.json` binds established UI object handles to ZIL source symbols. `scripts/story-adapter.mjs` parses compiler `.OBJECT`, `.GVAR` and flag/property constants and emits `src/story-adapters.json`. Runtime uses that registry, not display-name matching. Repeated Maze/Forest names were resolved with paired parser traversal and structural checks; names alone are not identifiers.

All 250 objects form a bijection. The adapter normalises room, parent/child chains, inventory, flags, properties and globals. Unknown source flags/properties/globals fail closed. ZVM internals retain their raw object IDs; no original puzzle memory is rewritten.

The ending presentation checks build-bound FINISH read/quit PCs **and the return address of its Stone Barrow caller**. The program counter alone could also represent a death menu. These addresses are tied to exact binary hashes, tested on both builds, and preserved by normal saves/Undo. Narration is never scraped for completion.

`npm run verify:source` compares the regenerated adapter with the committed registry, checks public source bytes against the fresh build, and compares the opening/chimney route. Node tests additionally compare the entire 350-point route turn by turn (state, flags, inventory, visibility, placements) and 1,296 parser movements covering 108 reachable room identities. Two source room objects are not normal reachable locations. No exit table is read by the presentation or discovery system.

## Saves

Each save records the exact story hash, adapter identity, Quetzal state, pending input, random state, journal and discovery data. Load/import chooses a verified matching engine **before** restoring. Legacy envelopes without hashes use the archived engine's matching VM signature. Incompatible Quetzal data is never converted or relabelled. Existing saves continue with retail; New game returns to source. A failed import leaves the active game untouched.

This is validated compatibility, not a claim that two binaries are byte-identical or that every possible random branch has been exhaustively compared.

ZILF is GPLv3 compiler tooling with separately described runtime terms. It is not bundled in the browser. Its notices remain in the verified tool archive. These self-contained historical sources import no compiler runtime library explicitly.
