import {test,expect} from '@playwright/test';
const command=async(p,c)=>{await p.locator('#command').fill(c);await p.locator('#command').press('Enter');};
test('scene actions remain in view, Escape restores focus, and held container contents are accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('#location')).toHaveText('West of House');
 const mailbox=page.getByRole('button',{name:'Inspect small mailbox',exact:true});await mailbox.click();
 await expect(page.locator('#scene-actions')).toBeVisible();
 const box=await page.locator('#scene-actions').boundingBox(),parser=await page.locator('#command-form').boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);expect(box.y+box.height).toBeLessThanOrEqual(parser.y);
 await page.keyboard.press('Escape');await expect(page.locator('#scene-actions')).toBeHidden();await expect(mailbox).toBeFocused();
 for(const c of ['n','e','open window','in','open sack','take sack'])await command(page,c);
 await expect(page.locator('#objects')).not.toContainText('garlic');await page.locator('#inventory').getByRole('button',{name:'brown sack',exact:true}).click();
 await page.getByRole('button',{name:/Select contents:.*garlic/}).click();await page.getByRole('button',{name:'Examine',exact:true}).click();
 await expect(page.locator('#transcript')).toContainText('garlic');await page.locator('#detail-close').click();
 await command(page,'w');await page.getByRole('button',{name:'Inspect trophy case',exact:true}).click();await page.getByRole('button',{name:'Open',exact:true}).click();
 await expect(page.locator('#painting')).toHaveAttribute('src','./art/living-room-case-open-v1.png');await page.locator('#painting').evaluate(e=>e.decode());
 await command(page,'close case');await expect(page.locator('#painting')).toHaveAttribute('src','./art/living-room.png');
});
