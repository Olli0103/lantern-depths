import {supportingScene,supportingHotspots} from './supporting-regions.js';
import { expeditionScene, expeditionGroups } from './expedition.js';
import { damScenes, damRooms, damState } from './dam-region.js';
import { localHotspots } from './staging.js';
// Object IDs and attributes are tied to the pinned release 119 story.
// No action changes VM memory: every interaction sends a parser command.
import { regions } from './regions.js';
export const scenes = {
  ...Object.fromEntries(Object.entries(regions).map(([id,scene])=>[id,expeditionScene(Number(id),supportingScene(Number(id),scene))])),
  ...damScenes,
  15:{art:'passage-atlas',cell:0,caption:'Passages lead away into the dark.',objects:[],hotspots:[]},
  175:{art:'passage-atlas',cell:1,caption:'A fork in the silence.',objects:[],hotspots:[]},
  106:{art:'passage-atlas',cell:2,caption:'The path follows the edge.',objects:[],hotspots:[]},
  69:{art:'caves-atlas',cell:2,caption:'Old marks cover the cave walls.',objects:[],hotspots:supportingHotspots[69]},
  64: { art: 'west-house', caption: 'A house at the edge of the unknown.', objects: [230,76], hotspots: [{id:230,x:21,y:56},{id:121,x:63,y:45}] },
  137: { art: 'north-house', caption: 'The woods keep their own counsel.', objects: [] },
  85: { art: 'behind-house-ajar-v2', caption: 'There is more than one way into a story.', objects: [243], hotspots: [{id:243,x:43,y:42}] },
  27: { art: 'kitchen', caption: 'Someone was here before you.', objects: [243,43,99,138], hotspots: localHotspots[27] },
  75: { art: 'living-room', caption: 'Ordinary things. Extraordinary possibilities.', objects: [146,227,55,240], hotspots: localHotspots[75] },
  33: { art: 'cellar', caption: 'The Great Underground Empire awaits.', objects: [], hotspots: [] },
  127: { art: 'troll-room', caption: 'The walls bear the marks of earlier visitors.', objects: [150,36], hotspots: [] },
  247: { art: 'east-chasm', caption: 'The darkness has no visible bottom.', objects: [], hotspots: [] },
  122: { art:'gallery',caption:'Even the vandals had excellent taste.',objects:[92],hotspots:[] },
  220: { art:'studio',caption:'An entire universe. Some assembly required.',objects:[41,43],hotspots:[{id:43,x:79,y:55}] },
  130: { art: 'east-west-passage-v2', caption: 'Stone narrows around the lamplight.', objects: [], hotspots: [] },
};
export const nouns = {105:"egg",135:"nest",211:"ghosts",183:"mirror",234:"mirror",84:"engravings",26:'candles',35:'altar',57:'railing',71:'prayer',79:'pedestal',83:'bell',168:'hot bell',101:'switch',108:'basket',203:'basket',131:'sand',179:'coffin',196:'book',207:'machine',208:'boat',219:'boat',68:'boat',190:'stone door',9:'panel',210:'bolt',200:'bubble',223:'dam',63:'yellow button',151:'brown button',212:'red button',225:'blue button',237:'tool chests',49:'leak',215:'guidebook',109:'pump', 197:'case',169:'table',100:'wooden door',186:'water',217:'garlic',14:'lunch', 92:'painting',41:'manual',43:'chimney', 150:'troll',36:'axe',230:'mailbox',76:'leaflet',243:'window',99:'sack',138:'bottle',146:'lamp',227:'sword',55:'rug',240:'trap door' };
const surfaceRooms=new Set([64,137,85,209,238,5,32,87,167,221,128,160,22,21,74,47,125,202,244,30,155,166,184,37,45,53,174,182,40,67,86,111]);
export const undergroundRooms = new Set(Object.keys(scenes).map(Number).filter(id=>!surfaceRooms.has(id)&&![27,75,187].includes(id)));
export function ambienceFor(engine) {
  const room=engine.state().room;
  // Acoustic identity is geographical, independent of whether a lamp is lit.
  if(damRooms.has(room)){const s=damState(engine);return room===224?(s.waterLevel>0?'leak':'machinery'):room===120?'gallery':s.gates?'sluices':'reservoir';}
  if(expeditionGroups.temple.includes(room))return 'temple';
  if(expeditionGroups.mine.includes(room))return 'mine';
  if(expeditionGroups.river.includes(room))return [47,125,202].includes(room)?'falls':'river';
  if(expeditionGroups.endgame.includes(room))return room===244?'outdoors':'quiet';
  return ({33:'cellar',127:'stone',247:'chasm',130:'passage',122:'gallery',220:'studio'})[room]
    ?? (surfaceRooms.has(room)?'outdoors':undergroundRooms.has(room)?'passage':'house');
}
export function sceneObjects(engine) {
  const scene = scenes[engine.state().room];
  if (!engine.lit()) return [];
  const ids = (scene?.objects ?? []).filter(id => id === 243 || id === 43 || engine.visible(id));
  // Read actual visible local objects, including opened-container contents.
  // No dictionary scan, exit-table scan or hidden-object affordances.
  for (let id=1;id<=250;id++) {
    if(id===44)continue;
    if (engine.visible(id) && engine.parent(id)!==44 && !ids.includes(id) && id!==243) ids.push(id);
  }
  const room=engine.state().room;
  if([160,216].includes(room)&&(room===216||!engine.flag(29,7)))ids.push(29);
  return [...new Set(ids)].filter(id=>id!==44&&!engine.carried(id));
}
