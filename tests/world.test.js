import test from 'node:test';
import assert from 'node:assert/strict';
import{createRequire}from'node:module';
import{readFileSync,existsSync}from'node:fs';
import{createHash}from'node:crypto';
import{Engine}from'../src/engine.js';
import{scenes,sceneObjects}from'../src/scenes.js';
import{worldState,sceneVariant}from'../src/world-state.js';
import{propLayers}from'../src/props.js';
const make=()=>new Engine(createRequire(import.meta.url)('ifvms/src/zvm.js'),readFileSync('vendor/zork1/COMPILED/zork1.z3'));
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
test('asset manifest has unique names and matches the shipped bytes',()=>{
 const assets=JSON.parse(readFileSync('docs/art-manifest.json')),seen=new Set();
 for(const asset of assets){assert.ok(!seen.has(asset.file));seen.add(asset.file);assert.equal(createHash('sha256').update(readFileSync(asset.file)).digest('hex'),asset.sha256,asset.file);}
});
test('every original room has a present environment asset, no player-object button',()=>{
 const e=make();let count=0;for(let id=1;id<=250;id++)if(e.parent(id)===39){count++;assert.ok(scenes[id],`${id} ${e.name(id)}`);assert.ok(existsSync(`public/art/${scenes[id].art}.png`));}
 assert.equal(count,110);assert.ok(!sceneObjects(e).includes(44));
});
test('parser-only winning route validates stateful world presentation and hidden treasure',()=>{
 const e=make();e.vm.xorshift_seed=route.seed;let drained=false,mirrored=false,rope=false,rainbow=false;
 assert.equal(worldState(e).mirrorBroken,false);assert.equal(worldState(e).rainbow,false);assert.equal(worldState(e).cyclopsSleeping,false);
 for(const c of route.commands){
  if(c==='touch mirror'&&!mirrored){const save=e.snapshot();const out=e.command('throw garlic at mirror');assert.match(out,/broken the mirror/);assert.equal(sceneVariant(e,scenes[e.state().room]).cell,1);e.restore(save);assert.equal(worldState(e).mirrorBroken,false);mirrored=true;}
  e.command(c);const s=worldState(e);
  if(c==='odysseus'){assert.equal(s.cyclopsPassage,true);assert.ok(!propLayers(e).some(x=>x.id===199));}
  if(c==='tie rope to railing'){assert.equal(s.ropeTied,true);rope=true;}
  if(c==='wave sceptre'){assert.equal(s.rainbow,true);rainbow=true;}
  if([95,123,191].includes(e.state().room)&&s.drained){assert.equal(sceneVariant(e,scenes[e.state().room]).cell,3);drained=true;}
  for(const layer of propLayers(e))if(!layer.decorative&&![29,59].includes(layer.id))assert.ok(e.visible(layer.id),`hidden prop ${layer.id}`);
 }
 assert.ok(drained&&mirrored&&rope&&rainbow);assert.equal(e.state().score,350);assert.equal(e.vm.quit,true);
});
