# Reproducible source build

`npm run build:source` downloads **ZILF 1.9** from its official GitHub release, verifies a pinned SHA-256, copies the pinned ZIL source to two isolated output directories and builds both without source edits. Release 0 and serial 000000 are explicit assembler options, removing date dependence. Matching results are required. Compiler warnings remain visible.

Verified on macOS arm64: **e21b4e04a078349e9bbcc8d6a324c5d01ffc3f16db1e8c9c0f32294c01794b58**. See `source-build-proof.json`. Linux x64/arm64 archive hashes are pinned too; cross-host reproducibility needs a separate run.

`npm run verify:source` checks the opening/gallery/studio/chimney route against retail by room name, score, moves and narration-line content. Room listing order differs because the compiler assigns different object numbers. It also verifies a rebuilt-story save resumes correctly. This is a route comparison, not proof of complete behavioural equivalence.

**Public gameplay still uses archived release 119.** Rebuilt object IDs, player ID, attributes and properties must be mapped separately before a graphical source-built option can ship. Rebuilt and retail Quetzal saves are not interchangeable. The scripts never overwrite `public/story.z3` or the upstream submodule.

ZILF is GPLv3 compiler tooling with separately described runtime terms. It is not bundled into the browser application. Its notices remain in the verified local tool archive. No compiler runtime library is explicitly imported by these self-contained historical sources.
