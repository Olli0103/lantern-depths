import test from 'node:test';
import assert from 'node:assert/strict';
import {stageRegion} from '../src/staging.js';
// Stress only the presentation layout; no synthetic writes to game memory.
const engine=(room,parent)=>({state:()=>({room}),parent:()=>parent,carried:()=>false,flag:()=>true});
const items=n=>Array.from({length:n},(_,i)=>({id:1000+i}));
test('crowded authored floors stay within the painting and never lose a visible item',()=>{
 const input=items(100),out=stageRegion(engine(247,247),input);
 assert.equal(out.length,100);assert.equal(new Set(out.map(x=>`${x.x},${x.y}`)).size,100);
 for(const l of out){assert.ok(l.x>=8&&l.x<=92);assert.ok(l.y>=68&&l.y<=94);assert.ok(l.width>0&&l.width<=9);assert.equal(l.dense,true);}
});
test('crowded trophy shelves have distinct bounded positions, without a saturated last row',()=>{
 const out=stageRegion(engine(75,197),items(70));
 assert.equal(new Set(out.map(x=>`${x.x},${x.y}`)).size,70);
 for(const l of out){assert.ok(l.x>=59&&l.x<73);assert.ok(l.y>=28&&l.y<51);assert.equal(l.placement,'shelf');}
});
test('additional kitchen table items do not wrap to identical anchors',()=>{
 const out=stageRegion(engine(27,169),items(30));
 assert.equal(new Set(out.map(x=>`${x.x},${x.y}`)).size,30);
 for(const l of out){assert.ok(l.x>=34&&l.x<=72);assert.ok(l.y>=62&&l.y<69);}
});
