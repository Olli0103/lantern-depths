import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
test('one responsive shell preserves controls, readable journal, compact sheets and game state',async({page})=>{
 await page.goto('./');await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
 for(const width of [1800,1600,1440,1024,768,430,390,375]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const id of ['scene','painting','objects','inventory','selection','transcript','command-form','save','load'])await expect(page.locator('#'+id)).toHaveCount(1);
  const scene=await page.locator('#scene').boundingBox();expect(Math.abs(scene.width/scene.height-1.5)).toBeLessThan(.01);
  const dock=await page.locator('#command-form').boundingBox();expect(dock.y+dock.height).toBeLessThanOrEqual(901);
  if(width<=760){
   const header=await page.locator('.masthead').boundingBox();expect(header.height).toBeLessThanOrEqual(64);
   await page.locator('#preferences summary').click();await expect(page.locator('#save')).toBeVisible();await expect(page.locator('#load')).toBeVisible();await page.locator('#preferences summary').click();
   await page.locator('#objects [data-select-id="230"]').click();
   const sheet=page.locator('#scene-actions');await expect(sheet).toBeVisible();await page.waitForTimeout(180);
   const r=await sheet.boundingBox();expect(r.y).toBeGreaterThanOrEqual(scene.y+scene.height);expect(r.y+r.height).toBeLessThanOrEqual(dock.y);expect(r.height).toBeLessThan(220);
   for(const b of await sheet.locator('button:visible').all())expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
   await page.keyboard.press('Escape');await expect(sheet).toBeHidden();
  }
 }
 await command(page,'open mailbox');await expect(page.locator('#objects')).toContainText('leaflet');
 await page.locator('#journal-toggle').click();await expect(page.locator('#transcript')).toBeVisible();await expect(page.locator('#transcript')).toContainText('leaflet');await expect(page.locator('#command')).toBeVisible();await page.locator('#journal-close').click();
 await page.locator('#preferences summary').click();await page.locator('#save').click();await page.locator('#preferences summary').click();await command(page,'n');
 await page.locator('#preferences summary').click();await page.locator('#load').click();await page.locator('#preferences summary').click();await expect(page.locator('#location')).toHaveText('West of House');await expect(page.locator('#objects')).toContainText('leaflet');
 await page.setViewportSize({width:844,height:390});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('#command')).toBeVisible();
});
