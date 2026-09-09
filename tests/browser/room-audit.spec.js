import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {Engine} from '../../src/engine.js';
import {capture} from '../../src/saves.js';
import {Discovery} from '../../src/discovery.js';
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js');
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
// Start from real route checkpoints and explore with ordinary parser commands.
// No exit-table reads, room teleportation, visibility writes or invented state.
function reachable(){
 const e=new Engine(VM,readFileSync('public/story-source.z3'));e.vm.xorshift_seed=route.seed;
 const queue=[],queued=new Set(),visited=new Set(),states=[];
 for(const c of route.commands){e.command(c);if(!e.vm.quit&&!queued.has(e.state().room)){queued.add(e.state().room);queue.push(e.snapshot());}}
 while(queue.length){const snapshot=queue.shift();e.restore(snapshot);const room=e.state().room;if(visited.has(room))continue;visited.add(room);
  states.push({room,name:e.state().name,lit:e.lit(),save:capture(e,[],new Discovery())});
  for(const direction of ['n','ne','e','se','s','sw','w','nw','up','down','in','out']){
   e.restore(snapshot);if(e.vm.quit)continue;e.command(direction);if(!e.vm.quit&&!visited.has(e.state().room))queue.push(e.snapshot());
  }
 }
 return states;
}
test('all 108 parser-reachable room checkpoints render without duplicate layers or clipped journals',async({page})=>{
 test.setTimeout(120000);const states=reachable();expect(states).toHaveLength(108);
 await page.setViewportSize({width:1440,height:1100});await page.goto('./');await expect(page.locator('#location')).toHaveText('West of House');
 for(const state of states){
  await page.evaluate(save=>localStorage.setItem('lantern-depths.save.v1',JSON.stringify(save)),state.save);await page.locator('#load').click();
  if(!state.lit){await expect(page.locator('#painting')).toBeHidden();await expect(page.locator('#object-layers')).toBeEmpty();continue;}
  await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
  const ids=await page.locator('#object-layers [data-object-id]').evaluateAll(es=>es.map(e=>e.dataset.objectId));expect(new Set(ids).size,`duplicate room ${state.room}`).toBe(ids.length);
  expect(await page.locator('#transcript').evaluate(e=>e.scrollWidth<=e.clientWidth),`journal room ${state.room}`).toBe(true);
  if(state.room===216){await expect(page.locator('[data-object-id="29"]')).toHaveCount(1);expect(await page.locator('[data-object-id="29"]').evaluate(e=>parseFloat(e.style.top))).toBeLessThan(30);}
  await page.locator('#object-layers').evaluate(async root=>{
   const urls=[...new Set([...root.children].map(el=>getComputedStyle(el).backgroundImage).filter(s=>s.startsWith('url(')).map(s=>s.slice(5,-2)))];
   await Promise.all(urls.map(async url=>{const image=new Image();image.src=url;await image.decode();}));
  });
  await page.locator('#scene').screenshot({animations:'disabled',path:`test-results/room-audit-${state.room}.png`});
 }
});
