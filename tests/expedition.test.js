import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{createRequire}from'node:module';
import {Engine} from '../src/engine.js';import {layersFor} from '../src/layers.js';import {scenes,sceneObjects} from '../src/scenes.js';import {expeditionRooms,expeditionStates} from '../src/expedition.js';import {relations,actionsFor,noun} from '../src/interactions.js';
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const make=()=>{const e=new Engine(createRequire(import.meta.url)('ifvms/src/zvm.js'),readFileSync('public/story.z3'));e.vm.xorshift_seed=route.seed;return e;};
test('expedition scene layers follow the complete real route, local contents, discovery and remote basket',()=>{
 const e=make(),seen=new Set();let remote=false,machine=false,altar=false,pedestal=false,scarab=false,emerald=false;
 for(const c of route.commands){
  e.command(c);const room=e.state().room;if(!expeditionRooms.has(room))continue;seen.add(room);
  assert.ok(scenes[room].caption);const layers=layersFor(e);
  if(!e.lit()){assert.deepEqual(layers,[]);assert.deepEqual(sceneObjects(e),[]);assert.deepEqual(expeditionStates(e),[]);continue;}
  for(const l of layers){if(l.decorative)continue;assert.ok(e.visible(l.id)||l.id===59);assert.ok(!e.carried(l.id));assert.ok(Number.isFinite(l.x)&&Number.isFinite(l.y)&&l.width>0);}
  const book=layers.find(l=>l.id===196);if(room===129&&book&&e.parent(196)===35){assert.equal(book.placement,'altar');altar=true;}
  const torch=layers.find(l=>l.id===12);if(room===18&&torch&&e.parent(12)===79){assert.equal(torch.placement,'pedestal');pedestal=true;}
  if([245,249].includes(room)){
   const basket=layers.find(l=>l.id===203);if(basket){assert.equal(basket.width,8);assert.ok(!layers.some(l=>e.parent(l.id)===108));remote=true;}
  }
  if(room===89){assert.ok(sceneObjects(e).includes(101));assert.equal(noun(e,101),'switch');assert.ok(layers.some(l=>l.id===207));
   if(!e.flag(207,11))assert.ok(!layers.some(l=>e.parent(l.id)===207));
   if(e.visible(192)&&e.parent(192)===207){assert.equal(layers.find(l=>l.id===192)?.placement,'container');machine=true;}
  }
  if(room===155){if(e.flag(126,7))assert.ok(!layers.some(l=>l.id===126));else scarab=true;}
  if(e.visible(119)){if(e.carried(119))assert.ok(!layers.some(l=>l.id===119));emerald=true;}
 }
 assert.ok(seen.size>=30);assert.ok(remote&&machine&&altar&&pedestal&&scarab&&emerald,JSON.stringify({remote,machine,altar,pedestal,scarab,emerald}));assert.equal(e.state().score,350);
});
test('mine and temple actions are parser commands and save restoration preserves candle/basket state',()=>{
 const e=make();let checked=false;
 for(const c of route.commands){
  if(c==='lower basket'){
   const saved=e.snapshot();assert.ok(actionsFor(e,108).includes('Lower'));e.command('lower basket');assert.equal(e.parent(108),249);e.restore(saved);assert.equal(e.parent(108),245);checked=true;
  }
  if(c==='ring bell'){assert.ok(actionsFor(e,83).includes('Ring'));assert.equal(noun(e,83),'bell');}
  e.command(c);
 }
 assert.ok(checked);assert.equal(relations.light.command('match','candles'),'light candles with match');assert.equal(relations.inflate.command('pump','boat'),'inflate boat with pump');
});
