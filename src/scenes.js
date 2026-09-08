// Object IDs and attributes are tied to the pinned release 119 story.
// No action changes VM memory: every interaction sends a parser command.
export const scenes = {
  64: { art: 'west-house', caption: 'A house at the edge of the unknown.', objects: [230,76], hotspots: [{id:230,x:23,y:67}] },
  137: { art: 'north-house', caption: 'The woods keep their own counsel.', objects: [] },
  85: { art: 'behind-house', caption: 'There is more than one way into a story.', objects: [243], hotspots: [{id:243,x:43,y:42}] },
  27: { art: 'kitchen', caption: 'Someone was here before you.', objects: [243,99,138], hotspots: [] },
  75: { art: 'living-room', caption: 'Ordinary things. Extraordinary possibilities.', objects: [146,227,55,240], hotspots: [] },
  33: { art: 'cellar', caption: 'The Great Underground Empire awaits.', objects: [], hotspots: [] },
};
export const nouns = { 230:'mailbox',76:'leaflet',243:'window',99:'sack',138:'bottle',146:'lamp',227:'sword',55:'rug',240:'trap door' };
export function sceneObjects(engine) {
  const scene = scenes[engine.state().room];
  if (!engine.lit()) return [];
  const ids = (scene?.objects ?? []).filter(id => id === 243 || engine.visible(id));
  // Include known items dropped by the player, wherever they are now.
  for (const raw of Object.keys(nouns)) {
    const id=Number(raw);
    if (engine.visible(id) && engine.parent(id)!==44 && !ids.includes(id) && id!==243) ids.push(id);
  }
  return ids.filter(id=>engine.parent(id)!==44);
}
