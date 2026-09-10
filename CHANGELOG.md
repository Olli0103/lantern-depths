# Changelog

## Unreleased — Desktop fit and recoverable Load

- Desktop and tablet paintings now scale to the window height (3:2 kept, nothing cropped) so the scene footer, Look control, the journal and the newest response are visible above the parser dock on 768–1080px-tall windows. Previously the opening prose and the first response were below the fold at 1280×720, 1440×900, 1600×900 and 1920×1080. The rail keeps to roughly 30% of the painting width; 720px-tall windows keep a 380px painting and scroll.
- Quick Load and named-slot Load push the replaced session onto the Undo history instead of clearing it. A misclick on Load (which sits beside Save) is reversed with Undo; Undo then continues through the restored session as before. File import still starts a fresh session with no Undo history.
- Added `tests/browser/recovery.spec.js` (layout at 1366×768, 1440×900, 1600×900, 1920×1080, 1280×720; reversible quick and slot Load) to the Chromium and WebKit suites. Help text updated.

## 0.2.0 — The living white house

- Added generated object art for the lantern, leaflet, sword, sack, bottle, rug and two trapdoor states.
- Added mailbox/window state paintings. Objects disappear when taken; known dropped items appear on the floor. Moving the rug reveals the hidden trapdoor without exposing it beforehand.
- Added contextual physical verbs and two-step inventory targeting using the existing parser grammar, with Escape to cancel.
- Added opt-in low-volume procedural sound, a volume control, journal text sizing and reduced-motion controls. Failed commands do not trigger successful-action sounds.
- Kept the original interpreter, story executable, puzzle logic and v0.1 save format unchanged.
- Added route-level tests for visual discovery, taking/dropping/restoring props, closed-container concealment, targeting without consuming turns, sound controls and state variants.

Remaining: complete world art, further object-state variants, full-game validation and reproducible ZIL compilation. This is not a finished remake.

## 0.1.0 — First playable prototype

- Pinned the MIT-released upstream source and ran its archived executable through ifvms.
- Added six environment paintings, compass, object controls, parser, inventory and browser-local saves.
- Published the public GitHub repository and GitHub Pages demo.
