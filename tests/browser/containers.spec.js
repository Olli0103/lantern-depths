import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
test('container artwork updates in place, on hover, in inventory and when dropped',async({page})=>{
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 for(const c of ['n','e','open window','in'])await command(page,c);
 const sack=page.locator('#object-layers [data-object-id="99"]');
 await expect(sack).toHaveAttribute('data-art-state','sack-closed');
 await command(page,'open sack');await expect(sack).toHaveAttribute('data-art-state','sack-open');
 await sack.hover();expect(await sack.evaluate(e=>getComputedStyle(e).backgroundImage)).toContain('container-states-v1');
 await command(page,'close sack');await expect(sack).toHaveAttribute('data-art-state','sack-closed');
 expect(await sack.evaluate(e=>getComputedStyle(e).backgroundImage)).toContain('objects-atlas');
 await command(page,'take bottle');const bottle=page.locator('#inventory [data-art-state^="bottle-"]');
 await expect(bottle).toHaveAttribute('data-art-state','bottle-full-closed');
 await command(page,'open bottle');await expect(bottle).toHaveAttribute('data-art-state','bottle-full-open');
 await command(page,'drink water');await expect(bottle).toHaveAttribute('data-art-state','bottle-empty-open');
 await command(page,'close bottle');await expect(bottle).toHaveAttribute('data-art-state','bottle-empty-closed');
 await command(page,'drop bottle');await expect(page.locator('#object-layers [data-object-id="138"]')).toHaveAttribute('data-art-state','bottle-empty-closed');
});
