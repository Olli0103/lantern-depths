// Release 119: troll object 150, axe 36, signed STRENGTH property 7.
// Read-only presentation; combat and randomness remain wholly in the VM.
export function trollState(engine) {
  if (!engine.lit() || !engine.visible(150)) return null;
  const strength=engine.prop(150,7);
  if (strength & 0x8000) return 'unconscious';
  return engine.parent(36)===150?'armed':'disarmed';
}
