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

## v0.4 Gallery, studio and passage network — 2026-09-09

Built-in image-generation tool; final PNGs copied unchanged into public/art. Sprite cells use authored CSS rectangles; environmental atlas cells are 2×2.

### gallery.png

Use case: illustration-story. Production background for Lantern Depths, a first-person illustrated classic fantasy adventure, 3:2 landscape. An underground art gallery in the same richly textured painterly style as warm stone cellars and cold teal recesses. Most paintings have been stolen: walls show pale rectangular patches and vacant mounting hooks. North exit at rear, west exit at left. Empty far-wall space at center right reserved for a separately composited painting. Warm neutral diffuse illumination; this gallery is inherently lit in the game, so do not depict a lantern or lamp-dependent blackness. Restrained dust and worn stone floor, dry humour in the sheer emptiness, no text. No loose props, no existing pictures or frames, no treasure, people or creatures. One full scene, no UI, no collage.

### studio.png

Use case: illustration-story. A single 3:2 landscape production environment painting for Lantern Depths. First person in an abandoned underground artist's studio: old stone walls and floor splattered with a riot of dried paint colours, the south exit at left is an open door also covered with paint, and on right a soot-black fireplace with a narrow vertical chimney disappearing into darkness. Warm unseen lantern illumination across foreground, cool shadow, richly textured painterly storybook style matching the underground gallery. Leave a clear patch of wall near center for a separately composited small paper. No paper painted into background, no canvas, easel, palette, brush, treasure, chairs or other collectible props. No text, no figures, no UI. Intimate and eccentric rather than grand, no windows or sunlight.

### gallery-props.png

Use case: stylized-concept. One transparent 2x2 game prop sprite atlas, square image, exactly four equally sized square cells, each subject centered with generous 18 percent clear padding, no overlap. Top left: a beautiful small horizontal oil landscape painting in a modest antique gold frame, dreamlike mountains and a river, no text. Top right: exactly the same painting and frame badly slashed across the canvas, worthless torn cloth, no intact masterpiece behind tear. Bottom left: a single slightly aged rectangular sheet of paper with faint unreadable ink lines, no legible words, no frame. Bottom right: a small closed worn brown leather book with no title. Rich painterly realistic material texture matching a classic fantasy storybook, soft warm light, front-facing inventory props, genuine alpha-transparent background, no checkerboard or cast background, no UI. This is a production asset sheet, not a composition of a room.

### passage-atlas.png

Use case: illustration-story. A production environment atlas for a first-person fantasy adventure. EXACT 2x2 grid of four complete landscape paintings, equal cells, edge-to-edge, NO borders gutters or labels; entire image 3:2 landscape, each cell also 3:2. Richly textured painterly stone, warm unseen lantern from foreground, subdued teal-black recesses; same art direction throughout. TOP LEFT: circular underground stone room with passages radiating around the walls, several blocked with fallen rock, no objects. TOP RIGHT: a high narrow north-south stone passage with a northeast fork opening at right rear, no stairs. BOTTOM LEFT: path along the south side of a bottomless chasm running southwest-northeast, narrow crack passage in foreground south wall, no bridge, railing or visible bottom. BOTTOM RIGHT: low empty cave with northwest passage behind viewer and east passage right, subtle ancient worn engravings on one wall with NO legible text. No characters, treasures, loose props, visible lanterns or UI. Distinct composition in each cell; no elements cross grid boundaries.

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

## Whole-world atlases — 2026-09-09

Exact regional prompts and cell assignments are in `docs/generated/*.json`; the complete room plan is in `docs/region-plan.json`. Four 4×4 transparent prop sheets use `docs/prop-plan.json` in left-to-right, top-to-bottom order. Shared wrapper: “Production sprite atlas for Lantern Depths. TRUE TRANSPARENT alpha background, not checkerboard. EXACT 4 columns by 4 rows, square image, sixteen isolated painterly fantasy-adventure object cutouts. Equal square cells, one centered object per cell, generous transparent padding, nothing crosses cell boundaries. No labels, letters, grid lines, scenery or drop shadow blocks. Warm neutral light, tactile materials, realistic proportions, crisp silhouettes matching a mature painted 1990s adventure.” Each cell's description follows in numbered order. Final instruction: “Each entire object must fit within its own equal cell. No substitutions, duplicates or extra objects. Keep all cells transparent around objects.”

