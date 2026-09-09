import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{createRequire}from'node:module';import{createHash}from'node:crypto';
import{Engine}from'../src/engine.js';import{layersFor}from'../src/layers.js';import{sceneObjects}from'../src/scenes.js';import{worldState}from'../src/world-state.js';import{damState}from'../src/dam-region.js';import adapters from '../src/story-adapters.json' with {type:'json'};
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js'),route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const bytes=[readFileSync('vendor/zork1/COMPILED/zork1.z3'),readFileSync('public/story-source.z3')];
const pair=()=>bytes.map(b=>{const e=new Engine(VM,b);e.vm.xorshift_seed=route.seed;return e;});
const sorted=a=>[...a].sort((a,b)=>a-b);
test('source adapter binds exact compiled bytes and is a 250-object bijection',()=>{
 assert.equal(createHash('sha256').update(bytes[1]).digest('hex'),adapters.source.sha256);
 assert.equal(new Set(Object.values(adapters.source.objects)).size,250);
 const[a,b]=pair();for(let id=1;id<=250;id++){
  if(![39,48,61].includes(id))assert.equal(b.name(id),a.name(id),`name ${id}`);
  assert.equal(b.parent(id),a.parent(id),`parent ${id}`);
  for(const bit of Object.keys(adapters.source.flags).map(Number))assert.equal(b.flag(id,bit),a.flag(id,bit),`flag ${id}/${bit}`);
 }
});
test('both builds expose identical full-route world state, visibility and authored layers',()=>{
 const[a,b]=pair();
 for(const c of route.commands){a.command(c);b.command(c);assert.deepEqual(b.state(),a.state(),c);assert.deepEqual(worldState(b),worldState(a),c);assert.deepEqual(damState(b),damState(a),c);assert.equal(b.lit(),a.lit(),c);
  assert.deepEqual(sorted(b.inventory().map(i=>i.id)),sorted(a.inventory().map(i=>i.id)),c);
  assert.deepEqual(sorted(sceneObjects(b)),sorted(sceneObjects(a)),c);
  // Arrays may follow a compiler-specific linked-list order, but identity and
  // derived placement of fixed props must agree. No parser output state guessing.
  assert.deepEqual(layersFor(b),layersFor(a),c);
 }
 assert.equal(b.state().score,350);assert.ok(b.vm.quit);
});
test('source save restores its own engine state and rejects a retail VM snapshot',()=>{
 const[a,b]=pair();for(const c of route.commands.slice(0,90)){a.command(c);b.command(c);}const saved=b.snapshot(),fresh=new Engine(VM,bytes[1]);fresh.restore(saved);assert.equal(fresh.command('look'),b.command('look'));assert.throws(()=>fresh.restore(a.snapshot()),/does not match/);
});
test('paired parser exploration validates ambiguous rooms without reading exit tables',()=>{
 const[a,b]=pair(),queue=[],queued=new Set(),visited=new Set();
 for(const c of route.commands){a.command(c);b.command(c);if(!a.vm.quit&&!queued.has(a.state().room)){queued.add(a.state().room);queue.push([a.snapshot(),b.snapshot()]);}}
 while(queue.length){const[as,bs]=queue.shift();a.restore(as);b.restore(bs);const room=a.state().room;if(visited.has(room))continue;visited.add(room);
  for(const direction of ['n','ne','e','se','s','sw','w','nw','up','down','in','out']){
   a.restore(as);b.restore(bs);if(a.vm.quit||b.vm.quit)continue;a.command(direction);b.command(direction);assert.equal(b.state().room,a.state().room,`${room}/${direction}`);
   if(!a.vm.quit&&!b.vm.quit&&!visited.has(a.state().room))queue.push([a.snapshot(),b.snapshot()]);
  }
 }
 assert.equal(visited.size,108);
});
