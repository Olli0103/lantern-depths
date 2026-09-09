import { stageRegion, authoredRooms } from './staging.js';
import { trollState } from './encounters.js';
import { props,propStyle,propLayers } from './props.js';
import { propImage } from './art.js';
// The single generated 4x2 PNG atlas remains intact; CSS selects its cells.
export const spriteIndex = { 146: 0, 76: 1, 227: 2, 99: 3, 138: 4, 55: 5, 240: 6 };
export function spriteStyle(element, index) {
  element.classList.add('sprite');
  element.style.backgroundPosition = `${(index % 4) * 100 / 3}% ${index < 4 ? 0 : 100}%`;
}

export const galleryItems=new Set([92,41]);
// Read-only release-119 state: WATER's actual parent, never parsed narration.
export function containerArtState(engine,id){
  if(id===99)return engine.flag(id,11)?'sack-open':'sack-closed';
  if(id===138)return `bottle-${engine.parent(186)===138?'full':'empty'}-${engine.flag(id,11)?'open':'closed'}`;
  return null;
}
export function hasItemArt(id){return spriteIndex[id]!==undefined||galleryItems.has(id)||!!props[id];}
export function itemArt(engine,id,el){
  // Detail and scene nodes are reused across object/state changes. Remove only
  // art-owned styles so an open container cannot retain its atlas after closing.
  el.classList.remove('sprite','gallery-sprite','world-prop','container-sprite');
  for(const key of ['backgroundImage','backgroundSize','backgroundPosition','aspectRatio'])el.style[key]='';
  delete el.dataset.artState;
  const state=containerArtState(engine,id);
  const cell={'sack-open':0,'bottle-full-open':1,'bottle-empty-closed':2,'bottle-empty-open':3}[state];
  if(cell!==undefined){
    el.classList.add('container-sprite');
    el.style.backgroundImage=propImage('container-states-v1');
    el.style.backgroundSize='200% 200%';
    el.style.backgroundPosition=`${cell%2*100}% ${Math.floor(cell/2)*100}%`;
    el.style.aspectRatio='1';
  }else if(id===146&&engine.flag(id,19))propStyle(engine,'lantern-lit',el);
  else if(props[id])propStyle(engine,id,el);
  else if(galleryItems.has(id)){
    el.classList.add('gallery-sprite');
    const index=id===41?2:engine.prop(92,12)===0?1:0;
    const [x,y,w,h]=index===2?[55,570,540,680]:index===1?[627,0,627,550]:[0,0,620,550];
    el.style.aspectRatio=`${w}/${h}`;el.style.backgroundSize=`${1254/w*100}% ${1254/h*100}%`;
    el.style.backgroundPosition=`${x/(1254-w)*100}% ${y/(1254-h)*100}%`;
    el.dataset.artState=id===92?(index===1?'damaged':'intact'):'paper';
  }else spriteStyle(el,spriteIndex[id]);
  if(state)el.dataset.artState=state;
}