Review corrections used the existing atlas as reference, preserving its exact 2×2 layout and unspecified details:

- Canyon: remove the bottom-right lantern and reconstruct bare stone, keeping unseen carried-lamp illumination.
- Passages two: remove top-left wall lantern and any visible lamps.
- Caves: replace exterior skies/mountains through openings with receding underground passages; retain the small crack and damp floor.
- Mines: remove bottom-left lantern and daylight skies; replace with dark mine ceilings/passages.
- Mirror: remove sconces/flames and their reflections from both mirror states; retain unseen carried-lamp illumination.
- Late: replace bottom-left exterior vista with an interior passage toward an old house.

All edits were generated, not painted or cut with a processing script. Source PNGs remain intact; browser CSS crops atlas cells.

## behind-house-ajar-v2.png

2026-09-09, built-in image-generation tool. Edit target: `public/art/behind-house.png`. Original retained; output copied unchanged. Corrects a misleading large opening in the VM-closed state.

Prompt: Change ONLY the central kitchen window to a virtually closed full rectangular weathered wooden glazed sash filling the entire opening, dark reflective panes and only a hairline gap at the bottom. Eliminate the large open hole. Preserve exterior wall, frame location/size, boarded windows, foliage, path, lighting, painterly texture, viewpoint, aspect ratio and composition. No UI, text or people. Must unmistakably look shut at thumbnail scale.

The original open variant remains authoritative when window object 243 has OPENBIT. Presentation badge now says “Window · not open”; original narration and engine rules are unchanged.

## living-room-case-open-v1.png

2026-09-09, built-in image generation; edit reference `public/art/living-room.png`. Output copied unchanged; original retained. Edit brief: open only the upper glazed double doors of the trophy cabinet; preserve the empty shelves, cabinet geometry, all other room furniture, camera, lighting and painterly texture. Do not add treasures, labels or UI. Original OPENBIT selects the variant. Reviewed decoded in the browser with the lamp, sword and rug layers.

Two container-atlas generations were rejected for missing real alpha and are not shipped. No checkerboard-background extraction or manual raster cleanup was used.

## container-states-v1.png

Built-in image generation, 2026-09-09. Reference: `public/art/objects-atlas.png` for sack/bottle identity and lighting. Generated RGBA copied unchanged; 1254×1254, 2×2 cells. Alpha inspection found 1,049,301 fully transparent pixels out of 1,572,516; no painted checkerboard. Lossless-alpha WebP is derived by the existing build pipeline.

Final prompt:

> Use case: stylized-concept. Create a production game sprite sheet for Lantern Depths. Reference image provides ONLY style and identity for its brown sack and clear glass bottle. New square sheet, exact 2 columns x 2 rows of equal square cells. Top left: that brown cloth sack with drawstring untied, mouth visibly open, dark interior, no visible contents. Top right: same clear glass bottle with water half full and NO cork, visibly open neck. Bottom left: same bottle completely empty with cork firmly in neck. Bottom right: same bottle completely empty, NO cork. Each isolated object centered in its cell with 12 percent transparent padding, same warm painterly light from upper left, matching existing rustic adventure art. Actual transparent RGBA background everywhere outside silhouettes, not a painted grid, no checkerboard, no solid backdrop, no text, no labels, no scenery, no loose cork props. Bottle silhouette remains legible against dark green game backgrounds. Preserve consistent scale of all three bottles.

Closed sack and full/closed bottle retain the original atlas. Open sack does not display guessed contents; the existing visible-content controls remain authoritative. Empty/full uses WATER's parent, open/closed uses OPENBIT. Reused detail/scene nodes reset only art-owned CSS when changing assets.

## candles-lit-v1.png

Built-in image-generation tool; equipment-atlas.png used as the candle identity/style reference. Output: `public/art/candles-lit-v1.png`. Real alpha verified before integration.

Prompt: Use case: precise-object-edit. Asset type: Lantern Depths game sprite. Reference image: equipment atlas, use ONLY the two ivory pillar candles in its top-right cell as identity/style reference. Produce a new standalone square transparent PNG containing that same pair of uneven ivory wax pillar candles, BOTH LIT with small warm golden flames. Preserve their relative tall-left/short-right arrangement, wax texture and painterly realism. Candles centered with 12% clear padding, full silhouettes visible, no other atlas items. Genuine transparent alpha background, NOT a painted checkerboard, no floor, no box, no text. This image will be layered on an existing temple painting.

