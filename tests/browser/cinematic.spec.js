import {test,expect} from '@playwright/test';

test('desktop cinematic composition, keyboard selection and journal folding retain parser',async({page})=>{
 await page.setViewportSize({width:1600,height:1100});await page.goto('/');
 await expect(page.locator('#location')).toHaveText('West of House');
 const ratio=await page.evaluate(()=>document.querySelector('.world').getBoundingClientRect().width/document.querySelector('.layout').getBoundingClientRect().width);
 expect(ratio).toBeGreaterThan(.74);expect(ratio).toBeLessThan(.80);
 const stats=await page.locator('#stats').innerText();
 const mailbox=page.getByRole('button',{name:'Inspect small mailbox',exact:true});
 await page.keyboard.press('Tab');await mailbox.focus();
 await expect.poll(()=>mailbox.evaluate(e=>getComputedStyle(e,'::after').opacity)).toBe('1');
 await page.keyboard.press('Enter');
 await expect(page.locator('#verbs button').first()).toBeFocused();
 await page.getByRole('button',{name:'Open',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(page.locator('#objects')).toContainText('leaflet');
 await expect(page.locator('#verbs button').first()).toBeFocused();
 await page.locator('#journal-toggle').click();await expect(page.locator('#transcript')).toBeHidden();
 await expect(page.locator('#command')).toBeVisible();
 await page.locator('#command').fill('take leaflet');await page.locator('#command').press('Enter');
 await expect(page.locator('#inventory')).toContainText('leaflet');
 await expect(page.locator('#inventory .inventory-icon')).toBeVisible();
 await page.locator('#journal-toggle').click();await expect(page.locator('#transcript')).toContainText('take leaflet');
 const beforeHelp=await page.locator('#stats').innerText();await page.locator('#parser-help').click();await expect(page.locator('#help-dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.locator('#help-dialog')).toBeHidden();await expect(page.locator('#stats')).toHaveText(beforeHelp);
 expect(beforeHelp).not.toBe(stats);
 await page.setViewportSize({width:1800,height:1000});
 const parser=await page.locator('#command-form').boundingBox();
 expect(parser.y+parser.height).toBeLessThanOrEqual(1000);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('mobile is scene then interactions, with reachable parser and unobscured settings',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 const boxes=await page.evaluate(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right}};return {scene:r('.scene-card'),nearby:r('.reach-panel'),journal:r('.journal-card'),parser:r('#command-form'),width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth};});
 expect(boxes.nearby.top).toBeGreaterThanOrEqual(boxes.scene.bottom);expect(boxes.journal.top).toBeGreaterThan(boxes.nearby.bottom);
 expect(boxes.parser.bottom).toBeLessThanOrEqual(boxes.height);expect(boxes.scroll).toBeLessThanOrEqual(boxes.width);
 await page.locator('#preferences summary').click();await expect(page.locator('#music')).toBeVisible();
 const panel=await page.locator('.settings-panel').boundingBox();expect(panel.x).toBeGreaterThanOrEqual(0);expect(panel.x+panel.width).toBeLessThanOrEqual(390);
 await page.locator('#preferences summary').click();
 await page.getByRole('button',{name:'Inspect small mailbox',exact:true}).click();await page.getByRole('button',{name:'Open',exact:true}).click();
 await expect(page.locator('#objects')).toContainText('leaflet');await page.locator('#command').fill('take leaflet');await page.locator('#command').press('Enter');await expect(page.locator('#inventory')).toContainText('leaflet');
});
