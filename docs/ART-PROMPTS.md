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

## v0.3 underground — 2026-09-09

Built-in image-generation tool; not Google Imagen. Raster outputs copied unchanged into `public/art`; no image-processing fallback. Files and hashes are in `art-manifest.json`.

### troll-room.png

Use case: illustration-story. Create a production background painting for a first-person classic text adventure illustrated as a richly textured painterly fantasy storybook, 3:2 landscape. A small empty underground stone chamber, narrow east passage on right, south passage behind viewer, forbidding low hole on left leading west. Deep axe scratches and a few old rust-brown stains mar rough stone walls. Warm lantern light from below viewer, cold charcoal and muted teal recesses, atmospheric but readable floor. No troll, no axe, no creature, no treasure, no visible lamp, no text or UI. Keep central floor free for separately composited character. Output this single room artwork.

### east-chasm.png

Use case: illustration-story. Single 3:2 landscape production background for a painterly first-person fantasy adventure, richly textured stone, warm lantern light from below the unseen viewer, charcoal and muted teal darkness. The viewer stands on the EAST edge of a vast underground chasm whose bottom cannot be seen. A narrow solid ledge runs from foreground toward a narrow north passage in the upper middle, another route continues east to the right. Black unfathomable void fills left half; rock edge is sharp and dangerous. No bridge, no railings, no bottom, no treasure, no creatures, no lantern in frame, no UI/text. Contained claustrophobic geology, not an epic outdoor landscape. Match a classic illustrated storybook with grounded materials, not cartoon.

### east-west-passage.png (initial generation)

Use case: illustration-story. Single 3:2 landscape background painting for first-person classic fantasy adventure. A narrow ancient underground east-west stone passage, viewed obliquely along its length toward the EAST opening at right rear; WEST entrance behind viewer. In the NORTH wall on the left there is a narrow stone stairway descending into blackness. Rough grey stone, damp joints, warm lantern illumination from below and behind unseen viewer, cold muted teal shadows. Rich painterly storybook texture, grounded materials, eerie restraint. No doors, no treasure, no creatures, no visible lamps, no text, no UI. Open empty walking floor, no invented puzzles or decorative symbols.

### east-west-passage-v2.png (direction correction)

Edit target: this underground corridor painting. Change ONLY the left stairway: it must lead DOWN below the viewer's floor into blackness, not ascend. Show the first step's top surface immediately below the floor edge, successive steps receding DOWNWARDS and vanishing into a pitch black lower shaft. Remove the ascending stairs entirely. Preserve the entire remainder of the painting, perspective, rough stone textures, warm foreground illumination, cool right corridor, aspect ratio. No new objects or text.

### troll-atlas.png

Use case: stylized-concept. Production sprite atlas on genuinely TRANSPARENT alpha background. Exactly 2 columns by 2 rows, four equal square cells, no gutters, no labels. Same squat nasty-looking fantasy troll with leathery moss-grey skin, ragged brown tunic, large crooked nose and small cunning eyes, grounded richly textured painterly storybook style. Top left: complete full body armed standing troll brandishing a worn iron axe, facing viewer. Top right: identical troll disarmed, cowering with empty hands. Bottom left: identical troll unconscious, lying horizontally on its side, eyes shut, without weapon; no blood or gore. Bottom right: the single iron axe alone diagonally. Each subject centered entirely in its own cell with 10 percent transparent padding, no overlap, no floor or background, no drop shadow extending into other cells. Warm light from lower left, subdued cold shadows. A game sprite sheet, NOT a scene or mockup. Actual transparent background, no checkerboard.
