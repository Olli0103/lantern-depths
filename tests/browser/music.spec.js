import { test, expect } from '@playwright/test';

test('music is opt-in, independently stoppable, and never advances game turns', async ({page}) => {
  const requests=[];
  page.on('request',r=>{if(r.url().includes('/audio/lantern-depths.mp3'))requests.push(r.url());});
  await page.addInitScript(()=>{
    const NativeAudio=window.Audio;
    window.Audio=class extends NativeAudio {constructor(...args){super(...args);window.testMusic=this;}};
  });
  await page.goto('/');
  await expect(page.locator('#location')).toHaveText('West of House');
  expect(requests).toHaveLength(0);
  const stats=await page.locator('#stats').innerText();
  await page.locator('#preferences summary').click();
  await page.locator('#music').click();
  await expect(page.locator('#music')).toHaveAttribute('aria-pressed','true');
  await expect.poll(()=>page.evaluate(()=>window.testMusic.currentTime)).toBeGreaterThan(0);
  expect(requests.length).toBeGreaterThan(0);
  await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');
  await page.locator('#volume').fill('0');
  await page.locator('#volume').dispatchEvent('input');
  expect(await page.evaluate(()=>window.testMusic.volume)).toBe(0);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  expect(await page.evaluate(()=>window.testMusic.paused)).toBe(true);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(()=>page.evaluate(()=>window.testMusic.paused)).toBe(false);
  await page.evaluate(()=>{window.testMusic.currentTime=60.1;window.testMusic.dispatchEvent(new Event('timeupdate'));});
  await expect(page.locator('#music')).toHaveAttribute('aria-pressed','false');
  expect(await page.evaluate(()=>window.testMusic.paused)).toBe(true);
  await expect(page.locator('#stats')).toHaveText(stats);
  await page.locator('#music').click();
  await expect(page.locator('#music')).toHaveAttribute('aria-pressed','true');
  await page.locator('#music').click();
  expect(await page.evaluate(()=>window.testMusic.paused)).toBe(true);
});
