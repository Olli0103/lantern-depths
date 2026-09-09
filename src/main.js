import { Engine } from './engine.js';
import { scenes, nouns, sceneObjects, undergroundRooms, ambienceFor } from './scenes.js';
import { actionsFor, relations, noun, visualState, changedSounds } from './interactions.js';
import { spriteIndex, spriteStyle, renderLayers } from './layers.js';
import { Soundscape } from './audio.js';

const $ = id => document.getElementById(id);
const key = 'lantern-depths.save.v1';
let engine, story, selected = null, history = [], targeting = null;
const sound = new Soundscape();
const art = new Set(Object.values(scenes).map(scene=>scene.art));
let previousRoom=null;

function button(label, action, parent, className) {
  const el = document.createElement('button');
  el.type = 'button'; el.textContent = label; el.setAttribute('aria-label', label);
  if (className) el.className = className;
  el.addEventListener('click', action); parent.append(el); return el;
}
function notice(text) { $('notice').textContent = text; }
function addEntry(command, text) {
  history.push({ command, text: text.replace(/\n*>\s*$/, '').trim() });
  history = history.slice(-150);
}
function renderLog() {
  const log=$('transcript'); log.replaceChildren();
  for(const entry of history) {
    if(entry.command) { const p=document.createElement('p'); p.className='command'; p.textContent='› '+entry.command; log.append(p); }
    const p=document.createElement('p');p.textContent=entry.text;log.append(p);
  }
  log.scrollTop=log.scrollHeight;
}
function select(id) {
  if(targeting) {
    const attempt=targeting;
    if(attempt.id===id){cancelTarget();return;}
    run(relations[attempt.relation].command(noun(engine,attempt.id),noun(engine,id)));
    return;
  }
  selected=id;
  renderSelection();
}
function cancelTarget() {
  targeting=null;document.body.classList.remove('targeting');
  $('instruction').textContent='Explore the scene, or write what you want to do.';
}
function renderSelection() {
  const id=selected;
  if(!id){$('selection').hidden=true;return;}
  $('selection').hidden=false;
  $('selected-name').textContent=engine.name(id);
  $('verbs').replaceChildren();
  $('relations').replaceChildren();
  for(const verb of actionsFor(engine,id)) button(verb,()=>run(verb.toLowerCase()+' '+noun(engine,id)),$('verbs'));
  if(engine.parent(id)===44) {
    for(const [relation, spec] of Object.entries(relations)) button(spec.label,()=>{
      targeting={id,relation};document.body.classList.add('targeting');
      $('instruction').textContent=`${engine.name(id)} → ${spec.label.toLowerCase()} Choose a target · Esc to cancel`;
      notice('Select a visible object or another item in your satchel.');
    },$('relations'));
  }
}
function render() {
  const state=engine.state(), scene=scenes[state.room], lit=engine.lit();
  $('location').textContent=lit?state.name:'Darkness';
  $('stats').textContent=`SCORE ${state.score} / 350 · MOVES ${state.turns}`;
  $('caption').textContent=lit?(scene?.caption??'Beyond the familiar.'):'It is pitch black. You are likely to be eaten by a grue.';
  const hasArt=lit&&art.has(scene?.art);
  $('painting').hidden=!hasArt;
  if(!hasArt){$('painting').removeAttribute('src');$('painting').alt='';}
  $('chapter-label').textContent=!lit?'LANTERN DEPTHS':undergroundRooms.has(state.room)?'BENEATH THE WHITE HOUSE':'LANTERN DEPTHS';
  $('scene').dataset.underground=String(undergroundRooms.has(state.room));
  if(previousRoom!==state.room){
    if(lit&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('reduce-motion'))
      $('painting').animate([{opacity:0},{opacity:1}],{duration:450});
    previousRoom=state.room;
  }
  let painting=scene?.art;
  if(state.room===64&&engine.flag(230,11))painting='west-house-open';
  if(state.room===85&&engine.flag(243,11))painting='behind-house-open';
  if(state.room===27&&!engine.flag(243,11))painting='kitchen-closed';
  if(hasArt){$('painting').src=`./art/${painting}.png`;$('painting').alt=`Painted view of ${state.name}`;}
  $('scene').dataset.dark=String(!lit);
  $('scene').dataset.lantern=String(lit&&!engine.flag(state.room,19));
  $('scene').dataset.room=state.room;
  if(hasArt)renderLayers(engine,$('object-layers'),select,button);else $('object-layers').replaceChildren();
  sound.setScene(ambienceFor(engine));
  $('unpainted').hidden=hasArt||!lit;
  $('hotspots').replaceChildren();
  const visible=sceneObjects(engine);
  for(const h of (hasArt?scene?.hotspots??[]:[])) {
    if(!visible.includes(h.id))continue;
    const el=button('+',()=>select(h.id),$('hotspots'),'hotspot');
    el.style.left=h.x+'%';el.style.top=h.y+'%';el.setAttribute('aria-label',`Inspect ${engine.name(h.id)}`);el.title=engine.name(h.id);
  }
  const states=[];
  if(lit&&state.room===64)states.push(engine.flag(230,11)?'Mailbox · open':'Mailbox · closed');
  if(lit&&[85,27].includes(state.room))states.push(engine.flag(243,11)?'Window · open':'Window · ajar');
  if(lit&&state.room===75&&!engine.flag(240,7))states.push(engine.flag(240,11)?'Trapdoor · open':'Trapdoor · closed');
  $('scene-state').textContent=states.join(' / ');
  $('objects').replaceChildren();
  for(const id of visible)button(engine.name(id),()=>select(id),$('objects'));
  if(!visible.length){const p=document.createElement('p');p.textContent=lit?'Look around. There may be more than meets the eye.':'You cannot see your surroundings.';$('objects').append(p);}
  $('inventory').replaceChildren();
  const items=engine.inventory();$('count').textContent=items.length;
  for(const item of items){
    const el=button(item.name+(item.id===146&&engine.flag(146,19)?' · lit':''),()=>select(item.id),$('inventory'));
    if(spriteIndex[item.id]!==undefined){const icon=document.createElement('span');icon.className='inventory-icon';icon.setAttribute('aria-hidden','true');spriteStyle(icon,spriteIndex[item.id]);el.prepend(icon);}
  }
  if(!items.length){const p=document.createElement('p');p.textContent='A little room for whatever you find.';$('inventory').append(p);}
  if(selected&&!visible.includes(selected)&&!items.some(i=>i.id===selected)){selected=null;$('selection').hidden=true;}
  renderSelection();
  document.querySelectorAll('.compass button, #vertical button, #command-form button').forEach(el=>el.disabled=!!engine.vm.quit);
  renderLog();
}
function run(command) {
  command=command.trim();if(!command)return;
  cancelTarget();
  try {const before=visualState(engine);addEntry(command,engine.command(command));for(const effect of changedSounds(before,visualState(engine)))sound.effect(effect);notice('');render();}
  catch(e){notice(e.message);}
}
async function start() {
  try {
    const response=await fetch('./story.z3');if(!response.ok)throw new Error('The story could not be loaded.');
    story=new Uint8Array(await response.arrayBuffer());
    engine=new Engine(window.ZVM,story);addEntry('',engine.output);render();
  }catch(e){notice(e.message);$('location').textContent='Unable to begin';}
}
const compass=document.querySelector('.compass');
for(const [label,command] of [['NW','northwest'],['N','north'],['NE','northeast'],['W','west'],['✦',null],['E','east'],['SW','southwest'],['S','south'],['SE','southeast']]) {
  if(command){const el=button(label,()=>run(command),compass);el.setAttribute('aria-label',`Go ${command}`);}
  else {const span=document.createElement('span');span.textContent=label;compass.append(span);}
}
for(const direction of ['up','down','in','out'])button(direction,()=>run(direction),$('vertical'));
$('command-form').addEventListener('submit',e=>{e.preventDefault();if(!engine)return;run($('command').value);$('command').value='';});
$('look').addEventListener('click',()=>engine&&run('look'));
$('save').addEventListener('click',()=>{if(!engine)return;try{localStorage.setItem(key,JSON.stringify({engine:engine.snapshot(),history}));notice('Your place in the story is saved in this browser.');}catch(e){notice('Save failed: '+e.message);}});
$('load').addEventListener('click',()=>{
  if(!story)return;
  try {
    const raw=localStorage.getItem(key);if(!raw)throw new Error('No saved adventure in this browser yet.');
    if(raw.length>2_000_000)throw new Error('Save is too large.');
    const save=JSON.parse(raw);
    if(!Array.isArray(save.history)||save.history.length>150||!save.history.every(e=>typeof e.text==='string'&&typeof e.command==='string'))throw new Error('Invalid journal data.');
    const candidate=new Engine(window.ZVM,story);candidate.restore(save.engine);
    engine=candidate;history=save.history;selected=null;cancelTarget();$('selection').hidden=true;render();notice('Welcome back. Your adventure has been restored.');
  }catch(e){notice('Load failed: '+e.message);}
});
$('new').addEventListener('click',()=>{
  if(!story||!window.confirm('Start a new adventure? Your saved game will remain available.'))return;
  engine=new Engine(window.ZVM,story);history=[];selected=null;cancelTarget();$('selection').hidden=true;addEntry('',engine.output);render();notice('A new adventure begins.');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelTarget();notice('');}});
$('sound').addEventListener('click',async()=>{
  $('sound').disabled=true;
  try{const enabled=await sound.toggle();$('sound').textContent=enabled?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(enabled));}
  catch(e){notice(e.message);}finally{$('sound').disabled=false;}
});
$('volume').addEventListener('input',e=>sound.setVolume(Number(e.target.value)/100));
$('text-size').addEventListener('change',e=>document.documentElement.style.setProperty('--journal-size',e.target.value+'px'));
$('reduce-motion').checked=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('reduce-motion').addEventListener('change',e=>document.documentElement.classList.toggle('reduce-motion',e.target.checked));
start();
