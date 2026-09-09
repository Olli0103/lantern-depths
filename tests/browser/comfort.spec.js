import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
const saves=async p=>{await p.locator('#preferences summary').click();await p.locator('#save-manager').click();};

test('Undo restores discoveries, hidden objects, journal and command history draft',async({page})=>{
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');await expect(page.locator('#undo')).toBeDisabled();
 await command(page,'open mailbox');await expect(page.locator('#objects')).toContainText('leaflet');await page.locator('#undo').click();await expect(page.locator('#objects')).not.toContainText('leaflet');await expect(page.locator('#transcript')).not.toContainText('open mailbox');
 await command(page,'north');await page.locator('#map').click();await expect(page.locator('#map-content')).toContainText('North of House');await page.keyboard.press('Escape');await page.locator('#undo').click();await expect(page.locator('#location')).toHaveText('West of House');await page.locator('#map').click();await expect(page.locator('#map-content')).not.toContainText('North of House');await page.keyboard.press('Escape');
 await page.locator('#command').fill('examine ');await page.locator('#command').press('ArrowUp');await expect(page.locator('#command')).toHaveValue('north');await page.locator('#command').press('ArrowDown');await expect(page.locator('#command')).toHaveValue('examine ');await expect(page.locator('#location')).toHaveText('West of House');
});
test('save slots, portable export/import, invalid-file rejection and legacy quick saves coexist',async({page})=>{
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');await page.locator('#save').click();
 await command(page,'north');await saves(page);await page.locator('#slot-name-1').fill('Forest expedition');await page.locator('.save-slot').first().getByRole('button',{name:'Save here',exact:true}).click();
 const downloadPromise=page.waitForEvent('download');await page.locator('#save-export').click();const download=await downloadPromise;const path=await download.path();expect(download.suggestedFilename()).toBe('lantern-depths-adventure.json');
 const journalPromise=page.waitForEvent('download');await page.locator('#transcript-export').click();expect((await journalPromise).suggestedFilename()).toBe('lantern-depths-journal.txt');
 await page.locator('#saves-close').click();await page.locator('#load').click();await expect(page.locator('#location')).toHaveText('West of House');await saves(page);
 await page.locator('#save-import').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});await expect(page.locator('#saves-notice')).toContainText('Import failed');await expect(page.locator('#location')).toHaveText('West of House');
 page.once('dialog',d=>d.accept());await page.locator('#save-import').setInputFiles(path);await expect(page.locator('#location')).toHaveText('North of House');await expect(page.locator('#saves-dialog')).toBeHidden();await expect(page.locator('#undo')).toBeDisabled();
 await page.reload();await expect(page.locator('#location')).toHaveText('West of House');await saves(page);await expect(page.locator('#slot-name-1')).toHaveValue('Forest expedition');await page.locator('.save-slot').first().getByRole('button',{name:'Load adventure',exact:true}).click();await expect(page.locator('#location')).toHaveText('North of House');
 // Old format is still accepted, independently of named slots.
 await page.evaluate(()=>{const key='lantern-depths.save.v1',s=JSON.parse(localStorage.getItem(key));localStorage.setItem(key,JSON.stringify({engine:s.engine,history:s.history,discovery:s.discovery}));});await page.locator('#load').click();await expect(page.locator('#location')).toHaveText('West of House');
});
test('mobile actually decodes a smaller WebP and keeps Undo and save dialog reachable',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 await page.locator('#painting').evaluate(i=>i.decode());const src=await page.locator('#painting').evaluate(i=>i.currentSrc);expect(src).toContain('/webp/west-house-768.webp');
 const response=await page.request.get(src);expect(response.headers()['content-type']).toContain('image/webp');expect((await response.body()).length).toBeLessThan(400_000);
 await command(page,'open mailbox');await page.locator('#undo').click();await expect(page.locator('#objects')).not.toContainText('leaflet');
 await saves(page);await expect(page.locator('#save-import')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
