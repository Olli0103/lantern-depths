import {test,expect} from '@playwright/test';import {readFileSync} from 'node:fs';
const route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
async function arrive(p){
 await p.addInitScript(seed=>{let VM;Object.defineProperty(window,'ZVM',{configurable:true,get:()=>VM,set:C=>{VM=function(...a){const v=new C(...a),init=v.init;v.init=function(...b){const r=init.apply(this,b);this.xorshift_seed=seed;return r;};return v;};}});},route.seed);
 await p.goto('/');await expect(p.locator('#location')).toHaveText('West of House');
 for(const c of route.commands){await command(p,c);if(await p.locator('#location').textContent()==='Maintenance Room')return;}
 throw Error('Missing maintenance room');
}
async function picture(p,name){await p.locator('#painting').evaluate(e=>e.decode());await p.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished)));await p.screenshot({path:`test-results/${name}.png`,fullPage:true});}
test('dam image controls, gate timing, variants, save/load and reservoir shore perspective',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:1440,height:1000});await arrive(page);
 await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-maintenance-v1.png');
 const before=await page.locator('#stats').textContent();await page.getByRole('button',{name:'Wall buttons',exact:true}).click();await expect(page.locator('#stats')).toHaveText(before);
 await page.getByRole('button',{name:'Push yellow button',exact:true}).click();await command(page,'take wrench');
 for(const c of ['s','s'])await command(page,c);
 await expect(page.locator('#dam-indicator')).toBeVisible();await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-closed-high-v1.png');
 await page.locator('#inventory').getByRole('button',{name:'wrench',exact:true}).click();await page.getByRole('button',{name:'Turn with…',exact:true}).click();await page.getByRole('button',{name:'Inspect bolt',exact:true}).click();
 await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-open-high-v1.png');await expect(page.locator('#unpainted')).toBeHidden();await page.locator('#save').click();await picture(page,'dam-open-high');
 for(let i=0;i<4;i++)await command(page,'wait');await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-open-low-v1.png');
 await picture(page,'dam-open-low');await command(page,'w');await expect(page.locator('#painting')).toHaveAttribute('src','./art/reservoir-dry-v1.png');await expect(page.locator('#painting')).toHaveCSS('left','0px');await picture(page,'reservoir-south-dry');
 await page.locator('#load').click();await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-open-high-v1.png');
 for(let i=0;i<4;i++)await command(page,'wait');await command(page,'turn bolt with wrench');await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-closed-low-v1.png');
 for(let i=0;i<4;i++)await command(page,'wait');await expect(page.locator('#painting')).toHaveAttribute('src','./art/dam-closed-high-v1.png');
});
test('maintenance controls are touch-sized; hidden leak and darkness do not leak affordances',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:390,height:844});await arrive(page);
 await expect(page.getByRole('button',{name:'Inspect leak',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Wall buttons',exact:true}).click();
 for(const row of await page.locator('.control-row button').all()){const b=await row.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);expect(b.x+b.width).toBeLessThanOrEqual(390);}
 await picture(page,'dam-mobile-controls');await page.getByRole('button',{name:'Push blue button',exact:true}).click();
 await expect(page.getByRole('button',{name:'Inspect leak',exact:true})).toBeVisible();await expect(page.locator('#dam-leak')).toBeVisible();await picture(page,'dam-mobile-leak');
 await page.locator('#undo').click();await expect(page.locator('#dam-leak')).toBeHidden();await expect(page.getByRole('button',{name:'Inspect leak',exact:true})).toHaveCount(0);
 await command(page,'turn off lamp');await expect(page.locator('#location')).toHaveText('Darkness');await expect(page.locator('#hotspots')).toBeEmpty();await expect(page.locator('#object-layers')).toBeEmpty();
 await page.locator('#undo').click();await expect(page.getByRole('button',{name:'Wall buttons',exact:true})).toBeVisible();
});
