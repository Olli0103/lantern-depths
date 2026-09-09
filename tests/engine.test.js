import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Engine } from '../src/engine.js';
import { sceneObjects } from '../src/scenes.js';
import { layersFor } from '../src/layers.js';
import { actionsFor, visualState, changedSounds } from '../src/interactions.js';
const require=createRequire(import.meta.url);
const bytes=readFileSync('vendor/zork1/COMPILED/zork1.z3');
const make=()=>new Engine(require('ifvms/src/zvm.js'),bytes);
const enter=['north','east','open window','west','west'];
const walk=(e,commands)=>commands.forEach(c=>e.command(c));

test('the archived game boots with its original release and location',()=>{
  const e=make();assert.match(e.output,/Release 119 \/ Serial number 880429/);
  assert.deepEqual(e.state(),{room:64,name:'West of House',score:0,turns:0});
});
test('concealed leaflet becomes visible only through the open mailbox',()=>{
  const e=make();assert.ok(!sceneObjects(e).includes(76));
  e.command('open mailbox');assert.ok(sceneObjects(e).includes(76));
  e.command('take leaflet');assert.equal(e.inventory()[0].name,'leaflet');
  assert.ok(!sceneObjects(e).includes(76));
});
test('original engine blocks house entry until the window is open',()=>{
  const e=make();walk(e,['north','east','west']);assert.equal(e.state().room,85);
  walk(e,['open window','west']);assert.equal(e.state().room,27);
});
test('hidden trapdoor is not offered by graphical UI before discovery',()=>{
  const e=make();walk(e,enter);assert.ok(!sceneObjects(e).includes(240));
  e.command('move rug');assert.ok(sceneObjects(e).includes(240));
});
test('original opening route reaches the cellar with light and 35 points',()=>{
  const e=make();walk(e,[...enter,'take lamp','turn on lamp','move rug','open trap door','down']);
  assert.equal(e.state().room,33);assert.equal(e.state().score,35);assert.ok(e.lit());
  e.command('turn off lamp');assert.equal(e.lit(),false);assert.deepEqual(sceneObjects(e),[]);
});
test('a light left in another room does not illuminate the cellar',()=>{
  const e=make();walk(e,[...enter,'turn on lamp','move rug','open trap door','down']);
  assert.equal(e.state().room,33);assert.equal(e.lit(),false);
});
test('save/load restores memory, inventory, moves and parser continuation',()=>{
  const e=make();walk(e,[...enter,'take lamp','move rug']);
  const save=JSON.parse(JSON.stringify(e.snapshot()));const state=e.state();
  const restored=make();restored.restore(save);assert.deepEqual(restored.state(),state);
  assert.equal(restored.inventory()[0].name,'brass lantern');assert.ok(sceneObjects(restored).includes(240));
  walk(restored,['turn on lamp','open trap door','down']);assert.equal(restored.state().room,33);
});
test('mismatched story saves are rejected',()=>{
  const e=make();const save=e.snapshot();save.signature='wrong';assert.throws(()=>e.restore(save),/does not match/);
});
test('source executable is bound to its documented SHA-256',()=>{
  const provenance=JSON.parse(readFileSync('docs/upstream.json','utf8'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),provenance.storySha256);
});

test('illustrated props follow discovery, possession and save restoration',()=>{
  const e=make();walk(e,enter);
  const ids=()=>layersFor(e).map(layer=>layer.id);
  assert.ok(ids().includes(146));assert.ok(!ids().includes(240));
  const save=e.snapshot();
  walk(e,['take lamp','move rug','open trap door']);
  assert.ok(!ids().includes(146));
  assert.equal(layersFor(e).find(layer=>layer.id===240).index,7);
  assert.equal(layersFor(e).find(layer=>layer.id===55).moved,true);
  e.restore(save);assert.ok(ids().includes(146));assert.ok(!ids().includes(240));
  walk(e,['take lamp','drop lamp']);
  assert.equal(layersFor(e).find(layer=>layer.id===146).y,90);
});
test('opening a closed mailbox changes actions and only successful changes produce effects',()=>{
  const e=make();const before=visualState(e);
  assert.ok(actionsFor(e,230).includes('Open'));assert.ok(!actionsFor(e,230).includes('Take'));
  e.command('open mailbox');const open=visualState(e);
  assert.deepEqual(changedSounds(before,open),['wood']);
  assert.ok(actionsFor(e,230).includes('Close'));assert.ok(!actionsFor(e,230).includes('Open'));
  e.command('open mailbox');assert.deepEqual(changedSounds(open,visualState(e)),[]);
});
test('returning a leaflet to the mailbox and closing it hides the artwork',()=>{
  const e=make();walk(e,['open mailbox','take leaflet','put leaflet in mailbox']);
  assert.ok(layersFor(e).some(layer=>layer.id===76));
  e.command('close mailbox');assert.ok(!layersFor(e).some(layer=>layer.id===76));
});

// Fixed seeds belong only to tests: shipping combat keeps the VM's randomness.
import { trollState } from '../src/encounters.js';
import { ambienceFor, scenes } from '../src/scenes.js';
const descend=[...enter,'take lamp','take sword','turn on lamp','move rug','open trap door','down'];
test('underground route, acoustics and concealment follow the original world',()=>{
  const e=make();walk(e,descend);e.command('south');
  assert.equal(e.state().room,247);assert.equal(scenes[247].art,'east-chasm');
  assert.equal(ambienceFor(e),'chasm');e.command('turn off lamp');
  assert.equal(ambienceFor(e),'chasm');assert.deepEqual(layersFor(e),[]);assert.deepEqual(sceneObjects(e),[]);
  e.command('turn on lamp');assert.equal(e.lit(),true);e.command('north');assert.equal(e.state().room,33);
});
test('troll knockout artwork and save continuation come from signed VM strength',()=>{
  const e=make();e.vm.xorshift_seed=2;walk(e,[...descend,'north']);
  assert.equal(trollState(e),'armed');e.command('attack troll with sword');
  assert.equal(trollState(e),'unconscious');assert.equal(e.parent(36),127);
  assert.ok(layersFor(e).some(x=>x.id===150&&x.encounter==='unconscious'));
  const restored=make();restored.restore(JSON.parse(JSON.stringify(e.snapshot())));
  assert.equal(trollState(restored),'unconscious');assert.deepEqual(layersFor(restored),layersFor(e));
  restored.command('east');assert.equal(restored.state().room,130);assert.equal(trollState(restored),null);
});
test('a defeated troll is absent, its dropped axe remains, and the passage opens',()=>{
  const e=make();e.vm.xorshift_seed=1;walk(e,[...descend,'north','attack troll with sword']);
  assert.equal(e.parent(150),0);assert.equal(trollState(e),null);
  assert.ok(!layersFor(e).some(x=>x.id===150));assert.ok(layersFor(e).some(x=>x.id===36));
  e.command('take axe');assert.ok(!layersFor(e).some(x=>x.id===36));
  e.command('east');assert.equal(e.state().room,130);assert.equal(scenes[130].art,'east-west-passage-v2');
});