export function layersFor(engine) {
  if (!engine.lit()||engine.completed()) return [];
  const room = engine.state().room;
  const visible = id => engine.visible(id) && engine.parent(id) !== 44;
  const layers = propLayers(engine);
  const encounter=trollState(engine);
  if(encounter) layers.push({id:150,x:57,y:66,width:encounter==='unconscious'?46:35,encounter});
  if(visible(36)&&engine.parent(36)===room)layers.push({id:36,x:70,y:87,width:15,encounter:'axe'});
  const add = (id, x, y, width, extra = {}) => { if (visible(id)) layers.push({id, x, y, width, index: spriteIndex[id], ...extra}); };
  if(room===122&&visible(92)&&!engine.flag(92,3))layers.push({id:92,x:69,y:39,width:23,gallery:true});
  if(room===220&&visible(41)&&!engine.flag(41,3))layers.push({id:41,x:51,y:40,width:10,gallery:true});
  for(const id of galleryItems)if(visible(id)&&engine.parent(id)===room&&!layers.some(x=>x.id===id))layers.push({id,x:id===92?42:61,y:86,width:id===92?22:10,gallery:true});
  if (room === 75) {
    // The rug is rendered over the same location as the hidden door until discovery.
    const moved = !engine.flag(240, 7);
    add(240, 53, 80, 32, { index: engine.flag(240, 11) ? 7 : 6 });
    add(55, moved ? 23 : 53, moved ? 84 : 80, moved ? 30 : 43, { moved });
    if (!engine.flag(146, 3)) add(146, 62, 19, 7.5);
    if (!engine.flag(227, 3)) add(227, 75, 17, 8);
  }
  if (room === 27) { if(engine.parent(99)===169)add(99, 43, 55, 12); if(engine.parent(138)===169)add(138, 61, 54, 9); }
  if (room === 64 && engine.flag(230, 11) && engine.parent(76)===230) add(76, 28, 62, 8);
  // Show known objects dropped in the current room, rather than restoring their original placement.
  let dropped = 0;
  for (const raw of Object.keys(spriteIndex)) {
    const id = Number(raw);
    if ([55,240].includes(id) || layers.some(layer => layer.id === id)) continue;
    if (visible(id) && engine.parent(id) === room) add(id, 35 + 12 * dropped++, 90, 8);
  }
  if(authoredRooms.has(room)){
    // Add supported loose items in visible local containers (including the
    // transparent case). Never render possessions inside a carried container.
    for(const id of [...Object.keys(spriteIndex).map(Number),...galleryItems]){
      if(!visible(id)||engine.carried(id)||layers.some(l=>l.id===id)||![99,138,169,197].includes(engine.parent(id)))continue;
      layers.push({id,index:spriteIndex[id],gallery:galleryItems.has(id)});
    }
  }
  const staged=stageRegion(engine,layers);
  for(const l of staged){if(l.decorative)continue;const parent=engine.parent(l.id);if(parent===135){const n=staged.find(x=>x.id===135);if(n)Object.assign(l,{x:n.x,y:n.y-2,width:n.width*.4,placement:'nest'});}}
  return staged;
}

export function renderLayers(engine, parent, select, makeButton) {
  const wanted = layersFor(engine);
  const ids = new Set(wanted.map(layer => String(layer.id)));
  for (const child of [...parent.children]) if (!ids.has(child.dataset.objectId)) child.remove();
  for (const layer of wanted) {
    let el = parent.querySelector(`[data-object-id="${layer.id}"]`);
    if (!el) {
      if(layer.decorative){el=document.createElement('span');el.className='scene-object decorative';el.setAttribute('aria-hidden','true');parent.append(el);}
      else el = makeButton('', element => select(layer.id,element), parent, 'scene-object');
      el.dataset.objectId = layer.id;
      if(!layer.decorative){el.setAttribute('aria-label', `Inspect ${engine.name(layer.id)}`);el.title = engine.name(layer.id);}
    }
    if(layer.encounter){
      el.classList.add('encounter-sprite');
      el.dataset.encounter=layer.encounter;
      // Authored source rectangles keep irregular generated cell padding intact.
      const [x,y,w,h]=({armed:[0,0,700,700],disarmed:[720,0,534,700],unconscious:[0,760,715,410],axe:[720,700,534,540]})[layer.encounter];
      el.style.aspectRatio=`${w}/${h}`;
      el.style.backgroundSize=`${1254/w*100}% ${1254/h*100}%`;
      el.style.backgroundPosition=`${x/(1254-w)*100}% ${y/(1254-h)*100}%`;
    }else if(layer.prop)propStyle(engine,layer.id,el);
    else if(layer.gallery)itemArt(engine,layer.id,el);
    else if([99,138,146].includes(layer.id))itemArt(engine,layer.id,el);
    else spriteStyle(el, layer.index);
    el.style.left = layer.x + '%'; el.style.top = layer.y + '%'; el.style.width = layer.width + '%';
    el.dataset.placement=layer.placement??'authored';
    el.dataset.dense=String(!!layer.dense);
    el.dataset.moved = layer.moved ? 'true' : 'false';
    el.classList.toggle('lamp-lit', layer.id === 146 && engine.flag(146, 19));
    el.dataset.sprite = layer.index;
  }
}
