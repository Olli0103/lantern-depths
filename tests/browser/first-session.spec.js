import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};

test('relations follow grammar flags, the popover clears the object it acts on, markers arrive once per room',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('./');
  await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
  await expect(page.locator('#hotspots')).toHaveAttribute('data-arrived','true');
  const marker=page.getByRole('button',{name:'Inspect small mailbox',exact:true});
  await expect(marker).toHaveCSS('animation-name','marker-arrival');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(marker).toHaveCSS('animation-name','none');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await marker.click();
  const panel=page.locator('#scene-actions');await expect(panel).toBeVisible();
  const m=await marker.boundingBox(),r=await panel.boundingBox();
  expect(r.y).toBeGreaterThanOrEqual(m.y+m.height);expect(r.x).toBeGreaterThanOrEqual(m.x+m.width);
  await expect.poll(()=>marker.evaluate(e=>getComputedStyle(e,'::after').opacity)).toBe('0');
  await page.getByRole('button',{name:'Open',exact:true}).click();
  await expect(page.locator('#hotspots')).toHaveAttribute('data-arrived','false');
  await page.getByRole('button',{name:'Select contents: leaflet',exact:true}).click();
  await page.getByRole('button',{name:'Take',exact:true}).click();
  await expect(page.locator('#inventory')).toContainText('leaflet');
  await page.locator('#inventory [data-select-id="76"]').click();
  const relations=await page.locator('#relations button').allTextContents();
  expect(relations).toEqual(['Tie to…','Put in…','Put on…','Give to…']);
  await command(page,'north');await expect(page.locator('#location')).toHaveText('North of House');
  await expect(page.locator('#hotspots')).toHaveAttribute('data-arrived','true');
  for(const c of ['east','open window','west','west','take sword'])await command(page,c);
  await page.locator('#inventory [data-select-id="227"]').click();
  await expect(page.getByRole('button',{name:'Attack with…',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Light with…',exact:true})).toHaveCount(0);
  // Desktop never shows the mobile journal peek.
  await expect(page.locator('#journal-peek')).toBeHidden();
});

test('mobile shows the newest original response under the painting and opens the journal from it',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('./');
  await expect(page.locator('#location')).toHaveText('West of House');
  const peek=page.locator('#journal-peek');
  await expect(peek).toBeVisible();await expect(peek).toContainText('There is a small mailbox here.');
  await command(page,'open mailbox');
  await expect(peek).toHaveText('Opening the small mailbox reveals a leaflet.');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await peek.click();
  await expect(page.locator('#transcript')).toBeVisible();await expect(page.locator('#transcript')).toContainText('reveals a leaflet');
  await expect(peek).toBeHidden();
  await page.locator('#journal-close').click();await expect(peek).toBeVisible();
  // A long response is trimmed, never rewritten.
  await command(page,'look');const text=await peek.textContent();
  expect(text.startsWith('West of House')).toBe(true);expect(text.length).toBeLessThanOrEqual(182);
});
