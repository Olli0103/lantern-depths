import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {Engine} from '../src/engine.js';
import {containerArtState,layersFor} from '../src/layers.js';
const make=()=>new Engine(createRequire(import.meta.url)('ifvms/src/zvm.js'),readFileSync('vendor/zork1/COMPILED/zork1.z3'));
test('container artwork follows parser-driven open, drink, close and restore transitions',()=>{
 const e=make();for(const c of ['n','e','open window','in'])e.command(c);
 assert.equal(containerArtState(e,99),'sack-closed');assert.equal(containerArtState(e,138),'bottle-full-closed');
 e.command('open sack');assert.equal(containerArtState(e,99),'sack-open');
 e.command('take sack');assert.ok(!layersFor(e).some(l=>[99,14,217].includes(l.id)));
 e.command('close sack');assert.equal(containerArtState(e,99),'sack-closed');assert.equal(e.visible(217),false);
 e.command('take bottle');e.command('open bottle');assert.equal(containerArtState(e,138),'bottle-full-open');const full=e.snapshot();
 e.command('drink water');assert.equal(containerArtState(e,138),'bottle-empty-open');
 e.command('close bottle');assert.equal(containerArtState(e,138),'bottle-empty-closed');
 e.restore(full);assert.equal(containerArtState(e,138),'bottle-full-open');
 e.command('close bottle');assert.equal(containerArtState(e,138),'bottle-full-closed');
});
