import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Engine } from '../src/engine.js';
import { sceneObjects } from '../src/scenes.js';
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
