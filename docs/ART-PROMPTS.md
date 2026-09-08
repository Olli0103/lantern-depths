# Production art prompts

Generated 2026-09-08 with the built-in image-generation tool (not Google Imagen). All six outputs were retained, visually inspected, and copied into `public/art`. No source artwork from the commercial game was supplied. The images are initial static environment plates; clickable names currently represent most mutable items. Hashes are recorded in `art-manifest.json`.

## west-house.png

Use case: illustration-story. Asset type: production background for a first-person point-and-click adventure, landscape 1536x1024. Create an exquisite hand-painted storybook environment: west/front view of a small isolated white wooden house in a forest clearing, its front door firmly boarded with rough timber, all visible windows boarded. A small closed wooden mailbox on a post stands prominently in the left foreground at about x=23%, y=67%; house front door around x=62%,y=53%. Path curves along both sides of the house. Late-afternoon amber sunlight, deep moss green woods, warm ivory clapboard, muted teal shadows, painterly brushwork and refined atmospheric depth. Charming but quietly mysterious, classic 1990s illustrated adventure spirit with modern detailed painting. Eye-level first-person view, clear playable composition, house occupies middle-right, forest frames scene. No characters, no lettering, no logo, no UI, no watermarks. Mailbox must be closed, no visible leaflet, no unboarded windows. This is an original illustration, not a screenshot recreation.

## north-house.png

Use case illustration-story. Production background for first-person point-and-click adventure, landscape 1536x1024. Original hand-painted storybook scene: north side of an isolated small white clapboard house in forest clearing. No door on this side, all windows securely boarded. House occupies right two-thirds; a narrow woodland path leading north disappears into trees on left. Clear paths run around house to left and right. Amber late afternoon sunshine, moss-green foliage, warm ivory wood, muted teal shadows, elegant detailed painterly brushwork, atmospheric, gently mysterious. Eye-level view, classic illustrated fantasy adventure sensibility. No mailbox on this side, no people, no text, no logo, no UI. Consistent world: a simple two-storey white house with grey-blue roof and chimney, overgrown clearing.

## behind-house.png

Use case illustration-story. Production scene background, first-person illustrated adventure, landscape 1536x1024. Behind a small white clapboard house in a forest clearing. Close view of rear wall occupying left two-thirds, slate roof edge above, ivy and ferns below. At x=44%, y=48% a small low rectangular kitchen window slightly ajar in its deep wooden frame, dark inside; the sill low enough to climb through. All other windows boarded. Forest path recedes to the right, paths curve around the house. Warm amber afternoon, moss greens, muted teal shadows, carefully hand-painted detailed storybook fantasy, no photographic lens effects. No people, mailbox, UI, text or logos. Original illustration.

## kitchen.png

Use case illustration-story. Production game background, first-person view of the kitchen of an old white wooden house, wide landscape 1536x1024. Beautiful detailed hand-painted storybook fantasy, warm late-afternoon amber rays through a small open window in right wall, muted teal shadows, moss and ivory palette. A large bare wooden preparation table in middle foreground, bare shelves, rough plaster, an open passage on the left leading west into living room, narrow dark wooden staircase upward at back left, dark chimney hearth. Quiet abandoned domestic mystery. IMPORTANT empty table with no bottle, bag, food or movable inventory objects; these will be separate interactive layers. No people, no writing, no logos, no UI. Original illustration, not an existing game screenshot. Eye-level playable composition, intricate textures and brushwork.

## living-room.png

Use case illustration-story. Production background for first-person point-and-click adventure, 1536x1024 landscape. An old house living room in a detailed hand-painted fantasy storybook style: aged plaster, exposed timber beams, cool muted teal shadows and soft amber daylight. Empty glass-front wooden trophy case against rear wall at x=62%, an ordinary open doorway on right into kitchen, an old firmly nailed-shut wooden door on left. Broad bare floorboards across central foreground, NO carpet, NO rug, NO trapdoor, NO lantern, NO sword, NO treasure: movable objects and hidden passage will be separate interactive layers. Architectural painting only. Dust motes, gentle atmosphere, quiet mystery, intricate brushwork, coherent perspective, not photorealistic. No writing, text, characters, logos or UI. Original environment.

