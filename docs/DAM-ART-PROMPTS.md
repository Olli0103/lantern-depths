# Dam-region artwork — built-in image generation

2026-09-09. All final PNGs copied unchanged into `public/art`; existing assets remain intact. Hashes and dimensions: `art-manifest.json`. Browser variants come from the existing WebP pipeline. No Google Imagen/API fallback was used.

## dam-closed-high-v1.png

Reference: top-left cell of `dam-atlas.png` (style reference, not edit target).

> Use case: illustration-story. Generate ONE 1536x1024 landscape hero room painting, not an atlas. For Lantern Depths, use reference top-left dam panel as style inspiration, not exact composition. First-person viewpoint on top of a vast old concrete flood-control dam. Reservoir high behind the dam, sluice gates CLOSED, overflow spilling over crest on left, broad stone walkway receding into distance and branching toward a weathered visitor building. Important interactive prop: large aged metal CONTROL PANEL on a sturdy concrete pedestal in the right foreground, occupying x 70–90%, y 40–80%. Panel face easy to read, with a single large hexagonal steel bolt in its center and a small dark-green plastic indicator dome directly ABOVE the bolt. Indicator unlit. No labels, no lettering, no extra buttons on this panel, no crank handles. Muted painterly old adventure art, mossy stone, tarnished bronze, overcast soft daylight, mysterious abandoned industrial place, no people or portable props. Keep lower left and center stone ground clear for dropped items. Full clean room painting, no UI or borders.

## dam-open-high-v1.png

Edit target: `dam-closed-high-v1.png`.

> Use case: precise-object-edit. This exact dam painting is the edit target. Create variant OPEN SLUICES, RESERVOIR STILL HIGH. Preserve exact camera, all architecture, pedestal and control panel including bolt and unlit green dome, landscape, clouds, lighting, aspect ratio and 1536x1024 geometry. Change ONLY the water/gates in the LEFT part: stop overflow over the crest, expose the face of the dam, show water forcefully issuing from OPEN lower sluice outlets down the face at the lower-left edge. Reservoir behind the dam on the right remains at its original HIGH level. Keep panel pixel-aligned. No added props, people, labels or UI.

## dam-open-low-v1.png

Edit target: `dam-closed-high-v1.png`.

> Use case: precise-object-edit. Edit this exact dam painting into OPEN SLUICES, LOW RESERVOIR state. Preserve exact camera and pixel alignment of all architecture, foreground walkway, pedestal, control panel with its bolt and UNLIT green dome, sky and mountains, 1536x1024. Change only water: reservoir on the RIGHT beyond parapet is drained down far below its original level exposing steep wet rocky banks and broad muddy basin with a narrow stream, no high lake surface remains. LEFT: dam crest no longer overflows; water issues from OPEN lower sluice outlets near lower-left edge into downstream canyon. Match original painterly style. No other changes, no UI, no lettering or people.

## dam-closed-low-v1.png

Edit target: `dam-open-low-v1.png`.

> Use case: precise-object-edit. Edit ONLY the sluice outlets and their flowing water on the far LEFT in this dam painting. Close all three lower sluice gates with metal shutters and remove the outflow jets; damp rock face stays visible with only residual moisture. This is CLOSED SLUICES with reservoir STILL LOW and refilling. Preserve the existing drained right-hand reservoir, narrow stream and exposed muddy banks EXACTLY. Preserve camera, architecture, control panel, bolt and dark green dome coordinates, foreground, lighting and all other pixels as closely as possible. Do not restore a high lake. No UI, text, people or new props. Same 1536x1024 frame.

## dam-maintenance-v1.png

Reference: bottom-left cell of `dam-atlas.png`.

> Use case: illustration-story. ONE 1536x1024 landscape painting, not an atlas. First-person maintenance room for an abandoned old concrete dam, painterly mysterious adventure style matching the bottom-left reference cell. Nearly empty ransacked room, clear stone floor foreground, rusty pipes on right wall. A clearly visible rectangular brass wall panel centered at x52%, y44%, containing exactly FOUR round push buttons in ONE horizontal row: BLUE, YELLOW, BROWN, RED in that order left to right. They are physical colored enamel buttons, evenly spaced, no symbols, no text. Pipe elbow on right x83%, y45% intact with NO leak. Dim soft light but NO self-luminous lamps or lit bulbs painted in: gameplay controls electric light separately, player may carry lantern. Side doorway left, doorway behind player not visible. No loose tools, no chests or containers, no furniture on central floor, no portable items: those are separate state layers. Detailed patinated metal, old stone, subdued warm highlights, mossy green-black shadows. Full room image no UI no border no labels.

The actual generated panel is at 54.2%,33.7%; the authored marker follows the decoded asset, not the requested coordinates. A grouped detail selection preserves 44px touch actions for each real button without overlapping markers.

## reservoir-dry-v1.png

Edit target: `reservoir-atlas.png`.

> Use case: precise-object-edit. Edit this 2x2 reservoir atlas into drained-water variants. Preserve exact camera viewpoint and cave/shore architecture independently in every cell. Top left: same SOUTH shore camera, water drained to wide muddy lakebed with narrow stream down center, keep foreground left rocks. Top right: same NORTH shore camera and foreground right rocks, water drained to wide muddy lakebed with narrow stream. Bottom left: same central lake view, now standing on muddy bed with shallow central stream, caves unchanged. Bottom right preserve the existing dry lakebed picture. Do NOT reuse one perspective across cells. Do NOT put any treasures, chests, pump, objects, creature, bridge, boats or text into images. Exposed wet mud, puddles and a narrow stream not a bone-dry desert. Match original warm rock/cool shadow painterly style. Equal 2x2 grid exactly aligned, no borders, original 1536x1024 or higher same 3:2 aspect ratio.

## dam-tool-chests-v1.png

No reference; generated transparent prop. Actual alpha verified: 825,406 fully transparent pixels / 1,572,516.

> Use case: stylized-concept. Production sprite for Lantern Depths painterly adventure. ONE compact group of three very old rusted metal tool chests, open lids showing empty interiors, corroded dark iron and tarnished edges, small stacked arrangement viewed from slightly above at three-quarter angle. No tools or treasures inside or around chests. Soft upper-left warm light, subtle cool shadows, matte finish, rusty reddish-brown patina, understated realistic painterly brushwork, not cartoon. Centered with generous 12 percent empty padding on each side, square image. ACTUAL transparent RGBA alpha background, no painted checkerboard, no solid color backdrop, no floor, no environment, no text, no shadow outside silhouette.
