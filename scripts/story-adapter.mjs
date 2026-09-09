// Build-time symbols only: no runtime exit table and no inferred UI discoveries.
import{readFileSync,writeFileSync}from'node:fs';import{createHash}from'node:crypto';
const symbols=JSON.parse(readFileSync('docs/story-symbols.json'));
const zap=readFileSync('build/source-a/zork1_data.zap','utf8');
const compiled=[null,...[...zap.matchAll(/\.OBJECT ([\w?-]+),/g)].map(m=>m[1])];
const flags=Object.fromEntries([...zap.matchAll(/^\s*([A-Z][A-Z?0-9-]*)=(\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
const globals=[...zap.matchAll(/\.GVAR ([\w?-]+)=/g)].map(m=>m[1]);
const properties=Object.fromEntries([...zap.matchAll(/P\?([\w?-]+)=(\d+)/g)].map(m=>[m[1],Number(m[2])]));
const sourceObjects=Object.fromEntries(Object.entries(symbols.objects).map(([id,sym])=>{const n=compiled.indexOf(sym);if(n<1)throw Error('Missing object '+sym);return[id,n];}));
if(new Set(Object.values(sourceObjects)).size!==250)throw Error('Nonbijective story adapter');
const sourceFlags=Object.fromEntries(Object.entries(symbols.flags).map(([id,sym])=>{if(flags[sym]===undefined)throw Error('Missing flag '+sym);return[id,flags[sym]];}));
const sourceGlobals=Object.fromEntries(Object.entries(symbols.globals).map(([id,sym])=>{const n=globals.indexOf(sym);if(n<0)throw Error('Missing global '+sym);return[id,n];}));
const sourceProps=Object.fromEntries(Object.entries(symbols.properties).map(([id,sym])=>[id,properties[sym]]));
const identity=(file,id)=>{const bytes=readFileSync(file);return{id,sha256:createHash('sha256').update(bytes).digest('hex'),length:bytes.length,release:bytes.readUInt16BE(2),serial:bytes.subarray(18,24).toString(),checksum:bytes.readUInt16BE(28)};};
const registry={retail:{...identity('vendor/zork1/COMPILED/zork1.z3','zork1-r119-v1'),objects:null,flags:null,globals:null,properties:null},source:{...identity('build/source-a/rebuilt.z3','zork1-source-v1'),objects:sourceObjects,flags:sourceFlags,globals:sourceGlobals,properties:sourceProps}};
registry.retail.finish={read:29882,quit:29942,caller:43619};registry.source.finish={read:29816,quit:29865,caller:43119};
const serialized=JSON.stringify(registry,null,2)+'\n';
if(process.argv.includes('--check')){if(readFileSync('src/story-adapters.json','utf8')!==serialized)throw Error('Committed adapter differs from rebuilt symbols');}
else writeFileSync('src/story-adapters.json',serialized);
console.log('Adapters emitted from pinned compiler symbols; 250-object bijection.');
