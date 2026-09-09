# Expedition staging — v0.7

Read-only release-119 presentation increment for Temple, River, Mine and endgame. Existing room art retained. `src/expedition.js` owns captions, hotspots and staging; it never reads the exit table or alters the VM.

## Delivered

- Scene captions and geographic chapter labels across the four connected groups. Indistinguishable river/mine rooms intentionally share wording; this does not create maze landmarks.
- Temple: direct prayer/altar/railing/pedestal targets; book on the altar, torch on the pedestal, coffin in the burial chamber. Lit candles use a separately generated, verified-alpha sprite; extinguishing restores the existing unlit sprite, including inventory and detail views.
- River: authored sand and beach prop positions, boat states continue using VM-owned replacement objects; buoy contents do not become scene objects when carried. Physical tool relations are player-composed parser commands, never proposed puzzle answers.
- Mine: reachable and remote basket representations are distinct. Visible contents stay with the actual local basket; the remote basket does not reveal its contents. Machine switch is directly selectable; machine contents remain hidden when closed. Coal, timber, bracelet and figurine have authored resting positions.
- Endgame: captions, staged chamber floors and existing VM-driven Cyclops/thief artwork retained. No guessed final state based on prose; the original final narrative remains authoritative.
- Ambient profiles distinguish temple, mine, river and falls. No additional provider credits or music tracks.

## Validation

Parser-driven full 350-point route with per-turn visibility, container placement and hidden treasure checks; basket restore and new action command checks. Browser coverage includes lit/unlit candles, mid-route save/load, direct basket controls with Undo, switch keyboard focus, mobile selection, and existing full-game/house/dam suites.

## Completion pass

Open/closed coffin and egg sprites, open buoy, open black book, ivory torch and silver chalice are now present. Exact alpha and source rectangles are verified; the book crop excludes the neighbouring buoy. Shaft/Drafty hero scenes replace timber with iron and show the chain raised/lowered with the actual basket. Sand excavation follows BEACH-DIG, including restoration and collapse reset; hidden scarab remains absent. The altar, Loud Room and Strange Passage have source-faithful hero plates. The strange door now has its permanent Cyclops-sized hole.

The finale uses the VM's build-bound FINISH call from Stone Barrow and its preserved caller, not narration matching or a fabricated room transition. Its bright cavern and floating sign are illustrated; the original sign text stays in the journal. Undo restores the exterior presentation correctly. The source adapter and old-save compatibility are complete; see SOURCE-BUILD.md.

Wordplay, exceptional narration and individual injury descriptions remain text/parser-led by design. This is a complete illustrated adaptation baseline, not animation of every sentence or a mouse-only rewrite.
