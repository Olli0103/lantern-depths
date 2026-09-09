import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {Engine} from '../src/engine.js';
const ZVM=createRequire(import.meta.url)('ifvms/src/zvm.js');
const rebuilt=new Engine(ZVM,readFileSync('build/source-a/rebuilt.z3'));
const original=new Engine(ZVM,readFileSync('vendor/zork1/COMPILED/zork1.z3'));
rebuilt.vm.xorshift_seed=1;original.vm.xorshift_seed=1;
const commands=['n','e','open window','w','w','take lamp','turn on lamp','move rug','open trap door','d','s','e','take painting','n','read manual','up','drop manual','up'];
for(const command of commands){
  const a=original.command(command),b=rebuilt.command(command);
  // Compiler object ordering can reorder room listing lines, without changing their content.
  assert.deepEqual(b.split('\n').sort(),a.split('\n').sort(),`Transcript content differs after: ${command}`);
  for(const key of ['name','score','turns'])assert.equal(rebuilt.state()[key],original.state()[key],`${key} differs after: ${command}`);
}
assert.equal(rebuilt.state().name,'Kitchen');
assert.notEqual(rebuilt.state().room,original.state().room,'Keep compiled object IDs separate');
const saved=rebuilt.snapshot(),restored=new Engine(ZVM,readFileSync('build/source-a/rebuilt.z3'));restored.restore(saved);
assert.equal(restored.command('look'),rebuilt.command('look'));
console.log('Rebuilt source: opening/gallery/studio/chimney transcript content matches retail (room-list ordering differs); own save continuation passes. Object IDs differ; retail graphical mapping must not be reused.');
