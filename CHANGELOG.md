# Changelog

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
