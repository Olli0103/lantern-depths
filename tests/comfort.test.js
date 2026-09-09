import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Engine} from '../src/engine.js';
import {UndoHistory,CommandHistory,EntropyTape} from '../src/checkpoints.js';
import {capture,decodeSave,saveSlot,readSlot,QUICK_SAVE_KEY} from '../src/saves.js';
import {Discovery,observation} from '../src/discovery.js';
const ZVM=createRequire(import.meta.url)('ifvms/src/zvm.js'),story=readFileSync('public/story.z3');
const hash=createHash('sha256').update(story).digest('hex'),make=()=>new Engine(ZVM,story);

test('bounded Undo keeps independent checkpoints, evicts oldest and resets cleanly',()=>{
 const h=new UndoHistory(2,1000),s={value:1};h.push(s);s.value=2;h.push(s);s.value=3;h.push(s);assert.deepEqual(h.peek(),{value:3});h.pop();assert.deepEqual(h.peek(),{value:2});h.pop();assert.equal(h.peek(),null);
 h.push({value:'a'.repeat(1000)});assert.equal(h.length,0);h.push({value:1});h.clear();assert.equal(h.bytes,0);
});
test('command history preserves unfinished draft without executing or inventing commands',()=>{
 const h=new CommandHistory();assert.equal(h.next('unfinished'),'unfinished');h.add('look');h.add('north');assert.equal(h.previous('examine '),'north');assert.equal(h.previous('north'),'look');assert.equal(h.next(),'north');assert.equal(h.next(),'examine ');assert.equal(h.next(),'examine ');h.reset();assert.equal(h.previous('new draft'),'north');
});
test('unseeded combat draws replay through Undo with original outcomes, no seeded gameplay',()=>{
 let e=make();for(const c of ['north','east','open window','west','west','take lamp','turn on lamp','take sword','move rug','open trap door','down'])e.command(c);
 const saved=e.snapshot();assert.equal(saved.random,0);
 const first=e.command('north'),after=e.state(),future=e.entropy.snapshot();assert.ok(future.cursor>saved.entropy.cursor);
 const restored=make();restored.restore(saved,future);assert.equal(restored.command('north'),first);assert.deepEqual(restored.state(),after);
 const snap=restored.snapshot();assert.equal(snap.random,0);
 const firstAttack=restored.command('attack troll with sword');const again=make();again.restore(snap,restored.entropy.snapshot());assert.equal(again.command('attack troll with sword'),firstAttack);
});
test('Undo restores pre-death state and legacy random-free snapshots remain loadable',()=>{
 const e=make();for(const c of ['north','east','open window','west','west','move rug','open trap door','down'])e.command(c);
 e.vm.xorshift_seed=-1234;
 const before=e.snapshot(),beforeState=e.state();const death=e.command('north');assert.match(death,/You have died/);assert.notEqual(e.state().room,beforeState.room);
 const restored=make();restored.restore(before,e.entropy.snapshot());assert.deepEqual(restored.state(),beforeState);assert.equal(restored.lit(),false);assert.equal(restored.vm.quit,false);
 const legacy=make().snapshot();delete legacy.entropy;restored.restore(legacy);assert.equal(restored.state().name,'West of House');assert.doesNotThrow(()=>restored.command('look'));
});
test('save packages bind story bytes and preserve journal/discovery without trusting labels',()=>{
 const e=make(),d=new Discovery();d.record(null,observation(e));const previous=observation(e);e.command('north');d.record(previous,observation(e),'north');
 const h=[{command:'north',text:e.output}],s=capture(e,h,d,hash),loaded=decodeSave(JSON.stringify(s),ZVM,story,hash);
 assert.equal(loaded.engine.state().name,'North of House');assert.deepEqual(loaded.discovery.snapshot(),d.snapshot());assert.deepEqual(loaded.history,h);
 const legacy={engine:e.snapshot(),history:h,discovery:d.snapshot()};assert.equal(decodeSave(JSON.stringify(legacy),ZVM,story,hash).engine.state().name,'North of House');
 assert.throws(()=>decodeSave(JSON.stringify({...s,storyHash:'wrong'}),ZVM,story,hash),/different story/);
 assert.throws(()=>decodeSave(JSON.stringify({...s,history:[{command:5,text:'bad'}]}),ZVM,story,hash),/journal/);
 assert.throws(()=>decodeSave('{',ZVM,story,hash));assert.throws(()=>decodeSave(' '.repeat(2_000_001),ZVM,story,hash),/large/);
 const store=new Map(),storage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)};storage.setItem(QUICK_SAVE_KEY,'old');saveSlot(storage,1,'First expedition',s);saveSlot(storage,2,'Second expedition',s);assert.equal(JSON.parse(readSlot(storage,1)).label,'First expedition');assert.equal(storage.getItem(QUICK_SAVE_KEY),'old');
});
test('random continuation validates finite draws and retains a bounded replay window',()=>{
 const tape=new EntropyTape();for(let i=0;i<8300;i++)tape.draw();assert.equal(tape.values.length,8192);assert.equal(tape.base,108);
 assert.throws(()=>new EntropyTape().restore({base:0,cursor:1,values:[2]}),/Invalid/);
});
