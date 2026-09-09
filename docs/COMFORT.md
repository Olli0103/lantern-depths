# v0.5 comfort/delivery contract

## Undo and randomness

Before each submitted command, capture VM Quetzal + pending input, the journal (last 150 entries) and discovery knowledge. A 20-entry / 8 MB ring evicts oldest checkpoints. Undo restores into a newly validated engine before changing the active session; it also closes stale detail/map dialogs, clears object targeting and restores knowledge, rather than retaining newly discovered routes. Undo itself is not a game command. Load/New game reset the ring. The ring is not persisted in localStorage.

The ifvms seeded Xorshift path remains unchanged. Its normal unseeded path originally samples `Math.random` for each positive-range call. The adapter retains those same uniform samples in a bounded 8,192-draw tape and uses the exact original range conversion. It does not install a fixed gameplay seed, patch story instructions or change combat probabilities. Undo reuses an already generated compatible future tape, so retrying the same command does not reroll the fight. A different command still follows the stock engine with the next retained random samples. Beyond the retained window old future samples cannot be recovered. Old saves without a tape remain readable, with fresh future randomness.

New-game startup is still genuinely random. This is checkpoint replay, not universal deterministic emulation. Tests cover seedless battle replay, seeded death recovery and restoring both the terminal Quit prompt and the pre-ending state in the complete playthrough.

## Saves

`lantern-depths.save.v1` remains the independent quick slot. Three named slots use separate keys. Version-2 envelopes contain the actual loaded story's SHA-256 and its matching adapter identifier. Legacy envelopes without a format/version remain supported via the original interpreter signature. A verified engine catalog selects retail for old saves and source for new saves; incompatible bytes are never migrated or relabelled.

Imports are limited to 2 MB and validate envelope/build identity, bounded byte/input arrays, journal entries, discovery notes and entropy data before replacing the session. Import uses textContent for content, never HTML; no external upload occurs. Failure preserves the active game and existing slots. Replacing a named slot or importing a valid file asks for confirmation in the game. File export includes the current game, not the Undo stack. Exported journal contains only the retained on-screen history (up to 150 entries), not a promised unlimited log.

## Artwork delivery

`sharp@0.35.4` is a build-only maintained library. `npm ci`/`npm run prepare` creates cached derivatives; no runtime image service. Input hashes + recipe identify the cache. Source PNGs and their provenance hashes are unchanged.

Opaque paintings: WebP quality 82, full source width plus 768 pixels when applicable. Transparent atlases: lossless WebP at original dimensions, preserving alpha and existing source rectangles. A native `<picture>` source chooses environment size; the original `#painting` element, its ID, clipping and PNG fallback remain. Atlas sizing accounts for 2× scene width. Current scene is eager/high-priority; unseen regions are not preloaded, avoiding unnecessary downloads and accidental discovery hints.

Full-resolution derivatives measured locally: 19.3 MB versus 115.6 MB PNG. This is aggregate file size, not page-load bytes or deployment archive savings. PNGs remain deployed for fallback/provenance. The mobile browser test checks actual selected source, successful decode and a <400 KB West-of-House transfer. No blanket <400 KB claim for large transparent atlases or every room.

## Verification

Run `npm test`, `npm run test:browser`, `npm run build`. Browser coverage includes Undo concealment and discovery rollback, unfinished command draft, separate slots, export/import, rejected malformed file, legacy quick saves, actual mobile WebP selection, existing house/troll/darkness/audio interactions and the complete 350-point route with save/reload and two Undo steps after completion. Desktop/mobile scene and saved-adventure dialogs plus selected troll sprites were visually reviewed.
