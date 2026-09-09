import { trollState } from './encounters.js';
// The single generated 4x2 PNG atlas remains intact; CSS selects its cells.
export const spriteIndex = { 146: 0, 76: 1, 227: 2, 99: 3, 138: 4, 55: 5, 240: 6 };
export function spriteStyle(element, index) {
  element.classList.add('sprite');
  element.style.backgroundPosition = `${(index % 4) * 100 / 3}% ${index < 4 ? 0 : 100}%`;
}

export function layersFor(engine) {
  if (!engine.lit()) return [];
  const room = engine.state().room;
  const visible = id => engine.visible(id) && engine.parent(id) !== 44;
  const layers = [];
  const encounter=trollState(engine);
  if(encounter) layers.push({id:150,x:57,y:66,width:encounter==='unconscious'?46:35,encounter});
  if(visible(36)&&engine.parent(36)===room)layers.push({id:36,x:70,y:87,width:15,encounter:'axe'});
  const add = (id, x, y, width, extra = {}) => { if (visible(id)) layers.push({id, x, y, width, index: spriteIndex[id], ...extra}); };
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
  return layers;
}

export function renderLayers(engine, parent, select, makeButton) {
  const wanted = layersFor(engine);
  const ids = new Set(wanted.map(layer => String(layer.id)));
  for (const child of [...parent.children]) if (!ids.has(child.dataset.objectId)) child.remove();
  for (const layer of wanted) {
    let el = parent.querySelector(`[data-object-id="${layer.id}"]`);
    if (!el) {
      el = makeButton('', () => select(layer.id), parent, 'scene-object');
      el.dataset.objectId = layer.id;
      el.setAttribute('aria-label', `Inspect ${engine.name(layer.id)}`);
      el.title = engine.name(layer.id);
    }
    if(layer.encounter){
      el.classList.add('encounter-sprite');
      el.dataset.encounter=layer.encounter;
      // Authored source rectangles keep irregular generated cell padding intact.
      const [x,y,w,h]=({armed:[0,0,700,700],disarmed:[720,0,534,700],unconscious:[0,760,715,410],axe:[720,700,534,540]})[layer.encounter];
      el.style.aspectRatio=`${w}/${h}`;
      el.style.backgroundSize=`${1254/w*100}% ${1254/h*100}%`;
      el.style.backgroundPosition=`${x/(1254-w)*100}% ${y/(1254-h)*100}%`;
    }else spriteStyle(el, layer.index);
    el.style.left = layer.x + '%'; el.style.top = layer.y + '%'; el.style.width = layer.width + '%';
    el.dataset.moved = layer.moved ? 'true' : 'false';
    el.classList.toggle('lamp-lit', layer.id === 146 && engine.flag(146, 19));
    el.dataset.sprite = layer.index;
  }
}
