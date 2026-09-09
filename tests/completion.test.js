import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{createRequire}from'node:module';import sharp from'sharp';
import{Engine}from'../src/engine.js';import{scenes}from'../src/scenes.js';import{sceneVariant,worldState}from'../src/world-state.js';import{authoredRooms}from'../src/staging.js';import{layersFor}from'../src/layers.js';import{propStyle}from'../src/props.js';
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js'),route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const make=f=>{let e=new Engine(VM,readFileSync(f));e.vm.xorshift_seed=route.seed;return e;};
const art=(e,id)=>{const el={classList:{add(){}},style:{},dataset:{}};propStyle(e,id,el);return el.dataset.artState;};
test('all 110 rooms have deliberate captions and authored safe placements',()=>{const e=make('public/story-source.z3');let n=0;for(let id=1;id<=250;id++)if(e.parent(id)===39){n++;assert.ok(scenes[id]?.caption?.trim(),e.name(id));assert.ok(authoredRooms.has(id),e.name(id));}assert.equal(n,110);});
test('state artwork and final scene follow exact VM state on both builds, including restore and collapse',()=>{
 for(const f of ['public/story.z3','public/story-source.z3']){
  const e=make(f);let digs=0,coffin=false,egg=false,ending=false;
  for(const c of route.commands){
   assert.equal(e.completed(),ending);
   if(e.state().room===244&&!ending){const s=e.snapshot();e.command('quit');assert.equal(e.completed(),false);e.restore(s);}
   e.command(c);
   if(c==='open coffin'){assert.equal(art(e,179),'coffin-open');coffin=true;const s=e.snapshot();e.command('close coffin');assert.equal(art(e,179),'179');e.restore(s);assert.equal(art(e,179),'coffin-open');}
   if(e.flag(105,11)){assert.equal(art(e,105),'egg-open');egg=true;}
   if(c==='dig sand with shovel'){const depth=worldState(e).excavation;assert.equal(depth,digs++);assert.equal(sceneVariant(e,scenes[155]).cell,Math.min(3,depth+1));if(depth<3)assert.ok(!layersFor(e).some(l=>l.id===126));else{const s=e.snapshot();e.command(c);assert.equal(worldState(e).excavation,-1);assert.ok(e.flag(126,7));e.restore(s);assert.equal(worldState(e).excavation,3);}}
   if(e.completed()){ending=true;assert.equal(sceneVariant(e,scenes[244]).art,'barrow-ending-v1');assert.deepEqual(layersFor(e),[]);const s=e.snapshot(),fresh=make(f);fresh.restore(s);assert.equal(fresh.completed(),true);}
  }
  assert.ok(coffin&&egg&&ending);assert.equal(digs,4);assert.equal(e.state().score,350);
 }
});
test('new sprite assets contain actual alpha, not painted backgrounds',async()=>{for(const id of ['treasure-states-v1','faithful-props-v1','lantern-lit-v1']){const img=sharp(`public/art/${id}.png`);assert.ok((await img.metadata()).hasAlpha);const stats=await img.stats();assert.equal(stats.channels[3].min,0);assert.ok(stats.channels[3].max>250);}});

test('visible-object parser labels work in isolated real discovery states',async()=>{
 const{noun}=await import('../src/interactions.js'),{sceneObjects}=await import('../src/scenes.js');const e=make('public/story-source.z3'),seen=new Set();
 for(const c of route.commands){e.command(c);if(e.vm.quit||e.completed()||!e.lit())continue;
  for(const id of [...sceneObjects(e),...e.inventory().map(x=>x.id)]){const key=id+':'+noun(e,id);if(seen.has(key))continue;seen.add(key);const s=e.snapshot();const response=e.command('examine '+noun(e,id));assert.doesNotMatch(response,/don't know the word|can't see any|don't understand|referring to|isn't clear|doesn't make sense/i,`object ${id}: ${noun(e,id)}`);e.restore(s);}
 }
 assert.ok(seen.size>=90);
});
