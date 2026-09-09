import {test,expect} from '@playwright/test';import{readFileSync}from'node:fs';
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
async function shot(p,name){await p.locator('#painting').evaluate(e=>e.decode());await p.screenshot({path:`test-results/expedition-${name}.png`,fullPage:true});}
test('temple, river, mine and endgame retain direct interaction, state art and save recovery',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:1440,height:1000});
 await page.addInitScript(seed=>{let VM;Object.defineProperty(window,'ZVM',{configurable:true,get:()=>VM,set:C=>{VM=function(...a){const v=new C(...a),init=v.init;v.init=function(...b){const r=init.apply(this,b);this.xorshift_seed=seed;return r;};return v;};}});},route.seed);
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 await page.locator('#preferences summary').click();await page.locator('#reduce-motion').check();await page.locator('#preferences summary').click();
 const seen=new Set();
 for(const c of route.commands){
  if(c==='lower basket'){
   await page.locator('#object-layers [data-object-id="108"]').click();await page.getByRole('button',{name:'Lower',exact:true}).click();
   await expect(page.locator('#scene-state')).toContainText('at the other end');await expect(page.locator('#object-layers [data-object-id="203"]')).toHaveCSS('width',/px/);
   await page.locator('#undo').click();await expect(page.locator('#scene-state')).toContainText('within reach');
  }
  await command(page,c);
  const room=await page.locator('#scene').getAttribute('data-room');
  if(['129','18','89','245','249','155','82'].includes(room)&&!seen.has(room)){
   seen.add(room);await shot(page,room);
  }
  if(c==='extinguish candles')await expect(page.locator('[data-art-state="candles-lit"]')).toHaveCount(0);
  if(c==='light candles with match'){
   await expect(page.locator('#inventory [data-art-state="candles-lit"]')).toHaveCount(1);
   await page.locator('#save').click();await command(page,'extinguish candles');await page.locator('#load').click();
   await expect(page.locator('#inventory [data-art-state="candles-lit"]')).toHaveCount(1);
  }
  if(c==='open machine'){
   await expect(page.locator('#object-layers [data-object-id="207"]')).toHaveAttribute('data-art-state','machine-open');
   await page.getByRole('button',{name:'Inspect switch',exact:true}).focus();await expect(page.getByRole('button',{name:'Inspect switch',exact:true})).toBeFocused();
   await shot(page,'machine-open');
  }
  if(c==='close machine')await expect(page.locator('#object-layers [data-object-id="192"]')).toHaveCount(0);
  if(c==='open buoy')await expect(page.locator('#object-layers [data-object-id="119"]')).toHaveCount(0);
  if(c==='take book'){
   await page.setViewportSize({width:390,height:844});await page.locator('#inventory [data-select-id="26"]').click();
   const before=await page.locator('#stats').textContent();await expect(page.getByRole('button',{name:'Light with…',exact:true})).toBeVisible();await expect(page.locator('#stats')).toHaveText(before);
   await shot(page,'mobile-altar');await page.setViewportSize({width:1440,height:1000});
  }
 }
 await expect(page.locator('#stats')).toContainText('SCORE 350 / 350');expect(seen.size).toBe(7);
});
