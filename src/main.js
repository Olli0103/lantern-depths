import { SceneMenu } from './scene-menu.js';
import { setPaintingSource } from './art.js';
import { UndoHistory, CommandHistory } from './checkpoints.js';
import { QUICK_SAVE_KEY, MAX_SAVE_BYTES, SLOT_COUNT, capture, decodeSave, saveSlot, readSlot, slotMetadata } from './saves.js';
import { MusicCue } from './music.js';
import { Discovery, observation, renderDiscovery } from './discovery.js';
import { Engine } from './engine.js';
import { scenes, nouns, sceneObjects, undergroundRooms, ambienceFor } from './scenes.js';
import { actionsFor, relations, noun, visualState, changedSounds } from './interactions.js';
import { spriteIndex, spriteStyle, renderLayers, hasItemArt, itemArt } from './layers.js';
import { Soundscape } from './audio.js';
import { sceneVariant } from './world-state.js';

const $ = id => document.getElementById(id);
const key = QUICK_SAVE_KEY;
const undoHistory=new UndoHistory(),commandHistory=new CommandHistory();
let storyHash='';
const checkpoint=()=>capture(engine,history,discovery,storyHash);
let engine, story, selected = null, history = [], targeting = null;
const sound = new Soundscape();
let discovery=new Discovery();
const art = new Set(Object.values(scenes).map(scene=>scene.art));
let previousRoom=null;
const sceneMenu=new SceneMenu($('scene'),$('selection'),$('selection-home'),$('scene-actions'),$('command-form'));
$('scene-actions-close').addEventListener('click',()=>sceneMenu.close(true));

