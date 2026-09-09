# Responsive UI — scene-first edition

One DOM, one visual system, unchanged story logic. The existing scene, artwork,
object, inventory, selection, transcript and parser IDs remain intact.

## Layout

- Wide desktop: approximately 76–78% scene column, a continuous interaction rail,
  literary transcript beneath the artwork, and a full-width fixed parser dock.
- Tablet (761–1100px): narrower rail and reduced spacing; no duplicated controls.
- Mobile (up to 760px): compact single-row header, full-width scene, Nearby rows,
  compact movement and satchel, and an independently scrollable journal view.
- Artwork and object layers keep their exact shared 3:2 geometry. The desktop
  document can scroll on short windows; images are never cropped to force the
  whole scene and transcript into one screen.

Mobile moves the existing Sound, Map, Save and Load buttons into Menu, keeping
IDs and listeners. Journal defaults closed on mobile, open on desktop, with an
unread marker when responses arrive while it is closed. An explicit user choice
survives layout changes within the session. Escape and the close button dismiss
the mobile journal. Help remains accessible from Menu on all layouts.

Scene actions reuse the same selection tree in a nonmodal native popover. Desktop
anchors it near the target; mobile positions it above the parser, limits its
height and scrolls long action sets. Nearby and inventory selections use the same
mobile sheet. No explanatory prose is invented for selected objects.

The dock uses safe-area insets and tracks visualViewport changes while the input
is focused. Input remains 16px or larger on mobile. Motion obeys both the system
preference and the existing in-game setting.

## Validation

- Existing engine tests, complete 350-point browser playthrough, 108-room audit,
  Save/Load, Undo, hidden objects and darkness checks retained.
- Added responsive checks at 375, 390, 430, 768, 1024, 1440, 1600 and 1800 pixels,
  plus landscape, single-instance DOM hooks, scene geometry, menu reachability,
  compact sheets and 44px sheet actions.
- Existing tests now open the mobile Menu or Journal before using relocated
  controls. Their original behavioral and visual assertions were not removed.
- `npm run test:webkit` runs the focused 9-test UI/interaction regression set in
  WebKit. CI installs and runs WebKit as well as the full Chromium suite.
- Visually inspected West of House, mailbox selection, Living Room, inventory,
  dark Cellar, lit Cellar and Troll Room; mobile scene, sheet and journal also
  inspected with Playwright's iPhone/WebKit device emulation.

**Device limit:** desktop WebKit and device emulation do not reproduce a physical
 iPhone's software keyboard or dynamic Safari chrome. Safe-area CSS and the
visualViewport keyboard handler are implemented, but a physical-iPhone keyboard
and home-indicator check is not claimed as completed.

## Reviewed production-build captures

[Desktop](ui-review/responsive-desktop.jpg) · [Mobile action sheet](ui-review/responsive-mobile.jpg)

Local release gate: 47 engine/integrity tests, 27 Chromium browser tests and 9
focused WebKit tests passed. After the final focus/popover refinements, the
7 affected Chromium checks and all 9 WebKit checks passed again; production
build succeeded. These are browser-engine checks, not physical-device claims.
