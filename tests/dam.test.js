import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
import {Engine} from '../src/engine.js';import {damState,damCaption,damScenes} from '../src/dam-region.js';
import {actionsFor,relations} from '../src/interactions.js';import {sceneObjects} from '../src/scenes.js';
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
function maintenance(){const e=new Engine(createRequire(import.meta.url)('ifvms/src/zvm.js'),readFileSync('public/story.z3'));e.vm.xorshift_seed=route.seed;for(const c of route.commands){e.command(c);if(e.state().room===224)return e;}throw Error('route missed maintenance');}
test('dam controls preserve gate interlock, delayed drainage/refill and hidden treasure',()=>{
 const e=maintenance();assert.equal(damState(e).enabled,false);e.command('take wrench');e.command('s');e.command('s');
 e.command(relations.turn.command('wrench','bolt'));assert.equal(damState(e).gates,false);
 for(const c of ['n','n','push yellow button','s','s'])e.command(c);assert.equal(damState(e).enabled,true);
 e.command('turn bolt with wrench');assert.equal(damState(e).water,'falling');assert.equal(damCaption(e,damScenes[178]).art,'dam-open-high-v1');assert.equal(e.flag(229,7),true);
 const early=e.snapshot();e.command('wait');assert.equal(damState(e).low,false);
 for(let i=0;i<4&&!damState(e).low;i++)e.command('wait');assert.equal(damState(e).water,'low');assert.equal(e.flag(229,7),false);assert.equal(damCaption(e,damScenes[178]).art,'dam-open-low-v1');
 e.command('turn bolt with wrench');assert.equal(damState(e).water,'rising');assert.equal(damCaption(e,damScenes[178]).art,'dam-closed-low-v1');
 for(let i=0;i<5&&damState(e).low;i++)e.command('wait');assert.equal(damState(e).water,'high');assert.equal(e.flag(229,7),true);
 e.restore(early);assert.equal(damState(e).water,'falling');assert.equal(e.flag(229,7),true);
});
test('maintenance buttons, lighting, leak discovery and corroded chests remain VM-owned',()=>{
 const e=maintenance();const clean=e.snapshot();assert.ok(!sceneObjects(e).includes(49));
 assert.ok(actionsFor(e,63).includes('Push'));e.command('push yellow button');assert.equal(damState(e).enabled,true);e.command('push brown button');assert.equal(damState(e).enabled,false);
 e.command('push red button');assert.equal(damState(e).maintenanceLit,true);e.command('turn off lamp');assert.equal(e.lit(),true);e.command('push red button');assert.equal(e.lit(),false);assert.deepEqual(sceneObjects(e),[]);
 e.restore(clean);e.command('push blue button');assert.ok(damState(e).waterLevel>0);assert.ok(sceneObjects(e).includes(49));const wet=e.snapshot();e.command('wait');assert.ok(damState(e).waterLevel>2);e.restore(wet);assert.equal(damState(e).waterLevel,2);
 e.restore(clean);assert.equal(damState(e).leak,false);assert.equal(e.visible(237),true);e.command('take tool chests');assert.equal(e.visible(237),false);
});
