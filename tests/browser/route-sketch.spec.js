import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
test('route sketch has only traversed arrows, keyboard notes, zoom and no game turns',async({page})=>{
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');for(const c of ['n','e'])await command(page,c);const stats=await page.locator('#stats').textContent();
 await page.locator('#map').click();await expect(page.locator('.journey-node')).toHaveCount(3);await expect(page.locator('.journey-edge')).toHaveCount(2);await expect(page.locator('.journey-node.current')).toHaveAttribute('data-room-id','85');
 await page.getByRole('button',{name:'Zoom in map',exact:true}).click();await expect(page.locator('#stats')).toHaveText(stats);
 const west=page.locator('.journey-node[data-room-id="64"]');await west.focus();await page.keyboard.press('Enter');await expect(page.locator('[data-notes-id="64"]')).toBeFocused();await expect(page.locator('#stats')).toHaveText(stats);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/route-sketch-mobile.png',fullPage:true});
 await page.locator('#map-close').click();await page.locator('#undo').click();await page.locator('#map').click();await expect(page.locator('.journey-node')).toHaveCount(2);await expect(page.locator('.journey-edge')).toHaveCount(1);
});
