// Integration playthrough. Only parser commands and supported saves; no puzzle-state writes.
// Route researched against the source and Eristic's Zork I walkthrough (see docs/VALIDATION.md).
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {Engine} from '../src/engine.js';
const ZVM=createRequire(import.meta.url)('ifvms/src/zvm.js');
const seed=Number(process.env.ZORK_TEST_SEED||8);
const e=new Engine(ZVM,readFileSync('vendor/zork1/COMPILED/zork1.z3'));e.vm.xorshift_seed=seed;
const log=[],visited=new Set();
function run(command){const output=e.command(command);log.push({command,output,state:e.state(),inventory:e.inventory()});visited.add(e.state().room);if(/You have died/.test(output))throw Error('Died after '+command);return output;}
function walk(commands){for(const c of commands.split('|'))run(c);}
function checkpoint(name,room){if(e.state().name!==room)throw Error(`${name}: expected ${room}, got ${e.state().name}`);console.log(name,e.state(),e.inventory().map(x=>x.name));writeFileSync('build/full-game-progress.json',JSON.stringify({seed,name,log,save:e.snapshot(),visited:[...visited]},null,2));}
mkdirSync('build',{recursive:true});
try{
walk('n|n|up|take egg|open egg|down|s|e|open window|w|take sack|open sack|take garlic|eat lunch|w|take sword|take lamp|move rug|open trap door|turn on lamp|d|drop egg|n');
for(let i=0;i<30&&e.parent(150);i++)run(e.parent(227)===44?'attack troll with sword':'take sword');
if(e.parent(150))throw Error('Troll remains');
walk('drop sword|w|w|w|up|take coins|take key|sw|e|s|se|odysseus|e|e|open case|put coins in case|drop key');checkpoint('maze', 'Living Room');
walk('open trap door|d|s|e|take painting|w|n|up|put painting in case');checkpoint('gallery','Living Room');
walk('d|n|e|e|e|echo|take bar|w|w|w|s|up|put bar in case');checkpoint('loud','Living Room');
walk('d|n|e|e|e|up|e|n|take matchbook|n|take wrench|take screwdriver|push yellow button|s|s|turn bolt with wrench|drop wrench|w|wait|wait|n|take trunk|s|sw|sw|w|s|up|put trunk in case');checkpoint('dam','Living Room');
walk('d|n|e|n|ne|n|n|take pump|n|take trident|up|n|n|w|d|up|put trident in case');checkpoint('atlantis','Living Room');
walk('e|up|take rope|d|w|d|n|e|e|se|e|tie rope to railing|d|take torch|turn off lamp|s|drop all but torch|e|take coffin|open coffin|take sceptre|w|s|pray|e|s|e|w|w|put coffin in case|put sceptre in case');checkpoint('egypt','Living Room');
walk('d|n|e|e|se|e|d|s|take matchbook|take bell|open matchbook|s|take candles|take book|extinguish candles|d|d|ring bell|take candles|light match|light candles with match|read book|extinguish candles|drop book|s|take skull|n|up|n|n|n|w|w|s|up|put skull in case|take sceptre');checkpoint('hades','Living Room');
walk('d|n|e|e|se|e|d|s|take all|s|d|n|n|n|e|up|e|e|inflate boat with pump|drop pump|put screwdriver in sack|put sceptre in sack|board boat|launch|wait|wait|wait|wait|take buoy|e|stand|open buoy|take emerald|drop buoy|take shovel|ne|dig sand with shovel|dig sand with shovel|dig sand with shovel|dig sand with shovel|drop shovel|take scarab|sw|s|s|take sceptre from sack|wave sceptre|w|w|sw|up|up|nw|w|w|w|put scarab in case|put emerald in case|put sceptre in case');checkpoint('river','Living Room');
walk('e|e|e|e|d|d|n|take gold|sw|up|up|nw|w|w|w|put gold in case');checkpoint('gold','Living Room');
walk('take screwdriver from sack|d|n|e|e|s|s|touch mirror|n|w|n|w|n|take jade|e|put candles in basket|put screwdriver in basket|drop torch|turn on lamp|n|d|take bracelet|e|ne|se|sw|d|d|s|take coal|n|up|up|n|e|s|n|up|s|put coal in basket|take candles|light match|light candles with match|put candles in basket|lower basket|n|d|e|ne|se|sw|d|d|w|drop all|w|take coal|take screwdriver|take candles|s|open machine|put coal in machine|close machine|turn switch with screwdriver|open machine|take diamond|drop screwdriver|n|put candles in basket|put diamond in basket|e|take all but timber|e|up|up|n|e|s|n|up|s|raise basket|take diamond|take candles|extinguish candles|take torch|w|s|e|s|d|up|put diamond in case|put bracelet in case|put jade in case|put torch in case|drop garlic|drop candles');checkpoint('mine','Living Room');
walk('e|up|take knife|d|w|w|w|up');
for(let i=0;i<40&&e.parent(164);i++)run(e.parent(165)===44?'attack thief with knife':'take knife');
if(e.parent(164))throw Error('Thief remains');
checkpoint('thief','Treasure Room');
walk('take all|d|e|e|put all but lamp in case|w|w|up|take all|d|e|e|put all but lamp in case|take egg|take canary from egg|put egg in case|e|e|n|n|wind canary|take bauble|s|e|w|w|put canary in case|put bauble in case');checkpoint('treasures','Living Room');
if(e.state().score!==350)throw Error('Missing treasure points: '+e.state().score);
walk('look|take parchment|read parchment|e|e|s|w|sw|w');
const ending=log.at(-1);
if(!ending.output.includes('Master Adventurer')||!ending.output.includes('Inside the Barrow'))throw Error('Final ending missing');
run('quit');if(!e.vm.quit)throw Error('Ending quit did not terminate');
writeFileSync('build/full-game-success.json',JSON.stringify({seed,score:e.state().score,commands:log.length,ending,visited:[...visited]},null,2));
writeFileSync('tests/fixtures/winning-route.json',JSON.stringify({seed,commands:log.map(x=>x.command),score:350,source:'Route validated against the original source; walkthrough reference in docs/VALIDATION.md'},null,2)+'\n');
console.log('COMPLETE',e.state().score,log.length);
}catch(error){console.error(error.message);writeFileSync('build/full-game-failure.json',JSON.stringify({seed,error:error.message,log,save:e.snapshot()},null,2));process.exitCode=1;}