## cellar.png

Use case illustration-story. First-person adventure game environment painting, landscape 1536x1024. A dark damp stone cellar beneath an old wooden house. Rough stone walls and low ceiling with massive weathered timber beams, uneven packed-earth floor. Narrow black passageway straight ahead leading north, small cramped crawlway near floor on right leading south, bottom of an impossibly steep smooth metal ramp on left. Rickety stairway rises out of frame behind/right, no visible open hatch. Scene lit ONLY by a warm portable lantern from the unseen viewer position; no visible lantern object, no candles or permanent lights. Amber pool of light foreground, deep cold teal shadows, mysterious depth, hand-painted storybook fantasy with intricate restrained brushwork. No people, monsters, movable items, writing, UI, logos or watermarks. Original illustration.

# Living-house update: additional production prompts

All four additions used the built-in image-generation tool. Edits used the indicated local original as a reference/target, with no raster post-processing. The atlas contains real alpha transparency (verified in-browser). Generated dimensions and hashes are in `art-manifest.json`; the tool did not always produce the exact requested dimensions.

## objects-atlas.png (new)

Production sprite atlas for a painterly first-person fantasy adventure. One PNG with GENUINELY TRANSPARENT background and alpha, 2048x1024 landscape, exact 4 columns by 2 rows equal cells, no lines or labels. Each object completely contained in its own 512x512 cell with generous transparent margin. Orthographic isolated cutouts, warm amber light from upper left, muted rich colours, beautiful hand-painted textures, not pixel art. Top row left to right: (1) antique brass BATTERY lantern, unlit, compact upright with carrying handle, no flame; (2) small folded ivory leaflet, no readable lettering; (3) elegant slender elvish sword vertical point down; (4) closed brown cloth food sack. Bottom row left to right: (5) clear glass water bottle upright with cork; (6) large rectangular burgundy oriental rug lying flat, viewed from above at shallow perspective, trapezoid wider in foreground; (7) closed rectangular wooden floor trapdoor with iron ring, same floor perspective as rug; (8) OPEN floor trapdoor, black opening with wooden frame and raised wooden cover, staircase fading into dark, same perspective. No surrounding room or floor outside objects. No shadows outside individual cells, no backgrounds, no checkerboard baked into image, no text, no UI. Preserve exact ordered 4x2 grid.

## west-house-open.png (edit target: west-house.png)

Edit this exact production adventure background. Change ONLY the small wooden mailbox in the left foreground: open its curved front door so it hangs downward on its lower hinge, revealing a dark EMPTY interior. No leaflet or contents. Keep the mailbox body and post exactly fixed. Preserve every other pixel as closely as possible: camera, house, trees, ground, lighting, colour, geometry and composition. Same dimensions. No new text, UI or objects. This is the mailbox-open state of the same scene.

## behind-house-open.png (edit target: behind-house.png)

Edit this exact adventure background, change ONLY the small kitchen window at centre-left. Push its hinged glass sash outward and UP until fully open, almost horizontal like a canopy, revealing the full dark rectangular opening large enough to enter. It is currently only partly open. Preserve exact window frame, wall, house, ivy, forest, paths, camera and lighting. Same image dimensions and composition. No new props, people, text or UI. Production fully-open-window state variant, all surroundings identical.

## kitchen-closed.png (edit target: kitchen.png)

Edit this exact production adventure background. Change ONLY the small kitchen window on the right wall: close its wooden-framed glass sash across the opening, retaining warm daylight passing through the glass. The closed frame must visibly block entry, and remain the same size and location. Keep the table completely empty. Preserve all other scene geometry, camera, lighting, colours, wall, staircase, fireplace, doorway and furniture exactly. Same dimensions. No new objects, people, letters or UI. This is the closed-window state variant viewed from inside the kitchen.
