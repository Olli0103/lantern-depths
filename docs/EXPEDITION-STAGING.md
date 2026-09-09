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

## Still not finished

This is not a claim of full cinematic art completion. The existing atlas plates remain lower resolution than hero paintings. The altar book is still depicted closed although the prose describes an open book. The existing torch material and mine beam material need art correction; the basket's chain is not yet illustrated. Excavation depth and open/closed coffin/egg variants need bespoke images. Generic fire/light prose and combat exceptions remain parser-led. Endgame conclusion uses the journal instead of inventing a VM room change. Source-built adapter migration remains separately gated; this increment does not change story bytes or old-save compatibility.
