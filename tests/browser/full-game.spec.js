import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json','utf8'));
test('complete 350-point adventure through browser with mid-game save/reload',async({page})=>{
  test.setTimeout(120000);
  // Test-only deterministic VM seed. No seeded mode is exposed in the shipped UI.
  await page.addInitScript(seed=>{
    let VM;
    Object.defineProperty(window,'ZVM',{configurable:true,get:()=>VM,set:C=>{VM=function(...args){const vm=new C(...args),init=vm.init;vm.init=function(...a){const result=init.apply(this,a);this.xorshift_seed=seed;return result;};return vm;};}});
  },route.seed);
  const errors=[],seen=new Set();page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&/\/art\//.test(r.url()))errors.push(`Asset ${r.status()}: ${r.url()}`);});
  await page.setViewportSize({width:1440,height:1100});
  await page.goto('./');await expect(page.locator('#location')).toHaveText('West of House');
  await page.locator('#preferences summary').click();await page.locator('#reduce-motion').check();await page.locator('#preferences summary').click();
  let beforeEnding;
  for(let i=0;i<route.commands.length;i++){
    if(i===route.commands.length-2)beforeEnding={location:await page.locator('#location').textContent(),journal:await page.locator('#transcript').textContent()};
    await page.locator('#command').fill(route.commands[i]);await page.locator('#command').press('Enter');
    if((await page.locator('#transcript').textContent()).includes('You have died'))throw Error(`Unexpected test death at command ${i}: ${route.commands[i]}`);
    const room=await page.locator('#location').textContent();
    if(room!=='Darkness') await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
    const display=await page.evaluate(()=>{
      const scene=document.querySelector('#scene').getBoundingClientRect();
      const objects=[...document.querySelectorAll('#object-layers [data-object-id]')];
      const ids=objects.map(e=>e.dataset.objectId);
      const inventory=[...document.querySelectorAll('#inventory [data-select-id]')].map(e=>e.dataset.selectId);
      return {duplicate:ids.filter((id,i)=>ids.indexOf(id)!==i),carried:ids.filter(id=>inventory.includes(id)),
        offscreen:objects.filter(e=>{const r=e.getBoundingClientRect();return r.right<scene.left||r.left>scene.right||r.bottom<scene.top||r.top>scene.bottom}).map(e=>e.dataset.objectId),
        overflow:document.documentElement.scrollWidth-innerWidth,journal:document.querySelector('#transcript').scrollWidth-document.querySelector('#transcript').clientWidth};
    });
    expect(display,`visual state after ${i}: ${route.commands[i]}`).toEqual({duplicate:[],carried:[],offscreen:[],overflow:0,journal:0});
    if(room!=='Darkness'&&!seen.has(room)){
      seen.add(room);await expect(page.locator('#unpainted')).toBeHidden();await page.locator('#painting').evaluate(el=>el.decode());
      // Exercise real click selection, not DOM presence alone, for every
      // newly encountered room. Nearby is the explicit accessible fallback
      // for packed shelves; direct unobscured scene targets are clicked too.
      for(const target of await page.locator('#hotspots [data-select-id],#object-layers button').all()){
        const point=await target.evaluate(el=>{const r=el.getBoundingClientRect();for(const [x,y] of [[.5,.5],[.25,.5],[.75,.5],[.5,.25],[.5,.75]]){const px=r.x+r.width*x,py=r.y+r.height*y;if(document.elementFromPoint(px,py)?.closest('[data-select-id],button')===el)return{x:px,y:py};}return null;});
        if(!point)continue;
        await page.mouse.click(point.x,point.y);await expect(page.locator('#selection')).toBeVisible();await expect(page.locator('#verbs button').first()).toBeVisible();await page.keyboard.press('Escape');
      }
      for(const target of await page.locator('#objects [data-select-id]').all()){
        await target.click();await expect(page.locator('#selection')).toBeVisible();await expect(page.locator('#verbs button').first()).toBeVisible();
      }
      await page.locator('#scene').scrollIntoViewIfNeeded();
      await page.screenshot({animations:'disabled',path:`test-results/world-${room.replaceAll(' ','-')}.png`,fullPage:true});
    }
    if(i===200){await page.locator('#save').click();await page.reload();await page.locator('#load').click();await expect(page.locator('#notice')).toContainText('restored');}
  }
  await expect(page.locator('#stats')).toContainText('SCORE 350 / 350');
  await expect(page.locator('#transcript')).toContainText('Master Adventurer');
  await expect(page.locator('#command-form button')).toHaveCount(4);
  await expect(page.locator('#undo')).toBeEnabled();
  for(const control of await page.locator('#command-form button:not(#undo)').all()) await expect(control).toBeDisabled();
  await page.locator('#undo').click();
  await expect(page.locator('#command-form button[type=submit]')).toBeEnabled();
  await page.locator('#undo').click();
  await expect(page.locator('#location')).toHaveText(beforeEnding.location);
  await expect(page.locator('#transcript')).toHaveText(beforeEnding.journal);
  expect(errors).toEqual([]);
});
