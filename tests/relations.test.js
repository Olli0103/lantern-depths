import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
import {Engine} from '../src/engine.js';import {relations,relationsFor} from '../src/interactions.js';
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js');
const builds=[readFileSync('vendor/zork1/COMPILED/zork1.z3'),readFileSync('public/story-source.z3')];
const labels=(engine,id)=>relationsFor(engine,id).map(([key])=>key);
const byName=(engine,name)=>{for(let id=1;id<=250;id++)if(engine.name(id)===name)return id;throw Error(name);};

test('grammar-required flags gate item relations identically on both builds, without solving anything',()=>{
 for(const bytes of builds){
  const e=new Engine(VM,bytes);
  const leaflet=byName(e,'leaflet'),sword=byName(e,'sword'),candles=byName(e,'pair of candles'),wrench=byName(e,'wrench'),key=byName(e,'skeleton key'),match=byName(e,'matchbook');
  assert.deepEqual(labels(e,leaflet),['tie','in','on','give'],'a leaflet is neither flame, tool nor weapon');
  assert.ok(labels(e,sword).includes('attack')&&!labels(e,sword).includes('light'));
  assert.ok(labels(e,candles).includes('light')&&!labels(e,candles).includes('attack'));
  for(const tool of [wrench,key])for(const rel of ['dig','unlock','inflate','turn'])assert.ok(labels(e,tool).includes(rel),`${e.name(tool)} ${rel}`);
  // The bit is read live: an unlit matchbook offers no light relation until the engine lights it.
  assert.ok(!labels(e,match).includes('light'));
  // Every relation still yields the same parser sentence as before.
  assert.equal(relations.attack.command('sword','troll'),'attack troll with sword');
  assert.equal(relations.light.command('match','candles'),'light candles with match');
 }
});
test('grammar flag sets are identical across builds for every object',()=>{
 const [a,b]=builds.map(x=>new Engine(VM,x));
 for(const bit of [25,28,29])for(let id=1;id<=250;id++)assert.equal(b.flag(id,bit),a.flag(id,bit),`${id}/${bit}`);
 assert.equal([...Array(251).keys()].filter(id=>id&&a.flag(id,29)).length,6,'six weapons in release 119');
});
