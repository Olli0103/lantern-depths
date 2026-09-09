# Audio direction

The original game stays turn-based. Sound never advances time, exposes an unseen object, or changes a puzzle. Playback remains opt-in, with a master volume and suspension in hidden tabs.

## Planned production sources

- ElevenLabs: short physical effects and unobtrusive environmental loops.
- Suno: sparse instrumental transition cues; no continuous heroic score, vocals, or imitation of a named artist.
- Existing procedural audio remains the working fallback until the user's sessions, generation allowance and applicable publication rights are confirmed.

## First sound batch

1. Forest bed: soft deciduous leaves, very distant birds, no footsteps or voices; seamless 20-second loop.
2. Interior bed: almost silent old timber house, faint draught, one distant timber tick; no melody, 20-second loop.
3. Cavern bed: isolated droplets in a large stone space, diffuse long reflections, no monsters or voices; 20-second loop.
4. River bed: broad cold rushing river heard from the bank, no identifiable boat; seamless 20 seconds.
5. Mailbox: one old metal mailbox latch opening and short hinge creak, dry close perspective, 2 seconds.
6. Rug: heavy woven rug dragged across dry wooden boards once, 3 seconds.
7. Trapdoor: heavy timber hatch lifted, two old iron hinge creaks, no footsteps; 3 seconds.
8. Object pickup: soft leather/cloth contact and restrained movement, no magical sparkle; 1 second.

## Music briefs

- Surface threshold: instrumental, sparse wooden flute fragments and warm sustained strings, curious but understated, long spaces between notes, no percussion, no vocals. Short introduction followed by a low-density tail suitable for fading.
- Descent: instrumental, a few low bowed tones and distant struck stone, unresolved harmony, spacious silence, wonder rather than jump-scare horror. No combat pulse or vocals.
- Final barrow: instrumental, restrained opening of harmony, gentle acoustic timbres, quiet earned discovery, no triumphant fanfare or choir.

Keep music separate from environmental beds. Trigger only at deliberate chapter transitions; do not restart on every room visit.

## Asset gate

Record provider, generation date, prompt, applicable plan/terms, source file hash and permitted redistribution. Do not place third-party generated audio under the repository's code licence or assume CC0. Never commit login data or session URLs. Audition each file for clipping, unwanted speech, abrupt loop seams and excessive loudness before integration.

## First supplied music — 2026-09-09

The owner supplied the selected Suno MP3 in a ZIP. It is integrated unmodified
as an explicitly requested opening cue in Settings, separately from procedural
ambience. Playback uses a bounded 60-second envelope, not a continuous score.
See `public/audio/README.md` for provenance, technical measurements and separate
rights. No claim of independent listening review or verified absence of vocals.
ElevenLabs recordings remain pending; no additional generation was attempted.