## treasure-states-v1.png

Built-in image generation, exec-b70ea5f0-03ef-4644-98fd-776005206b30. Production prompt specification:

> 2x2 transparent sprite atlas: closed/open horizontal gold Egyptian coffin and closed/open jeweled red-and-gold egg; same identity, perspective and lighting; empty dark interiors, no body, sceptre or bird. Reference treasures-atlas, painterly aged materials, genuine alpha, no text/grid.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## faithful-props-v1.png

Built-in image generation, exec-9914fdd3-fa2e-4ee8-a055-a6ecde2970e2. Production prompt specification:

> 2x2 transparent sprite atlas: burning ivory-handled torch, black leather book always open with indistinct printing, silver chalice and open empty red buoy. Painterly adventure, muted upper-left light, real alpha, no backdrop or text.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## shaft-hero-v1.png

Built-in image generation, exec-bc902acb-8eb6-4a9d-9a4f-1840ede49493. Production prompt specification:

> Hero Shaft Room, reference mine-chambers bottom-left style. Replace timber supports with iron framework. Small person-inaccessible shaft in wide stone floor x55 y78. Heavy chain from overhead frame into shaft. No basket, daylight, items or lit fixtures. Warm off-camera lantern light.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## drafty-lowered-v1.png

Built-in image generation, exec-505b25e2-c62a-4d42-b8ed-155f3d5ab3ed. Production prompt specification:

> Hero Drafty Room, reference mine-chambers top-right style. Enclosed cave, right passage and low left opening. Narrow ceiling shaft x54, iron chain to floor y74. No basket, sky, daylight or props. Soft warm lantern light.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## drafty-raised-v1.png

Built-in image generation, exec-55fbdfe8-f026-4623-8e43-2e93ca2eaffb. Production prompt specification:

> Precise edit of drafty-lowered-v1: chain raised into shaft; remove below ceiling, retaining short chain only inside top opening to y16. Preserve all other geometry and lighting. No basket.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## excavation-states-v1.png

Built-in image generation, exec-d9bfac37-2555-4e92-92a7-14305a19882a. Production prompt specification:

> Four-state 2x2 Sandy Cave environment atlas, reference river-atlas bottom-right. Identical camera/rock/entrance left. Untouched sandy floor; shallow hollow; deeper pit; deep pit with sand walls and empty bottom. No shovel, scarab, characters or labels.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## strange-passage-v2.png

Built-in image generation, exec-6e4951ac-5311-4d84-9cd5-1a2cd12b7f3a. Production prompt specification:

> Hero Strange Passage, reference late-atlas bottom-left. Long stone passage ending at wooden door with huge jagged cyclops-sized hole smashed through middle; splintered sides/top and dim room beyond. No intact door, monster, treasure or labels.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## loud-room-v1.png

Built-in image generation, exec-3bc56992-55fe-4d36-93df-f468566974fc. Production prompt specification:

> Hero Loud Room: vast natural stone chamber, dry floor, ceiling lost in darkness, narrow east-west passage and stone stairs upward. No visible water, machinery, bridge, rails or lit fixtures. Source of rushing sound stays unseen. Clear floor for separate treasure.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## barrow-ending-v1.png

Built-in image generation, exec-d7c5a060-68c9-4f52-b2ed-51dd4d44dbc5. Production prompt specification:

> Final bright cavern: wide stream, small wooden footbridge, path into dark tunnel, blank floating sign above bridge. No characters or treasure; source text stays in journal. Correction removed all sign poles/brackets while preserving low bridge handrails.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## altar-hero-v1.png

Built-in image generation, exec-9c9c05d3-a61f-4401-9997-2137bcd7130b. Production prompt specification:

> Hero Altar, reference temple-atlas top-right. Bare centered stone altar, columns, decorative stone recess not door, small dark hole at right floor corner. No book/candles/items baked in. Warm ivory light, aged marble and painterly texture.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.

## lantern-lit-v1.png

Built-in image generation, exec-c0e84cfb-85e2-40fb-8a10-e93d316519f9. Production prompt specification:

> Single brass lantern matching objects-atlas top-left, turned on with warm ivory glow inside glass. Complete centered silhouette, transparent alpha with restrained halo, no other objects.

Alpha verified for sprite atlases; scene geometry and state selection reviewed separately.
