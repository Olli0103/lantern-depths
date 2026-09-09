import{test,expect}from'@playwright/test';import{readFileSync}from'node:fs';import{createRequire}from'node:module';import{Engine}from'../../src/engine.js';import{capture}from'../../src/saves.js';import{Discovery}from'../../src/discovery.js';
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js'),route=JSON.parse(readFileSync('tests/fixtures/winning-route.json'));
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
const make=f=>{const e=new Engine(VM,readFileSync(f));e.vm.xorshift_seed=route.seed;return e;};
const old=make('public/story.z3');for(const c of ['n','e','open window'])old.command(c);const oldSave=capture(old,[],new Discovery());
test('a real pre-migration save retains retail VM; New game switches back to verified source bytes',async({page})=>{
 await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');await page.locator('#save').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('lantern-depths.save.v1')).adapter)).toBe('zork1-source-v1');
 await page.evaluate(s=>localStorage.setItem('lantern-depths.save.v1',JSON.stringify(s)),oldSave);await page.locator('#load').click();await expect(page.locator('#location')).toHaveText('Behind House');await command(page,'in');await expect(page.locator('#location')).toHaveText('Kitchen');await page.locator('#save').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('lantern-depths.save.v1')).adapter)).toBe('zork1-r119-v1');
 await page.reload();await page.locator('#load').click();await expect(page.locator('#location')).toHaveText('Kitchen');
 await page.locator('#preferences summary').click();page.once('dialog',d=>d.accept());await page.locator('#new').click();await expect(page.locator('#location')).toHaveText('West of House');await page.locator('#save').click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('lantern-depths.save.v1')).adapter)).toBe('zork1-source-v1');
});
test('corrected state art decodes after restore, hover, mobile selection and final Undo',async({page})=>{
 test.setTimeout(60000);const e=make('public/story-source.z3'),states=[];const seen=new Set();
 for(const c of route.commands){e.command(c);const room=e.state().room;let label;
  if(c==='open coffin')label='coffin-open';
  if(c==='dig sand with shovel')label=`dig-${e.global(62)}`;
  if(room===129&&!seen.has('altar'))label='altar';
  if(room===249&&!seen.has('basket-lower'))label='basket-lower';
  if(room===245&&e.parent(108)===249&&!seen.has('basket-remote'))label='basket-remote';
  if(room===117&&!seen.has('passage'))label='passage';
  if(e.completed()&&!e.vm.quit)label='ending';
  if(label&&!seen.has(label)){seen.add(label);states.push({label,save:capture(e,[{command:c,text:e.output}],new Discovery())});}
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:1000});await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 for(const{label,save}of states){await page.evaluate(s=>localStorage.setItem('lantern-depths.save.v1',JSON.stringify(s)),save);await page.locator('#load').click();await page.locator('#painting').evaluate(el=>el.decode());await expect(page.locator('#unpainted')).toBeHidden();
  if(label==='coffin-open'){await expect(page.locator('#inventory [data-art-state="coffin-open"]')).toHaveCount(1);await command(page,'drop coffin');await expect(page.locator('#object-layers [data-art-state="coffin-open"]')).toHaveCount(1);await page.locator('#object-layers [data-object-id="179"]').hover();}
  if(label==='altar'){await expect(page.locator('#object-layers [data-object-id="196"]')).toHaveCSS('background-image',/faithful-props/);await page.locator('#object-layers [data-object-id="196"]').hover();}
  if(label.startsWith('dig-')){await expect(page.locator('#painting')).toHaveAttribute('src',/excavation-states/);if(label!=='dig-3')await expect(page.locator('#object-layers [data-object-id="126"]')).toHaveCount(0);}
  if(label==='ending'){await expect(page.locator('#location')).toHaveText('Inside the Barrow');await expect(page.locator('#object-layers')).toBeEmpty();await command(page,'quit');await page.locator('#undo').click();await expect(page.locator('#location')).toHaveText('Inside the Barrow');}
  await page.screenshot({path:`test-results/completion-${label}.png`,fullPage:true});
 }
 const altar=states.find(s=>s.label==='altar');await page.setViewportSize({width:390,height:844});await page.evaluate(s=>localStorage.setItem('lantern-depths.save.v1',JSON.stringify(s)),altar.save);await page.locator('#preferences summary').click();await page.locator('#load').click();await page.locator('#preferences summary').click();await page.locator('#objects [data-select-id="196"]').click();await expect(page.getByRole('button',{name:'Read',exact:true})).toBeVisible();await page.screenshot({path:'test-results/completion-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