function button(label, action, parent, className) {
  const el = document.createElement('button');
  el.type = 'button'; el.textContent = label; el.setAttribute('aria-label', label);
  if (className) el.className = className;
  el.addEventListener('click', event => {
    action(el,event);
    if(event.detail===0&&el.matches('[data-select-id],.scene-object')&&!$('selection').hidden)
      $('verbs').querySelector('button')?.focus({preventScroll:true});
  }); parent.append(el); return el;
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
function select(id,anchor=null) {
  if(targeting) {
    const attempt=targeting;
    if(attempt.id===id){cancelTarget();return;}
    run(relations[attempt.relation].command(noun(engine,attempt.id),noun(engine,id)));
    return;
  }
  selected=id;
  if(!anchor)sceneMenu.close();
  renderSelection();
  if(anchor&&sceneMenu.open(id))return;
  if(window.matchMedia('(max-width:760px)').matches) $('selection').scrollIntoView({block:'nearest',behavior:'instant'});
}
function cancelTarget() {
  targeting=null;document.body.classList.remove('targeting');
  $('instruction').textContent='Explore the scene, or write what you want to do.';
}
function renderSelection() {
  const id=selected;
  if(!id){$('selection').hidden=true;sceneMenu.close();return;}
  $('selection').hidden=false;
  $('selected-name').textContent=engine.name(id);
  document.querySelectorAll('[data-select-id]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.selectId)===id)));
  $('verbs').replaceChildren();
  $('relations').replaceChildren();
  $('contents').replaceChildren();
  for(const verb of actionsFor(engine,id)) button(verb,()=>{
    const text=run(verb.toLowerCase()+' '+noun(engine,id));
    if(text&&['Read','Examine'].includes(verb)&&engine.lit())showDetail(id,text);
  },$('verbs'));
  const children=[];
  if(engine.lit())for(let child=engine.vm.get_child(id);child;child=engine.vm.get_sibling(child))if(engine.visible(child))children.push(child);
  if(children.length){const heading=document.createElement('p');heading.textContent='Contents';$('contents').append(heading);
    for(const child of children)button(engine.name(child),()=>select(child),$('contents')).setAttribute('aria-label',`Select contents: ${engine.name(child)}`);
  }
  if(engine.parent(id)===44) {
    for(const [relation, spec] of Object.entries(relations)) button(spec.label,()=>{
      targeting={id,relation};document.body.classList.add('targeting');
      $('instruction').textContent=`${engine.name(id)} → ${spec.label.toLowerCase()} Choose a target · Esc to cancel`;
      sceneMenu.close();
      notice('Select a visible object or another item in your satchel.');
    },$('relations'));
  }
}
function render() {
  const state=engine.state(), scene=sceneVariant(engine,scenes[state.room]), lit=engine.lit();
  $('location').textContent=lit?state.name:'Darkness';
  $('journal-location').textContent=lit?state.name:'Darkness';
  $('stats').textContent=`SCORE ${state.score} / 350 · MOVES ${state.turns}`;
  $('caption').textContent=lit?(scene?.caption??'Beyond the familiar.'):'It is pitch black. You are likely to be eaten by a grue.';
  const hasArt=lit&&art.has(scene?.art);
  $('painting').hidden=!hasArt;
  if(!hasArt){$('painting-source').removeAttribute('srcset');$('painting').removeAttribute('src');$('painting').alt='';}
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
  if(state.room===75&&engine.flag(197,11))painting='living-room-case-open-v1';
  const tile=scene?.cell;
  Object.assign($('painting').style,tile===undefined?{width:'100%',height:'100%',position:'',left:'',top:''}:{width:'200%',height:'200%',position:'absolute',left:`${-(tile%2)*100}%`,top:`${-Math.floor(tile/2)*100}%`});
  if(hasArt){setPaintingSource($('painting-source'),painting,tile!==undefined);$('painting').src=`./art/${painting}.png`;$('painting').alt=`Painted view of ${state.name}`;}
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
    const el=button('+',element=>select(h.id,element),$('hotspots'),'hotspot');
    el.style.left=h.x+'%';el.style.top=h.y+'%';el.setAttribute('aria-label',`Inspect ${engine.name(h.id)}`);el.dataset.label=engine.name(h.id);el.dataset.selectId=h.id;el.setAttribute('aria-pressed',String(selected===h.id));
  }
  const states=[];
  if(lit&&state.room===64)states.push(engine.flag(230,11)?'Mailbox · open':'Mailbox · closed');
  if(lit&&[85,27].includes(state.room))states.push(engine.flag(243,11)?'Window · open':'Window · not open');
  if(lit&&state.room===75&&!engine.flag(240,7))states.push(engine.flag(240,11)?'Trapdoor · open':'Trapdoor · closed');
  if(lit&&state.room===75)states.push(engine.flag(197,11)?'Case · open':'Case · closed');
  $('scene-state').textContent=states.join(' / ');
  $('objects').replaceChildren();
  for(const id of visible){
    const el=button(engine.name(id),()=>select(id),$('objects'));
    el.dataset.selectId=id;el.setAttribute('aria-pressed',String(selected===id));
    if(hasItemArt(id)){const icon=document.createElement('span');icon.className='nearby-icon';icon.setAttribute('aria-hidden','true');itemArt(engine,id,icon);el.prepend(icon);}
  }
  if(!visible.length){const p=document.createElement('p');p.textContent=lit?'Look around. There may be more than meets the eye.':'You cannot see your surroundings.';$('objects').append(p);}
  $('inventory').replaceChildren();
  const items=engine.inventory();$('count').textContent=items.length;
  for(const item of items){
    const el=button(item.name+(item.id===146&&engine.flag(146,19)?' · lit':''),()=>select(item.id),$('inventory'));
    el.dataset.selectId=item.id;el.setAttribute('aria-pressed',String(selected===item.id));
    if(hasItemArt(item.id)){const icon=document.createElement('span');icon.className='inventory-icon';icon.setAttribute('aria-hidden','true');itemArt(engine,item.id,icon);el.prepend(icon);}
  }
  if(!items.length){const p=document.createElement('p');p.textContent='A little room for whatever you find.';$('inventory').append(p);}
  if(selected&&!visible.includes(selected)&&!(engine.carried(selected)&&engine.visible(selected))){selected=null;$('selection').hidden=true;}
  renderSelection();
  sceneMenu.sync();
  document.querySelectorAll('.compass button, #vertical button, #command-form button').forEach(el=>{if(el.id!=='undo')el.disabled=!!engine.vm.quit;});
  $('undo').disabled=!undoHistory.length;
  renderLog();
}
function run(command) {
  command=command.trim();if(!command)return;
  const restoreActionFocus=$('selection').contains(document.activeElement);
  cancelTarget();
  try {const saved=checkpoint(),before=visualState(engine),seen=observation(engine);const output=engine.command(command);undoHistory.push(saved);commandHistory.add(command);discovery.record(seen,observation(engine),command);addEntry(command,output);for(const effect of changedSounds(before,visualState(engine)))sound.effect(effect);notice('');render();if(restoreActionFocus&&!$('selection').hidden)$('verbs').querySelector('button')?.focus({preventScroll:true});return output;}
  catch(e){notice(e.message);}
}
function showDetail(id,text){
  $('detail-title').textContent=engine.name(id);
  $('detail-text').textContent=text.replace(/\n*>\s*$/, '').trim();
  const image=$('detail-art');image.className='';image.style.cssText='';
  image.hidden=!hasItemArt(id)||!engine.visible(id);
  if(!image.hidden)itemArt(engine,id,image);
  sceneMenu.close();
  $('detail').showModal();
}
$('map').addEventListener('click',()=>{renderDiscovery(discovery,$('map-content'),engine&&observation(engine));$('map-dialog').showModal();});
$('map-close').addEventListener('click',()=>$('map-dialog').close());
$('detail-close').addEventListener('click',()=>$('detail').close());
async function start() {
  try {
    const response=await fetch('./story.z3');if(!response.ok)throw new Error('The story could not be loaded.');
    story=new Uint8Array(await response.arrayBuffer());
    storyHash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',story)),b=>b.toString(16).padStart(2,'0')).join('');
    engine=new Engine(window.ZVM,story);discovery.record(null,observation(engine));addEntry('',engine.output);render();
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
function applyCheckpoint(raw,{undo=false}={}) {
  const restored=decodeSave(raw,window.ZVM,story,storyHash,undo?engine.entropy.snapshot():undefined);
  engine=restored.engine;history=restored.history;discovery=restored.discovery;
  sceneMenu.close();selected=null;cancelTarget();$('selection').hidden=true;
  for(const id of ['detail','map-dialog'])if($(id).open)$(id).close();
  if(!undo){undoHistory.clear();commandHistory.reset();}
  render();
}
$('undo').addEventListener('click',()=>{
  const saved=undoHistory.peek();if(!saved)return;
  try{applyCheckpoint(JSON.stringify(saved),{undo:true});undoHistory.pop();$('undo').disabled=!undoHistory.length;notice('Last command undone. Your journal and discovered routes were restored.');$('command').focus({preventScroll:true});}
  catch(e){notice('Undo failed: '+e.message);}
});
$('command').addEventListener('keydown',e=>{
  if(e.isComposing||e.altKey||e.ctrlKey||e.metaKey||!['ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();e.target.value=e.key==='ArrowUp'?commandHistory.previous(e.target.value):commandHistory.next(e.target.value);
  e.target.setSelectionRange(e.target.value.length,e.target.value.length);
});
$('save').addEventListener('click',()=>{if(!engine)return;try{localStorage.setItem(key,JSON.stringify(checkpoint()));notice('Your place in the story is saved in this browser.');}catch(e){notice('Save failed: '+e.message);}});
$('load').addEventListener('click',()=>{
  if(!story)return;
  try {const raw=localStorage.getItem(key);if(!raw)throw new Error('No saved adventure in this browser yet.');applyCheckpoint(raw);notice('Welcome back. Your adventure has been restored.');}
  catch(e){notice('Load failed: '+e.message);}
});
function downloadFile(name,content,type){
  const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderSlots(){
  $('save-slots').replaceChildren();
  for(let id=1;id<=SLOT_COUNT;id++){
    const row=document.createElement('section');row.className='save-slot';$('save-slots').append(row);
    const raw=readSlot(localStorage,id),meta=slotMetadata(raw);
    const label=document.createElement('label');label.htmlFor=`slot-name-${id}`;label.textContent=`Adventure ${id}`;row.append(label);
    const name=document.createElement('input');name.id=label.htmlFor;name.maxLength=60;name.value=meta?.label??'';name.placeholder='Name this adventure';row.append(name);
    const date=document.createElement('small');date.textContent=meta?(meta.savedAt?new Date(meta.savedAt).toLocaleString():'Earlier save'):'Empty slot';row.append(date);
    button('Save here',()=>{try{if(raw&&!window.confirm('Replace this saved adventure?'))return;saveSlot(localStorage,id,name.value,checkpoint());renderSlots();$('saves-notice').textContent='Adventure saved.';}catch(e){$('saves-notice').textContent='Save failed: '+e.message;}},row);
    const load=button('Load adventure',()=>{try{const saved=readSlot(localStorage,id);if(!saved)throw Error('Empty slot.');applyCheckpoint(saved);$('saves-dialog').close();notice('Saved adventure restored.');}catch(e){$('saves-notice').textContent='Load failed: '+e.message;}},row);load.disabled=!raw;
  }
}
$('save-manager').addEventListener('click',()=>{if(!engine)return;try{renderSlots();$('saves-notice').textContent='';$('preferences').open=false;$('saves-dialog').showModal();}catch(e){notice('Saves unavailable: '+e.message);}});
$('saves-close').addEventListener('click',()=>$('saves-dialog').close());
$('save-export').addEventListener('click',()=>{if(engine)downloadFile('lantern-depths-adventure.json',JSON.stringify(checkpoint()),'application/json');});
$('transcript-export').addEventListener('click',()=>downloadFile('lantern-depths-journal.txt',history.map(e=>(e.command?'› '+e.command+'\n':'')+e.text).join('\n\n'),'text/plain;charset=utf-8'));
$('save-import').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>MAX_SAVE_BYTES)throw Error('Save is too large.');const raw=await file.text();
    // Validate completely before offering to replace the current session.
    decodeSave(raw,window.ZVM,story,storyHash);
    if(!window.confirm('Load this adventure file? Your current unsaved progress will be replaced.'))return;
    applyCheckpoint(raw);$('saves-dialog').close();notice('Adventure file loaded. Use Save to keep it in this browser.');
  }catch(error){$('saves-notice').textContent='Import failed: '+error.message;}finally{e.target.value='';}
});
$('new').addEventListener('click',()=>{
  if(!story||!window.confirm('Start a new adventure? Your saved game will remain available.'))return;
  undoHistory.clear();commandHistory.reset();engine=new Engine(window.ZVM,story);discovery=new Discovery();discovery.record(null,observation(engine));history=[];selected=null;cancelTarget();$('selection').hidden=true;addEntry('',engine.output);render();notice('A new adventure begins.');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelTarget();notice('');}});
$('sound').addEventListener('click',async()=>{
  $('sound').disabled=true;
  try{const enabled=await sound.toggle();$('sound').textContent=enabled?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(enabled));}
  catch(e){notice(e.message);}finally{$('sound').disabled=false;}
});
const music = new MusicCue((enabled,error) => {
  $('music').textContent=enabled?'Stop music':'Play opening music';
  $('music').setAttribute('aria-pressed',String(enabled));
  if(error) notice(error);
});
void music.autostart();
$('music').addEventListener('click',async()=>{
  $('music').disabled=true;
  try { await music.toggle(); } catch(e) { notice(e.message); }
  finally { $('music').disabled=false; }
});
$('volume').addEventListener('input',e=>{
  const value=Number(e.target.value)/100;
  sound.setVolume(value);music.setVolume(value);
});
$('text-size').addEventListener('change',e=>document.documentElement.style.setProperty('--journal-size',e.target.value+'px'));
$('reduce-motion').checked=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('reduce-motion').addEventListener('change',e=>document.documentElement.classList.toggle('reduce-motion',e.target.checked));
$('journal-toggle').addEventListener('click',()=>{
  const expanded=$('journal-toggle').getAttribute('aria-expanded')!=='true';
  $('journal-toggle').setAttribute('aria-expanded',String(expanded));
  $('journal-body').hidden=!expanded;
});
$('parser-inventory').addEventListener('click',()=>engine&&run('inventory'));
$('parser-help').addEventListener('click',()=>$('help-dialog').showModal());
$('help-close').addEventListener('click',()=>$('help-dialog').close());
start();
