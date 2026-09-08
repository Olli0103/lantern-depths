import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { Engine } from '../src/engine.js';
const require = createRequire(import.meta.url);
const engine = new Engine(require('ifvms/src/zvm.js'), readFileSync('public/story.z3'));
console.log(engine.output, engine.state());
for (const cmd of ['open mailbox','take leaflet','north','east','open window','west','west','take lamp','turn on lamp','move rug','open trap door','down']) {
  console.log(cmd, engine.command(cmd), engine.state());
}
for(let i=1;i<251;i++) {
  try { const name=engine.name(i); if(/lantern|mailbox|leaflet|trap|rug|window|cretin/i.test(name)) console.log(i,name,engine.vm.get_parent(i),Array.from({length:32},(_,a)=>engine.vm.test_attr(i,a)?a:null).filter(a=>a!==null)); } catch { break; }
}
