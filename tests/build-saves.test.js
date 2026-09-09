import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{createRequire}from'node:module';import {Engine}from'../src/engine.js';import{capture,decodeSave}from'../src/saves.js';import{Discovery}from'../src/discovery.js';
const VM=createRequire(import.meta.url)('ifvms/src/zvm.js'),old=readFileSync('public/story.z3'),fresh=readFileSync('public/story-source.z3');
test('old and new saves resume their own engines; legacy quick saves are never byte-converted',()=>{
 const a=new Engine(VM,old),b=new Engine(VM,fresh);const catalog={old:{bytes:old,hash:a.adapter.sha256,signature:a.vm.signature},fresh:{bytes:fresh,hash:b.adapter.sha256,signature:b.vm.signature}};
 for(const e of [a,b]){e.command('n');const s=capture(e,[{command:'n',text:e.output}],new Discovery(),b.adapter.sha256);const loaded=decodeSave(JSON.stringify(s),VM,fresh,b.adapter.sha256,undefined,catalog);assert.equal(loaded.engine.adapter.id,e.adapter.id);assert.equal(loaded.engine.state().room,137);assert.equal(loaded.engine.command('look'),e.command('look'));}
 const legacy={engine:a.snapshot(),history:[],discovery:new Discovery().snapshot()};const restored=decodeSave(JSON.stringify(legacy),VM,fresh,b.adapter.sha256,undefined,catalog);assert.equal(restored.engine.adapter.id,a.adapter.id);assert.equal(restored.engine.state().room,137);
});
