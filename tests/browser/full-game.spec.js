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
  await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
  await page.locator('#preferences summary').click();await page.locator('#reduce-motion').check();await page.locator('#preferences summary').click();
  for(let i=0;i<route.commands.length;i++){
    await page.locator('#command').fill(route.commands[i]);await page.locator('#command').press('Enter');
    if((await page.locator('#transcript').textContent()).includes('You have died'))throw Error(`Unexpected test death at command ${i}: ${route.commands[i]}`);
    const room=await page.locator('#location').textContent();
    if(room!=='Darkness'&&!seen.has(room)){
      seen.add(room);await expect(page.locator('#unpainted')).toBeHidden();await page.locator('#painting').evaluate(el=>el.decode());
      if(['Cyclops Room','Reservoir','Machine Room','Up a Tree','Treasure Room'].includes(room))await page.screenshot({path:`test-results/world-${room.replaceAll(' ','-')}.png`,fullPage:true});
    }
    if(i===200){await page.locator('#save').click();await page.reload();await page.locator('#load').click();await expect(page.locator('#notice')).toContainText('restored');}
  }
  await expect(page.locator('#stats')).toContainText('SCORE 350 / 350');
  await expect(page.locator('#transcript')).toContainText('Master Adventurer');
  await expect(page.locator('#command-form button')).toBeDisabled();
  expect(errors).toEqual([]);
});
