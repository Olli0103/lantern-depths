import {test,expect} from '@playwright/test';
const command=async(page,c)=>{await page.locator('#command').fill(c);await page.locator('#command').press('Enter');};
const ready=page=>expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
test('leaves move beside the grating, can be carried away, dropped and undone',async({page})=>{
 await page.goto('./');await expect(page.locator('#location')).toHaveText('West of House');
 for(const c of ['n','n','n'])await command(page,c);
 await ready(page);const leaves=page.locator('[data-object-id="157"]'),grate=page.locator('[data-object-id="29"]');
 await expect(leaves).toHaveAttribute('data-placement','covering-grating');await expect(grate).toHaveCount(0);
 await page.locator('#objects [data-select-id="157"]').click();await page.getByRole('button',{name:'Move',exact:true}).click();
 await expect(leaves).toHaveAttribute('data-placement','beside-grating');await expect(grate).toHaveCount(1);
 const l=await leaves.boundingBox(),g=await grate.boundingBox();expect(l.x+l.width).toBeLessThan(g.x);
 await leaves.click();await page.getByRole('button',{name:'Take',exact:true}).click();await expect(leaves).toHaveCount(0);await expect(page.locator('#inventory')).toContainText('leaves');
 await command(page,'s');await command(page,'drop leaves');await ready(page);await expect(leaves).toHaveCount(1);await expect(leaves).toHaveAttribute('data-placement','floor');
 await page.locator('#undo').click();await expect(leaves).toHaveCount(0);
 await command(page,'n');await command(page,'drop leaves');await ready(page);await expect(leaves).toHaveAttribute('data-placement','beside-grating');
 await page.locator('#save').click();await page.reload();await page.locator('#load').click();await ready(page);await expect(leaves).toHaveAttribute('data-placement','beside-grating');
 await page.screenshot({path:'test-results/regression-leaves.png',fullPage:true});
});
test('delayed atlas to hero change never shows previous pixels under new geometry',async({page})=>{
 await page.setViewportSize({width:375,height:844});
 await page.goto('./');await ready(page);for(const c of ['n','n'])await command(page,c);await ready(page);
 let release;const gate=new Promise(r=>release=r);await page.route('**/art/webp/north-house*',async route=>{await gate;await route.continue();});
 // Route interception disables HTTP cache. Resizing requests the uncached
 // full-resolution hero, giving deterministic control over its completion.
 await page.setViewportSize({width:1700,height:1100});await command(page,'s');
 await expect(page.locator('#scene')).toHaveAttribute('data-painting','loading');
 await expect(page.locator('#painting')).toHaveCSS('visibility','hidden');await expect(page.locator('#object-layers')).toHaveCSS('visibility','hidden');
 await command(page,'w');release();await ready(page);await expect(page.locator('#location')).toHaveText('West of House');
 await expect(page.locator('#painting')).toHaveAttribute('src',/west-house.png/);expect(await page.locator('#painting').evaluate(e=>Math.abs(e.getBoundingClientRect().width-document.querySelector('#scene').getBoundingClientRect().width))).toBeLessThan(1);
 await page.screenshot({path:'test-results/regression-room-swap.png',fullPage:true});
});
test('journal wraps and exposes the start and end of long entries at every layout size',async({page})=>{
 await page.goto('./');await ready(page);await command(page,'n');await command(page,'e');
 for(const width of [360,390,768,880,1100,1440,1800]){
  await page.setViewportSize({width,height:900});await page.locator('#preferences summary').click();await page.locator('#text-size').selectOption('21');await page.locator('#preferences summary').click();await command(page,'look');
  const log=page.locator('#transcript');if(await page.locator('#journal-body').isHidden())await page.locator('#journal-toggle').click();await log.scrollIntoViewIfNeeded();
  const measurements=await log.evaluate(e=>{const p=e.lastElementChild,r=p.getBoundingClientRect(),l=e.getBoundingClientRect();return{overflow:e.scrollWidth-e.clientWidth,documentOverflow:document.documentElement.scrollWidth-innerWidth,start:r.top-l.top,end:r.bottom-l.bottom,scroll:e.scrollTop,height:r.height,viewport:l.height};});
  expect(measurements.overflow).toBeLessThanOrEqual(1);expect(measurements.documentOverflow).toBeLessThanOrEqual(1);expect(measurements.start).toBeGreaterThanOrEqual(-1);if(measurements.height>=measurements.viewport)expect(measurements.start).toBeLessThanOrEqual(16);
  await log.evaluate(e=>e.scrollTop=e.scrollHeight);expect(await log.evaluate(e=>e.lastElementChild.getBoundingClientRect().bottom<=e.getBoundingClientRect().bottom)).toBe(true);
  await page.screenshot({path:`test-results/regression-journal-${width}.png`,fullPage:true});
 }
});
