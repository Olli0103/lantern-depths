import { test, expect } from '@playwright/test';
const command=async(page,text)=>{await page.locator('#command').fill(text);await page.locator('#command').press('Enter');};
test('gallery treasure, readable manual, close-ups and discovery map',async({page})=>{
  await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
  await page.locator('#map').click();await expect(page.locator('#map-content')).not.toContainText('Gallery');await page.locator('#map-close').click();
  for(const c of ['n','e','open window','w','w','take lamp','take sword','turn on lamp','move rug','open trap door','d','s','e'])await command(page,c);
  await expect(page.locator('#location')).toHaveText('Gallery');
  await page.locator('[data-object-id="92"]').click();await page.getByRole('button',{name:'Examine',exact:true}).click();
  await expect(page.locator('#detail')).toBeVisible();await expect(page.locator('#detail-art')).toHaveAttribute('data-art-state','intact');await page.locator('#detail-close').click();
  await command(page,'take painting');await expect(page.locator('[data-object-id="92"]')).toHaveCount(0);
  await command(page,'drop painting');await command(page,'destroy painting with sword');
  await expect(page.locator('[data-object-id="92"]')).toHaveAttribute('data-art-state','damaged');
  await command(page,'n');await expect(page.locator('#location')).toHaveText('Studio');
  await page.locator('#objects').getByRole('button',{name:"ZORK owner's manual",exact:true}).click();
  await page.getByRole('button',{name:'Read',exact:true}).click();await expect(page.locator('#detail-text')).toContainText('self-maintaining universe');await page.keyboard.press('Escape');
  await page.locator('#save').click();await page.reload();await page.locator('#load').click();
  await page.locator('#map').click();await expect(page.locator('#map-content')).toContainText('Gallery');await expect(page.locator('#map-content')).toContainText('Studio');await expect(page.locator('#map-content')).not.toContainText('Atlantis');await page.locator('#map-close').click();
  await page.locator('#painting').evaluate(el=>el.decode());await page.screenshot({path:'test-results/studio.png',fullPage:true});
});
