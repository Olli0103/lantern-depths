import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
const box=async(p,sel)=>await p.locator(sel).boundingBox();

test('desktop paintings scale to the window: Look, the journal and the newest response stay above the parser dock',async({page})=>{
  for(const [width,height] of [[1440,900],[1600,900],[1920,1080],[1366,768]]){
    await page.setViewportSize({width,height});await page.goto('./');
    await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
    const scene=await box(page,'#scene'),look=await box(page,'#look'),dock=await box(page,'#command-form'),transcript=await box(page,'#transcript');
    expect(Math.abs(scene.width/scene.height-1.5)).toBeLessThan(.01);
    expect(scene.height).toBeGreaterThanOrEqual(380);
    expect(look.y+look.height).toBeLessThanOrEqual(dock.y);
    expect(transcript.y+transcript.height).toBeLessThanOrEqual(dock.y+1);
    const opening=await page.locator('#transcript p').last().boundingBox();
    await expect(page.locator('#transcript p').last()).toContainText('You are standing in an open field');
    expect(opening.y).toBeGreaterThanOrEqual(transcript.y);
    await command(page,'open mailbox');
    const latest=await page.locator('#transcript p').last().boundingBox();
    expect(latest.y).toBeGreaterThanOrEqual(transcript.y);expect(latest.y+latest.height).toBeLessThanOrEqual(dock.y);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  // 720px-tall windows keep the painting at its 380px floor; the page scrolls instead of shrinking further.
  await page.setViewportSize({width:1280,height:720});await page.goto('./');
  await expect(page.locator('#scene')).toHaveAttribute('data-painting','ready');
  const scene=await box(page,'#scene'),look=await box(page,'#look'),dock=await box(page,'#command-form');
  expect(Math.round(scene.height)).toBe(380);expect(look.y+look.height).toBeLessThanOrEqual(dock.y);
});

test('quick Load and slot Load are reversible with Undo, keeping journal and inventory of the replaced session',async({page})=>{
  await page.goto('./');await expect(page.locator('#location')).toHaveText('West of House');
  await command(page,'open mailbox');await page.getByRole('button',{name:'Save',exact:true}).click();
  await expect(page.locator('#notice')).toContainText('saved');
  await command(page,'take leaflet');await command(page,'north');
  await expect(page.locator('#location')).toHaveText('North of House');await expect(page.locator('#inventory')).toContainText('leaflet');
  await page.getByRole('button',{name:'Load',exact:true}).click();
  await expect(page.locator('#location')).toHaveText('West of House');
  await expect(page.locator('#objects')).toContainText('leaflet');await expect(page.locator('#inventory')).not.toContainText('leaflet');
  await expect(page.locator('#undo')).toBeEnabled();
  await page.locator('#undo').click();
  await expect(page.locator('#location')).toHaveText('North of House');
  await expect(page.locator('#inventory')).toContainText('leaflet');
  await expect(page.locator('#transcript')).toContainText('You are facing the north side of a white house');
  await expect(page.locator('#stats')).toContainText('MOVES 3');
  // Undo continues to step back through the session that was restored.
  await page.locator('#undo').click();await expect(page.locator('#location')).toHaveText('West of House');await expect(page.locator('#inventory')).toContainText('leaflet');
  // Named slot load is reversible the same way.
  await page.locator('#preferences summary').click();await page.locator('#save-manager').click();
  await page.locator('#slot-name-1').fill('Porch');await page.locator('.save-slot').first().getByRole('button',{name:'Save here'}).click();
  await expect(page.locator('#saves-notice')).toHaveText('Adventure saved.');await page.locator('#saves-close').click();
  await command(page,'drop leaflet');await expect(page.locator('#inventory')).not.toContainText('leaflet');
  await page.locator('#preferences summary').click();await page.locator('#save-manager').click();
  await page.locator('.save-slot').first().getByRole('button',{name:'Load adventure'}).click();
  await expect(page.locator('#inventory')).toContainText('leaflet');
  await page.locator('#undo').click();await expect(page.locator('#inventory')).not.toContainText('leaflet');await expect(page.locator('#objects')).toContainText('leaflet');
  // A file import still starts a fresh session with no Undo history.
});

test('desktop journal fills spare height, resizes without scroll feedback, and keeps the mobile view',async({page})=>{
  await page.goto('./');await expect(page.locator('#location')).toHaveText('West of House');
  for(const [width,height] of [[980,1400],[1100,1300],[1100,1600]]){
    await page.setViewportSize({width,height});
    await expect.poll(async()=>page.evaluate(()=>{
      const dock=document.querySelector('#command-form').getBoundingClientRect();
      const footer=document.querySelector('body>footer').getBoundingClientRect();
      return Math.round(dock.top-footer.bottom);
    })).toBeGreaterThanOrEqual(8);
    await expect.poll(async()=>page.evaluate(()=>document.querySelector('#command-form').getBoundingClientRect().top-document.querySelector('body>footer').getBoundingClientRect().bottom)).toBeLessThan(10);
    expect((await box(page,'#transcript')).height).toBeGreaterThan(350);
    await command(page,'look');await page.locator('#save').click();
    const heightBefore=await page.evaluate(()=>document.documentElement.scrollHeight);
    await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    await page.waitForTimeout(100);
    expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(heightBefore);
    await page.evaluate(()=>window.scrollTo(0,0));
  }
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('#mobile-utilities #save')).toHaveCount(1);
  if(await page.locator('#journal-body').isHidden())await page.locator('#journal-toggle').click();
  await expect(page.locator('#transcript')).toBeVisible();
  const log=await box(page,'#transcript'),dock=await box(page,'#command-form');
  expect(log.y+log.height).toBeLessThanOrEqual(dock.y);
});
