# Connected-region staging — v0.6

This increment improves the house/cellar/troll/chasm/gallery/studio route; it is not the completed regional art milestone.

- Room-specific floor anchors replace the generic bottom row in eleven opening-region rooms. Untouched objects stay on their authored surfaces: kitchen table, mantel, above the cabinet, gallery wall; the studio manual belongs on the floor.
- Supported objects in the transparent trophy case stay on shelves. Local sack contents stay next to the sack. Items inside carried containers do not appear in Nearby or on the room floor. Select the container to access visible contents.
- Selecting a scene object opens the existing action controls beside it, without duplicated commands or invented verbs. Native manual Popover keeps controls above the scene. Escape restores focus; touch layouts keep the popup above the parser. Unsupported browsers retain sidebar actions.
- The trophy case gets a distinct open-door painting controlled only by OPENBIT. Original artwork and story bytes are unchanged.

## Art direction contract

Keep the established painterly lighting, earthy wood/stone, restrained brass and ivory. Preserve camera geometry and layer coordinates when editing a room. Portable props must never be painted into backgrounds. Put objects on plausible surfaces and scale to the local furniture; favour readability over literal physical scale for tiny treasures. Do not reveal concealed contents, exits or creatures. Inspect hover, selection, darkness and actual decoded mobile delivery, not merely DOM presence.

## Known remaining work

Sack opening and all four bottle open/closed × full/empty states now use verified transparent artwork across scene, inventory and detail. Full/closed bottle and closed sack retain the original art. Open sack artwork intentionally has an obscured interior, never guessed contents; visible contents remain separate controls/layers. Previous painted-grid attempts remain rejected. Filling/emptying the sack is not assigned an invented fullness flag or shape. Packed shelves now align to the four actual shelf heights and were visually reviewed after the full 350-point treasure route. Crowded floor/table placements use bounded non-overlapping anchor grids; synthetic 100-object floor, 70-object shelf and 30-object table tests cover placement limits. Dense props retain full-size accessible Nearby controls. This is authored positioning, not a collision/physics system. Seven dam/reservoir rooms also have authored placement; other regions retain prior placement. A visual coordinate editor, additional source-built adapter and the later regions remain separate roadmap tasks.
